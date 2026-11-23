import { getPage, navigation } from '@/content';
import type { Localized, NavItem, PageContent } from '@/content';

export interface ResolvedNavItem {
  id: string;
  to: string;
  label: Localized;
  external: boolean;
  button: boolean;
  page?: PageContent;
  children: ResolvedNavItem[];
}

function resolve(items: NavItem[]): ResolvedNavItem[] {
  return items.flatMap((item): ResolvedNavItem[] => {
    const page = item.page ? getPage(item.page) : undefined;
    // A menu entry for a switched-off page disappears with its sub-pages.
    if (item.page && !page) return [];
    const to = page?.path ?? item.to;
    const label = item.label ?? page?.navLabel ?? page?.seo.title;
    const children = resolve(item.children ?? []);
    if (!label || (!to && children.length === 0)) return [];
    return [
      {
        id: item.id,
        to: to ?? children[0].to,
        label,
        external: !!to && /^https?:/.test(to),
        button: !!item.button,
        page,
        children,
      },
    ];
  });
}

/** The header menu, with switched-off pages removed. */
export const navTree: ResolvedNavItem[] = resolve(navigation.header);

export function flattenNav(items: ResolvedNavItem[] = navTree): ResolvedNavItem[] {
  return items.flatMap((i) => [i, ...flattenNav(i.children)]);
}

/** The chain of menu entries from the top level down to the page, for breadcrumbs. */
export function navTrail(pageId: string, items: ResolvedNavItem[] = navTree): ResolvedNavItem[] {
  for (const item of items) {
    if (item.page?.id === pageId) return [item];
    const sub = navTrail(pageId, item.children);
    if (sub.length) return [item, ...sub];
  }
  return [];
}

export function navChildren(pageId: string): ResolvedNavItem[] {
  return flattenNav().find((i) => i.page?.id === pageId)?.children ?? [];
}

export function isActive(item: ResolvedNavItem, pathname: string): boolean {
  if (item.to === '/') return pathname === '/';
  return pathname === item.to || pathname.startsWith(`${item.to}/`) || item.children.some((c) => isActive(c, pathname));
}

export const donateItem = flattenNav().find((i) => i.button);

export function pageIsOn(id: string): boolean {
  return !!getPage(id);
}
