import type { Category } from '@/content';
import { useI18n } from '@/i18n';

/** A row of category filters with an "All" option. Scrolls sideways on narrow screens. */
export default function FilterChips({
  categories,
  value,
  onChange,
  label,
  counts,
}: {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  counts?: Record<string, number>;
}) {
  const { t, ui } = useI18n();
  if (categories.length < 2) return null;
  const all = [{ id: '', label: { en: ui('all') } as Category['label'] }, ...categories];
  return (
    <div role="group" aria-label={label} className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {all.map((c) => (
          <button
            key={c.id || 'all'}
            type="button"
            onClick={() => onChange(c.id)}
            aria-pressed={value === c.id}
            className={`chip ${value === c.id ? 'chip-on' : 'chip-off'}`}
          >
            {c.id ? t(c.label) : ui('all')}
            {counts && c.id && counts[c.id] !== undefined && <span className="text-[11px] opacity-70">{counts[c.id]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
