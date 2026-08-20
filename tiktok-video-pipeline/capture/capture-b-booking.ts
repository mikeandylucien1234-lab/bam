/**
 * Vidéo B — Parcours utilisateur : tutoriel de réservation de billet.
 * Suit la timeline `bookingSteps` (config.ts) avec un curseur animé, en
 * capturant image-par-image → MP4 propre (clean/video-b.mp4).
 */
import { config, bookingSteps, type BookingStep } from './config.js';
import { launch } from './lib/browser.js';
import { preparePage, easeInOutCubic } from './lib/prepare-page.js';
import { FrameRecorder } from './lib/frames.js';
import { initCursor, moveCursorTo, clickRipple } from './lib/fake-cursor.js';
import type { Locator, Page } from 'playwright';

const { fps } = config;
const B = config.videoB;

/** Résout un locator à partir d'une étape "clic". */
function resolveLocator(page: Page, step: Extract<BookingStep, { type: 'clickText' | 'clickSelector' }>): Locator {
  return step.type === 'clickText'
    ? page.getByText(step.text, { exact: false }).first()
    : page.locator(step.selector).first();
}

/** Amène le curseur au centre d'un élément (scroll dans la vue au besoin) puis capture. */
async function cursorToLocator(page: Page, rec: FrameRecorder, loc: Locator): Promise<void> {
  await loc.scrollIntoViewIfNeeded({ timeout: 5_000 }).catch(() => {});
  const box = await loc.boundingBox();
  if (!box) throw new Error('élément introuvable / hors écran');
  await moveCursorTo(page, rec, box.x + box.width / 2, box.y + box.height / 2, B.moveSec, fps);
}

async function runStep(page: Page, rec: FrameRecorder, step: BookingStep, i: number): Promise<void> {
  const tag = step.label ? ` (${step.label})` : '';
  console.log(`  · étape ${i + 1}/${bookingSteps.length} : ${step.type}${tag}`);

  switch (step.type) {
    case 'dwell':
      await rec.hold(step.sec, fps);
      break;

    case 'scrollTo': {
      const target = await page.evaluate((to) => {
        const max = Math.max(0, document.body.scrollHeight - window.innerHeight);
        if (to === 'bottom') return max;
        if (to === 'top') return 0;
        return max * (to as number);
      }, step.to);
      const from = await page.evaluate(() => window.scrollY);
      const frames = Math.round(B.moveSec * 2 * fps);
      for (let f = 1; f <= frames; f++) {
        const y = from + (target - from) * easeInOutCubic(f / frames);
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await rec.shoot();
      }
      break;
    }

    case 'clickText':
    case 'clickSelector': {
      const loc = resolveLocator(page, step);
      await cursorToLocator(page, rec, loc);
      await clickRipple(page, rec, fps);
      await loc.click({ timeout: 5_000 });
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
      await rec.hold(B.dwellSec, fps);
      break;
    }

    case 'fill': {
      const loc = page.locator(step.selector).first();
      await cursorToLocator(page, rec, loc);
      await clickRipple(page, rec, fps);
      await loc.click({ timeout: 5_000 });
      // Frappe caractère par caractère, capturée pour l'effet "saisie".
      await loc.fill('');
      for (const ch of step.value) {
        await loc.type(ch, { delay: 0 });
        await rec.shoot();
      }
      await rec.hold(0.4, fps);
      break;
    }

    case 'waitFor':
      await page.locator(step.selector).first().waitFor({ timeout: 15_000 });
      await rec.hold(0.3, fps);
      break;
  }
}

async function main() {
  console.log(`▶ Vidéo B — ${config.baseUrl} @ ${fps}fps`);
  const { browser, page } = await launch();
  try {
    await preparePage(page, config.baseUrl);
    await initCursor(page);

    const rec = new FrameRecorder(page, B.outFile, fps);

    for (let i = 0; i < bookingSteps.length; i++) {
      await runStep(page, rec, bookingSteps[i], i);
    }

    console.log(`  frames capturées : ${rec.count}`);
    await rec.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ Échec capture Vidéo B :', err?.message ?? err);
  console.error('   Astuce : ajuste les sélecteurs de `bookingSteps` dans capture/config.ts');
  process.exit(1);
});
