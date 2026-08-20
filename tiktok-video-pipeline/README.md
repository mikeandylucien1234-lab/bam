# TikTok Video Pipeline — Playwright → FFmpeg → Remotion

Pipeline pour produire **2 vidéos TikTok 1080×1920** à partir d'un site en ligne :

- **Vidéo A** — scroll fluide de la page d'accueil.
- **Vidéo B** — tutoriel de réservation de billet (parcours utilisateur, curseur animé).

Phase actuelle : **capture** (Playwright → MP4 propre). L'habillage 3D Remotion suit en Phase 2.

## Prérequis
- Node 18+
- Accès réseau au site cible (voir ⚠️ ci-dessous)

## Installation
```bash
cd tiktok-video-pipeline
npm install            # playwright, ffmpeg-static, tsx…
npx playwright install chromium   # en local uniquement (déjà présent en sandbox)
```

## Utilisation
```bash
npm run capture:a      # → clean/video-a.mp4  (scroll accueil)
npm run capture:b      # → clean/video-b.mp4  (tutoriel réservation)
npm run capture:all
```

Réglages par variables d'environnement (sinon valeurs par défaut de `capture/config.ts`) :
```bash
BASE_URL=https://caonabo.vercel.app/ FPS=60 VIEWPORT_W=390 VIEWPORT_H=844 DSF=3 npm run capture:a
```

## ⚠️ Contrainte réseau (environnement Claude Code web)
La capture nécessite d'atteindre le site. Dans **cet environnement d'exécution**,
l'hôte `caonabo.vercel.app` est **bloqué par la politique d'egress** de
l'organisation → `net::ERR_TUNNEL_CONNECTION_FAILED` (proxy 403).

Deux façons de produire réellement les MP4 :
1. **Lancer en local** (`npm run capture:all`) sur une machine à réseau ouvert — recommandé.
2. **Autoriser le domaine** dans la politique réseau de l'environnement (côté admin
   claude.ai), puis relancer ici.

Le toolchain lui-même est validé de bout en bout (Playwright → screenshots →
ffmpeg H.264/yuv420p, 1170×2532). Seul l'accès au site distant manque ici.

## Architecture
```
capture/
  config.ts              # URL, device, fps, timings + TIMELINE Vidéo B (bookingSteps)
  capture-a-home.ts      # Vidéo A : scroll accueil (easeInOutCubic)
  capture-b-booking.ts   # Vidéo B : suit bookingSteps avec curseur animé
  lib/
    browser.ts           # Chromium (proxy + Chromium préinstallé si dispo)
    prepare-page.ts      # attente polices/réseau, préchargement lazy, cookies, scrollbar
    frames.ts            # 1 screenshot / frame → raw/<v>/frame_%05d.png
    fake-cursor.ts       # curseur DOM animé + effet clic (tuto)
    encode.ts            # frames PNG → MP4 propre (ffmpeg-static, libx264)
raw/                     # frames PNG (ignorées par git)
clean/                   # video-a.mp4 / video-b.mp4 (sorties)
```

## Vidéo B — ajuster le parcours
Les sélecteurs de `bookingSteps` (dans `capture/config.ts`) sont des **hypothèses** :
le site n'a pas pu être inspecté ici. Après un premier passage local, ajuste
`text`/`selector`/`value` de chaque étape selon le vrai flux de réservation.
Types d'étape disponibles : `dwell`, `scrollTo`, `clickText`, `clickSelector`,
`fill`, `waitFor`.

## Méthode de capture
Capture **déterministe image-par-image** (1 screenshot par frame) plutôt que la
vidéo native Playwright (framerate variable → saccades). On pilote nous-mêmes le
scroll / le curseur, puis ffmpeg assemble à framerate constant → mouvement fluide
et reproductible. `yuv420p` + `+faststart` = compatibilité TikTok/QuickTime/navigateurs.
