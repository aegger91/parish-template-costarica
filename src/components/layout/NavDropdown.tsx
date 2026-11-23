import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/i18n';
import { isActive } from '@/lib/nav';
import type { ResolvedNavItem } from '@/lib/nav';

function DropdownLinks({ items, depth, onPick }: { items: ResolvedNavItem[]; depth: number; onPick: () => void }) {
  const { t } = useI18n();
  return (
    <>
      {items.map((item) =>
        item.children.length > 0 && depth === 0 && !item.page ? (
          <div key={item.id} className="border-t border-primary-100 py-1 first:border-t-0">
            <p className="px-5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-600">{t(item.label)}</p>
            <DropdownLinks items={item.children} depth={depth + 1} onPick={onPick} />
          </div>
        ) : (
          <div key={item.id}>
            <NavLink
              to={item.to}
              end
              onClick={onPick}
              className={({ isActive: active }) =>
                [
                  'block py-2.5 pe-5 text-[14px] font-medium transition-colors',
                  depth > 1 ? 'ps-9' : 'ps-5',
                  active ? 'bg-accent-50 text-accent-700' : 'text-primary-700 hover:bg-primary-50 hover:text-primary-900',
                ].join(' ')
              }
            >
              {t(item.label)}
            </NavLink>
            {item.children.length > 0 && <DropdownLinks items={item.children} depth={depth + 1} onPick={onPick} />}
          </div>
        ),
      )}
    </>
  );
}

/** A top-level menu entry with a panel of sub-pages. Opens on hover or click; Escape closes it. */
export default function NavDropdown({
  item,
  triggerClass,
  align = 'center',
}: {
  item: ResolvedNavItem;
  triggerClass: (active: boolean) => string;
  align?: 'center' | 'end';
}) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number>();
  const panelId = useId();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${triggerClass(isActive(item, pathname))} flex items-center gap-1`}
        aria-expanded={open}
        aria-controls={panelId}
      >
        {t(item.label)}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={`absolute top-full z-50 pt-3 ${align === 'end' ? 'end-0' : 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2'}`}
      >
        <div className="max-h-[75vh] w-64 overflow-y-auto rounded-2xl border border-primary-100 bg-white py-2 shadow-xl shadow-primary-950/15">
          <DropdownLinks items={item.children} depth={0} onPick={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
