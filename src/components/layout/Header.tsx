import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Clock, MapPin, Menu, ShoppingBag } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import LiveBadge from '@/components/ui/LiveBadge';
import { Brand } from '@/components/ui/Logo';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { getPage, moduleOn, site } from '@/content';
import { lookupUi, useI18n } from '@/i18n';
import { isLive, upcomingServices } from '@/lib/calendar';
import { cartCount, useCart } from '@/lib/cart';
import { useParishNow } from '@/lib/hooks';
import { donateItem, navTree } from '@/lib/nav';
import type { ResolvedNavItem } from '@/lib/nav';
import { formatTime } from '@/lib/time';
import { dayLabel } from '@/lib/when';
import MobileDrawer from './MobileDrawer';
import NavDropdown from './NavDropdown';

const GAP = 22;
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
    const more = widths.pop() ?? 0;
    const available = nav.clientWidth;
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

function CartButton({ tone }: { tone: 'light' | 'dark' }) {
  const { ui } = useI18n();
  const lines = useCart();
  const count = cartCount(lines);
  const cart = getPage('cart');
  if (!cart || (!moduleOn('store') && count === 0)) return null;
  return (
    <Link
      to={cart.path}
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
        tone === 'light' ? 'text-white hover:bg-white/10' : 'text-primary-800 hover:bg-primary-50'
      }`}
      aria-label={count ? ui('cart.labelCount', { count: String(count) }) : ui('cart.label')}
    >
      <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.6} aria-hidden />
      {count > 0 && (
        <span className="absolute -end-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-pill bg-accent-400 px-1 text-[11px] font-bold text-primary-900">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

function NextService() {
  const { t, ui, language } = useI18n();
  const now = useParishNow();
  if (isLive(now)) return <LiveBadge size="sm" />;
  const next = upcomingServices(now, 8)[0];
  if (!next) return null;
  return (
    <Link
      to={getPage('services')?.path ?? '/'}
      className="flex min-w-0 items-center gap-2 truncate transition-colors hover:text-white"
    >
      <Clock className="h-3.5 w-3.5 shrink-0 text-accent-300" strokeWidth={1.8} aria-hidden />
      <span className="truncate">
        <span className="text-primary-200">{ui('header.next')}: </span>
        {t(next.service.name)}, {dayLabel(next.jdn, now.jdn, language.locale, ui)} {formatTime(next.service.time, language.locale)}
      </span>
    </Link>
  );
}

export default function Header() {
  const { t, ui, lang } = useI18n();
  const { pathname } = useLocation();
  const [condensed, setCondensed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const solid = condensed || pathname !== '/';

  const links = navTree.filter((i) => !i.button);
  const { navRef, measureRef, visible } = usePriorityNav(links.length, [lang, desktop, condensed]);
  const useDrawer = !desktop || visible < Math.min(MIN_VISIBLE, links.length);
  const shown = links.slice(0, visible);
  const overflow = links.slice(visible);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setDrawer(false), [pathname]);

  const closeDrawer = useCallback(() => {
    setDrawer(false);
    menuButton.current?.focus();
  }, []);

  const linkClass = (active: boolean) =>
    [
      'nav-link relative whitespace-nowrap font-medium uppercase transition-colors duration-200',
      active
        ? 'text-accent-300 after:absolute after:-bottom-1.5 after:start-0 after:h-0.5 after:w-full after:bg-accent-400'
        : 'text-white/85 hover:text-white',
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

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300',
          solid ? 'bg-primary-900/95 shadow-lg shadow-primary-950/30 backdrop-blur-md' : 'bg-gradient-to-b from-primary-950/60 to-transparent',
        ].join(' ')}
      >
        {/* Utility strip: next service or live badge, address, language. Folds away on scroll. */}
        <div
          className={`hidden border-b border-white/10 transition-[max-height,opacity] duration-300 lg:block ${
            condensed ? 'max-h-0 overflow-hidden border-transparent opacity-0' : 'max-h-10 opacity-100'
          }`}
          aria-hidden={condensed}
        >
          <div className="container-px mx-auto flex h-9 max-w-[88rem] items-center justify-between gap-6 text-[12.5px] text-white/85">
            <div className="flex min-w-0 items-center gap-6">
              <NextService />
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                tabIndex={condensed ? -1 : undefined}
                className="hidden min-w-0 items-center gap-2 truncate transition-colors hover:text-white xl:flex"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-300" strokeWidth={1.8} aria-hidden />
                <span className="truncate">{t(site.address.singleLine)}</span>
              </a>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              {moduleOn('zapiski') && getPage('zapiski') && (
                <Link to={getPage('zapiski')!.path} tabIndex={condensed ? -1 : undefined} className="flex items-center gap-1.5 hover:text-white">
                  <OrthodoxIcon name="note" className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} />
                  {ui('header.submitNote')}
                </Link>
              )}
              <LanguageSwitcher variant="bar" />
            </div>
          </div>
        </div>

        <div
          className={`container-px mx-auto flex max-w-[88rem] items-center gap-3 transition-[height] duration-300 sm:gap-4 ${
            condensed ? 'h-16' : 'h-16 sm:h-20'
          }`}
        >
          <Link to="/" className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3" aria-label={`${t(site.name)}, ${ui('home')}`}>
            <Brand
              size={condensed ? 'sm' : 'md'}
              nameClassName="line-clamp-2 text-[14px] min-[400px]:text-[15px] sm:text-lg lg:max-w-[13rem] xl:max-w-[16rem] xl:text-[19px]"
            />
          </Link>

          <nav
            ref={navRef}
            className={`relative hidden h-full min-w-0 flex-1 items-center justify-end lg:flex ${useDrawer ? 'invisible' : ''}`}
            style={{ gap: GAP }}
            aria-label={ui('primaryNav')}
          >
            <div ref={measureRef} aria-hidden className="pointer-events-none invisible absolute start-0 top-0 flex whitespace-nowrap" style={{ gap: GAP }}>
              {links.map((item) => (
                <span key={item.id} className={`${linkClass(false)} flex items-center gap-1`}>
                  {t(item.label)}
                  {item.children.length > 0 && <span className="inline-block w-3.5" />}
                </span>
              ))}
              <span className={`${linkClass(false)} flex items-center gap-1`}>
                {ui('more')}
                <span className="inline-block w-3.5" />
              </span>
            </div>
            {!useDrawer && (
              <>
                {shown.map(renderItem)}
                {overflow.length > 0 && <NavDropdown item={more} triggerClass={linkClass} />}
              </>
            )}
          </nav>

          <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ms-0">
            <span className="max-[399px]:hidden lg:hidden">
              <LiveBadge size="sm" />
            </span>
            <CartButton tone="light" />
            {donateItem && (
              <Link to={donateItem.to} className="btn-accent hidden min-h-0 gap-1.5 px-4 py-2.5 sm:inline-flex">
                <OrthodoxIcon name="candle" className="h-4 w-4" strokeWidth={1.8} />
                {t(donateItem.label)}
              </Link>
            )}
            <span className="hidden sm:block lg:hidden">
              <LanguageSwitcher variant="bar" />
            </span>
            {useDrawer && (
              <button
                ref={menuButton}
                type="button"
                onClick={() => setDrawer(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10"
                aria-label={ui('openMenu')}
                aria-expanded={drawer}
                aria-controls="mobile-menu"
              >
                <Menu className="h-6 w-6" strokeWidth={1.6} aria-hidden />
              </button>
            )}
          </div>
        </div>
      </header>
      <MobileDrawer open={drawer} onClose={closeDrawer} />
    </>
  );
}
