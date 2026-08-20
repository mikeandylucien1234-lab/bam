/**
 * Vidéo A — Présentation fluide : scroll de la page d'accueil.
 * Capture déterministe image-par-image → MP4 propre (clean/video-a.mp4).
 */
import { config } from './config.js';
import { launch } from './lib/browser.js';
import { preparePage, easeInOutCubic } from './lib/prepare-page.js';
import { FrameRecorder } from './lib/frames.js';
import { encodeFramesToMp4 } from './lib/encode.js';

async function main() {
  const { fps } = config;
  const A = config.videoA;
  console.log(`▶ Vidéo A — ${config.baseUrl} @ ${fps}fps`);

  const { browser, page } = await launch();
  try {
    await preparePage(page, config.baseUrl);

    const rec = new FrameRecorder(page, A.framesDir);

    const maxScroll = await page.evaluate(
      () => Math.max(0, document.body.scrollHeight - window.innerHeight),
    );
    console.log(`  hauteur scrollable : ${maxScroll}px`);

    // 1) Pause en haut
    await page.evaluate(() => window.scrollTo(0, 0));
    await rec.hold(A.holdTopSec, fps);

    // 2) Scroll fluide (easeInOutCubic)
    const scrollFrames = Math.round(A.scrollSec * fps);
    for (let i = 1; i <= scrollFrames; i++) {
      const y = easeInOutCubic(i / scrollFrames) * maxScroll;
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await rec.shoot();
    }

    // 3) Pause en bas
    await rec.hold(A.holdBottomSec, fps);

    console.log(`  frames capturées : ${rec.count}`);
    encodeFramesToMp4(A.framesDir, A.outFile, fps);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ Échec capture Vidéo A :', err?.message ?? err);
  process.exit(1);
});
