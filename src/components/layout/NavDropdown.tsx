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
          <div key={item.id} className="border-t border-rule/40 py-1 first:border-t-0">
            <p className="eyebrow px-5 pb-1 pt-2.5 text-accent-700">{t(item.label)}</p>
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
                  'block py-2 pe-5 text-[14px] transition-colors duration-200',
                  depth > 1 ? 'ps-9' : 'ps-5',
                  active ? 'bg-cream text-primary-700' : 'text-ink-700 hover:bg-cream hover:text-primary-700',
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
        <ChevronDown className={`h-3 w-3 text-accent-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={2} aria-hidden />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={`absolute top-full z-50 pt-2 ${align === 'end' ? 'end-0' : 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2'}`}
      >
        <div className="max-h-[75vh] w-60 overflow-y-auto rounded-[6px] border border-rule/50 bg-paper py-2 shadow-lg shadow-primary-950/10">
          <DropdownLinks items={item.children} depth={0} onPick={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
