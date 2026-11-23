import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { t, LANG_LABEL } from '@/i18n';
import type { TKey, Lang } from '@/i18n';

interface NavItem {
  to: string;
  key: TKey;
}

const PARISH_ITEMS: NavItem[] = [
  { to: '/about', key: 'nav.about' },
  { to: '/visit', key: 'nav.subVisit' },
  { to: '/gallery', key: 'nav.subGallery' },
  { to: '/sacraments', key: 'nav.subSacraments' },
  { to: '/projects', key: 'nav.subProjects' },
];

const PARISH_NAME = {
  en: 'Our Lady of Vladimir Church',
  es: 'Iglesia de la Virgen de Vladimir',
  ru: 'Храм Владимирской иконы Божией Матери',
};

export default function Header() {
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [parishOpen, setParishOpen] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === '/';
  const solid = scrolled || !onHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setParishOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    [
      'relative whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-200',
      solid
        ? active
          ? 'text-gold-500 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-gold-400'
          : 'text-navy-100/80 hover:text-white'
        : active
          ? 'text-gold-400 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-gold-400'
          : 'text-white/85 hover:text-white',
    ].join(' ');

  const renderLink = (item: NavItem) => (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) => linkClass(isActive)}
    >
      {t(item.key, lang)}
    </NavLink>
  );

  return (
    <>
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        solid
          ? 'bg-navy-900/95 shadow-lg shadow-navy-950/30 backdrop-blur-md'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="container-px container-max flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="Home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
            <img
              src="/images/5177128844341742972_(1)%20copy.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-serif text-sm font-semibold tracking-wide text-white sm:text-xl">
              {PARISH_NAME[lang]}
            </span>
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
          {renderLink({ to: '/', key: 'nav.home' })}

          <div
            className="relative"
            onMouseEnter={() => setParishOpen(true)}
            onMouseLeave={() => setParishOpen(false)}
          >
            <button
              onClick={() => setParishOpen((v) => !v)}
              className={[
                'flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-200',
                solid ? 'text-navy-100/80 hover:text-white' : 'text-white/85 hover:text-white',
                location.pathname !== '/' && ['/about', '/visit', '/gallery', '/sacraments', '/projects'].includes(location.pathname)
                  ? (solid ? 'text-gold-500' : 'text-gold-400')
                  : '',
              ].join(' ')}
              aria-haspopup="true"
              aria-expanded={parishOpen}
            >
              {t('nav.parish', lang)}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${parishOpen ? 'rotate-180' : ''}`}
                strokeWidth={1.8}
              />
            </button>
            <AnimatePresence>
              {parishOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                >
                  <div className="w-56 overflow-hidden rounded-2xl border border-navy-100 bg-white py-2 shadow-xl shadow-navy-950/15">
                    {PARISH_ITEMS.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setParishOpen(false)}
                        className={({ isActive }) =>
                          [
                            'block px-5 py-2.5 text-[13px] font-medium tracking-[0.06em] transition-colors',
                            isActive ? 'text-gold-600' : 'text-navy-700 hover:bg-navy-50 hover:text-navy-900',
                          ].join(' ')
                        }
                      >
                        {t(item.key, lang)}
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {renderLink({ to: '/worship', key: 'nav.schedule' })}
          {renderLink({ to: '/announcements', key: 'nav.announcements' })}
          {renderLink({ to: '/contact', key: 'nav.contact' })}

          <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Language">
            {(['en', 'es', 'ru'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={[
                  'rounded-full px-2.5 py-1 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors',
                  lang === l
                    ? 'bg-gold-400 text-navy-900'
                    : 'text-white/85 hover:text-white border border-transparent hover:border-white/25',
                ].join(' ')}
                aria-pressed={lang === l}
              >
                {l === 'en' ? 'EN' : l === 'es' ? 'ES' : 'RU'}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          <div className="flex items-center gap-0.5 rounded-full border border-white/25 p-0.5" role="group" aria-label="Language">
            {(['en', 'es', 'ru'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={[
                  'rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors',
                  lang === l ? 'bg-gold-400 text-navy-900' : 'text-white/85',
                ].join(' ')}
                aria-pressed={lang === l}
              >
                {l === 'en' ? 'EN' : l === 'es' ? 'ES' : 'RU'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex h-full flex-col bg-navy-950 lg:hidden"
        >
          <div className="container-px flex h-16 shrink-0 items-center justify-between sm:h-20">
            <span className="font-serif text-lg text-white">
              {lang === 'es' ? 'Menú' : lang === 'ru' ? 'Меню' : 'Menu'}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" strokeWidth={1.6} />
            </button>
          </div>
          <nav
            className="container-px mt-6 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pb-[max(2.5rem,env(safe-area-inset-bottom))]"
            aria-label="Mobile"
          >
                {[
                  { to: '/', key: 'nav.home' as TKey },
                  { to: '/about', key: 'nav.about' as TKey },
                  { to: '/visit', key: 'nav.subVisit' as TKey },
                  { to: '/gallery', key: 'nav.subGallery' as TKey },
                  { to: '/sacraments', key: 'nav.subSacraments' as TKey },
                  { to: '/projects', key: 'nav.subProjects' as TKey },
                  { to: '/worship', key: 'nav.schedule' as TKey },
                  { to: '/announcements', key: 'nav.announcements' as TKey },
                  { to: '/contact', key: 'nav.contact' as TKey },
                ].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        [
                          'block border-b border-white/10 py-4 font-serif text-2xl transition-colors',
                          isActive ? 'text-gold-300' : 'text-white/90 hover:text-gold-200',
                        ].join(' ')
                      }
                    >
                      {t(item.key, lang)}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="container-px shrink-0 border-t border-white/10 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Language">
                  {(['en', 'es', 'ru'] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={[
                        'rounded-full border py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors',
                        lang === l
                          ? 'border-gold-400 bg-gold-400 text-navy-900'
                          : 'border-white/25 text-white/90 active:border-gold-300 active:text-gold-200',
                      ].join(' ')}
                      aria-pressed={lang === l}
                    >
                      {LANG_LABEL[l]}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
  );
}
