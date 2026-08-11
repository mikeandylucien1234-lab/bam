# BAM

Site web classique — **Vite + React + TypeScript**, câblé à Supabase.

## Prérequis

- Node.js 18+ (testé sur Node 22)

## Installation

```bash
npm install
```

## Configuration Supabase

Le projet est câblé au projet Supabase **caona** (`ref: irtjefebunphenlyuvhl`).

1. Copiez le fichier d'exemple :

   ```bash
   cp .env.example .env
   ```

2. Renseignez dans `.env` :

   - `VITE_SUPABASE_URL` → `https://irtjefebunphenlyuvhl.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → la clé **publishable** du projet
     (Supabase → Project Settings → API Keys).

`.env` est ignoré par git : **aucune clé n'est jamais commitée**. Seul
`.env.example` (avec des placeholders) est versionné.

## Lancer en local

```bash
npm run dev
```

Le site est servi sur http://localhost:5173. La page d'accueil affiche
l'état de la connexion au projet Supabase.

## Scripts

| Commande           | Rôle                                  |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Serveur de développement (localhost)  |
| `npm run build`    | Build de production (`dist/`)         |
| `npm run preview`  | Prévisualise le build de production   |
| `npm run typecheck`| Vérification TypeScript               |

## Structure

```
src/
  lib/supabase.ts   Client Supabase partagé (lit VITE_SUPABASE_*)
  App.tsx           Page d'accueil + test de connexion
  main.tsx          Point d'entrée React
```
