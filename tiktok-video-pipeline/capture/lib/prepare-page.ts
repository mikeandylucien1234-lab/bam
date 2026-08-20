import type { Page } from 'playwright';
import { config } from '../config.js';

/** easeInOutCubic — courbe douce pour le scroll. */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Prépare une page pour une capture "propre" :
 *  - navigue et attend le réseau au repos,
 *  - attend le chargement des polices,
 *  - précharge les images lazy (petit aller-retour de scroll),
 *  - masque la barre de scroll,
 *  - tente de fermer les bandeaux cookies/consentement courants.
 */
export async function preparePage(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });

  // Masquer la scrollbar (WebKit + Firefox) pour un rendu net.
  await page.addStyleTag({
    content: `
      ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
      * { scrollbar-width: none !important; }
    `,
  });

  // Polices prêtes.
  await page.evaluate(async () => {
    try {
      await (document as any).fonts?.ready;
    } catch {}
  });

  // Précharger les images lazy : descendre puis remonter.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.body.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });

  // Fermer les bandeaux cookies/consentement les plus courants (best-effort).
  const consentSelectors = [
    'text=/tout accepter/i',
    'text=/accepter/i',
    'text=/accept all/i',
    'text=/j.accepte/i',
    '#onetrust-accept-btn-handler',
    'button[aria-label*="accept" i]',
  ];
  for (const sel of consentSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 500 })) {
        await btn.click({ timeout: 1000 });
        break;
      }
    } catch {}
  }

  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.readyState === 'complete');
  void config;
}
