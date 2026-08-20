import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, config } from '../config.js';

const require = createRequire(import.meta.url);

/** Résout un binaire ffmpeg disposant de libx264 (ffmpeg-static en priorité). */
function resolveFfmpeg(): string {
  const candidates: string[] = [];
  try {
    const p = require('ffmpeg-static') as string | null;
    if (p) candidates.push(p);
  } catch {}
  if (process.env.FFMPEG_PATH) candidates.push(process.env.FFMPEG_PATH);
  candidates.push('ffmpeg');
  for (const c of candidates) {
    if (c === 'ffmpeg' || fs.existsSync(c)) return c;
  }
  throw new Error('Aucun binaire ffmpeg trouvé (installe ffmpeg-static).');
}

/**
 * Assemble les frames PNG d'un dossier en un MP4 H.264 propre.
 * yuv420p + faststart = compatibilité maximale (TikTok, QuickTime, navigateurs).
 */
export function encodeFramesToMp4(framesDir: string, outFile: string, fps: number): void {
  const ffmpeg = resolveFfmpeg();
  const absFrames = path.join(ROOT, framesDir, 'frame_%05d.png');
  const absOut = path.join(ROOT, outFile);
  fs.mkdirSync(path.dirname(absOut), { recursive: true });

  const args = [
    '-y',
    '-framerate', String(fps),
    '-i', absFrames,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', String(config.encode.crf),
    '-pix_fmt', config.encode.pixFmt,
    // dimensions paires obligatoires pour yuv420p
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-movflags', '+faststart',
    absOut,
  ];

  console.log(`\n[ffmpeg] ${ffmpeg} ${args.join(' ')}\n`);
  const res = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (res.status !== 0) throw new Error(`ffmpeg a échoué (code ${res.status})`);
  console.log(`✅ Écrit : ${absOut}`);
}
