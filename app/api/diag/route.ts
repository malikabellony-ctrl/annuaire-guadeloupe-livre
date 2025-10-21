import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const db = supabaseServer();

  // test 1: lire le nombre total (toutes lignes) via service_role
  const { data: countAll, error: errCount } = await db
    .from('entities')
    .select('id', { count: 'exact', head: true });

  // test 2: lister 5 pending
  const { data: pending, error: errPending } = await db
    .from('entities')
    .select('id,name,status,slug,created_at')
    .eq('status','pending')
    .order('created_at', { ascending: false })
    .limit(5);

  return NextResponse.json({
  env: {
    NEXT_PUBLIC_SUPABASE_URL_PRESENT: !!url,
    NEXT_PUBLIC_SUPABASE_URL_VALUE: url, // <-- on l'affiche
    NEXT_PUBLIC_SUPABASE_ANON_KEY_PRESENT: hasAnon,
    SUPABASE_SERVICE_ROLE_KEY_PRESENT: hasService,
  },
  tests: {
    countAll: {
      ok: !errCount,
      error: errCount?.message ?? null,
      count: (countAll as any) ? (countAll as any).length ?? null : null
    },
    pending: {
      ok: !errPending,
      error: errPending?.message ?? null,
      rows: pending ?? []
    }
  }
});
}
