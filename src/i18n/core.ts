import { createContext, useContext } from 'react';
import { datedServices, languages, services, site, ui as uiStrings } from '@/content';
import type { Language, Localized, UiStrings } from '@/content';
import { formatTime } from '@/lib/time';

export const LANGUAGES: Language[] = languages.languages;
export const DEFAULT_LANG = languages.default;
export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

export function getLanguage(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

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

const chains = new Map<string, string[]>();

/** The order in which languages are tried for a field: the language, its fallbacks, then the default. */
export function fallbackChain(lang: string): string[] {
  let chain = chains.get(lang);
  if (!chain) {
    chain = [...new Set([lang, ...(getLanguage(lang).fallback ?? []), DEFAULT_LANG])];
    chains.set(lang, chain);
  }
  return chain;
}

export function pick(field: Localized | string | undefined, lang: string): string {
  if (field === undefined) return '';
  if (typeof field === 'string') return field;
  for (const code of fallbackChain(lang)) {
    const value = field[code];
    if (value) return value;
  }
  return Object.values(field).find(Boolean) ?? '';
}

/**
 * Fills placeholders in content strings:
 *   {time:<service-id>}  -> the service's start time, formatted for the language
 *   {site.<path>}        -> a text or localized field from site.json (name, diocese, address.singleLine, contact.email)
 *   {<var>}              -> a value passed in `vars`
 */
export function interpolate(text: string, lang: string, vars?: Record<string, string>): string {
  return text.replace(/\{([\w.:-]+)\}/g, (match, token: string) => {
    if (token.startsWith('time:')) {
      const id = token.slice(5);
      const service = services.find((s) => s.id === id) ?? datedServices.find((s) => s.id === id);
      return service ? formatTime(service.time, getLanguage(lang).locale).replace(/ /g, '\u00a0') : match;
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
  dir: 'ltr' | 'rtl';
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
