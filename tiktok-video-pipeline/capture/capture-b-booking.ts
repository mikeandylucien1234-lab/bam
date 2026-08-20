/**
 * Vidéo B — Parcours utilisateur : tutoriel de réservation (CAONABO /book).
 * Suit la timeline `bookingSteps` (config.ts) avec un curseur animé, en
 * capturant image-par-image → MP4 propre (clean/video-b.mp4).
 */
import { config, bookingSteps, type BookingStep, type Target } from './config.js';
import { launch } from './lib/browser.js';
import { preparePage, easeInOutCubic } from './lib/prepare-page.js';
import { FrameRecorder } from './lib/frames.js';
import { initCursor, moveCursorTo, clickRipple } from './lib/fake-cursor.js';
import type { Locator, Page } from 'playwright';

const { fps } = config;
const B = config.videoB;

/** Résout une cible en locator Playwright. */
function resolve(page: Page, t: Target): Locator {
  switch (t.by) {
    case 'label':
      return page.getByLabel(t.value, { exact: false }).first();
    case 'placeholder':
      return page.getByPlaceholder(t.value, { exact: false }).first();
    case 'role':
      return page.getByRole(t.role, { name: t.name }).first();
    case 'text':
      return page.getByText(t.value, { exact: false }).first();
    case 'selector':
      return page.locator(t.value).first();
  }
}

/** Amène le curseur au centre d'un élément (scroll au besoin) puis capture. */
async function cursorTo(page: Page, rec: FrameRecorder, loc: Locator): Promise<void> {
  await loc.scrollIntoViewIfNeeded({ timeout: 6_000 });
  const box = await loc.boundingBox();
  if (!box) throw new Error('élément sans position à l’écran');
  await moveCursorTo(page, rec, box.x + box.width / 2, box.y + box.height / 2, B.moveSec, fps);
}

async function runStep(page: Page, rec: FrameRecorder, step: BookingStep, i: number): Promise<void> {
  const tag = step.label ? ` (${step.label})` : '';
  console.log(`  · étape ${i + 1}/${bookingSteps.length} : ${step.type}${tag}`);

  switch (step.type) {
    case 'dwell':
      await rec.hold(step.sec, fps);
      return;

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
      return;
    }

    case 'click': {
      const loc = resolve(page, step.target);
      await cursorTo(page, rec, loc);
      await clickRipple(page, rec, fps);
      await loc.click({ timeout: 6_000 });
      await page.waitForLoadState('networkidle', { timeout: 12_000 }).catch(() => {});
      await rec.hold(B.dwellSec, fps);
      return;
    }

    case 'select': {
      const loc = resolve(page, step.target);
      await cursorTo(page, rec, loc);
      await clickRipple(page, rec, fps);
      // essaie par libellé d'option, puis par valeur brute
      await loc.selectOption({ label: step.value }).catch(() => loc.selectOption(step.value));
      await rec.hold(0.6, fps);
      return;
    }

    case 'fill': {
      const loc = resolve(page, step.target);
      await cursorTo(page, rec, loc);
      await clickRipple(page, rec, fps);
      await loc.click({ timeout: 6_000 }).catch(() => {});
      const isDate = /^\d{4}-\d{2}-\d{2}$/.test(step.value);
      if (isDate) {
        // champ date natif : remplissage direct (pas de frappe lettre par lettre)
        await loc.fill(step.value);
        await rec.hold(0.5, fps);
      } else {
        await loc.fill('');
        for (const ch of step.value) {
          await loc.type(ch, { delay: 0 });
          await rec.shoot();
        }
        await rec.hold(0.4, fps);
      }
      return;
    }

    case 'waitFor': {
      await resolve(page, step.target).waitFor({ timeout: 15_000 });
      await rec.hold(0.4, fps);
      return;
    }
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
      const step = bookingSteps[i];
      try {
        await runStep(page, rec, step, i);
      } catch (err: any) {
        if ('optional' in step && step.optional) {
          console.warn(`    ⏭️  étape optionnelle ignorée : ${err?.message ?? err}`);
          continue;
        }
        throw err;
      }
    }

    console.log(`  frames capturées : ${rec.count}`);
    await rec.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ Échec capture Vidéo B :', err?.message ?? err);
  console.error('   Astuce : ajuste la cible de l’étape dans `bookingSteps` (capture/config.ts),');
  console.error('   ou lance `capture/inspect.ts` sur la page /book pour voir les libellés exacts.');
  process.exit(1);
});
