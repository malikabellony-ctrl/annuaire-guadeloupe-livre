import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const db = supabaseServer();
    const slug = 'diag-' + Date.now();
    const { error } = await db.from('entities').insert({
      name: 'Diag Insert',
      type: 'auteur',
      slug,
      status: 'pending'
    });
    if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok:true, slug });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message || 'server error' }, { status: 500 });
  }
}
