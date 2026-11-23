import { site } from '@/content';
import type { ServiceOccurrence } from './calendar';
import { gregorianFromJdn } from './time';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Local civil stamp YYYYMMDDTHHMMSS for ICS / Google Calendar (with ctz / TZID). */
export function localStamp(jdn: number, minutes: number): string {
  const { year, month, day } = gregorianFromJdn(jdn);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${year}${pad(month)}${pad(day)}T${pad(h)}${pad(m)}00`;
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildIcs(occurrence: ServiceOccurrence, title: string, description: string, location: string): string {
  const tz = site.timeZone;
  const start = localStamp(occurrence.jdn, occurrence.start);
  const end = localStamp(occurrence.jdn, occurrence.end);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const uid = `${occurrence.service.id}-${occurrence.jdn}@${site.id}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Orthodox Parish Template//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${tz}:${start}`,
    `DTEND;TZID=${tz}:${end}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `LOCATION:${icsEscape(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function downloadIcs(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(occurrence: ServiceOccurrence, title: string, description: string, location: string): string {
  const start = localStamp(occurrence.jdn, occurrence.start);
  const end = localStamp(occurrence.jdn, occurrence.end);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    ctz: site.timeZone,
    details: description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
