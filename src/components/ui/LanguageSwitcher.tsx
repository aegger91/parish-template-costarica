import { LANGUAGES, useI18n } from '@/i18n';

type Variant = 'desktop' | 'compact' | 'menu';

const STYLES: Record<Variant, { group: string; button: string; active: string; idle: string }> = {
  desktop: {
    group: 'flex shrink-0 items-center gap-1',
    button: 'rounded-pill px-2.5 py-1 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors',
    active: 'bg-accent-400 text-primary-900',
    idle: 'border border-transparent text-white/85 hover:border-white/25 hover:text-white',
  },
  compact: {
    group: 'flex items-center gap-0.5 rounded-pill border border-white/25 p-0.5',
    button: 'min-h-8 rounded-pill px-1.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors sm:px-2',
    active: 'bg-accent-400 text-primary-900',
    idle: 'text-white/85',
  },
  menu: {
    group: 'grid gap-2',
    button: 'min-h-11 rounded-pill border py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors',
    active: 'border-accent-400 bg-accent-400 text-primary-900',
    idle: 'border-white/25 text-white/90 active:border-accent-300 active:text-accent-200',
  },
};

export default function LanguageSwitcher({ variant }: { variant: Variant }) {
  const { lang, setLang, ui } = useI18n();
  const s = STYLES[variant];
  if (LANGUAGES.length < 2) return null;
  return (
    <div
      className={s.group}
      style={variant === 'menu' ? { gridTemplateColumns: `repeat(${LANGUAGES.length}, minmax(0, 1fr))` } : undefined}
      role="group"
      aria-label={ui('language')}
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.htmlLang}
          onClick={() => setLang(l.code)}
          className={`${s.button} ${lang === l.code ? s.active : s.idle}`}
          aria-pressed={lang === l.code}
          aria-label={variant === 'menu' ? undefined : l.label}
        >
          {variant === 'menu' ? l.label : l.short}
        </button>
      ))}
    </div>
  );
}
