/**
 * Configuration partagée des captures Playwright.
 * Tout est surchargeable par variable d'environnement pour éviter de toucher au code.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

export const config = {
  /** URL du site cible (page d'accueil). */
  baseUrl: process.env.BASE_URL ?? 'https://caonabo.vercel.app/',

  /** Profil "téléphone" : rendu mobile, écran net (deviceScaleFactor). */
  device: {
    width: Number(process.env.VIEWPORT_W ?? 390),
    height: Number(process.env.VIEWPORT_H ?? 844),
    deviceScaleFactor: Number(process.env.DSF ?? 3),
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
      '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },

  /** Cadence de capture. 60 = scroll très fluide ; 30 pour alléger. */
  fps: Number(process.env.FPS ?? 60),

  /** Vidéo A — scroll de la page d'accueil. */
  videoA: {
    holdTopSec: 0.8, // pause en haut avant de descendre
    scrollSec: 8, // durée du scroll
    holdBottomSec: 1.0, // pause en bas
    outFile: 'clean/video-a.mp4',
  },

  /** Vidéo B — parcours réservation (timeline éditable ci-dessous). */
  videoB: {
    outFile: 'clean/video-b.mp4',
    dwellSec: 1.0, // temps d'arrêt par défaut après chaque action
    moveSec: 0.6, // durée d'un déplacement de curseur
  },

  /** Encodage FFmpeg. */
  encode: {
    crf: Number(process.env.CRF ?? 18),
    pixFmt: 'yuv420p',
  },
} as const;

/**
 * TIMELINE de la Vidéo B (tutoriel de réservation).
 *
 * ⚠️ Les sélecteurs ci-dessous sont des HYPOTHÈSES : le site n'a pas pu être
 * inspecté depuis l'environnement d'exécution (bloqué par la politique réseau).
 * Ajuste `text`/`selector` après un premier passage — chaque étape anime le
 * curseur vers sa cible puis exécute l'action, en capturant image par image.
 *
 * Types d'étape :
 *  - { type: 'scrollTo', to: 'bottom' | 'top' | number }  // number = ratio 0..1
 *  - { type: 'clickText', text: 'Réserver' }
 *  - { type: 'clickSelector', selector: 'button.book' }
 *  - { type: 'fill', selector: 'input[name=email]', value: 'test@mail.com' }
 *  - { type: 'waitFor', selector: '...' }
 *  - { type: 'dwell', sec: 1.5 }
 */
export type BookingStep =
  | { type: 'scrollTo'; to: 'bottom' | 'top' | number; label?: string }
  | { type: 'clickText'; text: string; label?: string }
  | { type: 'clickSelector'; selector: string; label?: string }
  | { type: 'fill'; selector: string; value: string; label?: string }
  | { type: 'waitFor'; selector: string; label?: string }
  | { type: 'dwell'; sec: number; label?: string };

/** Valeurs réelles du parcours (CAONABO AIRLINES) — faciles à modifier. */
export const booking = {
  departure: 'Cap-Haïtien',
  arrival: 'Santiago',
  dateAller: '2026-09-10', // 10 septembre 2026 (format à adapter au champ réel)
  dateRetour: '2026-10-12', // 12 octobre 2026
  passagers: 1,
};

export const bookingSteps: BookingStep[] = [
  // ── Étape 1 : ouvrir la page Réserver (lien du menu du haut) ─────────────
  { type: 'dwell', sec: 1.2, label: 'Accueil' },
  { type: 'clickText', text: 'Réserver', label: 'Menu → Réserver' },
  { type: 'dwell', sec: 1.5, label: 'Page Réserver' },

  // ── Étape 2+ : formulaire (destination / dates / recherche) ──────────────
  // ⚠️ À COMPLÉTER avec la sortie de `capture/inspect.ts` sur la page Réserver.
  // Une fois les sélecteurs connus, ça ressemblera à :
  //   { type: 'fill',        selector: '<champ départ>',  value: booking.departure },
  //   { type: 'fill',        selector: '<champ arrivée>', value: booking.arrival },
  //   { type: 'fill',        selector: '<champ date aller>',  value: booking.dateAller },
  //   { type: 'fill',        selector: '<champ date retour>', value: booking.dateRetour },
  //   { type: 'clickText',   text: 'Rechercher', label: 'Voir les vols' },
  //   { type: 'waitFor',     selector: '<carte vol>' },
  //   { type: 'dwell', sec: 2.0, label: 'Vols disponibles' },
];
