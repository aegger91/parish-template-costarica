import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
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
    <section className="bg-primary-900 py-12 sm:py-20">
      <div className="container-px container-max">
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} tone="dark" rule={false} />
            <span className="rounded-pill border border-accent-400/35 bg-primary-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-200">
              {ui(`calendar.styles.${style}`)}
            </span>
          </div>
          <ul
            className={`mx-auto mt-10 grid gap-4 sm:gap-6 ${
              services.length >= 3 ? 'max-w-4xl sm:grid-cols-3' : services.length === 2 ? 'max-w-2xl sm:grid-cols-2' : 'max-w-sm'
            }`}
          >
            {services.map((s) => {
              const name = t(s.name);
              const occurrence = nextOccurrence(s, now);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    disabled={!occurrence}
                    onClick={() => occurrence && setSelected(occurrence)}
                    aria-label={occurrence ? ui('schedule.openDetails', { name }) : name}
                    className={[
                      'w-full rounded-2xl border bg-primary-800/60 p-6 text-center transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
                      occurrence ? 'hover:border-accent-400/50 hover:bg-primary-800/90' : '',
                      s.highlight ? 'border-accent-400/40 bg-primary-800/80 shadow-lg shadow-accent-900/10' : 'border-white/10',
                    ].join(' ')}
                  >
                    <Icon name={s.icon} className="mx-auto h-6 w-6 text-accent-300" strokeWidth={1.6} />
                    <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-primary-200">
                      {s.weekday !== undefined && weekdayName(s.weekday, language.locale)}
                    </p>
                    <p className={`mt-1 font-heading text-2xl font-semibold leading-snug ${s.highlight ? 'text-accent-200' : 'text-white'}`}>
                      <time dateTime={s.time}>{formatTime(s.time, language.locale)}</time>
                    </p>
                    <p className="text-sm leading-relaxed text-primary-200">{name}</p>
                    {s.streamed && moduleOn('livestream') && (
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-300">{ui('live.streamed')}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {(section.note || section.link) && (
            <p className="mt-8 text-center text-sm leading-relaxed text-primary-200">
              {section.note && `${t(section.note)} `}
              {section.link && (
                <Link to={section.link.to} className="font-medium text-accent-300 underline-offset-4 hover:underline">
                  {t(section.link.label)}
                </Link>
              )}
            </p>
          )}
          {isOldCalendar(style) && (
            <p className="mt-4 text-center text-[12px] text-primary-300">{ui('calendar.styleNote.old')}</p>
          )}
        </Reveal>
      </div>
      <ServiceDetail occurrence={selected} open={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
}
