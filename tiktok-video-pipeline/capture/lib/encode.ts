import fs from 'node:fs';
import { createRequire } from 'node:module';
import { config } from '../config.js';

const require = createRequire(import.meta.url);

/** Résout un binaire ffmpeg disposant de libx264 (ffmpeg-static en priorité). */
export function resolveFfmpeg(): string {
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
 * Arguments ffmpeg pour encoder un flux d'images (image2pipe, via stdin) en
 * MP4 H.264 propre. yuv420p + faststart = compatibilité maximale
 * (TikTok, QuickTime, navigateurs).
 */
export function encodeArgs(outFile: string, fps: number): string[] {
  return [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-framerate', String(fps),
    '-i', 'pipe:0',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', String(config.encode.crf),
    '-pix_fmt', config.encode.pixFmt,
    // dimensions paires obligatoires pour yuv420p
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-movflags', '+faststart',
    outFile,
  ];
}
