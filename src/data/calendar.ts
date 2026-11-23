import type { Lang } from '@/i18n';

export interface ScriptureReading {
  source: string;
  book: string;
  display: string;
  short_display: string;
}

export interface CalendarDay {
  pascha_distance?: number;
  year: number;
  month: number;
  day: number;
  weekday: number;
  tone: number | null;
  titles: string[] | null;
  summary_title: string;
  feast_level: number;
  feast_level_description: string;
  feasts: string[] | null;
  fast_level: number;
  fast_level_desc: string;
  fast_exception: number;
  fast_exception_desc: string;
  fast_abstentions: string[] | null;
  saints: string[] | null;
  service_notes: string[] | null;
  readings: ScriptureReading[] | null;
}

export interface CalendarMonth {
  calendar: string;
  year: number;
  month: number;
  fetched_at: string;
  days: CalendarDay[];
}

export type CalChoice = 'gregorian' | 'julian';

const FAST_ABBREV: Record<Lang, Record<string, string>> = {
  en: {
    meat: 'meat',
    dairy: 'dairy',
    eggs: 'eggs',
    fish: 'fish',
    wine: 'wine',
    oil: 'oil',
  },
  es: {
    meat: 'carne',
    dairy: 'lácteos',
    eggs: 'huevos',
    fish: 'pescado',
    wine: 'vino',
    oil: 'aceite',
  },
  ru: {
    meat: 'мясо',
    dairy: 'молочное',
    eggs: 'яйца',
    fish: 'рыба',
    wine: 'вино',
    oil: 'елей',
  },
};

export function fastDescription(day: CalendarDay, lang: Lang): string {
  if (day.fast_level === 0) {
    return lang === 'es' ? 'Sin ayuno' : lang === 'ru' ? 'Поста нет' : 'No fast';
  }
  const base =
    lang === 'es'
      ? fastLevelEs(day)
      : lang === 'ru'
        ? (FAST_LEVEL_RU[day.fast_level] ?? day.fast_level_desc)
        : day.fast_level_desc;
  if (day.fast_exception_desc) {
    return lang === 'es'
      ? `${base} — ${fastExceptionEs(day.fast_exception_desc)}`
      : lang === 'ru'
        ? `${base} — ${fastExceptionRu(day.fast_exception_desc)}`
        : `${base} — ${day.fast_exception_desc}`;
  }
  return base;
}

const FAST_LEVEL_ES: Record<number, string> = {
  0: 'Sin ayuno',
  1: 'Ayuno estricto',
  2: 'Ayuno estricto',
  3: 'Ayuno',
  4: 'Ayuno',
  5: 'Ayuno',
  6: 'Ayuno estricto',
  7: 'Ayuno estricto',
};

const FAST_LEVEL_RU: Record<number, string> = {
  1: 'Строгий пост',
  2: 'Строгий пост',
  3: 'Пост',
  4: 'Пост',
  5: 'Пост',
  6: 'Строгий пост',
  7: 'Строгий пост',
};

function fastLevelEs(day: CalendarDay): string {
  const mapped = FAST_LEVEL_ES[day.fast_level];
  return mapped ?? day.fast_level_desc;
}

const FAST_EXCEPTION_ES: Record<string, string> = {
  'Wine and Oil are Allowed': 'se permite vino y aceite',
  'Fish, Wine and Oil are Allowed': 'se permite pescado, vino y aceite',
  'Fish, Wine and Oil Allowed': 'se permite pescado, vino y aceite',
  'Wine & Oil Allowed': 'se permite vino y aceite',
  'Fish, Wine and Oil': 'se permite pescado, vino y aceite',
  'Fast-free': 'sin ayuno',
  'Abbreviated Psalter': 'salmos abreviados',
};

const FAST_EXCEPTION_RU: Record<string, string> = {
  'Wine and Oil are Allowed': 'допускаются вино и елей',
  'Fish, Wine and Oil are Allowed': 'допускаются рыба, вино и елей',
  'Fish, Wine and Oil Allowed': 'допускаются рыба, вино и елей',
  'Wine & Oil Allowed': 'допускаются вино и елей',
  'Fish, Wine and Oil': 'допускаются рыба, вино и елей',
  'Fast-free': 'сплошная седмица',
  'Abbreviated Psalter': 'сокращённая Псалтирь',
};

function fastExceptionEs(desc: string): string {
  return FAST_EXCEPTION_ES[desc] ?? desc;
}

function fastExceptionRu(desc: string): string {
  return FAST_EXCEPTION_RU[desc] ?? desc;
}

export function abstentionsText(day: CalendarDay, lang: Lang): string | null {
  if (!day.fast_abstentions || day.fast_abstentions.length === 0) return null;
  const items = day.fast_abstentions.map((a) => FAST_ABBREV[lang][a] ?? a);
  return lang === 'es'
    ? `Se abstiene de: ${items.join(', ')}`
    : lang === 'ru'
      ? `Не вкушаем: ${items.join(', ')}`
      : `Abstaining from: ${items.join(', ')}`;
}

const MONTH_NAMES: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
};

const WEEKDAY_NAMES: Record<Lang, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
};

export function formatDayDate(
  day: Pick<CalendarDay, 'year' | 'month' | 'day'>,
  lang: Lang,
): string {
  return `${MONTH_NAMES[lang][day.month - 1]} ${day.day}, ${day.year}`;
}

export function weekdayName(day: Pick<CalendarDay, 'weekday'>, lang: Lang): string {
  return WEEKDAY_NAMES[lang][day.weekday];
}

export { MONTH_NAMES, WEEKDAY_NAMES };
