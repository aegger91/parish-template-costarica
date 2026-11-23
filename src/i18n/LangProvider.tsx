import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { I18nContext, LANGUAGES, LANGUAGE_CODES, getInitialLang, interpolate, lookupUi, pick, storeLang } from './core';
import type { I18nValue } from './core';

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(() => getInitialLang());
  const language = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = language.htmlLang;
  }, [language]);

  const setLang = useCallback((code: string) => {
    if (!LANGUAGE_CODES.includes(code)) return;
    setLangState(code);
    storeLang(code);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      language,
      setLang,
      t: (field, vars) => interpolate(pick(field, lang), lang, vars),
      ui: (path, vars) => interpolate(pick(lookupUi(path), lang), lang, vars),
    }),
    [lang, language, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
