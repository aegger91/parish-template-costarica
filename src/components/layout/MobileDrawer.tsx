import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Mail, MapPin, Phone, X } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Brand } from '@/components/ui/Logo';
import { site } from '@/content';
import { useI18n } from '@/i18n';
import { telHref } from '@/lib/format';
import { donateItem, isActive, navTree } from '@/lib/nav';
import type { ResolvedNavItem } from '@/lib/nav';

function Group({ item, depth, onNavigate }: { item: ResolvedNavItem; depth: number; onNavigate: () => void }) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => isActive(item, pathname));
  const id = useId();
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className={`flex w-full items-center justify-between gap-3 py-3.5 text-start font-heading transition-colors ${
          depth === 0 ? 'text-[21px]' : 'text-lg'
        } ${isActive(item, pathname) ? 'text-primary-700' : 'text-ink-900'}`}
      >
        {t(item.label)}
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.6} aria-hidden />
      </button>
      <ul id={id} hidden={!open} className="mb-2 border-s border-accent-400/50 ps-4">
        {item.page && <Leaf item={{ ...item, children: [] }} depth={depth + 1} onNavigate={onNavigate} />}
        {item.children.map((child) => (
          <Item key={child.id} item={child} depth={depth + 1} onNavigate={onNavigate} />
        ))}
      </ul>
    </li>
  );
}

function Leaf({ item, depth, onNavigate }: { item: ResolvedNavItem; depth: number; onNavigate: () => void }) {
  const { t } = useI18n();
  return (
    <li>
      <NavLink
        to={item.to}
        end
        onClick={onNavigate}
        className={({ isActive: active }) =>
          [
            'block font-heading transition-colors',
            depth === 0 ? 'py-3.5 text-xl' : 'py-2.5 text-[17px]',
            active ? 'text-primary-700' : 'text-ink-900 hover:text-primary-700',
          ].join(' ')
        }
      >
        {t(item.label)}
      </NavLink>
    </li>
  );
}

function Item({ item, depth, onNavigate }: { item: ResolvedNavItem; depth: number; onNavigate: () => void }) {
  return item.children.length ? (
    <Group item={item} depth={depth} onNavigate={onNavigate} />
  ) : (
    <Leaf item={item} depth={depth} onNavigate={onNavigate} />
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Side drawer menu for phones, tablets, and desktops where the menu does not fit. */
export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, ui, dir } = useI18n();
  const panel = useRef<HTMLDivElement>(null);
  const offscreen = dir === 'rtl' ? '-100%' : '100%';

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const nodes = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const links = navTree.filter((i) => !i.button);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="presentation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-primary-950/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={ui('menu')}
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
            className="drawer-panel absolute inset-y-0 end-0 flex w-[min(24rem,90vw)] flex-col bg-paper shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-rule/40 px-5">
              <span className="flex min-w-0 items-center gap-2.5">
                <Brand size="sm" nameClassName="line-clamp-2 text-[15px]" />
              </span>
              <button
                type="button"
                autoFocus
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-900 hover:bg-cream"
                aria-label={ui('closeMenu')}
              >
                <X className="h-6 w-6" strokeWidth={1.6} aria-hidden />
              </button>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2" aria-label={ui('primaryNav')}>
              <ul className="divide-y divide-rule/40">
                {links.map((item) => (
                  <Item key={item.id} item={item} depth={0} onNavigate={onClose} />
                ))}
              </ul>
              {donateItem && (
                <Link to={donateItem.to} onClick={onClose} className="btn-outline mt-6 w-full">
                  {t(donateItem.label)}
                </Link>
              )}
              <ul className="mt-8 space-y-3 text-sm text-ink-700">
                <li>
                  <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-primary-700">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.6} aria-hidden />
                    {t(site.address.singleLine)}
                  </a>
                </li>
                {site.contact.phone && (
                  <li>
                    <a href={telHref(site.contact.phone)} className="flex gap-3 hover:text-primary-700">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.6} aria-hidden />
                      <span dir="ltr">{site.contact.phone}</span>
                    </a>
                  </li>
                )}
                <li>
                  <a href={`mailto:${site.contact.email}`} className="flex gap-3 break-all hover:text-primary-700">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.6} aria-hidden />
                    {site.contact.email}
                  </a>
                </li>
              </ul>
            </nav>
            <div className="shrink-0 border-t border-rule/40 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <LanguageSwitcher variant="drawer" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
