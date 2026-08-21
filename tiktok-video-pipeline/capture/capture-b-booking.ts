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

/**
 * Repli « champ par libellé de proximité » : beaucoup de formulaires n'associent
 * pas le <label> au champ (pas de for/id). On cherche donc l'élément dont le
 * texte correspond au libellé, puis le contrôle le plus proche (à l'intérieur,
 * juste après, ou dans le bloc parent), et on le marque pour le cibler.
 */
const FIND_FIELD_BY_LABEL = String.raw`
  (labelText, allowedTags) => {
    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
    const want = norm(labelText);
    const allow = allowedTags && allowedTags.length ? allowedTags : ['INPUT', 'SELECT', 'TEXTAREA'];
    const isField = (el) => el && allow.includes(el.tagName) && el.type !== 'hidden';
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    document.querySelectorAll('[data-tt-target]').forEach((e) => e.removeAttribute('data-tt-target'));

    // 1) <label> explicite (for=, ou champ imbriqué)
    for (const lab of document.querySelectorAll('label')) {
      if (!norm(lab.textContent).startsWith(want)) continue;
      let f = null;
      const forId = lab.getAttribute('for');
      if (forId) f = document.getElementById(forId);
      if (!isField(f)) f = lab.querySelector(allow.join(','));
      if (isField(f) && visible(f)) { f.setAttribute('data-tt-target', '1'); return true; }
    }

    // 2) n'importe quel élément portant ce texte → champ le plus proche, du bon type.
    // Portée volontairement étroite (élément lui-même, ou au plus 2 voisins
    // suivants) : une recherche non bornée peut, sur une page « à plat »,
    // remonter très loin et saisir SILENCIEUSEMENT la mauvaise valeur dans un
    // champ sans rapport — pire qu'un échec visible.
    const all = Array.from(document.querySelectorAll('label,span,div,p,strong,b'));
    for (const el of all) {
      if (el.children.length > 2) continue;           // garder les petits porteurs de texte
      if (!norm(el.textContent).startsWith(want)) continue;
      let f = el.querySelector(allow.join(','));
      let sib = el.nextElementSibling;
      let hops = 0;
      while (sib && !isField(f) && hops < 2) {
        f = isField(sib) ? sib : (sib.querySelector && sib.querySelector(allow.join(',')));
        sib = sib.nextElementSibling;
        hops++;
      }
      if (isField(f) && visible(f)) { f.setAttribute('data-tt-target', '1'); return true; }
    }
    return false;
  }
`;

/** Résout une cible en locator Playwright (avec repli intelligent pour 'label'). */
async function resolve(page: Page, t: Target, allowedTags?: string[]): Promise<Locator> {
  switch (t.by) {
    case 'label': {
      const direct = page.getByLabel(t.value, { exact: false }).first();
      if (await direct.count().then((n) => n > 0).catch(() => false)) {
        if (await direct.isVisible().catch(() => false)) return direct;
      }
      // appel construit dans l'expression : passer une fonction en chaîne à
      // page.evaluate ne transmet pas l'argument.
      const found = await page.evaluate(
        `(${FIND_FIELD_BY_LABEL})(${JSON.stringify(t.value)}, ${JSON.stringify(allowedTags ?? null)})`,
      );
      if (found) return page.locator('[data-tt-target="1"]').first();
      return direct; // laisse l'erreur remonter avec un message clair
    }
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

/**
 * Diagnostic : liste TOUS les champs (visibles ou non — un input caché
 * derrière un bouton stylé est un piège classique des date-pickers) et les
 * boutons/liens visibles. Repère aussi tout élément dont le texte contient
 * "date" (souvent le bouton d'un calendrier personnalisé).
 */
const DUMP_FIELDS = String.raw`
  () => {
    const out = [];
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    out.push('--- champs (input/select/textarea), y compris invisibles ---');
    document.querySelectorAll('input,select,textarea').forEach((el) => {
      let lab = '';
      if (el.id) { const l = document.querySelector('label[for="' + CSS.escape(el.id) + '"]'); if (l) lab = l.innerText; }
      if (!lab && el.closest('label')) lab = el.closest('label').innerText;
      if (!lab && el.parentElement) lab = el.parentElement.innerText;
      out.push((vis(el) ? '[visible] ' : '[CACHÉ]   ') + '[' + el.tagName + (el.type ? ':' + el.type : '') + '] libellé≈"' +
        (lab || '').replace(/\s+/g, ' ').trim().slice(0, 45) + '"' +
        (el.name ? ' name=' + el.name : '') + (el.id ? ' id=' + el.id : '') +
        (el.placeholder ? ' ph="' + el.placeholder + '"' : ''));
    });
    out.push('--- boutons / liens visibles ---');
    document.querySelectorAll('button,[role=button],a').forEach((el) => {
      if (!vis(el)) return;
      const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
      if (t) out.push('[' + el.tagName + '] "' + t.slice(0, 45) + '"');
    });
    out.push('--- éléments contenant "date" (calendrier personnalisé probable) ---');
    document.querySelectorAll('button,div,span').forEach((el) => {
      if (!vis(el) || el.children.length > 2) return;
      const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
      if (t && /date/i.test(t) && t.length < 60) out.push('[' + el.tagName + '] "' + t + '"');
    });
    return out;
  }
`;

async function dumpPage(page: Page): Promise<void> {
  try {
    console.error(`\n🔎 Éléments sur ${page.url()} :`);
    const items = (await page.evaluate(`(${DUMP_FIELDS})()`)) as string[];
    for (const i of items.slice(0, 90)) console.error('   ' + i);
    console.error('');
  } catch {}
}

/** Amène le curseur au centre d'un élément (scroll au besoin) puis capture. */
async function cursorTo(page: Page, rec: FrameRecorder, loc: Locator): Promise<void> {
  // visible d'abord : en mobile, un élément replié (menu ☰) n'a pas de position
  await loc.waitFor({ state: 'visible', timeout: 6_000 });
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
      const loc = await resolve(page, step.target);
      await cursorTo(page, rec, loc);
      await clickRipple(page, rec, fps);
      await loc.click({ timeout: 6_000 });
      await page.waitForLoadState('networkidle', { timeout: 12_000 }).catch(() => {});
      await initCursor(page); // si le clic a provoqué une navigation
      await rec.hold(B.dwellSec, fps);
      return;
    }

    case 'select': {
      const loc = await resolve(page, step.target, ['SELECT']);
      await cursorTo(page, rec, loc);
      await clickRipple(page, rec, fps);
      // essaie par libellé d'option, puis par valeur brute
      await loc.selectOption({ label: step.value }).catch(() => loc.selectOption(step.value));
      await rec.hold(0.6, fps);
      return;
    }

    case 'fill': {
      const loc = await resolve(page, step.target, ['INPUT', 'TEXTAREA']);
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
      await (await resolve(page, step.target)).waitFor({ timeout: 15_000 });
      await rec.hold(0.4, fps);
      return;
    }

    case 'ensureUrl': {
      if (page.url().includes(step.path)) return; // déjà au bon endroit
      const target = new URL(step.path, config.baseUrl).toString();
      console.log(`    ↪ navigation directe vers ${target}`);
      await page.goto(target, { waitUntil: 'networkidle', timeout: 60_000 });
      await initCursor(page); // le curseur est perdu au rechargement
      await rec.hold(0.6, fps);
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

    // On ne s'arrête plus jamais au milieu : chaque étape en échec est
    // journalisée avec un diagnostic de la page, puis on continue — pour que
    // UNE SEULE exécution donne un rapport complet de tout ce qui coince,
    // et que le MP4 aille quand même jusqu'au bout.
    const failed: string[] = [];
    const dumpedUrls = new Set<string>(); // 1 diagnostic par page, pas par étape
    for (let i = 0; i < bookingSteps.length; i++) {
      const step = bookingSteps[i];
      const tag = step.label ?? step.type;
      try {
        await runStep(page, rec, step, i);
      } catch (err: any) {
        const isOptional = 'optional' in step && step.optional;
        console.warn(`    ⚠️  étape ${i + 1} (${tag}) échouée${isOptional ? ' [optionnelle]' : ''} : ${err?.message ?? err}`);
        if (!dumpedUrls.has(page.url())) {
          dumpedUrls.add(page.url());
          await dumpPage(page);
        }
        failed.push(`#${i + 1} ${tag}`);
      }
    }

    console.log(`  frames capturées : ${rec.count}`);
    await rec.close();

    if (failed.length) {
      console.warn(`\n⚠️  ${failed.length} étape(s) ont échoué (le MP4 a quand même été produit) :`);
      for (const f of failed) console.warn(`   - ${f}`);
      console.warn('   Colle tout ce log (y compris les blocs 🔎) pour que les cibles soient corrigées.\n');
    } else {
      console.log('✅ Toutes les étapes ont réussi.');
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ Échec capture Vidéo B (erreur fatale, hors étapes) :', err?.message ?? err);
  process.exit(1);
});
