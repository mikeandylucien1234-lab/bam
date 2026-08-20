/**
 * Inspecteur de page — liste les éléments interactifs (boutons, liens, champs)
 * d'une URL, avec leur texte exact et un sélecteur suggéré.
 *
 * But : découvrir le vrai parcours de réservation sans deviner les sélecteurs.
 * Lance-le sur chaque page du flux et colle la sortie.
 *
 * Windows PowerShell :
 *   $env:URL="https://caonabo.vercel.app/"; npx tsx capture/inspect.ts
 *   $env:URL="https://caonabo.vercel.app/reservation"; npx tsx capture/inspect.ts
 * (sans URL, il inspecte config.baseUrl)
 */
import { config } from './config.js';
import { launch } from './lib/browser.js';
import { preparePage } from './lib/prepare-page.js';

type Item = {
  kind: string;
  text: string;
  selector: string;
  detail: string;
  visible: boolean;
};

async function main() {
  const url = process.env.URL ?? config.baseUrl;
  console.log(`\n🔎 Inspection de : ${url}\n`);

  const { browser, page } = await launch();
  try {
    await preparePage(page, url);

    console.log(`Titre : ${await page.title()}`);
    console.log(`URL finale : ${page.url()}\n`);

    // Code exécuté DANS le navigateur — passé en chaîne brute pour éviter la
    // transformation esbuild/tsx (bug "__name is not defined").
    const BROWSER_COLLECT = String.raw`
      (() => {
        const out = [];
        const seen = new Set();
        function cssPath(e) {
          if (e.id) return '#' + CSS.escape(e.id);
          const name = e.getAttribute('name');
          if (name) return e.tagName.toLowerCase() + '[name="' + name + '"]';
          const ph = e.getAttribute('placeholder');
          if (ph) return e.tagName.toLowerCase() + '[placeholder="' + ph + '"]';
          const aria = e.getAttribute('aria-label');
          if (aria) return e.tagName.toLowerCase() + '[aria-label="' + aria + '"]';
          let path = e.tagName.toLowerCase();
          const cls = (e.className || '').toString().trim().split(/\s+/).filter(Boolean).slice(0, 2);
          if (cls.length) path += '.' + cls.map((c) => CSS.escape(c)).join('.');
          return path;
        }
        function isVisible(el) {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
        }
        function push(el, kind) {
          if (seen.has(el)) return;
          seen.add(el);
          const text = (el.innerText || el.getAttribute('value') || el.getAttribute('placeholder') || '')
            .replace(/\s+/g, ' ').trim().slice(0, 80);
          const detail = [
            el.getAttribute('type') ? 'type=' + el.getAttribute('type') : '',
            el.getAttribute('name') ? 'name=' + el.getAttribute('name') : '',
            el.getAttribute('href') ? 'href=' + el.getAttribute('href') : '',
            el.getAttribute('placeholder') ? 'placeholder="' + el.getAttribute('placeholder') + '"' : '',
          ].filter(Boolean).join(' ');
          out.push({ kind, text, selector: cssPath(el), detail, visible: isVisible(el) });
        }
        document.querySelectorAll('button, [role="button"]').forEach((el) => push(el, 'BUTTON'));
        document.querySelectorAll('a[href]').forEach((el) => push(el, 'LINK'));
        document.querySelectorAll('input, select, textarea').forEach((el) => push(el, 'FIELD'));
        return out;
      })()
    `;
    const items: Item[] = await page.evaluate(BROWSER_COLLECT);

    const groups = ['BUTTON', 'FIELD', 'LINK'];
    for (const g of groups) {
      const list = items.filter((i) => i.kind === g && i.visible);
      console.log(`\n===== ${g} (${list.length} visibles) =====`);
      for (const i of list) {
        const t = i.text ? `"${i.text}"` : '(sans texte)';
        console.log(`• ${t}\n    selector: ${i.selector}${i.detail ? `\n    ${i.detail}` : ''}`);
      }
    }
    console.log('\n(les éléments non visibles sont masqués)\n');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ Inspection échouée :', err?.message ?? err);
  process.exit(1);
});
