import fs from 'node:fs';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { config } from '../config.js';

/**
 * Chemin d'un Chromium préinstallé, si présent (sandbox où `playwright install`
 * n'est pas disponible). En local, on laisse Playwright utiliser le sien.
 */
function resolveExecutablePath(): string | undefined {
  if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) return process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  const preinstalled = '/opt/pw-browsers/chromium';
  return fs.existsSync(preinstalled) ? preinstalled : undefined;
}

/**
 * Lance Chromium + un contexte "téléphone".
 * - Route le trafic via HTTPS_PROXY si présent (environnements sandbox).
 * - ignoreHTTPSErrors : évite les soucis de CA quand le proxy re-termine le TLS.
 */
export async function launch(): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  const proxyServer = process.env.HTTPS_PROXY || process.env.https_proxy;

  const executablePath = resolveExecutablePath();

  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    ...(proxyServer
      ? { proxy: { server: proxyServer, bypass: process.env.NO_PROXY ?? '' } }
      : {}),
    args: ['--disable-dev-shm-usage', '--force-color-profile=srgb'],
  });

  const context = await browser.newContext({
    viewport: { width: config.device.width, height: config.device.height },
    deviceScaleFactor: config.device.deviceScaleFactor,
    isMobile: config.device.isMobile,
    hasTouch: config.device.hasTouch,
    userAgent: config.device.userAgent,
    ignoreHTTPSErrors: true,
    reducedMotion: 'no-preference',
  });

  const page = await context.newPage();
  return { browser, context, page };
}
