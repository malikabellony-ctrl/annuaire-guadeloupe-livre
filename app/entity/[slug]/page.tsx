import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

export default async function EntityDetail({ params }: { params: { slug: string } }) {
  const db = supabaseServer();
  const { data } = await db.from('entities_public').select('*').eq('slug', params.slug).single();
  if (!data) return <div className="card">Fiche introuvable.</div>;
  return (
    <div className="card">
      <h1>{data.name}</h1>
      <p><strong>Type :</strong> <span className="badge">{data.type}</span></p>
      <p><strong>Commune :</strong> {data.commune || '—'}</p>
      <p><strong>Bio :</strong><br />{data.bio || '—'}</p>
      <p><strong>Site :</strong> {data.site ? <a href={data.site} target="_blank">{data.site}</a> : '—'}</p>
      <p><strong>Réseaux :</strong> {data.reseaux ? JSON.stringify(data.reseaux) : '—'}</p>
      <Link className="btn" href={`/submit?entity=${data.id}`}>Suggérer une mise à jour</Link>
    </div>
  );
}
