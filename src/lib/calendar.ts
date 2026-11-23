import { datedServices, feasts, moduleOn, services, site } from '@/content';
import type { CalendarStyle, Feast, Service } from '@/content';
import {
  gregorianFromJdn,
  jdnFromGregorian,
  jdnFromIso,
  jdnFromJulian,
  julianFromJdn,
  minutesOf,
  weekdayOfJdn,
} from './time';
import type { ParishNow } from './time';

/* ---------- Pascha and the Great Feasts, computed locally for every calendar style ---------- */

function julianPaschaJdn(year: number): number {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  return jdnFromJulian({ year, month, day });
}

function westernPaschaJdn(year: number): number {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return jdnFromGregorian({ year, month, day });
}

export function paschaJdn(style: CalendarStyle, civilYear: number): number {
  return style === 'gregorian' ? westernPaschaJdn(civilYear) : julianPaschaJdn(civilYear);
}

/** The church-calendar date of a civil day: 13 days behind on the Old Calendar. */
function churchMonthDay(style: CalendarStyle, jdn: number): string {
  const d = style === 'julian' ? julianFromJdn(jdn) : gregorianFromJdn(jdn);
  return `${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

export function feastsOn(style: CalendarStyle, jdn: number): Feast[] {
  const md = churchMonthDay(style, jdn);
  const fromPascha = jdn - paschaJdn(style, gregorianFromJdn(jdn).year);
  return feasts.filter((f) => (f.date ? f.date === md : f.paschaOffset === fromPascha));
}

/** The next Great Feast, Pascha or parish feast on or after a day. */
export function nextFeast(style: CalendarStyle, fromJdn: number, maxDays = 400): { feast: Feast; jdn: number } | null {
  for (let jdn = fromJdn; jdn < fromJdn + maxDays; jdn++) {
    const feast = feastsOn(style, jdn)[0];
    if (feast) return { feast, jdn };
  }
  return null;
}

/* ---------- Daily saints and fasting from orthocal.info ---------- */

export interface OrthocalDay {
  julian_day_number: number;
  tone: number | null;
  titles: string[] | null;
  summary_title: string;
  feast_level: number;
  feasts: string[] | null;
  saints: string[] | null;
  fast_level: number;
  fast_level_desc: string;
  fast_exception_desc: string;
}

const monthCache = new Map<string, Promise<Map<number, OrthocalDay>>>();

/**
 * Loads one civil month. Both orthocal calendars accept civil dates; the "julian" one returns
 * Old Calendar commemorations. Days are keyed by Julian Day Number, so they line up with civil dates.
 */
export function loadOrthocalMonth(style: CalendarStyle, year: number, month: number): Promise<Map<number, OrthocalDay>> {
  const source = style === 'julian' ? 'julian' : 'gregorian';
  const key = `${source}-${year}-${month}`;
  let hit = monthCache.get(key);
  if (!hit) {
    hit = fetch(`${site.calendar.apiBase}/${source}/${year}/${month}/`, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`calendar request failed (${res.status})`);
        return res.json() as Promise<OrthocalDay[]>;
      })
      .then((days) => {
        if (!Array.isArray(days) || days.length === 0) throw new Error('unexpected calendar response');
        return new Map(days.map((d) => [d.julian_day_number, d]));
      });
    hit.catch(() => monthCache.delete(key));
    monthCache.set(key, hit);
  }
  return hit;
}

/**
 * The orthocal data follows the Orthodox Paschalion, so with the Gregorian style only the
 * fixed commemorations (saints) are used; the moveable cycle and the fasts are left out.
 */
export function usesOrthocalCycle(style: CalendarStyle): boolean {
  return style !== 'gregorian';
}

export function commemorations(day: OrthocalDay | undefined, style: CalendarStyle): string[] {
  if (!day) return [];
  if (!usesOrthocalCycle(style)) return day.saints ?? [];
  const list = [...(day.feasts ?? []), ...(day.saints ?? [])].filter((s) => !/^begin /i.test(s));
  return list.length ? list : [day.summary_title].filter(Boolean);
}

export type FastTone = 'none' | 'light' | 'strict';

export function fastTone(day: OrthocalDay): FastTone {
  if (day.fast_level === 0) return 'none';
  if (/allowed|fish|wine|oil/i.test(day.fast_exception_desc)) return 'light';
  return 'strict';
}

const FAST_KEYS: Record<string, string> = {
  fast: 'fast',
  'nativity fast': 'nativity',
  'great lent': 'lent',
  'lenten fast': 'lent',
  'apostles fast': 'apostles',
  'dormition fast': 'dormition',
};

const EXCEPTION_KEYS: [RegExp, string][] = [
  [/fish/i, 'fishWineOil'],
  [/wine/i, 'wineOil'],
  [/fast[- ]free/i, 'fastFree'],
];

/** Builds a fasting note in the visitor's language from orthocal's English labels. */
export function fastNote(day: OrthocalDay, ui: (path: string) => string): string {
  if (day.fast_level === 0) return ui('calendar.noFast');
  const key = FAST_KEYS[day.fast_level_desc.trim().toLowerCase()];
  const base = (key && ui(`calendar.fasts.${key}`)) || day.fast_level_desc;
  const exceptionKey = EXCEPTION_KEYS.find(([re]) => re.test(day.fast_exception_desc))?.[1];
  if (!day.fast_exception_desc) return base;
  const exception = (exceptionKey && ui(`calendar.exceptions.${exceptionKey}`)) || day.fast_exception_desc;
  return `${base}, ${exception}`;
}

/* ---------- Services ---------- */

export interface ServiceOccurrence {
  service: Service;
  jdn: number;
  start: number;
  end: number;
}

export function servicesOn(jdn: number): ServiceOccurrence[] {
  const weekday = weekdayOfJdn(jdn);
  const dated = datedServices.filter((s) => s.date && jdnFromIso(s.date) === jdn);
  const weekly = services.filter((s) => s.weekday === weekday);
  return [...dated, ...weekly]
    .map((service) => {
      const start = minutesOf(service.time);
      return { service, jdn, start, end: start + service.durationMinutes };
    })
    .sort((a, b) => a.start - b.start);
}

/** Services from now on, over the next `days` days, in order. Includes one already in progress. */
export function upcomingServices(now: ParishNow, days: number): ServiceOccurrence[] {
  const out: ServiceOccurrence[] = [];
  for (let i = 0; i < days; i++) {
    const jdn = now.jdn + i;
    out.push(...servicesOn(jdn).filter((o) => i > 0 || o.end > now.minutes));
  }
  return out;
}

export function liveService(now: ParishNow): ServiceOccurrence | null {
  if (!moduleOn('livestream')) return null;
  return servicesOn(now.jdn).find((o) => o.start <= now.minutes && now.minutes < o.end && o.service.streamed) ?? null;
}

export function isLive(now: ParishNow): boolean {
  return liveService(now) !== null;
}
