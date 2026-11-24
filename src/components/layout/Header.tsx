import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import LiveBadge from '@/components/ui/LiveBadge';
import { Brand } from '@/components/ui/Logo';
import { getPage, moduleOn, site } from '@/content';
import { lookupUi, useI18n } from '@/i18n';
import { cartCount, useCart } from '@/lib/cart';
import { telHref } from '@/lib/format';
import { donateItem, navTree } from '@/lib/nav';
import type { ResolvedNavItem } from '@/lib/nav';
import MobileDrawer from './MobileDrawer';
import NavDropdown from './NavDropdown';

const GAP = 30;
/** With fewer top-level entries than this left in the bar, the drawer is used instead. */
const MIN_VISIBLE = 3;

function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/**
 * Fits as many top-level entries in the bar as there is room for and moves the rest into "More".
 * Widths are measured from a hidden copy of the menu, so it works for any language and any number of pages.
 * The last measured child is the donate link, which always stays in the bar.
 */
function usePriorityNav(count: number, deps: unknown[]) {
  const navRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(count);

  const compute = useCallback(() => {
    const nav = navRef.current;
    const measure = measureRef.current;
    if (!nav || !measure) return;
    const widths = [...measure.children].map((c) => c.getBoundingClientRect().width);
    const donate = widths.pop() ?? 0;
    const more = widths.pop() ?? 0;
    // A few pixels of slack: measured widths are fractional and rounding must never push the bar over.
    const available = nav.clientWidth - (donate ? donate + GAP : 0) - 4;
    const total = (k: number) => widths.slice(0, k).reduce((a, b) => a + b, 0) + GAP * Math.max(0, k - 1);
    if (total(count) <= available) {
      setVisible(count);
      return;
    }
    let k = count - 1;
    while (k > 0 && total(k) + GAP + more > available) k -= 1;
    setVisible(k);
  }, [count]);

  useLayoutEffect(compute, [compute, ...deps]);

  useEffect(() => {
    const ro = new ResizeObserver(compute);
    if (navRef.current) ro.observe(navRef.current);
    document.fonts?.ready.then(compute).catch(() => {});
    return () => ro.disconnect();
  }, [compute]);

  return { navRef, measureRef, visible };
}

function CartButton() {
  const { ui } = useI18n();
  const lines = useCart();
  const count = cartCount(lines);
  const cart = getPage('cart');
  if (!cart || (!moduleOn('store') && count === 0)) return null;
  return (
    <Link
      to={cart.path}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-cream hover:text-primary-700"
      aria-label={count ? ui('cart.labelCount', { count: String(count) }) : ui('cart.label')}
    >
      <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} aria-hidden />
      {count > 0 && (
        <span className="absolute -end-0.5 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-primary-600 px-1 text-[10.5px] font-semibold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

export default function Header() {
  const { t, ui, lang } = useI18n();
  const { pathname } = useLocation();
  const [stuck, setStuck] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const deskMenuButton = useRef<HTMLButtonElement>(null);
  const lastOpener = useRef<HTMLButtonElement | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery('(min-width: 1024px)');

  const links = navTree.filter((i) => !i.button);
  const { navRef, measureRef, visible } = usePriorityNav(links.length, [lang, desktop]);
  const tooTight = visible < Math.min(MIN_VISIBLE, links.length);
  const shown = links.slice(0, visible);
  const overflow = links.slice(visible);
  const homeLabel = `${t(site.name)}, ${ui('home')}`;

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => setDrawer(false), [pathname]);

  const openDrawer = (from: HTMLButtonElement | null) => {
    lastOpener.current = from;
    setDrawer(true);
  };
  const closeDrawer = useCallback(() => {
    setDrawer(false);
    (lastOpener.current ?? menuButton.current)?.focus();
  }, []);

  const linkClass = (active: boolean) =>
    [
      'nav-link relative inline-flex items-center whitespace-nowrap py-2 uppercase transition-colors duration-200',
      'after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:bg-accent-500 after:transition-transform after:duration-300',
      active ? 'text-primary-700 after:scale-x-100' : 'text-ink-700 after:scale-x-0 hover:text-primary-700 hover:after:scale-x-100',
    ].join(' ');

  const more: ResolvedNavItem = {
    id: 'more',
    to: '#more',
    label: lookupUi('more') ?? { en: 'More' },
    external: false,
    button: false,
    children: overflow,
  };

  const renderItem = (item: ResolvedNavItem) =>
    item.children.length ? (
      <NavDropdown key={item.id} item={item} triggerClass={linkClass} />
    ) : (
      <NavLink key={item.id} to={item.to} end={item.to === '/'} className={({ isActive }) => linkClass(isActive)}>
        {t(item.label)}
      </NavLink>
    );

  const donateLink = donateItem && (
    <NavLink
      to={donateItem.to}
      className={({ isActive }) =>
        `${linkClass(isActive)} !text-accent-700 hover:!text-accent-600`
      }
    >
      {t(donateItem.label)}
    </NavLink>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rule/40 bg-paper/95 backdrop-blur-sm lg:static lg:border-0 lg:bg-paper lg:backdrop-blur-none">
        {/* Large screens: the white card with hours, the centered mark and name, and contacts. */}
        <div className="container-px mx-auto hidden max-w-container grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-10 pb-7 pt-8 lg:grid">
          <div className="min-w-0 text-[13px] leading-[1.65] text-ink-700">
            {site.hours?.map((line, i) => (
              <p key={i} className={i === 0 ? 'text-ink-900' : undefined}>
                {t(line)}
              </p>
            ))}
            <span className="mt-2 block empty:hidden">
              <LiveBadge size="sm" />
            </span>
          </div>

          <Link to="/" className="group flex items-center gap-4" aria-label={homeLabel}>
            <Brand size="lg" nameClassName="max-w-[13.5rem] text-[24px] xl:max-w-[15rem] xl:text-[27px]" />
          </Link>

          <div className="flex min-w-0 flex-col items-end text-end text-[13px] leading-[1.65] text-ink-700">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="max-w-[17rem] [text-wrap:balance] transition-colors hover:text-primary-700"
            >
              {t(site.address.singleLine)}
            </a>
            {site.contact.phone && (
              <a href={telHref(site.contact.phone)} dir="ltr" className="text-ink-900 transition-colors hover:text-primary-700">
                {site.contact.phone}
              </a>
            )}
            <div className="-me-2 mt-2 flex items-center gap-1">
              <LanguageSwitcher variant="bar" />
              <CartButton />
            </div>
          </div>
        </div>

        {/* Phones and tablets: a compact bar. */}
        <div className="container-px flex h-[4.25rem] items-center gap-3 lg:hidden">
          <Link to="/" className="flex min-w-0 shrink items-center gap-2.5" aria-label={homeLabel}>
            <Brand size="sm" nameClassName="line-clamp-2 text-[15px] min-[400px]:text-[16px] sm:text-[18px]" />
          </Link>
          <div className="ms-auto flex shrink-0 items-center gap-1">
            <span className="max-[419px]:hidden">
              <LiveBadge size="sm" />
            </span>
            <span className="hidden sm:block">
              <LanguageSwitcher variant="bar" />
            </span>
            <CartButton />
            <button
              ref={menuButton}
              type="button"
              onClick={() => openDrawer(menuButton.current)}
              className="-me-2 flex h-11 w-11 items-center justify-center rounded-full text-ink-900 transition-colors hover:bg-cream"
              aria-label={ui('openMenu')}
              aria-expanded={drawer}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <div ref={sentinel} aria-hidden className="hidden h-px bg-paper lg:block" />

      <div
        className={`sticky top-0 z-50 hidden bg-paper/95 backdrop-blur-sm transition-shadow duration-300 lg:block ${
          stuck ? 'shadow-[0_6px_18px_-12px_rgb(var(--color-primary-950)/0.35)]' : ''
        }`}
      >
        <div className="container-px mx-auto max-w-container">
          <div className="gold-rule" />
          <nav
            ref={navRef}
            className="relative flex h-[3.25rem] items-center justify-center"
            style={{ gap: GAP }}
            aria-label={ui('primaryNav')}
          >
            <div ref={measureRef} aria-hidden className="pointer-events-none invisible absolute start-0 top-0 flex whitespace-nowrap" style={{ gap: GAP }}>
              {links.map((item) => (
                <span key={item.id} className={`${linkClass(false)} flex items-center gap-1`}>
                  {t(item.label)}
                  {item.children.length > 0 && <span className="inline-block w-3" />}
                </span>
              ))}
              <span className={`${linkClass(false)} flex items-center gap-1`}>
                {ui('more')}
                <span className="inline-block w-3" />
              </span>
              {donateItem && <span className={linkClass(false)}>{t(donateItem.label)}</span>}
            </div>
            {tooTight ? (
              <button
                ref={deskMenuButton}
                type="button"
                onClick={() => openDrawer(deskMenuButton.current)}
                className="nav-link flex items-center gap-2 uppercase text-ink-700 hover:text-primary-700"
                aria-expanded={drawer}
                aria-controls="mobile-menu"
              >
                <Menu className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                {ui('menu')}
              </button>
            ) : (
              <>
                {shown.map(renderItem)}
                {overflow.length > 0 && <NavDropdown item={more} triggerClass={linkClass} />}
                {donateLink}
              </>
            )}
          </nav>
        </div>
      </div>
      <MobileDrawer open={drawer} onClose={closeDrawer} />
    </>
  );
}
