import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: 'HCaptcha non configuré' }, { status: 400 });
  const token = await req.text();
  const res = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `response=${token}&secret=${secret}`
  });
  const data = await res.json();
  return NextResponse.json(data);
}
