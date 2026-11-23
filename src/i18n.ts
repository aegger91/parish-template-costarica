export type Lang = 'en' | 'es' | 'ru';

export type TKey =
  | 'nav.home'
  | 'nav.parish'
  | 'nav.about'
  | 'nav.subVisit'
  | 'nav.subGallery'
  | 'nav.subProjects'
  | 'nav.subSacraments'
  | 'nav.schedule'
  | 'nav.announcements'
  | 'nav.contact';

const dict: Record<string, Record<Lang, string>> = {
  'nav.home': { en: 'Home', es: 'Inicio', ru: 'Главная' },
  'nav.parish': { en: 'Our Parish', es: 'Nuestra Parroquia', ru: 'Приход' },
  'nav.about': { en: 'About the Parish', es: 'Sobre la parroquia', ru: 'О приходе' },
  'nav.subVisit': { en: 'Plan a Visit', es: 'Planee su Visita', ru: 'Как нас найти' },
  'nav.subGallery': { en: 'Gallery', es: 'Galería', ru: 'Галерея' },
  'nav.subProjects': { en: 'Projects', es: 'Proyectos', ru: 'Проекты' },
  'nav.subSacraments': { en: 'Sacraments', es: 'Sacramentos', ru: 'Таинства' },
  'nav.schedule': { en: 'Schedule', es: 'Horario', ru: 'Расписание' },
  'nav.announcements': { en: 'News', es: 'Noticias', ru: 'Новости' },
  'nav.contact': { en: 'Contact', es: 'Contacto', ru: 'Контакты' },
};

export function t(key: TKey, lang: Lang): string {
  return dict[key][lang];
}

const LANG_KEY = 'vladimir-lang';

const LANGS: Lang[] = ['en', 'es', 'ru'];

export function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(LANG_KEY);
  if (saved && (LANGS as string[]).includes(saved)) return saved as Lang;
  const browser = (navigator.language || '').toLowerCase();
  if (browser.startsWith('es')) return 'es';
  if (browser.startsWith('ru')) return 'ru';
  return 'en';
}

export function storeLang(lang: Lang): void {
  window.localStorage.setItem(LANG_KEY, lang);
}

export function nextLang(lang: Lang): Lang {
  return LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
}

export const LANG_LABEL: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
};
