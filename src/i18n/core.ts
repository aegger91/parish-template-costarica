import { createContext, useContext } from 'react';
import { languages, services, site, ui as uiStrings } from '@/content';
import type { Language, Localized, UiStrings } from '@/content';

export const LANGUAGES: Language[] = languages.languages;
export const DEFAULT_LANG = languages.default;
export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

export function getInitialLang(): string {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const saved = window.localStorage.getItem(languages.storageKey);
  if (saved && LANGUAGE_CODES.includes(saved)) return saved;
  const browser = (navigator.language || '').toLowerCase();
  return LANGUAGE_CODES.find((c) => browser.startsWith(c)) ?? DEFAULT_LANG;
}

export function storeLang(code: string): void {
  window.localStorage.setItem(languages.storageKey, code);
}

export function pick(field: Localized | string | undefined, lang: string): string {
  if (field === undefined) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field[DEFAULT_LANG] ?? Object.values(field)[0] ?? '';
}

/**
 * Fills placeholders in content strings:
 *   {time:<service-id>}  -> the service's display time from services.json
 *   {site.<path>}        -> a text or localized field from site.json (name, diocese, address.singleLine, contact.email)
 *   {<var>}              -> a value passed in `vars`
 */
export function interpolate(text: string, lang: string, vars?: Record<string, string>): string {
  return text.replace(/\{([\w.:-]+)\}/g, (match, token: string) => {
    if (token.startsWith('time:')) {
      return services.find((s) => s.id === token.slice(5))?.display.replace(/ /g, '\u00a0') ?? match;
    }
    if (token.startsWith('site.')) {
      const value = token
        .slice(5)
        .split('.')
        .reduce<unknown>((node, key) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined), site);
      if (typeof value === 'string') return value;
      if (value && typeof value === 'object' && Object.values(value).every((v) => typeof v === 'string')) {
        return pick(value as Localized, lang);
      }
      return match;
    }
    return vars?.[token] ?? match;
  });
}

export function lookupUi(path: string): Localized | undefined {
  let node: UiStrings | Localized | undefined = uiStrings;
  for (const part of path.split('.')) {
    node = (node as UiStrings | undefined)?.[part];
  }
  return node as Localized | undefined;
}

export interface I18nValue {
  lang: string;
  language: Language;
  setLang: (code: string) => void;
  /** Resolve a localized content field for the current language. */
  t: (field: Localized | string | undefined, vars?: Record<string, string>) => string;
  /** Resolve a UI string from ui.json by dot path, e.g. "calendar.loading". */
  ui: (path: string, vars?: Record<string, string>) => string;
}

export const I18nContext = createContext<I18nValue | null>(null);

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <LangProvider>');
  return ctx;
}
