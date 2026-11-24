import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { ConnectActions, ItemCard, SampleNote } from '@/components/connect/ConnectParts';
import { useConnectFeed } from '@/lib/connect';
import FilterChips from '@/components/ui/FilterChips';
import { connectCategories, site } from '@/content';
import type { ConnectItem, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { useParishNow } from '@/lib/hooks';
import { formatDay, gregorianFromJdn, jdnFromGregorian, jdnFromIso, monthYearLabel, weekdayName, weekdayOfJdn } from '@/lib/time';

export interface ConnectEventsSection extends SectionBase {
  intro?: Localized;
}

function DateBlock({ iso }: { iso: string }) {
  const { language } = useI18n();
  const jdn = jdnFromIso(iso);
  return (
    <span className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-primary-600 py-1.5 text-white">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-accent-100">{formatDay(jdn, language.locale, { month: 'short' }).replace('.', '')}</span>
      <span className="font-heading text-[23px] font-normal leading-none">{gregorianFromJdn(jdn).day}</span>
    </span>
  );
}

export default function ConnectEvents({ section }: { section: ConnectEventsSection }) {
  const { t, ui, language } = useI18n();
  const feed = useConnectFeed();
  const now = useParishNow();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [category, setCategory] = useState('');
  const today = gregorianFromJdn(now.jdn);
  const [month, setMonth] = useState({ year: today.year, month: today.month });
  const [picked, setPicked] = useState<number | null>(null);

  const events = useMemo(
    () =>
      (feed?.items ?? [])
        .filter((i): i is ConnectItem => i.kind === 'event' && !!i.date && jdnFromIso(i.date) >= now.jdn)
        .filter((i) => !category || i.category === category)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [feed, category, now.jdn],
  );

  const first = jdnFromGregorian({ ...month, day: 1 });
  const last = jdnFromGregorian(month.month === 12 ? { year: month.year + 1, month: 1, day: 1 } : { year: month.year, month: month.month + 1, day: 1 }) - 1;
  const lead = (weekdayOfJdn(first) - site.calendar.weekStartsOn + 7) % 7;
  const byDay = new Map<number, ConnectItem[]>();
  events.forEach((e) => {
    const j = jdnFromIso(e.date);
    byDay.set(j, [...(byDay.get(j) ?? []), e]);
  });
  const shown = view === 'calendar' ? (picked !== null ? (byDay.get(picked) ?? []) : events.filter((e) => jdnFromIso(e.date) >= first && jdnFromIso(e.date) <= last)) : events;

  const moveMonth = (d: -1 | 1) => {
    setPicked(null);
    setMonth((m) => {
      const n = m.month + d;
      return n < 1 ? { year: m.year - 1, month: 12 } : n > 12 ? { year: m.year + 1, month: 1 } : { year: m.year, month: n };
    });
  };

  return (
    <section className="section">
      <div className="container-px mx-auto max-w-container">
        {section.intro && <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-700">{t(section.intro)}</p>}
        <ConnectActions actions={[{ action: 'create-event', label: ui('connect.createEvent') }]} />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <FilterChips categories={connectCategories} value={category} onChange={setCategory} label={ui('connect.categories')} />
          <div className="flex w-fit rounded-pill border border-primary-200 bg-white p-1" role="group" aria-label={ui('calendar.view')}>
            {(['list', 'calendar'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`flex min-h-9 items-center gap-1.5 rounded-pill px-4 text-[13px] font-semibold ${view === v ? 'bg-primary-600 text-white' : 'text-primary-700'}`}
              >
                {v === 'list' ? <List className="h-4 w-4" strokeWidth={1.8} aria-hidden /> : <CalendarDays className="h-4 w-4" strokeWidth={1.8} aria-hidden />}
                {ui(`connect.${v}`)}
              </button>
            ))}
          </div>
        </div>

        {view === 'calendar' && (
          <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <button type="button" onClick={() => moveMonth(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200" aria-label={ui('previous')}>
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={1.8} aria-hidden />
              </button>
              <p className="font-heading text-xl font-normal text-ink-900" aria-live="polite">
                {monthYearLabel(month.year, month.month, language.locale)}
              </p>
              <button type="button" onClick={() => moveMonth(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200" aria-label={ui('next')}>
                <ChevronRight className="h-5 w-5 rtl:rotate-180" strokeWidth={1.8} aria-hidden />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 7 }, (_, i) => (i + site.calendar.weekStartsOn) % 7).map((w) => (
                <span key={w} className="py-1 text-[11px] font-medium uppercase text-ink-500">
                  {weekdayName(w, language.locale, 'short').slice(0, 2)}
                </span>
              ))}
              {Array.from({ length: lead }, (_, i) => (
                <span key={`l${i}`} />
              ))}
              {Array.from({ length: last - first + 1 }, (_, i) => first + i).map((jdn) => {
                const has = byDay.has(jdn);
                const sel = picked === jdn;
                return (
                  <button
                    key={jdn}
                    type="button"
                    disabled={!has}
                    onClick={() => setPicked(sel ? null : jdn)}
                    aria-pressed={sel}
                    aria-label={formatDay(jdn, language.locale, { day: 'numeric', month: 'long' })}
                    className={`relative flex aspect-square items-center justify-center rounded-xl text-[14px] sm:aspect-[4/3] ${
                      sel ? 'bg-primary-600 font-semibold text-white' : has ? 'bg-accent-50 font-semibold text-primary-900 hover:bg-accent-100' : 'text-ink-500'
                    } ${jdn === now.jdn && !sel ? 'ring-2 ring-accent-400' : ''}`}
                  >
                    {gregorianFromJdn(jdn).day}
                    {has && <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${sel ? 'bg-accent-300' : 'bg-accent-500'}`} aria-hidden />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {feed === null ? (
          <p className="mt-8 text-[15px] text-ink-500">{ui('connect.loading')}</p>
        ) : shown.length ? (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((e) => (
              <li key={e.id}>
                <ItemCard item={e} action={ui('connect.rsvp')}>
                  <DateBlock iso={e.date} />
                </ItemCard>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-2xl border border-primary-100 bg-white p-6 text-center text-[15px] text-ink-500">{ui('connect.noEvents')}</p>
        )}
        <SampleNote feed={feed} />
      </div>
    </section>
  );
}
