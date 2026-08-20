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
 * TIMELINE de la Vidéo B — assistant de réservation CAONABO (`/book`, 5 étapes).
 *
 * Chaque étape anime le curseur vers sa cible puis agit, en capturant image
 * par image. Les cibles sont résolues par LIBELLÉ / RÔLE / PLACEHOLDER
 * (robuste sur ce formulaire), pas par sélecteur CSS fragile.
 *
 * `Target` : comment trouver l'élément
 *  - { by: 'label', value }        → getByLabel (champ avec libellé)
 *  - { by: 'placeholder', value }  → getByPlaceholder
 *  - { by: 'role', role, name }    → getByRole (bouton/lien)
 *  - { by: 'text', value }         → getByText (sous-chaîne)
 *  - { by: 'selector', value }     → locator CSS brut
 *
 * Types d'étape :
 *  - dwell     : pause (sec)
 *  - scrollTo  : défilement ('top'|'bottom'|ratio 0..1)
 *  - click     : clic sur une cible
 *  - fill      : saisie de texte (champs date natifs : format 'AAAA-MM-JJ')
 *  - select    : choix dans un <select> natif (par libellé d'option)
 *  - waitFor   : attend l'apparition d'une cible
 *  - ensureUrl : filet de sécurité — navigue vers `path` seulement si on n'y est
 *                pas déjà (ex. si le clic sur le menu n'a pas abouti)
 * `optional: true` → si la cible est absente/échoue, on continue sans planter.
 */
export type Target =
  | { by: 'label'; value: string }
  | { by: 'placeholder'; value: string }
  | { by: 'role'; role: 'button' | 'link' | 'option'; name: string }
  | { by: 'text'; value: string }
  | { by: 'selector'; value: string };

export type BookingStep =
  | { type: 'dwell'; sec: number; label?: string }
  | { type: 'scrollTo'; to: 'bottom' | 'top' | number; label?: string }
  | { type: 'click'; target: Target; label?: string; optional?: boolean }
  | { type: 'fill'; target: Target; value: string; label?: string; optional?: boolean }
  | { type: 'select'; target: Target; value: string; label?: string; optional?: boolean }
  | { type: 'waitFor'; target: Target; label?: string; optional?: boolean }
  | { type: 'ensureUrl'; path: string; label?: string };

/** Valeurs réelles du parcours (issues de tes captures) — faciles à modifier. */
export const pax = {
  depuis: 'Cap-Haïtien (CAP)',
  vers: 'Santiago (SCL)',
  dateAller: '2026-09-10', // 10 sept. 2026
  dateRetour: '2026-10-12', // 12 oct. 2026
  passagers: '1 passager',
  civilite: 'M.',
  prenom: 'JEAN',
  nom: 'JACQUE',
  naissance: '2000-12-11', // né le 11-12-2000
  nationalite: 'Haïti',
  typeDoc: 'Passeport',
  numDoc: 'R1234567890',
  expirationDoc: '2029-11-11', // exp. 11-11-2029
  paysEmission: 'HAITI',
  telPassager: '982621210',
  email: 'EXAMPLE@gmail.com',
  telContact: '91234567',
  nomCarte: 'JEAN BAPTISTE',
  numCarte: '4242 4242 4242 4242',
  expCarte: '12/29',
  cvc: '123',
};

export const bookingSteps: BookingStep[] = [
  // ── Accueil → menu Réserver ──────────────────────────────────────────────
  // En viewport téléphone, la nav est repliée dans un hamburger : on l'ouvre
  // d'abord (optionnel), on clique « Réserver » (optionnel), puis `ensureUrl`
  // garantit qu'on est bien sur /book quoi qu'il arrive.
  { type: 'dwell', sec: 1.2, label: 'Accueil' },
  { type: 'click', target: { by: 'selector', value: 'button[aria-label*="enu" i], button.hamburger, header button:has(svg)' }, label: 'Ouvrir le menu ☰', optional: true },
  { type: 'dwell', sec: 0.6 },
  { type: 'click', target: { by: 'role', role: 'link', name: 'Réserver' }, label: 'Menu → Réserver', optional: true },
  { type: 'ensureUrl', path: '/book', label: 'Page de réservation' },
  { type: 'dwell', sec: 1.4, label: 'Étape 1 · Recherche' },

  // ── Étape 1 · Recherche (itinéraire) ─────────────────────────────────────
  { type: 'select', target: { by: 'label', value: 'Depuis' }, value: pax.depuis, label: 'Départ' },
  { type: 'select', target: { by: 'label', value: 'Vers' }, value: pax.vers, label: 'Arrivée' },
  { type: 'fill', target: { by: 'label', value: 'Date aller' }, value: pax.dateAller, label: 'Date aller' },
  { type: 'fill', target: { by: 'label', value: 'Date retour' }, value: pax.dateRetour, label: 'Date retour' },
  { type: 'select', target: { by: 'label', value: 'Passagers' }, value: pax.passagers, optional: true },
  { type: 'dwell', sec: 0.8 },
  { type: 'click', target: { by: 'role', role: 'button', name: 'Suivant' }, label: '→ Vol' },
  { type: 'dwell', sec: 1.4, label: 'Étape 2 · Vol' },

  // ── Étape 2 · Choix du vol ───────────────────────────────────────────────
  { type: 'click', target: { by: 'text', value: 'CA201' }, label: 'Choisir le vol', optional: true },
  { type: 'dwell', sec: 1.0 },
  { type: 'click', target: { by: 'role', role: 'button', name: 'Suivant' }, label: '→ Passagers' },
  { type: 'dwell', sec: 1.4, label: 'Étape 3 · Passagers' },

  // ── Étape 3 · Passagers et documents ─────────────────────────────────────
  { type: 'select', target: { by: 'label', value: 'Civilité' }, value: pax.civilite, optional: true },
  { type: 'fill', target: { by: 'label', value: 'Prénom' }, value: pax.prenom, label: 'Prénom' },
  { type: 'fill', target: { by: 'label', value: 'Nom' }, value: pax.nom, label: 'Nom' },
  { type: 'fill', target: { by: 'label', value: 'Date de naissance' }, value: pax.naissance, optional: true },
  { type: 'fill', target: { by: 'label', value: 'Nationalité' }, value: pax.nationalite, optional: true },
  { type: 'select', target: { by: 'label', value: 'Type de document' }, value: pax.typeDoc, optional: true },
  { type: 'fill', target: { by: 'label', value: 'N° de document' }, value: pax.numDoc, label: 'N° passeport' },
  { type: 'fill', target: { by: 'label', value: 'Expiration' }, value: pax.expirationDoc, optional: true },
  { type: 'fill', target: { by: 'label', value: "Pays d'émission" }, value: pax.paysEmission, optional: true },
  { type: 'fill', target: { by: 'label', value: 'Téléphone du passager' }, value: pax.telPassager, optional: true },
  { type: 'fill', target: { by: 'label', value: 'Email de contact' }, value: pax.email, label: 'Email' },
  { type: 'fill', target: { by: 'label', value: 'Téléphone de contact' }, value: pax.telContact, optional: true },
  { type: 'dwell', sec: 0.8 },
  { type: 'click', target: { by: 'role', role: 'button', name: 'Suivant' }, label: '→ Options' },
  { type: 'dwell', sec: 1.6, label: 'Étape 4 · Options' },

  // ── Étape 4 · Bagages et sièges (mise en valeur, puis suite) ─────────────
  { type: 'scrollTo', to: 0.3, label: 'Voir les sièges' },
  { type: 'dwell', sec: 1.4 },
  { type: 'click', target: { by: 'role', role: 'button', name: 'Suivant' }, label: '→ Paiement' },
  { type: 'dwell', sec: 1.4, label: 'Étape 5 · Paiement' },

  // ── Étape 5 · Récapitulatif et paiement (mode démo) ──────────────────────
  { type: 'click', target: { by: 'text', value: 'Carte bancaire' }, optional: true },
  { type: 'fill', target: { by: 'placeholder', value: 'JEAN BAPTISTE' }, value: pax.nomCarte, label: 'Nom carte', optional: true },
  { type: 'fill', target: { by: 'placeholder', value: '4242 4242 4242 4242' }, value: pax.numCarte, label: 'N° carte', optional: true },
  { type: 'fill', target: { by: 'placeholder', value: 'MM/AA' }, value: pax.expCarte, optional: true },
  { type: 'fill', target: { by: 'placeholder', value: '123' }, value: pax.cvc, optional: true },
  { type: 'dwell', sec: 0.8 },
  { type: 'click', target: { by: 'text', value: 'Payer' }, label: 'Payer (démo)' },
  { type: 'waitFor', target: { by: 'text', value: 'Réservation confirmée' }, label: 'Confirmation', optional: true },
  { type: 'dwell', sec: 2.6, label: '✅ Réservation confirmée' },
];
