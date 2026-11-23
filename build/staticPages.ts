import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

/**
 * Writes one index.html per page (and per store product) with that page's title, description and
 * social tags filled in from the content files, plus 404.html. Any static host can then serve the
 * site without rewrite rules, and link previews show the right page.
 *
 * index.html uses {{placeholders}}; the dev server fills them for the home page.
 */

type Localized = string | Record<string, string>;
interface Language {
  code: string;
  htmlLang: string;
  locale: string;
  ogLocale: string;
  dir?: 'ltr' | 'rtl';
}
interface Page {
  id: string;
  path: string;
  enabled?: boolean;
  module?: string;
  seo: { title: Localized; description?: Localized };
}

const read = <T>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf8')) as T;
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function load(root: string) {
  const dir = path.join(root, 'src/content');
  const site = read<Record<string, unknown> & { name: Localized; url: string; socialImage?: string; modules?: Record<string, boolean> }>(
    path.join(dir, 'site.json'),
  );
  const langs = read<{ default: string; languages: Language[] }>(path.join(dir, 'languages.json'));
  const services = read<{ weekly: { id: string; time: string }[]; dated?: { id: string; time: string }[] }>(path.join(dir, 'services.json'));
  const store = read<{ products: { id: string; name: Localized; summary?: Localized }[] }>(path.join(dir, 'store.json'));
  const pages = fs
    .readdirSync(path.join(dir, 'pages'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => read<Page>(path.join(dir, 'pages', f)))
    .filter((p) => p.enabled !== false && (!p.module || site.modules?.[p.module] !== false));

  const lang = langs.languages.find((l) => l.code === langs.default) ?? langs.languages[0];
  const t = (field: Localized | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang.code] || Object.values(field).find(Boolean) || '';
  };
  const allServices = [...services.weekly, ...(services.dated ?? [])];
  const fill = (text: string) =>
    text.replace(/\{([\w.:-]+)\}/g, (match, token: string) => {
      if (token.startsWith('time:')) {
        const s = allServices.find((x) => x.id === token.slice(5));
        if (!s) return match;
        const [h, m] = s.time.split(':').map(Number);
        return new Intl.DateTimeFormat(lang.locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, 0, 1, h, m || 0)));
      }
      if (token.startsWith('site.')) {
        const value = token
          .slice(5)
          .split('.')
          .reduce<unknown>((node, key) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined), site);
        return typeof value === 'string' || (value && typeof value === 'object') ? t(value as Localized) : match;
      }
      return match;
    });

  return { site, langs, lang, store, pages, t, fill };
}

type Data = ReturnType<typeof load>;
interface Route {
  path: string;
  title: string;
  description: string;
  robots: string;
}

function routes(d: Data): { routes: Route[]; notFound: Route } {
  const siteName = d.t(d.site.name);
  const full = (id: string, title: string) => (id === 'home' || title.includes(siteName) ? title : `${title} | ${siteName}`);
  const home = d.pages.find((p) => p.id === 'home');
  const homeDescription = home ? d.fill(d.t(home.seo.description)) : '';
  const out: Route[] = [];
  let notFound: Route = { path: '/404', title: siteName, description: homeDescription, robots: 'noindex' };
  for (const p of d.pages) {
    const title = full(p.id, d.fill(d.t(p.seo.title)));
    const description = d.fill(d.t(p.seo.description)) || homeDescription;
    if (p.path === '*') {
      notFound = { path: '/404', title, description, robots: 'noindex' };
    } else if (p.path.includes('/:')) {
      const base = p.path.slice(0, p.path.indexOf('/:'));
      for (const product of d.store.products) {
        out.push({ path: `${base}/${product.id}`, title: full('', d.t(product.name)), description: d.t(product.summary) || description, robots: 'index, follow' });
      }
    } else {
      out.push({ path: p.path, title, description, robots: 'index, follow' });
    }
  }
  return { routes: out, notFound };
}

function render(template: string, d: Data, r: Route): string {
  const base = d.site.url.replace(/\/$/, '');
  const values: Record<string, string> = {
    lang: d.lang.htmlLang,
    dir: d.lang.dir ?? 'ltr',
    title: r.title,
    description: r.description,
    robots: r.robots,
    siteName: d.t(d.site.name),
    url: `${base}${r.path === '/404' ? '/' : r.path}`,
    image: `${base}${d.site.socialImage ?? '/social-preview.jpg'}`,
    ogLocale: d.lang.ogLocale,
  };
  const alternates = d.langs.languages
    .filter((l) => l.code !== d.lang.code)
    .map((l) => `<meta property="og:locale:alternate" content="${escape(l.ogLocale)}" />`)
    .join('\n    ');
  return template
    .replace(/[ \t]*\{\{ogAlternates\}\}/, alternates ? `    ${alternates}` : '')
    .replace(/\{\{(\w+)\}\}/g, (m, key: string) => (key in values ? escape(values[key]) : m));
}

export default function staticPages(): Plugin {
  let root = process.cwd();
  let outDir = 'dist';
  return {
    name: 'static-pages',
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const d = load(root);
        const home = routes(d).routes.find((r) => r.path === '/');
        // During the build, keep the placeholders so closeBundle can render every page from the same template.
        if (ctx.bundle) return html;
        return home ? render(html, d, home) : html;
      },
    },
    closeBundle() {
      const file = path.join(outDir, 'index.html');
      if (!fs.existsSync(file)) return;
      const template = fs.readFileSync(file, 'utf8');
      const d = load(root);
      const { routes: list, notFound } = routes(d);
      for (const r of list) {
        const target = r.path === '/' ? file : path.join(outDir, r.path, 'index.html');
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, render(template, d, r));
      }
      fs.writeFileSync(path.join(outDir, '404.html'), render(template, d, notFound));
    },
  };
}
