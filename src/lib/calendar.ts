import { site } from '@/content';

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
  calendar: CalChoice;
  year: number;
  month: number;
  days: CalendarDay[];
}

export type CalChoice = 'gregorian' | 'julian';

const monthCache = new Map<string, CalendarMonth>();

/** Fetches a month of saints, feasts, and fasts from orthocal.info (CORS-enabled, no key needed). */
export async function fetchMonth(cal: CalChoice, year: number, month: number): Promise<CalendarMonth> {
  const key = `${cal}-${year}-${month}`;
  const hit = monthCache.get(key);
  if (hit) return hit;
  const res = await fetch(`${site.calendar.apiBase}/${cal}/${year}/${month}/`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`calendar request failed (${res.status})`);
  const days = (await res.json()) as CalendarDay[];
  if (!Array.isArray(days) || days.length === 0) throw new Error('unexpected calendar response');
  const data: CalendarMonth = { calendar: cal, year, month, days };
  monthCache.set(key, data);
  return data;
}

// Weekday/month names come from Intl so any language added in languages.json works.
const REF_SUNDAY = new Date(2023, 0, 1);

export function weekdayName(weekday: number, locale: string, style: 'long' | 'short' = 'long'): string {
  const d = new Date(REF_SUNDAY);
  d.setDate(REF_SUNDAY.getDate() + weekday);
  const name = new Intl.DateTimeFormat(locale, { weekday: style }).format(d);
  return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1).replace(/\.$/, '');
}

export function monthName(month: number, locale: string, style: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat(locale, { month: style }).format(new Date(2023, month - 1, 1)).replace(/\.$/, '');
}

export function monthYearLabel(year: number, month: number, locale: string): string {
  const label = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
}

const FAST_LEVEL: Record<string, Record<number, string>> = {
  es: { 1: 'Ayuno estricto', 2: 'Ayuno estricto', 3: 'Ayuno', 4: 'Ayuno', 5: 'Ayuno', 6: 'Ayuno estricto', 7: 'Ayuno estricto' },
  ru: { 1: 'Строгий пост', 2: 'Строгий пост', 3: 'Пост', 4: 'Пост', 5: 'Пост', 6: 'Строгий пост', 7: 'Строгий пост' },
};

const FAST_EXCEPTION: Record<string, Record<string, string>> = {
  es: {
    'Wine and Oil are Allowed': 'se permite vino y aceite',
    'Fish, Wine and Oil are Allowed': 'se permite pescado, vino y aceite',
    'Fish, Wine and Oil Allowed': 'se permite pescado, vino y aceite',
    'Wine & Oil Allowed': 'se permite vino y aceite',
    'Fish, Wine and Oil': 'se permite pescado, vino y aceite',
    'Fast-free': 'sin ayuno',
    'Abbreviated Psalter': 'salmos abreviados',
  },
  ru: {
    'Wine and Oil are Allowed': 'допускаются вино и елей',
    'Fish, Wine and Oil are Allowed': 'допускаются рыба, вино и елей',
    'Fish, Wine and Oil Allowed': 'допускаются рыба, вино и елей',
    'Wine & Oil Allowed': 'допускаются вино и елей',
    'Fish, Wine and Oil': 'допускаются рыба, вино и елей',
    'Fast-free': 'сплошная седмица',
    'Abbreviated Psalter': 'сокращённая Псалтирь',
  },
};

/** Fast description for tooltips. orthocal.info returns English; known phrases are translated. */
export function fastDescription(day: CalendarDay, lang: string, noFastLabel: string): string {
  if (day.fast_level === 0) return noFastLabel;
  const base = FAST_LEVEL[lang]?.[day.fast_level] ?? day.fast_level_desc;
  if (!day.fast_exception_desc) return base;
  const exception = FAST_EXCEPTION[lang]?.[day.fast_exception_desc] ?? day.fast_exception_desc;
  return `${base}, ${exception}`;
}

// Julian Day Number helpers for switching between the new and old calendars.
export function jdnFromGregorian(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function jdnFromJulian(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}

export interface YMD {
  year: number;
  month: number;
  day: number;
}

export function gregorianFromJdn(jdn: number): YMD {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

export function julianFromJdn(jdn: number): YMD {
  const c = jdn + 32082;
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: d - 4800 + Math.floor(m / 10),
  };
}

export function toJdn(cal: CalChoice, date: YMD): number {
  return cal === 'julian' ? jdnFromJulian(date.year, date.month, date.day) : jdnFromGregorian(date.year, date.month, date.day);
}

export function fromJdn(cal: CalChoice, jdn: number): YMD {
  return cal === 'julian' ? julianFromJdn(jdn) : gregorianFromJdn(jdn);
}
