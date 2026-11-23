import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '@/content';
import type { PageContent } from '@/content';
import { useI18n } from '@/i18n';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Updates the document title, description, and social tags for the current page and language. */
export function useSeo(page: PageContent) {
  const { t, language } = useI18n();
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const siteName = t(site.name);
    const pageTitle = t(page.seo.title);
    const title = page.id === 'home' || pageTitle.includes(siteName) ? pageTitle : `${pageTitle} | ${siteName}`;
    const description = t(page.seo.description);
    const url = new URL(pathname, site.url).toString();

    document.title = title;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
    setMeta('property', 'og:site_name', siteName);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:locale', language.ogLocale);
    setMeta('name', 'robots', page.id === 'not-found' ? 'noindex' : 'index, follow');
  }, [t, page, pathname, language]);
}
