import type { Crumb } from '@/components/ui/Breadcrumbs';
import { useI18n } from '@/i18n';
import { navTrail } from '@/lib/nav';
import { usePage } from '@/pages/PageContext';

/** Home, then the menu path to the current page, then any extra steps (e.g. a product name). */
export function useCrumbs(extra?: Crumb[]): Crumb[] {
  const { t, ui } = useI18n();
  const page = usePage();
  if (!page || page.id === 'home') return [];
  const trail = navTrail(page.id).map((i) => ({ label: t(i.label), to: i.page ? i.to : undefined }));
  const own = trail.length ? trail : [{ label: t(page.navLabel ?? page.seo.title), to: page.path }];
  return [{ label: ui('home'), to: '/' }, ...own, ...(extra ?? [])];
}
