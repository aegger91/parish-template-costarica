import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, Clock, Loader2, RotateCcw } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { services, site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import {
  fastDescription,
  fetchMonth,
  fromJdn,
  gregorianFromJdn,
  julianFromJdn,
  jdnFromGregorian,
  monthName,
  monthYearLabel,
  toJdn,
  weekdayName,
} from '@/lib/calendar';
import type { CalChoice, CalendarDay, CalendarMonth, YMD } from '@/lib/calendar';

export interface CalendarSection extends SectionBase {
  title: Localized;
  footnote?: Localized;
}

type FastTone = 'none' | 'light' | 'strict';

function fastTone(day: CalendarDay): FastTone {
  if (day.fast_level === 0) return 'none';
  if (day.fast_exception_desc) return 'light';
  return 'strict';
}

const FAST_DOT: Record<FastTone, string> = {
  none: 'bg-emerald-500',
  light: 'bg-amber-400',
  strict: 'bg-rose-500',
};

function hasFeast(day: CalendarDay): boolean {
  return (day.feasts !== null && day.feasts.length > 0) || day.feast_level > 0;
}

function sameDay(a: YMD, b: YMD): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function useToday(): YMD {
  return useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }, []);
}

const selectCls =
  'min-h-11 appearance-none rounded-pill border border-primary-200 bg-white py-2.5 pl-4 pr-10 text-[13px] font-medium text-primary-900 outline-none transition-colors focus:border-accent-400';

export default function Calendar({ section }: { section: CalendarSection }) {
  const { t, ui, lang, language } = useI18n();
  const locale = language.locale;
  const todayGregorian = useToday();

  const [cal, setCal] = useState<CalChoice>(site.calendar.default ?? 'gregorian');
  const [mode, setMode] = useState<'week' | 'month'>('week');
  const initial = useMemo(
    () => fromJdn(site.calendar.default ?? 'gregorian', toJdn('gregorian', todayGregorian)),
    [todayGregorian],
  );
  const [cursor, setCursor] = useState({ year: initial.year, month: initial.month });
  const [selected, setSelected] = useState<YMD>(initial);
  const [data, setData] = useState<CalendarMonth | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetchMonth(cal, cursor.year, cursor.month)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setStatus('ok');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [cal, cursor, attempt]);

  const todayDisplayed = useMemo(
    () =>
      cal === 'julian'
        ? julianFromJdn(jdnFromGregorian(todayGregorian.year, todayGregorian.month, todayGregorian.day))
        : gregorianFromJdn(jdnFromGregorian(todayGregorian.year, todayGregorian.month, todayGregorian.day)),
    [cal, todayGregorian],
  );

  const selectedDay = useMemo<CalendarDay | null>(
    () => data?.days.find((d) => sameDay(d, selected)) ?? null,
    [data, selected],
  );

  const weeks = useMemo<(CalendarDay | null)[][]>(() => {
    if (!data) return [];
    const cells: (CalendarDay | null)[] = [];
    for (let i = 0; i < data.days[0].weekday; i++) cells.push(null);
    cells.push(...data.days);
    while (cells.length % 7 !== 0) cells.push(null);
    const out: (CalendarDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [data]);

  const activeWeekIdx = useMemo(() => {
    if (!selectedDay) return 0;
    const idx = weeks.findIndex((w) => w.some((c) => c && sameDay(c, selectedDay)));
    return idx >= 0 ? idx : 0;
  }, [weeks, selectedDay]);

  const changeCal = (choice: CalChoice) => {
    setCal(choice);
    const target = fromJdn(choice, toJdn('gregorian', todayGregorian));
    setCursor({ year: target.year, month: target.month });
    setSelected(target);
  };

  const shiftDays = (delta: number) => {
    const base = selectedDay ?? selected;
    const target = fromJdn(cal, toJdn(cal, base) + delta);
    setCursor({ year: target.year, month: target.month });
    setSelected(target);
  };

  const stepMonth = (delta: number) => {
    const m = cursor.month + delta;
    const next = m < 1 ? { year: cursor.year - 1, month: 12 } : m > 12 ? { year: cursor.year + 1, month: 1 } : { year: cursor.year, month: m };
    setCursor(next);
    setSelected({ ...next, day: 1 });
  };

  const monthLabel = useMemo(() => {
    if (!data) return '';
    const first = data.days[0];
    const last = data.days[data.days.length - 1];
    if (cal === 'julian' && (first.month !== last.month || first.year !== last.year)) {
      return `${monthName(first.month, locale, 'short')} ${first.day} – ${monthName(last.month, locale)} ${last.day}, ${last.year}`;
    }
    return monthYearLabel(cursor.year, cursor.month, locale);
  }, [data, cal, cursor, locale]);

  const serviceLabel = (weekday: number): string | null => {
    const list = services.filter((s) => s.weekday === weekday);
    return list.length ? list.map((s) => `${t(s.name)} ${s.display}`).join(' · ') : null;
  };

  const noFast = ui('calendar.noFast');

  return (
    <section id="calendar" className="bg-primary-50 py-12 sm:py-20">
      <div className="container-px container-max">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="heading-section text-primary-900">{t(section.title)}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={cal}
                  onChange={(e) => changeCal(e.target.value as CalChoice)}
                  className={selectCls}
                  aria-label={ui('calendar.style')}
                >
                  <option value="gregorian">{ui('calendar.gregorian')}</option>
                  <option value="julian">{ui('calendar.julian')}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" strokeWidth={1.8} aria-hidden />
              </div>
              <div className="relative">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'week' | 'month')}
                  className={selectCls}
                  aria-label={ui('calendar.view')}
                >
                  <option value="week">{ui('calendar.weekly')}</option>
                  <option value="month">{ui('calendar.monthly')}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" strokeWidth={1.8} aria-hidden />
              </div>
            </div>
          </div>
        </Reveal>

        {status === 'loading' && (
          <div
            role="status"
            className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-primary-100 bg-white py-16 text-ink-500"
          >
            <Loader2 className="h-5 w-5 animate-spin text-accent-600" strokeWidth={2} aria-hidden />
            <span className="text-sm">{ui('calendar.loading')}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-primary-100 bg-white px-6 py-16 text-center">
            <AlertTriangle className="h-8 w-8 text-accent-600" strokeWidth={1.6} aria-hidden />
            <p className="max-w-md text-sm leading-relaxed text-ink-700">{ui('calendar.error')}</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-primary-900 px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary-700"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              {ui('calendar.retry')}
            </button>
          </div>
        )}

        {status === 'ok' && data && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="font-serif text-xl font-semibold text-primary-900 sm:text-2xl" aria-live="polite">
                {monthLabel}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => (mode === 'week' ? shiftDays(-7) : stepMonth(-1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 transition-colors hover:border-accent-400 hover:text-accent-600"
                  aria-label={ui('previous')}
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => (mode === 'week' ? shiftDays(7) : stepMonth(1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 transition-colors hover:border-accent-400 hover:text-accent-600"
                  aria-label={ui('next')}
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </button>
              </div>
            </div>

            {mode === 'week' ? (
              <ul className="mt-6 space-y-2.5">
                {(weeks[activeWeekIdx] ?? []).map((day, i) => {
                  if (!day) return null;
                  const isToday = sameDay(todayDisplayed, day);
                  const service = serviceLabel(day.weekday);
                  return (
                    <li
                      key={`${day.month}-${day.day}-${i}`}
                      aria-current={isToday ? 'date' : undefined}
                      className={[
                        'flex flex-col gap-1.5 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6',
                        isToday
                          ? 'border-accent-400 bg-white shadow-md shadow-primary-900/10'
                          : service
                            ? 'border-accent-200 bg-accent-50/60'
                            : 'border-primary-100 bg-white',
                      ].join(' ')}
                    >
                      <div className="flex w-full items-center gap-2 sm:w-36 sm:shrink-0 sm:items-baseline">
                        <p className={`w-10 text-[12px] font-semibold uppercase tracking-[0.12em] ${isToday ? 'text-accent-700' : 'text-ink-500'}`}>
                          {weekdayName(day.weekday, locale, 'short')}
                        </p>
                        <p className={`font-serif text-lg font-semibold ${isToday ? 'text-accent-700' : 'text-primary-900'}`}>{day.day}</p>
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${FAST_DOT[fastTone(day)]}`}
                          title={fastDescription(day, lang, noFast)}
                          role="img"
                          aria-label={fastDescription(day, lang, noFast)}
                        />
                      </div>
                      <p className="min-w-0 flex-1 break-words text-[13px] leading-snug text-primary-800 sm:truncate" title={day.summary_title}>
                        {day.summary_title}
                      </p>
                      {service && (
                        <p className="flex shrink-0 flex-wrap items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-accent-700">
                          <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                          {service}
                        </p>
                      )}
                      {hasFeast(day) && (
                        <span className="hidden h-2 w-2 rounded-full bg-accent-400 sm:block" title={ui('feast')} aria-hidden />
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
                <div className="grid grid-cols-7 border-b border-primary-100 bg-primary-900" aria-hidden>
                  {[0, 1, 2, 3, 4, 5, 6].map((wd) => (
                    <div
                      key={wd}
                      className="px-0.5 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-accent-300 sm:px-1 sm:py-3 sm:text-[11px] sm:tracking-[0.12em]"
                    >
                      {weekdayName(wd, locale, 'short')}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {weeks.flat().map((day, i) => {
                    const isSunday = i % 7 === 0;
                    const isToday = day ? sameDay(todayDisplayed, day) : false;
                    return (
                      <button
                        type="button"
                        key={i}
                        disabled={!day}
                        onClick={() => {
                          if (!day) return;
                          setSelected({ year: day.year, month: day.month, day: day.day });
                          setMode('week');
                        }}
                        aria-label={day ? `${weekdayName(day.weekday, locale)} ${day.day}. ${day.summary_title}` : undefined}
                        className={[
                          'min-h-16 border-b border-r border-primary-100 p-1.5 text-left transition-colors sm:min-h-20 sm:p-2',
                          (i + 1) % 7 === 0 ? 'border-r-0' : '',
                          !day ? 'cursor-default bg-primary-50/50' : isSunday ? 'bg-accent-50 hover:bg-accent-100' : 'bg-white hover:bg-primary-50',
                        ].join(' ')}
                      >
                        {day && (
                          <>
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={[
                                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold sm:h-7 sm:w-7',
                                  isToday ? 'bg-primary-900 text-white' : isSunday ? 'text-accent-700' : 'text-ink-700',
                                ].join(' ')}
                              >
                                {day.day}
                              </span>
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${FAST_DOT[fastTone(day)]}`}
                                title={fastDescription(day, lang, noFast)}
                              />
                            </div>
                            {hasFeast(day) && (
                              <p className="mt-1 hidden truncate text-[10px] leading-tight text-accent-800 sm:block" title={day.summary_title}>
                                {day.summary_title}
                              </p>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-500">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                {noFast}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden />
                {ui('calendar.lightFast')}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden />
                {ui('calendar.strictFast')}
              </span>
            </div>
            {section.footnote && <p className="mt-4 text-[13px] leading-relaxed text-ink-500">{t(section.footnote)}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
