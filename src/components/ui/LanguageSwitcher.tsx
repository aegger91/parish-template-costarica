import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LANGUAGES, useI18n } from '@/i18n';

type Variant = 'bar' | 'drawer';

/** Up to this many languages show as buttons; more become a dropdown. */
const MAX_INLINE = 3;

function Dropdown() {
  const { lang, setLang, ui, language } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${ui('language')}: ${language.label}`}
        className="flex min-h-9 items-center gap-1.5 rounded-pill border border-rule px-3 py-1 text-[11.5px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors hover:border-primary-500 hover:text-primary-700"
      >
        <Globe className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
        {language.short}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden />
      </button>
      {open && (
        <ul className="absolute end-0 top-full z-50 mt-2 max-h-[70vh] w-52 overflow-y-auto rounded-[6px] border border-rule/50 bg-paper py-2 shadow-lg shadow-primary-950/10">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                lang={l.htmlLang}
                dir={l.dir ?? 'ltr'}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                aria-pressed={lang === l.code}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-[14px] transition-colors ${
                  lang === l.code ? 'font-medium text-primary-700' : 'text-ink-700 hover:bg-cream'
                }`}
              >
                {l.label}
                {lang === l.code && <Check className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LanguageSwitcher({ variant }: { variant: Variant }) {
  const { lang, setLang, ui } = useI18n();
  if (LANGUAGES.length < 2) return null;

  if (variant === 'drawer') {
    const cols = LANGUAGES.length <= MAX_INLINE ? LANGUAGES.length : 2;
    return (
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="group" aria-label={ui('language')}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.htmlLang}
            dir={l.dir ?? 'ltr'}
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            className={`min-h-11 truncate rounded-pill border px-2 py-2.5 text-[13px] font-medium transition-colors ${
              lang === l.code ? 'border-primary-600 bg-primary-600 text-white' : 'border-rule text-ink-700 hover:border-primary-500'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  if (LANGUAGES.length > MAX_INLINE) return <Dropdown />;

  return (
    <div className="flex shrink-0 items-center" role="group" aria-label={ui('language')}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.htmlLang}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          aria-label={l.label}
          className={`relative inline-flex min-h-8 min-w-[2.1rem] items-center justify-center px-1.5 text-[11.5px] font-medium uppercase leading-snug tracking-[0.1em] transition-colors after:absolute after:inset-x-2 after:bottom-1 after:h-px after:transition-colors ${
            lang === l.code ? 'text-primary-700 after:bg-accent-500' : 'text-ink-500 after:bg-transparent hover:text-primary-700'
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
