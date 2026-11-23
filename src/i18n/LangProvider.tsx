import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { I18nContext, LANGUAGE_CODES, getInitialLang, getLanguage, interpolate, lookupUi, pick, storeLang } from './core';
import type { I18nValue } from './core';

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(() => getInitialLang());
  const language = getLanguage(lang);
  const dir = language.dir ?? 'ltr';

  useEffect(() => {
    document.documentElement.lang = language.htmlLang;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLang = useCallback((code: string) => {
    if (!LANGUAGE_CODES.includes(code)) return;
    setLangState(code);
    storeLang(code);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      language,
      dir,
      setLang,
      t: (field, vars) => interpolate(pick(field, lang), lang, vars),
      ui: (path, vars) => interpolate(pick(lookupUi(path), lang), lang, vars),
    }),
    [lang, language, dir, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
