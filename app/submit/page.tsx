'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { containsProfanity } from '@/lib/profanity';

export default function Submit() {
  const [form, setForm] = useState({ name:'', type:'auteur', bio:'', commune:'', site:'' });
  const [msg, setMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // client-side quick profanity check
    if (containsProfanity(form.name) || containsProfanity(form.bio)) {
      setMsg('Votre texte semble contenir des termes inappropriés. Merci de le corriger.');
      return;
    }
    const res = await fetch('/api/submit', { method: 'POST', body: JSON.stringify(form) });
    const json = await res.json();
    if (json.ok) setMsg('Merci ! Votre proposition a été soumise à la modération.');
    else setMsg(json.error || 'Une erreur est survenue.');
  }

  return (
    <div className="card">
      <h2>Ajouter / Revendiquer une fiche</h2>
      <form onSubmit={onSubmit}>
        <label>Nom</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <label>Type</label>
        <select className="input" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
          <option value="auteur">Auteur</option>
          <option value="editeur">Éditeur</option>
          <option value="illustrateur">Illustrateur</option>
          <option value="librairie">Librairie</option>
          <option value="bibliotheque">Bibliothèque</option>
          <option value="lieu">Lieu</option>
          <option value="independant">Indépendant</option>
          <option value="autre">Autre</option>
        </select>
        <label>Commune</label>
        <input className="input" value={form.commune} onChange={e=>setForm({...form, commune:e.target.value})} />
        <label>Site web</label>
        <input className="input" value={form.site} onChange={e=>setForm({...form, site:e.target.value})} />
        <label>Présentation</label>
        <textarea className="input" rows={5} value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} />
        <button className="btn primary" type="submit">Soumettre pour validation</button>
      </form>
      {msg && <p style={{marginTop:12}}>{msg}</p>}
    </div>
  );
}
