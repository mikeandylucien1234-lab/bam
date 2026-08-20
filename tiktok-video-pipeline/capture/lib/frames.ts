import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { ROOT } from '../config.js';
import { resolveFfmpeg, encodeArgs } from './encode.js';

/**
 * Enregistreur de frames en STREAMING : chaque screenshot est envoyé
 * directement dans ffmpeg (image2pipe) → aucun PNG stocké sur le disque,
 * seul le MP4 final est écrit. Évite le remplissage disque (ENOSPC).
 */
export class FrameRecorder {
  private index = 0;
  private ff: ChildProcess;
  private lastFrame: Buffer | null = null;
  private done: Promise<void>;
  readonly absOut: string;

  constructor(private page: Page, outFile: string, private fps: number) {
    this.absOut = path.join(ROOT, outFile);
    fs.mkdirSync(path.dirname(this.absOut), { recursive: true });

    const ffmpeg = resolveFfmpeg();
    const args = encodeArgs(this.absOut, fps);
    console.log(`[ffmpeg] flux → ${this.absOut}`);
    this.ff = spawn(ffmpeg, args, { stdio: ['pipe', 'inherit', 'inherit'] });

    this.done = new Promise<void>((resolve, reject) => {
      this.ff.on('error', reject);
      this.ff.on('close', (code) =>
        code === 0 ? resolve() : reject(new Error(`ffmpeg s'est terminé (code ${code})`)),
      );
    });
    // Ne pas planter le process sur EPIPE : l'erreur remonte via 'close'.
    this.ff.stdin?.on('error', () => {});
  }

  /** Écrit un buffer dans ffmpeg en respectant la contre-pression (drain). */
  private write(buf: Buffer): Promise<void> {
    const stdin = this.ff.stdin!;
    return new Promise<void>((resolve) => {
      if (stdin.write(buf)) resolve();
      else stdin.once('drain', resolve);
    });
  }

  /** Capture le viewport et l'envoie comme une frame. */
  async shoot(): Promise<void> {
    const buf = await this.page.screenshot({ animations: 'disabled' });
    this.lastFrame = buf;
    await this.write(buf);
    this.index++;
  }

  /** Maintient l'état courant `sec` secondes (réutilise la dernière frame). */
  async hold(sec: number, fps = this.fps): Promise<void> {
    const n = Math.max(1, Math.round(sec * fps));
    let written = 0;
    if (!this.lastFrame) {
      await this.shoot();
      written = 1;
    }
    for (; written < n; written++) {
      await this.write(this.lastFrame!);
      this.index++;
    }
  }

  get count(): number {
    return this.index;
  }

  /** Ferme le flux et attend la finalisation du MP4. */
  async close(): Promise<void> {
    this.ff.stdin?.end();
    await this.done;
    console.log(`✅ Écrit : ${this.absOut}`);
  }
}
