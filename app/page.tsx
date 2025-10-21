import Link from 'next/link';

export default function Home() {
  return (
    <div className="card">
      <h1>Bienvenue</h1>
      <p>Découvrez et référencez les auteurs, éditeurs, illustrateurs, librairies, bibliothèques et lieux du livre en Guadeloupe.</p>
      <div style={{display:'flex', gap: 12}}>
        <Link className="btn primary" href="/directory">Parcourir l'annuaire</Link>
        <Link className="btn" href="/submit">Ajouter / Revendiquer une fiche</Link>
      </div>
    </div>
  );
}
