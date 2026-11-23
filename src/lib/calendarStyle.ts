import type { CalendarStyle } from '@/content';

/** Accepts builder values and legacy julian / revised-julian / gregorian strings. Default: old (ROCOR). */
export function normalizeCalendarStyle(value: unknown): CalendarStyle {
  if (value === 'new' || value === 'revised-julian' || value === 'gregorian') return 'new';
  return 'old';
}

export function isOldCalendar(style: CalendarStyle): boolean {
  return style === 'old';
}
