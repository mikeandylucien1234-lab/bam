# Haitian Stars Media (HSM) — app Expo

Plateforme de streaming pour un média haïtien (interviews, podcasts, rap
kreyòl) destinée à la diaspora. Design sombre & cinématographique, interface
en français, titres/descriptions souvent en kreyòl.

> Ce dépôt a été repivoté depuis un ancien prototype retail (« BAM ») vers
> HSM. Les fichiers de l'ancien prototype ont été retirés ; `HomeScreen`
> (HSM) est la référence de style pour les écrans suivants.

## 🚀 Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en dev (Expo Go sur ton téléphone, scan du QR code)
npx expo start

# (optionnel) aperçu web dans le navigateur
npx expo start --web
```

## 🎨 Identité visuelle

- Thème sombre (fond noir/anthracite `#0A0A0C`, cards `#16161C`)
- Rouge `#E31C25` → live + CTA principal ; Or `#F5C542` → Star Member (premium)
- Typographie bold/impactante : Plus Jakarta Sans (ExtraBold pour le display)
- Logo : étoile dorée + « HAITIAN » (blanc) « STARS » (rouge) « MEDIA » (gris espacé)
- Vignettes cinématographiques (dégradé par catégorie + overlay sombre en bas)

## 📂 Structure

```
App.tsx                          → navigation + polices (thème sombre)
src/theme/hsm.ts                 → tokens couleurs/rayons/espacements + dégradés catégories
src/theme/fonts.ts               → chargement Plus Jakarta Sans
src/data/shows.ts                → données démo (émissions, catégories, placeholders vidéo)
src/components/hsm/Logo.tsx      → logo HSM (étoile SVG + wordmark)
src/components/hsm/Thumbnail.tsx → vignette dégradé + filigrane + scrim
src/components/hsm/ui.tsx        → badges LIVE/OFFLINE, compteur viewers, tag catégorie
src/screens/hsm/HomeScreen.tsx   → Accueil : header + hero + « Émissions en direct »
src/screens/hsm/PlaceholderScreen.tsx → écran temporaire pour le reste
```

## ✅ État actuel

Fait (accueil, 1re tranche) :

1. **Header sticky** — logo + recherche + menu
2. **Hero** — badge type d'émission, titre 2 lignes, description, 3 CTA
   (Regarder maintenant / Devenir Star Member / Programme)
3. **Émissions en direct** — cards pleine largeur, badge LIVE/OFFLINE,
   compteur de viewers, tag catégorie, prochaine diffusion si offline

## 🛠️ À venir (section par section)

- Accueil : Interviews, Podcasts & débats, Collaborations, Shorts,
  Actualités showbiz, footer
- Pages : lecteur vidéo, Star Member (offre premium), catalogue par
  catégorie (filtrable + recherche), profil (favoris/historique)
- Auth : inscription/connexion (email + Google)
- Back-office admin : CRUD émissions/vidéos, statut live/offline, catégories,
  mise en avant du hero
- Backend Supabase : tables `shows`, `categories`, `users`, `memberships` ;
  Auth (email + OAuth Google) ; Row Level Security

## ⚠️ Streaming vidéo

Pas d'infra de streaming réelle (ni RTMP ni transcodage). Les `videoUrl`
dans `src/data/shows.ts` sont des **placeholders** (MP4 de démo). Le vrai
service vidéo sera branché manuellement plus tard.
