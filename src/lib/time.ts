export interface YMD {
  year: number;
  month: number;
  day: number;
}

// Julian Day Numbers make it easy to move between the civil (Gregorian) and Julian calendars.
export function jdnFromGregorian({ year, month, day }: YMD): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function jdnFromJulian({ year, month, day }: YMD): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
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

/** 0 = Sunday ... 6 = Saturday */
export function weekdayOfJdn(jdn: number): number {
  return (jdn + 1) % 7;
}

export function isoFromJdn(jdn: number): string {
  const { year, month, day } = gregorianFromJdn(jdn);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function jdnFromIso(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  return jdnFromGregorian({ year, month, day });
}

export function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

export interface ParishNow {
  jdn: number;
  /** minutes since midnight */
  minutes: number;
}

/** The current date and time in the parish's time zone, whatever the visitor's own zone is. */
export function parishNow(timeZone: string, at: Date = new Date()): ParishNow {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(at);
  } catch {
    parts = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(at);
  }
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    jdn: jdnFromGregorian({ year: get('year'), month: get('month'), day: get('day') }),
    minutes: (get('hour') % 24) * 60 + get('minute'),
  };
}

const UTC = 'UTC';

function utcDate(jdn: number): Date {
  const { year, month, day } = gregorianFromJdn(jdn);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function capitalize(text: string, locale: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

export function formatTime(hhmm: string, locale: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: UTC }).format(
    new Date(Date.UTC(2000, 0, 1, h, m || 0)),
  );
}

export function formatDay(jdn: number, locale: string, options: Intl.DateTimeFormatOptions): string {
  return capitalize(new Intl.DateTimeFormat(locale, { ...options, timeZone: UTC }).format(utcDate(jdn)), locale);
}

export function weekdayName(weekday: number, locale: string, style: 'long' | 'short' = 'long'): string {
  // 2459946 is a Sunday (1 January 2023).
  return formatDay(2459946 + weekday, locale, { weekday: style }).replace(/\.$/, '');
}

export function monthYearLabel(year: number, month: number, locale: string): string {
  return formatDay(jdnFromGregorian({ year, month, day: 1 }), locale, { month: 'long', year: 'numeric' });
}

export function formatDate(iso: string, locale: string): string {
  if (!iso) return '';
  return formatDay(jdnFromIso(iso), locale, { day: 'numeric', month: 'long', year: 'numeric' });
}
