import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HandHeart, Menu, X } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { navigation, site } from '@/content';
import type { NavItem } from '@/content';
import { useI18n } from '@/i18n';

function flatten(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => (item.children ? item.children : [item]));
}

export default function Header() {
  const { t, ui } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const onHome = location.pathname === '/';
  const solid = scrolled || !onHome || open;
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenDropdown(null);
      if (open) {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = (active: boolean) =>
    [
      'nav-link relative whitespace-nowrap font-medium uppercase transition-colors duration-200',
      active
        ? `${solid ? 'text-accent-500' : 'text-accent-400'} after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-accent-400`
        : solid
          ? 'text-primary-100/80 hover:text-white'
          : 'text-white/85 hover:text-white',
    ].join(' ');

  const donate = navigation.donate;

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          solid ? 'bg-primary-900/95 shadow-lg shadow-primary-950/30 backdrop-blur-md' : 'bg-transparent',
        ].join(' ')}
      >
        <div className="container-px mx-auto flex h-16 max-w-container items-center justify-between gap-3 sm:h-20 sm:gap-4 xl:max-w-[88rem] xl:gap-8">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={`${t(site.name)}, ${ui('home')}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
              <img src={site.logo.src} alt={site.logo.alt} width={48} height={48} className="h-full w-full object-cover" />
            </span>
            <span className="line-clamp-2 min-w-0 font-serif text-[14px] font-semibold min-[400px]:text-[15px] leading-tight tracking-wide text-white sm:text-xl xl:text-[19px] 2xl:text-xl">
              {t(site.name)}
            </span>
          </Link>

          <nav className="hidden shrink-0 items-center gap-5 xl:flex 2xl:gap-6" aria-label={ui('primaryNav')}>
            {navigation.header.map((item) =>
              item.children ? (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenDropdown(null);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown((v) => (v === item.id ? null : item.id))}
                    className={[
                      linkClass(item.children.some((c) => c.to === location.pathname)),
                      'flex items-center gap-1',
                    ].join(' ')}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.id}
                  >
                    {t(item.label)}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`}
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.16 }}
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                      >
                        <div className="w-60 overflow-hidden rounded-2xl border border-primary-100 bg-white py-2 shadow-xl shadow-primary-950/15">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.id}
                              to={child.to ?? '/'}
                              onClick={() => setOpenDropdown(null)}
                              className={({ isActive }) =>
                                [
                                  'block px-5 py-2.5 text-[14px] font-medium tracking-[0.04em] transition-colors',
                                  isActive ? 'text-accent-600' : 'text-primary-700 hover:bg-primary-50 hover:text-primary-900',
                                ].join(' ')
                              }
                            >
                              {t(child.label)}
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink key={item.id} to={item.to ?? '/'} end={item.to === '/'} className={({ isActive }) => linkClass(isActive)}>
                  {t(item.label)}
                </NavLink>
              ),
            )}

            <Link to={donate.to} className="btn-accent min-h-0 gap-1.5 px-4 py-2.5 2xl:px-5">
              <HandHeart className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              {t(donate.label)}
            </Link>

            <LanguageSwitcher variant="desktop" />
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3 xl:hidden">
            <Link to={donate.to} className="btn-accent hidden min-h-0 gap-1.5 px-4 py-2 sm:inline-flex">
              <HandHeart className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              {t(donate.label)}
            </Link>
            <div className="max-[359px]:hidden">
              <LanguageSwitcher variant="compact" />
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white"
              aria-label={ui('openMenu')}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.6} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={ui('menu')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex h-full flex-col bg-primary-950 xl:hidden"
          >
            <div className="container-px flex h-16 shrink-0 items-center justify-between sm:h-20">
              <span className="font-serif text-lg text-white">{ui('menu')}</span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                aria-label={ui('closeMenu')}
              >
                <X className="h-6 w-6" strokeWidth={1.6} aria-hidden />
              </button>
            </div>
            <nav
              className="container-px mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pb-6"
              aria-label={ui('primaryNav')}
            >
              {flatten(navigation.header).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to ?? '/'}
                    end={item.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        'block border-b border-white/10 py-3.5 font-serif text-2xl transition-colors',
                        isActive ? 'text-accent-300' : 'text-white/90 hover:text-accent-200',
                      ].join(' ')
                    }
                  >
                    {t(item.label)}
                  </NavLink>
                </motion.div>
              ))}
              <Link to={donate.to} onClick={() => setOpen(false)} className="btn-accent mt-6 w-full text-[13px]">
                <HandHeart className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                {t(donate.label)}
              </Link>
            </nav>
            <div className="container-px shrink-0 border-t border-white/10 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <LanguageSwitcher variant="menu" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
