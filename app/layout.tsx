import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Annuaire du Livre - Guadeloupe',
  description: 'Répertoire des acteurs du livre en Guadeloupe'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="container">
          <header className="header">
            <div><strong>Annuaire du Livre - Guadeloupe</strong></div>
            <nav>
              <Link href="/">Accueil</Link>
              <Link href="/directory">Annuaire</Link>
              <Link href="/submit">Ajouter / Revendiquer</Link>
              <Link href="/admin/moderation">Admin</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer>© {new Date().getFullYear()} Annuaire des acteurs du livre (Guadeloupe). Mentions légales & CGU à compléter.</footer>
        </div>
      </body>
    </html>
  );
}
