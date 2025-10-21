import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

const BAD_WORDS = ["merde","con","connard","connasse","salope","pute","enculé","encule","batard","bâtard","fdp","ntm","nique ta mère","putain","bordel","chiasse","ta gueule"];

function isClean(text: string) {
  const t = (text||'').toLowerCase();
  return !BAD_WORDS.some(w => t.includes(w));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const data = JSON.parse(body || "{}");
    const { name, type, bio, commune, site } = data;

    if (!name || !type) {
      return NextResponse.json({ ok: false, error: 'Nom et type requis.' }, { status: 400 });
    }
    if (!isClean(name) || !isClean(bio||'')) {
      return NextResponse.json({ ok: false, error: 'Texte inapproprié détecté.' }, { status: 400 });
    }

    // Optional hCaptcha verification
    const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
    const secret = process.env.HCAPTCHA_SECRET;
    const token = req.headers.get('x-hcaptcha-token');
    if (sitekey && secret) {
      if (!token) {
        return NextResponse.json({ ok:false, error:'Captcha manquant.' }, { status: 400 });
      }
      const verify = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `response=${token}&secret=${secret}`
      }).then(r => r.json()).catch(()=>({success:false}));
      if (!verify.success) {
        return NextResponse.json({ ok:false, error:'Captcha invalide.' }, { status: 400 });
      }
    }

    const db = supabaseServer();
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    const insert = {
      name: name.trim(),
      type: String(type),
      slug,
      commune: commune || null,
      site: site || null,
      bio: bio || null,
      status: 'pending'
    };
    const { error } = await db.from('entities').insert(insert);
    if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message || 'Erreur serveur.' }, { status: 500 });
  }
}
