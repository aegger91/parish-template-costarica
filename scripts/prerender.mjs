#!/usr/bin/env node
/**
 * Runs after `vite build`: opens every generated page in headless Chrome and writes the rendered
 * markup back into dist, so the full page is readable with JavaScript disabled. With JavaScript
 * on, React replaces this markup on mount exactly as before.
 *
 * Saved markup must never carry a hidden state: reveal wrappers are saved without is-revealed and
 * framer-motion's inline opacity/transform is dropped and gated by [data-reveal] instead, which
 * only hides anything under html.js (see index.css).
 */
import { chromium } from 'playwright';
import { preview } from 'vite';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const port = 4179;
const chrome = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const languages = JSON.parse(readFileSync(join(root, 'src/content/languages.json'), 'utf8'));
const defaultLang = languages.languages.find((l) => l.code === languages.default) ?? languages.languages[0];

if (!existsSync(join(dist, 'index.html'))) {
  console.error('prerender: dist/index.html is missing; run vite build first');
  process.exit(1);
}

const pages = [];
const walk = (dir, route) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (route === '' && entry.name === 'assets') continue;
      walk(join(dir, entry.name), `${route}/${entry.name}`);
    } else if (entry.name === 'index.html') {
      pages.push({ url: route ? `${route}/` : '/', file: join(dir, entry.name) });
    }
  }
};
walk(dist, '');
if (existsSync(join(dist, '404.html'))) pages.push({ url: '/__prerender-not-found__', file: join(dist, '404.html') });

const server = await preview({ root, preview: { host: '127.0.0.1', port, strictPort: true, open: false } });
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  locale: defaultLang.locale,
  reducedMotion: 'no-preference',
});

let failed = 0;
for (const { url, file } of pages) {
  const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:${port}${url}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('#root > *', { timeout: 15000 });
    // Let mount animations (hero) finish so their final state is what gets saved.
    await page.waitForTimeout(1200);
    const html = await page.evaluate(() => {
      const doc = document.documentElement;
      doc.classList.remove('js', 'reveal-fallback');
      if (!doc.className) doc.removeAttribute('class');
      document.querySelectorAll('#root [data-reveal]').forEach((el) => {
        el.classList.remove('is-revealed');
        if (!el.className) el.removeAttribute('class');
      });
      document.querySelectorAll('#root [style]').forEach((el) => {
        if (!el.style.opacity) return;
        el.style.removeProperty('opacity');
        el.style.removeProperty('transform');
        if (!el.getAttribute('style')) el.removeAttribute('style');
        el.setAttribute('data-reveal', '');
      });
      return '<!doctype html>\n' + doc.outerHTML;
    });
    if (!html.includes('<main')) throw new Error('rendered page has no <main>');
    writeFileSync(file, html);
  } catch (err) {
    failed += 1;
    console.error(`prerender: ${url} failed: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
await new Promise((resolve) => server.httpServer.close(resolve));
console.log(`prerender: ${pages.length - failed}/${pages.length} pages written`);
if (failed) process.exit(1);
