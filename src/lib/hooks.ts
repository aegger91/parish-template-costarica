import { useEffect, useState } from 'react';
import { site } from '@/content';
import type { CalendarStyle } from '@/content';
import { loadOrthocalMonth } from './calendar';
import type { OrthocalDay } from './calendar';
import { gregorianFromJdn, parishNow } from './time';
import type { ParishNow } from './time';

/** The parish date and time, refreshed every minute. */
export function useParishNow(): ParishNow {
  const [now, setNow] = useState(() => parishNow(site.timeZone));
  useEffect(() => {
    const id = window.setInterval(() => setNow(parishNow(site.timeZone)), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export type LoadStatus = 'loading' | 'ok' | 'error';

/** Daily saints and fasting for every civil month touched by the given day range. */
export function useOrthocalDays(style: CalendarStyle, fromJdn: number, toJdn: number, attempt = 0) {
  const [days, setDays] = useState<Map<number, OrthocalDay>>(new Map());
  const [status, setStatus] = useState<LoadStatus>('loading');

  const first = gregorianFromJdn(fromJdn);
  const last = gregorianFromJdn(toJdn);
  const monthsKey = `${first.year}-${first.month}:${last.year}-${last.month}`;

  useEffect(() => {
    let cancelled = false;
    const months: { year: number; month: number }[] = [];
    let { year, month } = first;
    while (year < last.year || (year === last.year && month <= last.month)) {
      months.push({ year, month });
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
    setStatus('loading');
    Promise.all(months.map((m) => loadOrthocalMonth(style, m.year, m.month)))
      .then((maps) => {
        if (cancelled) return;
        const merged = new Map<number, OrthocalDay>();
        maps.forEach((m) => m.forEach((v, k) => merged.set(k, v)));
        setDays(merged);
        setStatus('ok');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, monthsKey, attempt]);

  return { days, status };
}
