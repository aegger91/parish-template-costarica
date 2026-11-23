import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';
import { WEEKDAY_NAMES, fastDescription } from '@/data/calendar';
import type { CalChoice, CalendarDay, CalendarMonth } from '@/data/calendar';
import { PARISH } from '@/data/parish';
import type { Lang } from '@/i18n';

const monthCache = new Map<string, CalendarMonth>();

function jdnFromGregorian(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdnFromJulian(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}

function gregorianFromJdn(jdn: number): { year: number; month: number; day: number } {
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

function julianFromJdn(jdn: number): { year: number; month: number; day: number } {
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

function displayedToJdn(cal: CalChoice, date: { year: number; month: number; day: number }): number {
  return cal === 'julian'
    ? jdnFromJulian(date.year, date.month, date.day)
    : jdnFromGregorian(date.year, date.month, date.day);
}

function jdnToDisplayed(
  cal: CalChoice,
  jdn: number,
): { year: number; month: number; day: number } {
  return cal === 'julian' ? julianFromJdn(jdn) : gregorianFromJdn(jdn);
}

async function fetchMonth(cal: CalChoice, year: number, month: number): Promise<CalendarMonth> {
  const key = `${cal}-${year}-${month}`;
  const hit = monthCache.get(key);
  if (hit) return hit;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/orthodox-calendar?cal=${cal}&year=${year}&month=${month}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`calendar request failed (${res.status})`);
  const data = (await res.json()) as CalendarMonth;
  if (!data || !Array.isArray(data.days) || data.days.length === 0) {
    throw new Error('unexpected calendar response');
  }
  monthCache.set(key, data);
  return data;
}

const MONTH_NAMES: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
};

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

export default function OrthodoxCalendar() {
  const { lang } = useLang();
  const todayCivil = useMemo(() => new Date(), []);
  const todayGregorian = useMemo(
    () => ({
      year: todayCivil.getFullYear(),
      month: todayCivil.getMonth() + 1,
      day: todayCivil.getDate(),
    }),
    [todayCivil],
  );

  const [cal, setCal] = useState<CalChoice>('gregorian');
  const [mode, setMode] = useState<'week' | 'month'>('week');
  const [cursor, setCursor] = useState({ year: todayGregorian.year, month: todayGregorian.month });
  const [selected, setSelected] = useState(todayGregorian);
  const [data, setData] = useState<CalendarMonth | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

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
  }, [cal, cursor]);

  const todayDisplayed = useMemo(
    () =>
      cal === 'julian'
        ? julianFromJdn(jdnFromGregorian(todayGregorian.year, todayGregorian.month, todayGregorian.day))
        : todayGregorian,
    [cal, todayGregorian],
  );

  const selectedDay = useMemo<CalendarDay | null>(() => {
    if (!data) return null;
    return (
      data.days.find(
        (d) => d.year === selected.year && d.month === selected.month && d.day === selected.day,
      ) ?? null
    );
  }, [data, selected]);

  const weeks = useMemo<(CalendarDay | null)[][]>(() => {
    if (!data) return [];
    const cells: (CalendarDay | null)[] = [];
    const first = data.days[0];
    for (let i = 0; i < first.weekday; i++) cells.push(null);
    for (const d of data.days) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const out: (CalendarDay | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [data]);

  const activeWeekIdx = useMemo(() => {
    if (!selectedDay) return 0;
    const idx = weeks.findIndex((w) =>
      w.some((c) => c && c.month === selectedDay.month && c.day === selectedDay.day),
    );
    return idx >= 0 ? idx : 0;
  }, [weeks, selectedDay]);

  const changeCal = (choice: CalChoice) => {
    setCal(choice);
    const t = jdnToDisplayed(choice, displayedToJdn('gregorian', todayGregorian));
    setCursor({ year: t.year, month: t.month });
    setSelected(t);
  };

  const shiftDays = (delta: number) => {
    if (!selectedDay) return;
    const target = displayedToJdn(cal, selectedDay) + delta;
    const t = jdnToDisplayed(cal, target);
    setCursor({ year: t.year, month: t.month });
    setSelected(t);
  };

  const stepMonth = (delta: number) => {
    setCursor(({ year, month }) => {
      const m = month + delta;
      if (m < 1) return { year: year - 1, month: 12 };
      if (m > 12) return { year: year + 1, month: 1 };
      return { year, month: m };
    });
  };

  const monthLabel = useMemo(() => {
    if (!data) return '';
    const first = data.days[0];
    const last = data.days[data.days.length - 1];
    if (cal === 'julian' && (first.month !== last.month || first.year !== last.year)) {
      return `${MONTH_NAMES[lang][first.month - 1].slice(0, 3)} ${first.day} – ${MONTH_NAMES[lang][last.month - 1]} ${last.day}, ${last.year}`;
    }
    return `${MONTH_NAMES[lang][cursor.month - 1]} ${cursor.year}`;
  }, [data, cal, cursor, lang]);

  return (
    <section id="calendar" className="bg-navy-50 py-12 sm:py-20">
      <div className="container-px container-max">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-serif text-2xl font-semibold text-navy-900 sm:text-4xl">
              {lang === 'es' ? 'Calendario de la parroquia' : lang === 'ru' ? 'Приходской календарь' : 'Parish Calendar'}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={cal}
                  onChange={(e) => changeCal(e.target.value as CalChoice)}
                  className="appearance-none rounded-full border border-navy-200 bg-white py-2.5 pl-4 pr-10 text-[13px] font-medium text-navy-900 outline-none transition-colors focus:border-gold-400"
                  aria-label={lang === 'es' ? 'Estilo del calendario' : lang === 'ru' ? 'Стиль календаря' : 'Calendar style'}
                >
                  <option value="gregorian">
                    {lang === 'es' ? 'Nuevo (gregoriano)' : lang === 'ru' ? 'Новый (григорианский)' : 'New Calendar'}
                  </option>
                  <option value="julian">
                    {lang === 'es' ? 'Antiguo (juliano)' : lang === 'ru' ? 'Старый (юлианский)' : 'Old Calendar'}
                  </option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" strokeWidth={1.8} />
              </div>
              <div className="relative">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'week' | 'month')}
                  className="appearance-none rounded-full border border-navy-200 bg-white py-2.5 pl-4 pr-10 text-[13px] font-medium text-navy-900 outline-none transition-colors focus:border-gold-400"
                  aria-label={lang === 'es' ? 'Vista del calendario' : lang === 'ru' ? 'Вид календаря' : 'Calendar view'}
                >
                  <option value="week">{lang === 'es' ? 'Semanal' : lang === 'ru' ? 'Неделя' : 'Weekly'}</option>
                  <option value="month">{lang === 'es' ? 'Mensual' : lang === 'ru' ? 'Месяц' : 'Monthly'}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        </Reveal>

        {status === 'loading' && (
          <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-navy-100 bg-white py-16 text-ink-500">
            <Loader2 className="h-5 w-5 animate-spin text-gold-600" strokeWidth={2} />
            <span className="text-sm">
              {lang === 'es' ? 'Cargando el calendario…' : lang === 'ru' ? 'Загрузка календаря…' : 'Loading the calendar…'}
            </span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-navy-100 bg-white py-16 text-center">
            <AlertTriangle className="h-8 w-8 text-gold-600" strokeWidth={1.6} />
            <p className="max-w-md text-sm leading-relaxed text-ink-700">
              {lang === 'es'
                ? 'El calendario no está disponible en este momento. Inténtelo de nuevo en unos minutos.'
                : lang === 'ru'
                  ? 'Календарь временно недоступен. Попробуйте снова через несколько минут.'
                  : 'The calendar is unavailable right now. Please try again in a few minutes.'}
            </p>
            <button
              onClick={() => setCursor({ ...cursor })}
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-navy-700"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              {lang === 'es' ? 'Reintentar' : lang === 'ru' ? 'Повторить' : 'Retry'}
            </button>
          </div>
        )}

        {status === 'ok' && data && (
          <Reveal delay={0.08}>
            <div className="flex flex-col items-start justify-between gap-4">
              <p className="font-serif text-xl font-semibold text-navy-900">{monthLabel}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (mode === 'week' ? shiftDays(-7) : stepMonth(-1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-600"
                  aria-label={lang === 'es' ? 'Anterior' : lang === 'ru' ? 'Назад' : 'Previous'}
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => (mode === 'week' ? shiftDays(7) : stepMonth(1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-600"
                  aria-label={lang === 'es' ? 'Siguiente' : lang === 'ru' ? 'Вперёд' : 'Next'}
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {mode === 'week' ? (
              <WeekRows
                lang={lang}
                weeks={weeks}
                activeWeekIdx={activeWeekIdx}
                todayDisplayed={todayDisplayed}
              />
            ) : (
              <MonthGrid
                lang={lang}
                weeks={weeks}
                todayDisplayed={todayDisplayed}
                onSelect={(d) => {
                  setSelected({ year: d.year, month: d.month, day: d.day });
                  setMode('week');
                }}
              />
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-500">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {lang === 'es' ? 'Sin ayuno' : lang === 'ru' ? 'Поста нет' : 'No fast'}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                {lang === 'es' ? 'Ayuno con dispensa' : lang === 'ru' ? 'Пост с послаблением' : 'Fast with dispensation'}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                {lang === 'es' ? 'Ayuno estricto' : lang === 'ru' ? 'Строгий пост' : 'Strict fast'}
              </span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
              {lang === 'es'
                ? 'Los santos y fiestas provienen del servicio orthocal.info. Confirme los horarios de semana con el párroco antes de viajar.'
                : lang === 'ru'
                  ? 'Данные о святых и праздниках — от службы orthocal.info. О богослужениях по будням уточняйте у настоятеля.'
                  : 'Saints and feasts come from the orthocal.info service. Please confirm weekday service times with the priest before travelling.'}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function parishServiceLabel(weekday: number, lang: Lang): string | null {
  if (weekday !== 0) return null;
  return lang === 'es'
    ? `Confesión ${PARISH.services.confession} · Divina Liturgia ${PARISH.services.liturgy}`
    : lang === 'ru'
      ? `Исповедь ${PARISH.services.confession} · Божественная литургия ${PARISH.services.liturgy}`
      : `Confession ${PARISH.services.confession} · Divine Liturgy ${PARISH.services.liturgy}`;
}

function WeekRows({
  lang,
  weeks,
  activeWeekIdx,
  todayDisplayed,
}: {
  lang: Lang;
  weeks: (CalendarDay | null)[][];
  activeWeekIdx: number;
  todayDisplayed: { year: number; month: number; day: number };
}) {
  const week = weeks[activeWeekIdx] ?? [];

  return (
    <div className="mt-6 space-y-2.5">
      {week.map((day, i) => {
        if (!day) {
          return <div key={`pad-${i}`} className="hidden sm:h-[58px]" />;
        }
        const isToday =
          todayDisplayed.year === day.year &&
          todayDisplayed.month === day.month &&
          todayDisplayed.day === day.day;
        const service = parishServiceLabel(day.weekday, lang);
        const feast = hasFeast(day);
        return (
          <div
            key={`${day.month}-${day.day}`}
            className={[
              'flex flex-col gap-1.5 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6',
              isToday
                ? 'border-gold-400 bg-white shadow-md shadow-navy-900/10'
                : day.weekday === 0
                  ? 'border-gold-200 bg-gold-50/60'
                  : 'border-navy-100 bg-white',
            ].join(' ')}
          >
            <div className="flex w-full items-center gap-2 sm:w-40 sm:shrink-0 sm:items-baseline">
              <p
                className={[
                  'text-[12px] font-semibold uppercase tracking-[0.12em]',
                  isToday ? 'text-gold-700' : 'text-ink-500',
                ].join(' ')}
              >
                {WEEKDAY_NAMES[lang][day.weekday].slice(0, 3)}
              </p>
              <p
                className={[
                  'font-serif text-lg font-semibold',
                  isToday ? 'text-gold-700' : 'text-navy-900',
                ].join(' ')}
              >
                {day.day}
              </p>
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${FAST_DOT[fastTone(day)]}`}
                title={fastDescription(day, lang)}
              />
            </div>
            <p className="min-w-0 flex-1 break-words text-[13px] leading-snug text-navy-800 sm:truncate" title={day.summary_title}>
              {day.summary_title}
            </p>
            {service && (
              <p className="flex shrink-0 flex-wrap items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-gold-700">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                {service}
              </p>
            )}
            {feast && (
              <span
                className="hidden h-2 w-2 rounded-full bg-gold-400 sm:block"
                title={lang === 'es' ? 'Fiesta' : lang === 'ru' ? 'Праздник' : 'Feast'}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MonthGrid({
  lang,
  weeks,
  todayDisplayed,
  onSelect,
}: {
  lang: Lang;
  weeks: (CalendarDay | null)[][];
  todayDisplayed: { year: number; month: number; day: number };
  onSelect: (day: CalendarDay) => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-navy-100 bg-navy-900">
        {WEEKDAY_NAMES[lang].map((d) => (
          <div
            key={d}
            className="px-0.5 py-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.06em] text-gold-300 sm:px-1 sm:py-3 sm:text-[11px] sm:tracking-[0.12em]"
          >
            {d.slice(0, lang === 'ru' ? 2 : 3)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weeks.flat().map((day, i) => {
          const isSunday = i % 7 === 0;
          const isToday =
            day &&
            todayDisplayed.year === day.year &&
            todayDisplayed.month === day.month &&
            todayDisplayed.day === day.day;
          const feast = day ? hasFeast(day) : false;
          return (
            <button
              key={i}
              disabled={!day}
              onClick={() => day && onSelect(day)}
              className={[
                'min-h-16 border-b border-r border-navy-100 p-1.5 text-left transition-colors last:border-r-0 sm:min-h-20 sm:p-2',
                (i + 1) % 7 === 0 ? 'border-r-0' : '',
                !day
                  ? 'cursor-default bg-navy-50/50'
                  : isSunday
                    ? 'bg-gold-50 hover:bg-gold-100'
                    : 'bg-white hover:bg-navy-50',
              ].join(' ')}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={[
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold sm:h-7 sm:w-7',
                        isToday
                          ? 'bg-navy-900 text-white'
                          : isSunday
                            ? 'text-gold-700'
                            : 'text-ink-700',
                      ].join(' ')}
                    >
                      {day.day}
                    </span>
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${FAST_DOT[fastTone(day)]}`}
                      title={fastDescription(day, lang)}
                    />
                  </div>
                  {feast && (
                    <p
                      className="mt-1 hidden truncate text-[10px] leading-tight text-gold-800 sm:block"
                      title={day.summary_title}
                    >
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
  );
}
