import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { moduleOn, site } from '@/content';
import type { CalendarStyle, Feast, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import {
  commemorations,
  fastNote,
  fastTone,
  feastsOn,
  liveService,
  servicesOn,
  usesOrthocalCycle,
} from '@/lib/calendar';
import type { OrthocalDay, ServiceOccurrence } from '@/lib/calendar';
import { useOrthocalDays, useParishNow } from '@/lib/hooks';
import {
  formatDay,
  formatTime,
  gregorianFromJdn,
  jdnFromGregorian,
  julianFromJdn,
  monthYearLabel,
  weekdayName,
  weekdayOfJdn,
} from '@/lib/time';

export interface CalendarSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
  intro?: Localized;
  defaultView?: 'week' | 'month';
}

type View = 'week' | 'month';

interface DayInfo {
  jdn: number;
  services: ServiceOccurrence[];
  feasts: Feast[];
  orthocal?: OrthocalDay;
}

function startOfWeek(jdn: number): number {
  return jdn - ((weekdayOfJdn(jdn) - site.calendar.weekStartsOn + 7) % 7);
}

function monthRange(jdn: number): [number, number] {
  const { year, month } = gregorianFromJdn(jdn);
  const first = jdnFromGregorian({ year, month, day: 1 });
  const next = month === 12 ? { year: year + 1, month: 1, day: 1 } : { year, month: month + 1, day: 1 };
  return [first, jdnFromGregorian(next) - 1];
}

function rankClass(feast: Feast | undefined): string {
  if (!feast) return '';
  if (feast.rank === 'parish') return 'border-primary-300 bg-primary-50';
  return 'border-accent-300 bg-accent-50';
}

function FeastLine({ feast, compact = false }: { feast: Feast; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <p className={`flex items-start gap-1.5 font-semibold text-accent-700 ${compact ? 'text-[11px] leading-tight' : 'text-[13.5px] leading-snug'}`}>
      <OrthodoxIcon name="cross" className={`${compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} mt-0.5 shrink-0`} strokeWidth={2.2} />
      <span className={compact ? 'line-clamp-2' : ''}>{t(feast.name)}</span>
    </p>
  );
}

function ServiceLine({ o, live, compact = false }: { o: ServiceOccurrence; live: boolean; compact?: boolean }) {
  const { t, ui, language } = useI18n();
  return (
    <li className={`flex flex-wrap gap-x-2 ${compact ? 'text-[11.5px] leading-tight' : 'text-[14px] leading-snug'}`}>
      <span className={`shrink-0 tabular-nums font-semibold ${o.service.highlight ? 'text-primary-900' : 'text-primary-700'}`}>
        {formatTime(o.service.time, language.locale)}
      </span>
      <span className={`min-w-0 ${compact ? 'line-clamp-2' : ''} ${o.service.highlight ? 'font-medium text-primary-900' : 'text-ink-700'}`}>
        {t(o.service.name)}
        {live && <span className="ms-1.5 inline-block whitespace-nowrap rounded-pill bg-rose-600 px-1.5 py-px text-[10px] font-bold uppercase text-white">{ui('live.short')}</span>}
      </span>
    </li>
  );
}

function OldStyleDate({ jdn }: { jdn: number }) {
  const { language } = useI18n();
  const j = julianFromJdn(jdn);
  const text = new Intl.DateTimeFormat(language.locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2001, j.month - 1, j.day)),
  );
  return <span className="text-[11px] text-ink-500">{text}</span>;
}

/** Full details for one day: used in the week view, the mobile list and the selected day of the month view. */
function DayDetails({ info, style, today, live, heading = true }: { info: DayInfo; style: CalendarStyle; today: number; live: ServiceOccurrence | null; heading?: boolean }) {
  const { ui, lang, language } = useI18n();
  const saints = site.calendar.saintsLanguages.includes(lang) ? commemorations(info.orthocal, style).slice(0, 3) : [];
  const fast = info.orthocal && usesOrthocalCycle(style) ? info.orthocal : undefined;
  const isToday = info.jdn === today;
  return (
    <div>
      {heading && (
        <div className="flex items-baseline justify-between gap-2">
          <p className={`font-heading text-lg font-semibold ${isToday ? 'text-accent-700' : 'text-primary-900'}`}>
            {formatDay(info.jdn, language.locale, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <span className="flex shrink-0 items-center gap-2">
            {style === 'julian' && <OldStyleDate jdn={info.jdn} />}
            {isToday && <span className="rounded-pill bg-accent-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-900">{ui('today')}</span>}
          </span>
        </div>
      )}
      <div className="mt-2 space-y-1">
        {info.feasts.map((f) => (
          <FeastLine key={f.id} feast={f} />
        ))}
      </div>
      {info.services.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {info.services.map((o) => (
            <ServiceLine key={o.service.id} o={o} live={!!live && live.jdn === o.jdn && live.service.id === o.service.id} />
          ))}
        </ul>
      )}
      {saints.length > 0 && <p className="mt-2 text-[12.5px] leading-snug text-ink-500">{saints.join(' · ')}</p>}
      {fast && (
        <p className={`mt-1.5 text-[12px] ${fastTone(fast) === 'none' ? 'text-emerald-700' : 'text-ink-500'}`}>{fastNote(fast, ui)}</p>
      )}
    </div>
  );
}

export default function Calendar({ section }: { section: CalendarSection }) {
  const { t, ui, language } = useI18n();
  const now = useParishNow();
  const style = site.calendar.style;
  const [view, setView] = useState<View>(section.defaultView ?? 'week');
  const [anchor, setAnchor] = useState(now.jdn);
  const [selected, setSelected] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const live = moduleOn('livestream') ? liveService(now) : null;

  const [from, to] = view === 'week' ? [startOfWeek(anchor), startOfWeek(anchor) + 6] : monthRange(anchor);
  const { days, status } = useOrthocalDays(style, from, to, attempt);

  const list: DayInfo[] = useMemo(() => {
    const out: DayInfo[] = [];
    for (let jdn = from; jdn <= to; jdn++) {
      out.push({ jdn, services: servicesOn(jdn), feasts: feastsOn(style, jdn), orthocal: days.get(jdn) });
    }
    return out;
  }, [from, to, style, days]);

  const move = (dir: -1 | 1) => {
    setSelected(null);
    if (view === 'week') setAnchor(anchor + dir * 7);
    else {
      const { year, month } = gregorianFromJdn(anchor);
      const m = month + dir;
      setAnchor(jdnFromGregorian({ year: m < 1 ? year - 1 : m > 12 ? year + 1 : year, month: ((m + 11) % 12) + 1, day: 1 }));
    }
  };

  const title =
    view === 'week'
      ? ui('calendar.range', {
          from: formatDay(from, language.locale, { day: 'numeric', month: 'short' }),
          to: formatDay(to, language.locale, { day: 'numeric', month: 'short', year: 'numeric' }),
        })
      : (() => {
          const { year, month } = gregorianFromJdn(anchor);
          return monthYearLabel(year, month, language.locale);
        })();

  const weekdays = Array.from({ length: 7 }, (_, i) => (i + site.calendar.weekStartsOn) % 7);
  const lead = view === 'month' ? (weekdayOfJdn(from) - site.calendar.weekStartsOn + 7) % 7 : 0;
  const selectedInfo = selected !== null ? list.find((d) => d.jdn === selected) : undefined;
  const agenda = view === 'month' ? list.filter((d) => d.services.length || d.feasts.length || d.jdn === now.jdn) : list;

  return (
    <section className="section bg-white">
      <div className="container-px mx-auto max-w-[80rem]">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
          {section.intro && <p className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-relaxed text-ink-700">{t(section.intro)}</p>}
        </Reveal>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-pill border border-primary-200 p-1" role="group" aria-label={ui('calendar.view')}>
              {(['week', 'month'] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setView(v);
                    setSelected(null);
                  }}
                  aria-pressed={view === v}
                  className={`min-h-9 rounded-pill px-4 text-[13px] font-semibold transition-colors ${
                    view === v ? 'bg-primary-900 text-white' : 'text-primary-700 hover:text-primary-900'
                  }`}
                >
                  {ui(v === 'week' ? 'calendar.weekly' : 'calendar.monthly')}
                </button>
              ))}
            </div>
            <span className="rounded-pill bg-primary-50 px-3 py-1.5 text-[12px] font-semibold text-primary-700">{ui(`calendar.styles.${style}`)}</span>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <button type="button" onClick={() => move(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 text-primary-800 hover:border-accent-400" aria-label={ui('previous')}>
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={1.8} aria-hidden />
            </button>
            <p className="min-w-0 flex-1 text-center font-heading text-xl font-semibold text-primary-900 sm:min-w-[14rem] sm:flex-none" aria-live="polite">
              {title}
            </p>
            <button type="button" onClick={() => move(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 text-primary-800 hover:border-accent-400" aria-label={ui('next')}>
              <ChevronRight className="h-5 w-5 rtl:rotate-180" strokeWidth={1.8} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                setAnchor(now.jdn);
                setSelected(null);
              }}
              className="btn-outline min-h-11 px-4"
            >
              {ui('today')}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-accent-300 bg-accent-50" aria-hidden />
            {ui('calendar.legendFeast')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-primary-300 bg-primary-50" aria-hidden />
            {ui('calendar.legendParish')}
          </span>
          {status === 'loading' && <span>{ui('calendar.loading')}</span>}
          {status === 'error' && (
            <span className="flex items-center gap-2 text-rose-700">
              {ui('calendar.error')}
              <button type="button" onClick={() => setAttempt((a) => a + 1)} className="inline-flex items-center gap-1 font-semibold underline">
                <RotateCw className="h-3 w-3" strokeWidth={2} aria-hidden />
                {ui('calendar.retry')}
              </button>
            </span>
          )}
        </div>

        {/* Week view: seven columns on large screens, one list on smaller ones. */}
        {view === 'week' && (
          <ol className="mt-6 grid gap-3 lg:grid-cols-7">
            {list.map((info) => {
              const feast = info.feasts[0];
              const isToday = info.jdn === now.jdn;
              return (
                <li
                  key={info.jdn}
                  className={`rounded-2xl border p-4 ${feast ? rankClass(feast) : 'border-primary-100 bg-white'} ${isToday ? 'ring-2 ring-accent-400' : ''}`}
                >
                  <div className="lg:hidden">
                    <DayDetails info={info} style={style} today={now.jdn} live={live} />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">{weekdayName(weekdayOfJdn(info.jdn), language.locale, 'short')}</p>
                    <p className={`font-heading text-2xl font-semibold ${isToday ? 'text-accent-700' : 'text-primary-900'}`}>
                      {gregorianFromJdn(info.jdn).day}
                      {style === 'julian' && (
                        <span className="ms-1.5 align-middle">
                          <OldStyleDate jdn={info.jdn} />
                        </span>
                      )}
                    </p>
                    <DayDetails info={info} style={style} today={now.jdn} live={live} heading={false} />
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {view === 'month' && (
          <>
            <div className="mt-6 hidden md:block">
              <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-primary-100 bg-primary-100">
                {weekdays.map((w) => (
                  <div key={w} className="bg-primary-50 px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-700">
                    {weekdayName(w, language.locale, 'short')}
                  </div>
                ))}
                {Array.from({ length: lead }, (_, i) => (
                  <div key={`lead-${i}`} className="bg-white/60" aria-hidden />
                ))}
                {list.map((info) => {
                  const feast = info.feasts[0];
                  const isToday = info.jdn === now.jdn;
                  const isSel = selected === info.jdn;
                  return (
                    <button
                      key={info.jdn}
                      type="button"
                      onClick={() => setSelected(isSel ? null : info.jdn)}
                      aria-pressed={isSel}
                      aria-label={formatDay(info.jdn, language.locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                      className={`flex min-h-[7.5rem] flex-col gap-1 p-2 text-start align-top transition-colors ${
                        feast ? (feast.rank === 'parish' ? 'bg-primary-50' : 'bg-accent-50') : 'bg-white'
                      } ${isSel ? 'outline outline-2 -outline-offset-2 outline-primary-900' : 'hover:bg-primary-50/70'}`}
                    >
                      <span className="flex items-center justify-between gap-1">
                        <span
                          className={`flex h-7 min-w-7 items-center justify-center rounded-full text-[13px] font-semibold ${
                            isToday ? 'bg-accent-400 text-primary-900' : 'text-primary-900'
                          }`}
                        >
                          {gregorianFromJdn(info.jdn).day}
                        </span>
                        {style === 'julian' && <OldStyleDate jdn={info.jdn} />}
                      </span>
                      {feast && <FeastLine feast={feast} compact />}
                      <ul className="space-y-0.5">
                        {info.services.slice(0, feast ? 2 : 3).map((o) => (
                          <ServiceLine key={o.service.id} o={o} compact live={!!live && live.jdn === o.jdn && live.service.id === o.service.id} />
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 min-h-[5rem] rounded-2xl border border-primary-100 bg-primary-50/50 p-5" aria-live="polite">
                {selectedInfo ? (
                  <DayDetails info={selectedInfo} style={style} today={now.jdn} live={live} />
                ) : (
                  <p className="text-[14px] text-ink-500">{ui('calendar.pickDay')}</p>
                )}
              </div>
            </div>

            <ol className="mt-6 space-y-3 md:hidden">
              {agenda.map((info) => (
                <li
                  key={info.jdn}
                  className={`rounded-2xl border p-4 ${info.feasts[0] ? rankClass(info.feasts[0]) : 'border-primary-100 bg-white'} ${info.jdn === now.jdn ? 'ring-2 ring-accent-400' : ''}`}
                >
                  <DayDetails info={info} style={style} today={now.jdn} live={live} />
                </li>
              ))}
            </ol>
          </>
        )}

        <p className="mt-6 text-[12.5px] leading-relaxed text-ink-500">
          {ui(`calendar.styleNote.${style}`)} {ui('calendar.source')}
        </p>
      </div>
    </section>
  );
}
