#!/usr/bin/env node
/**
 * Loads every routed page in every language at 360 / 768 / 1280 and flags text
 * nodes that overflow their box (scrollWidth/Height > clientWidth/Height) or
 * that overlap another visible text node. Exit 1 when any issue remains.
 *
 * Usage: node scripts/language-fit.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:4173
 */
import { chromium } from 'playwright';
import { readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const base = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const widths = [360, 768, 1280];
const langs = ['en', 'es', 'ru'];
const storageKey = 'orthodox-parish-lang';

function collectPaths(distDir) {
  const paths = new Set(['/']);
  const walk = (dir, prefix = '') => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      if (name.name === 'assets' || name.name === 'fonts' || name.name === 'images' || name.name === 'media') continue;
      const full = join(dir, name.name);
      if (name.isDirectory()) walk(full, `${prefix}/${name.name}`);
      else if (name.name === 'index.html') paths.add(prefix || '/');
    }
  };
  if (existsSync(distDir)) walk(distDir);
  return [...paths].sort();
}

const paths = collectPaths(join(process.cwd(), 'dist'));
const chrome = process.env.CHROME || '/usr/local/bin/google-chrome';

const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const issues = [];
let checks = 0;

for (const lang of langs) {
  for (const w of widths) {
    const context = await browser.newContext({
      viewport: { width: w, height: w === 360 ? 740 : 900 },
      deviceScaleFactor: 1,
    });
    await context.addInitScript(
      ([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          /* ignore */
        }
      },
      [storageKey, lang],
    );
    const page = await context.newPage();

    for (const path of paths) {
      checks += 1;
      const res = await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => e);
      if (!res || res instanceof Error || res.status() >= 400) {
        issues.push({ lang, w, path, kind: 'load', detail: String(res?.status?.() ?? res) });
        continue;
      }
      await page.waitForTimeout(200);
      await page.evaluate(
        ([key, value]) => {
          localStorage.setItem(key, value);
          document.documentElement.lang = value === 'ru' ? 'ru' : value === 'es' ? 'es' : 'en';
        },
        [storageKey, lang],
      );
      const switched = await page.evaluate((code) => {
        const buttons = [...document.querySelectorAll('button')];
        const langBtn = buttons.find((b) => {
          const t = (b.textContent || '').trim().toUpperCase();
          return t === code.toUpperCase() || t === (code === 'en' ? 'EN' : code === 'es' ? 'ES' : 'RU');
        });
        if (langBtn && langBtn.getAttribute('aria-pressed') !== 'true') {
          langBtn.click();
          return true;
        }
        return false;
      }, lang);
      if (switched) await page.waitForTimeout(300);
      await page.evaluate(async () => {
        try {
          await document.fonts?.ready;
        } catch {
          /* ignore */
        }
      });

      const found = await page.evaluate(() => {
        const out = [];

        const isSkipped = (el) => {
          if (!(el instanceof HTMLElement)) return true;
          if (el.closest('[aria-hidden="true"], [hidden], .sr-only')) return true;
          const style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return true;
          const r = el.getBoundingClientRect();
          if (r.width <= 1 || r.height <= 1) return true;
          if ((style.position === 'absolute' || style.position === 'fixed') && r.bottom <= 1) return true;
          return false;
        };

        const intentionalClamp = (el) => {
          const style = getComputedStyle(el);
          if (style.textOverflow === 'ellipsis') return true;
          if (/\btruncate\b|\bline-clamp-/.test(el.className || '')) return true;
          if (style.webkitLineClamp && style.webkitLineClamp !== 'none') return true;
          return false;
        };

        /** Text-bearing leaves / simple labels — not layout wrappers. */
        const candidates = [...document.querySelectorAll('body *')].filter((el) => {
          if (isSkipped(el)) return false;
          if (intentionalClamp(el) || el.closest('.truncate, [class*="line-clamp-"]')) return false;

          // Skip media / structural wrappers that only host text via descendants.
          if (/^(SVG|PATH|IMG|PICTURE|VIDEO|CANVAS|SCRIPT|STYLE|NOSCRIPT)$/i.test(el.tagName)) return false;

          const hasElementKids = [...el.children].some((c) => c.tagName !== 'BR' && c.tagName !== 'WBR');
          const hasTextNode = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent || '').trim());

          // Pure text hosts (skip structural list/table cells that wrap cards)
          if (/^(H1|H2|H3|H4|H5|H6|P|LABEL|LEGEND|FIGCAPTION|TIME|DT|DD)$/i.test(el.tagName)) {
            return (el.innerText || '').trim().length > 0;
          }
          if (/^(TH|TD|LI)$/i.test(el.tagName)) {
            if (el.querySelector('div, section, article, a, button, ul, ol, table, img, picture, h1, h2, h3, h4, h5, h6, p')) {
              return false;
            }
            return (el.innerText || '').trim().length > 0;
          }

          // Inline / control text: only when they do not wrap block structure
          if (/^(A|BUTTON|SPAN|EM|STRONG|SMALL|CITE|ABBR)$/i.test(el.tagName)) {
            if (el.querySelector('div, section, article, ul, ol, table, img, picture, svg, video, canvas, p, h1, h2, h3, h4, h5, h6')) {
              return false;
            }
            return hasTextNode || (!hasElementKids && (el.innerText || '').trim().length > 0);
          }

          return false;
        });

        const boxes = candidates.map((el) => {
          const r = el.getBoundingClientRect();
          return { el, r, text: (el.innerText || '').trim().slice(0, 80) };
        });

        for (const { el, r, text } of boxes) {
          if (r.width < 2 || r.height < 2) continue;
          // Ignore off-screen / fully outside viewport horizontally for overflow-x noise
          if (r.right < 0 || r.left > (window.innerWidth || 0)) continue;

          const style = getComputedStyle(el);
          const clipX = style.overflowX === 'hidden' || style.overflowX === 'clip' || style.overflowX === 'scroll' || style.overflowX === 'auto';
          const clipY = style.overflowY === 'hidden' || style.overflowY === 'clip' || style.overflowY === 'scroll' || style.overflowY === 'auto';
          // Glyphs may extend a few px past the em-box when overflow is visible; only flag
          // true clipping, or a large mismatch that indicates layout squeeze.
          const ow = el.scrollWidth - el.clientWidth > (clipX ? 2 : 8);
          const oh = el.scrollHeight - el.clientHeight > (clipY ? 2 : 8);
          if (!ow && !oh) continue;

          // Parent with intentional ellipsis clamp covers this text.
          if (intentionalClamp(el) || el.closest('[class*="line-clamp-"], .truncate')) continue;

          out.push({
            kind: ow && oh ? 'overflow-both' : ow ? 'overflow-x' : 'overflow-y',
            text,
            tag: el.tagName.toLowerCase(),
            sw: el.scrollWidth,
            cw: el.clientWidth,
            sh: el.scrollHeight,
            ch: el.clientHeight,
          });
        }

        // Overlap: two independent in-flow text boxes intersecting substantially.
        const flow = boxes.filter(({ el, r }) => {
          const style = getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'absolute' || style.position === 'sticky') return false;
          if (r.width < 8 || r.height < 8) return false;
          // Prefer leafiest: skip if another candidate is a descendant
          if (boxes.some((o) => o.el !== el && el.contains(o.el))) return false;
          return true;
        });

        for (let i = 0; i < flow.length; i++) {
          for (let j = i + 1; j < flow.length; j++) {
            const a = flow[i];
            const b = flow[j];
            if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
            // Same interactive control / label group — not a layout bug
            if (a.el.closest('a, button, label') && a.el.closest('a, button, label') === b.el.closest('a, button, label')) {
              continue;
            }
            const x = Math.max(0, Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left));
            const y = Math.max(0, Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top));
            // Require meaningful overlap area (avoids sub-pixel / descender grazes)
            if (x > 8 && y > 8 && x * y > 64) {
              out.push({
                kind: 'overlap',
                text: `${a.text} ⊕ ${b.text}`,
                tag: `${a.el.tagName}/${b.el.tagName}`.toLowerCase(),
              });
            }
          }
        }
        return out;
      });

      for (const item of found) {
        issues.push({ lang, w, path, ...item });
      }
    }
    await context.close();
  }
}

await browser.close();

const summary = {
  checks,
  pages: paths.length,
  languages: langs.length,
  widths: widths.length,
  issueCount: issues.length,
  byKind: issues.reduce((acc, i) => {
    acc[i.kind] = (acc[i.kind] || 0) + 1;
    return acc;
  }, {}),
  sample: issues.slice(0, 50),
};

const outPath = join(process.cwd(), 'language-fit-report.json');
writeFileSync(outPath, JSON.stringify({ ...summary, issues }, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.error(`Wrote ${outPath}`);
if (issues.length) process.exit(1);
