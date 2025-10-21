# Annuaire des Acteurs du Livre — Guadeloupe (MVP)

Application **Next.js + Supabase** prête à déployer (Vercel).  
Fonctions incluses : création de fiches, file de **modération**, **anti‑vulgarité** simple, **vue publique** filtrée, **RLS** Supabase.

## 1) Pré-requis
- Un compte **Supabase** (gratuit)
- Un compte **Vercel** (gratuit)

## 2) Base de données (Supabase)
1. Crée un projet sur Supabase
2. Va dans **SQL Editor** et exécute le contenu du fichier `supabase/schema.sql` (copier/coller).
3. Notes tes clés dans **Project Settings → API** :  
   - URL du projet  
   - `anon key`  
   - `service_role` (server only, ne jamais exposer côté client)

## 3) Variables d'environnement
Crée un fichier `.env` à la racine (ou via le dashboard Vercel) en t'inspirant de `.env.example` :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# hCaptcha (optionnel, recommandé pour lutter contre le spam)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=...   # sitekey
HCAPTCHA_SECRET=...                 # secret

ADMIN_EMAILS=you@example.com
APP_BASE_URL=https://ton-domaine.example
```

## 4) Lancement en local
```bash
npm install
npm run dev
# ouvre http://localhost:3000
```

## 5) Déploiement Vercel (simple)
- Nouveau projet → Importer ce repo
- Ajoute les variables d'env ci-dessus
- Déploie. C'est tout.

## 6) Rôles & Modération
- Toutes les créations vont en **status = pending**.
- L’admin publie/refuse via `/admin/moderation`.
- Le **RLS** autorise la lecture publique uniquement des fiches `published` (via la **vue** `entities_public`).

## 7) Anti-vulgarité
- Validation côté client (utile UX) **et côté serveur** (sécurité) via une petite liste FR.
- Tu peux enrichir la liste dans `app/api/submit/route.ts` et `lib/profanity.ts`.

## 8) hCaptcha (optionnel)
- Crée un sitekey sur hCaptcha, mets `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` + `HCAPTCHA_SECRET`.
- Le formulaire `/submit` enverra un header `x-hcaptcha-token` (à câbler dans le front si tu actives hCaptcha).

## 9) Personnalisation rapide
- Styles : `app/globals.css`
- Libellés : composants/pages dans `app/*`
- Données : ajoute une commande d’insert initial si tu veux précharger des fiches.

## 10) Limites connues (MVP)
- Pas encore d’authentification/connexion UI (possible via Supabase Auth si besoin).
- Pas encore de “revendiquer une fiche” avec preuve : à ajouter (table owners).
- Pas d’upload média (photos/logos) : ajouter Supabase Storage.
- Pas de carte : ajouter Leaflet + colonnes géo.

> Ce dépôt est une **base fonctionnelle** minimaliste. Tu peux publier en l’état puis itérer.
