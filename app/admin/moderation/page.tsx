import { supabaseServer } from '@/lib/supabaseServer';

async function approve(id: string) {
  'use server';
  const db = supabaseServer();
  await db.from('entities').update({ status: 'published' }).eq('id', id);
}

async function reject(id: string) {
  'use server';
  const db = supabaseServer();
  await db.from('entities').update({ status: 'rejected' }).eq('id', id);
}

export default async function Moderation() {
  const db = supabaseServer();
  const { data: pending } = await db.from('entities').select('*').eq('status','pending').order('created_at', { ascending: true });
  return (
    <div className="card">
      <h2>Modération</h2>
      {!pending?.length && <p>Aucune fiche en attente.</p>}
      {pending?.map((e:any) => (
        <div key={e.id} style={{borderBottom:'1px solid #e2e8f0', padding:'12px 0'}}>
          <strong>{e.name}</strong> <span className="badge">{e.type}</span> — {e.commune || '—'}
          <p style={{whiteSpace:'pre-wrap'}}>{e.bio || '—'}</p>
          <form action={approve.bind(null, e.id)} style={{display:'inline-block', marginRight:8}}>
            <button className="btn primary">Publier</button>
          </form>
          <form action={reject.bind(null, e.id)} style={{display:'inline-block'}}>
            <button className="btn">Refuser</button>
          </form>
        </div>
      ))}
    </div>
  );
}
