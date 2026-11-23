import { formatDay } from './time';

/** "Today", "Tomorrow", or a short weekday and date, for a civil day relative to today. */
export function dayLabel(jdn: number, todayJdn: number, locale: string, ui: (path: string) => string): string {
  if (jdn === todayJdn) return ui('today');
  if (jdn === todayJdn + 1) return ui('tomorrow');
  return formatDay(jdn, locale, { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.(?=,|\s|$)/g, '');
}
