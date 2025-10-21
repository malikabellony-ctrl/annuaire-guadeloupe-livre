import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = supabaseServer();
  const { data, error } = await db
    .from('entities')
    .select('id,name,status,slug,created_at')
    .eq('status','pending')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, rows: data ?? [] });
}
