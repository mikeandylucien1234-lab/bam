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

export const bookingSteps: BookingStep[] = [
  { type: 'dwell', sec: 1.0, label: "Accueil" },
  { type: 'clickText', text: 'Réserver', label: 'Ouvrir la réservation' },
  { type: 'dwell', sec: 1.2, label: 'Page réservation' },
  { type: 'clickText', text: 'Billet', label: 'Choisir un billet' },
  { type: 'dwell', sec: 1.0 },
  { type: 'fill', selector: 'input[type="email"]', value: 'client@exemple.com', label: 'Saisir email' },
  { type: 'dwell', sec: 0.8 },
  { type: 'clickText', text: 'Confirmer', label: 'Confirmer la réservation' },
  { type: 'dwell', sec: 1.8, label: 'Confirmation' },
];
