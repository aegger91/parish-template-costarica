import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n';

export interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ items, tone = 'dark' }: { items: Crumb[]; tone?: 'dark' | 'light' }) {
  const { ui } = useI18n();
  if (items.length < 2) return null;
  const link = tone === 'dark' ? 'text-primary-200 hover:text-white' : 'text-ink-500 hover:text-primary-900';
  const current = tone === 'dark' ? 'text-accent-200' : 'text-primary-900';
  return (
    <nav aria-label={ui('breadcrumbs')}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px]">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {c.to && !last ? (
                <Link to={c.to} className={`transition-colors ${link}`}>
                  {c.label}
                </Link>
              ) : (
                <span className={last ? current : link} aria-current={last ? 'page' : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60 rtl:rotate-180" strokeWidth={1.8} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
