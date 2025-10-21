'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Types } from '@/lib/roles';

type Entity = {
  id: string;
  name: string;
  slug: string;
  type: string;
  commune: string | null;
  status: string;
};

export default function Directory() {
  const [items, setItems] = useState<Entity[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('');

  useEffect(() => {
    (async () => {
      let query = supabase.from('entities_public').select('id,name,slug,type,commune,status').eq('status','published');
      if (q) query = query.ilike('name', `%${q}%`);
      if (type) query = query.eq('type', type);
      const { data } = await query.order('name', { ascending: true });
      setItems(data || []);
    })();
  }, [q, type]);

  return (
    <div className="card">
      <h2>Annuaire</h2>
      <div className="grid cols-3">
        <input className="input" placeholder="Rechercher par nom…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="">Tous les types</option>
          {Types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <table className="table">
        <thead><tr><th>Nom</th><th>Type</th><th>Commune</th><th>Statut</th></tr></thead>
        <tbody>
          {items.map(e => (
            <tr key={e.id}>
              <td><Link href={`/entity/${e.slug}`}>{e.name}</Link></td>
              <td><span className="badge">{e.type}</span></td>
              <td>{e.commune || '—'}</td>
              <td className={`status ${e.status}`}>{e.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
