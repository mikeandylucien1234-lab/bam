import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { ROOT } from '../config.js';

/**
 * Enregistreur de frames : un screenshot du viewport par appel à shoot(),
 * numéroté frame_00000.png, frame_00001.png, ... dans un dossier propre.
 */
export class FrameRecorder {
  private index = 0;
  readonly absDir: string;

  constructor(private page: Page, framesDir: string) {
    this.absDir = path.join(ROOT, framesDir);
    fs.rmSync(this.absDir, { recursive: true, force: true });
    fs.mkdirSync(this.absDir, { recursive: true });
  }

  async shoot(): Promise<void> {
    const file = path.join(this.absDir, `frame_${String(this.index).padStart(5, '0')}.png`);
    await this.page.screenshot({ path: file, animations: 'disabled' });
    this.index++;
  }

  /** Répète le dernier état pendant `sec` secondes (pause fluide). */
  async hold(sec: number, fps: number): Promise<void> {
    const n = Math.max(1, Math.round(sec * fps));
    for (let i = 0; i < n; i++) await this.shoot();
  }

  get count(): number {
    return this.index;
  }
}
