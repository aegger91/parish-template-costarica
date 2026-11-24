import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ServiceDetail from '@/components/ui/ServiceDetail';
import { moduleOn, services, site } from '@/content';
import type { LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { nextOccurrence } from '@/lib/calendar';
import type { ServiceOccurrence } from '@/lib/calendar';
import { isOldCalendar } from '@/lib/calendarStyle';
import { useParishNow } from '@/lib/hooks';
import { formatTime, weekdayName } from '@/lib/time';

export interface ServiceTimesSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
  note?: Localized;
  link?: LinkRef;
}

export default function ServiceTimes({ section }: { section: ServiceTimesSection }) {
  const { t, ui, language } = useI18n();
  const now = useParishNow();
  const [selected, setSelected] = useState<ServiceOccurrence | null>(null);
  const style = site.calendar.style;

  return (
    <section className="section bg-white">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
          <p className="mt-3 text-center text-[13px] text-ink-500">{ui(`calendar.styles.${style}`)}</p>

          <ul
            className={`mx-auto mt-10 grid gap-4 ${
              services.length >= 3 ? 'max-w-4xl sm:grid-cols-3' : services.length === 2 ? 'max-w-2xl sm:grid-cols-2' : 'max-w-sm'
            }`}
          >
            {services.map((s) => {
              const name = t(s.name);
              const occurrence = nextOccurrence(s, now);
              return (
                <li key={s.id} className="h-full">
                  <button
                    type="button"
                    disabled={!occurrence}
                    onClick={() => occurrence && setSelected(occurrence)}
                    aria-label={occurrence ? ui('schedule.openDetails', { name }) : name}
                    className={[
                      'card flex h-full w-full flex-col items-center px-5 py-8 text-center transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
                      occurrence ? 'hover:border-accent-400' : 'opacity-70',
                      s.highlight ? 'border-accent-400/50' : '',
                    ].join(' ')}
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                      {s.weekday !== undefined && weekdayName(s.weekday, language.locale)}
                    </p>
                    <p className="mt-3 font-heading text-3xl font-semibold leading-snug text-primary-900">
                      <time dateTime={s.time}>{formatTime(s.time, language.locale)}</time>
                    </p>
                    <p className="mt-2 text-[15px] leading-snug text-ink-700">{name}</p>
                    {s.streamed && moduleOn('livestream') && (
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-rose-700">{ui('live.streamed')}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {(section.note || section.link) && (
            <p className="mt-8 text-center text-sm text-ink-500">
              {section.note && `${t(section.note)} `}
              {section.link && (
                <Link to={section.link.to} className="font-semibold text-accent-700 underline-offset-4 hover:underline">
                  {t(section.link.label)}
                </Link>
              )}
            </p>
          )}
          {isOldCalendar(style) && <p className="mt-3 text-center text-[12px] text-ink-500">{ui('calendar.styleNote.old')}</p>}
        </Reveal>
      </div>
      <ServiceDetail occurrence={selected} open={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
}
