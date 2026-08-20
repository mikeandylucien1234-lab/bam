import type { Page } from 'playwright';
import { easeInOutCubic } from './prepare-page.js';
import type { FrameRecorder } from './frames.js';

const CURSOR_ID = '__tt_cursor__';

/** Injecte un faux curseur DOM (pour les tutos), positionné au centre bas. */
export async function initCursor(page: Page): Promise<void> {
  await page.evaluate((id) => {
    if (document.getElementById(id)) return;
    const c = document.createElement('div');
    c.id = id;
    Object.assign(c.style, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '26px',
      height: '26px',
      marginLeft: '-4px',
      marginTop: '-2px',
      zIndex: '2147483647',
      pointerEvents: 'none',
      transition: 'none',
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.35))',
    });
    c.innerHTML =
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none">' +
      '<path d="M4 2l14 8-6 1.6L9 18 4 2z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/>' +
      '</svg>';
    document.body.appendChild(c);
    const start = { x: window.innerWidth / 2, y: window.innerHeight * 0.7 };
    c.style.left = start.x + 'px';
    c.style.top = start.y + 'px';
    (window as any).__ttCursorPos = start;
  }, CURSOR_ID);
}

async function setCursor(page: Page, x: number, y: number): Promise<void> {
  await page.evaluate(
    ({ id, x, y }) => {
      const c = document.getElementById(id);
      if (c) {
        c.style.left = x + 'px';
        c.style.top = y + 'px';
      }
      (window as any).__ttCursorPos = { x, y };
    },
    { id: CURSOR_ID, x, y },
  );
}

/** Déplace le curseur de sa position courante vers (x,y), une frame par pas. */
export async function moveCursorTo(
  page: Page,
  rec: FrameRecorder,
  x: number,
  y: number,
  sec: number,
  fps: number,
): Promise<void> {
  const from = (await page.evaluate(() => (window as any).__ttCursorPos)) as { x: number; y: number };
  const frames = Math.max(1, Math.round(sec * fps));
  for (let i = 1; i <= frames; i++) {
    const t = easeInOutCubic(i / frames);
    await setCursor(page, from.x + (x - from.x) * t, from.y + (y - from.y) * t);
    await rec.shoot();
  }
  await page.mouse.move(x, y);
}

/** Petit effet "ripple" au clic, capturé sur quelques frames. */
export async function clickRipple(page: Page, rec: FrameRecorder, fps: number): Promise<void> {
  await page.evaluate(
    ({ id }) => {
      const c = document.getElementById(id);
      if (!c) return;
      const p = (window as any).__ttCursorPos;
      const r = document.createElement('div');
      Object.assign(r.style, {
        position: 'fixed',
        left: p.x + 'px',
        top: p.y + 'px',
        width: '10px',
        height: '10px',
        marginLeft: '-5px',
        marginTop: '-5px',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,.9)',
        boxShadow: '0 0 0 2px rgba(0,0,0,.25)',
        zIndex: '2147483646',
        pointerEvents: 'none',
        transform: 'scale(0.3)',
        opacity: '1',
        transition: 'transform .35s ease-out, opacity .35s ease-out',
      });
      document.body.appendChild(r);
      requestAnimationFrame(() => {
        r.style.transform = 'scale(3.2)';
        r.style.opacity = '0';
      });
      setTimeout(() => r.remove(), 400);
    },
    { id: CURSOR_ID },
  );
  const n = Math.max(1, Math.round(0.4 * fps));
  for (let i = 0; i < n; i++) await rec.shoot();
}
