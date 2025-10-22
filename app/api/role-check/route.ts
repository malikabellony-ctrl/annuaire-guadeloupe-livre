export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const db = supabaseServer();

  // 1) Essaye un UPDATE impossible (id qui n'existe pas)
  const { error: updateErr } = await db
    .from('entities')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', '00000000-0000-0000-0000-000000000000');

  // 2) Essaye de LIRE des pending (anon ne voit rien, service les voit)
  const { data: pendingRows, error: pendingErr } = await db
    .from('entities')
    .select('id,name,status')
    .eq('status', 'pending')
    .limit(3);

  return NextResponse.json({
    env_seen: {
      URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SERVICE: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    update_test: {
      ok: !updateErr,
      error: updateErr?.message ?? null
    },
    pending_read: {
      ok: !pendingErr,
      error: pendingErr?.message ?? null,
      rows: pendingRows ?? []
    }
  });
}
