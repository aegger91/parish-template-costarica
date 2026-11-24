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
    <section className="section">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
          <p className="mt-4 text-center">
            <span className="eyebrow inline-block rounded-pill border border-accent-400/60 px-3 py-1 text-accent-700">
              {ui(`calendar.styles.${style}`)}
            </span>
          </p>
          <ul
            className={`mx-auto mt-10 grid gap-4 sm:gap-5 ${
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
                      'card flex h-full w-full flex-col items-center justify-start p-6 text-center sm:p-7',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      occurrence ? 'lift' : '',
                    ].join(' ')}
                  >
                    <Icon name={s.icon} className="mx-auto h-6 w-6 text-accent-500" strokeWidth={1.5} />
                    <p className="eyebrow mt-4 text-accent-700">{s.weekday !== undefined && weekdayName(s.weekday, language.locale)}</p>
                    <p className="mt-1.5 font-heading text-[30px] leading-tight text-ink-900">
                      <time dateTime={s.time}>{formatTime(s.time, language.locale)}</time>
                    </p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-700">{name}</p>
                    {s.streamed && moduleOn('livestream') && (
                      <p className="eyebrow mt-3 text-rose-700">{ui('live.streamed')}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {(section.note || section.link) && (
            <p className="mt-8 text-center text-[14.5px] leading-relaxed text-ink-700">
              {section.note && `${t(section.note)} `}
              {section.link && (
                <Link to={section.link.to} className="font-medium text-primary-700 underline decoration-accent-400 underline-offset-4 hover:text-primary-800">
                  {t(section.link.label)}
                </Link>
              )}
            </p>
          )}
        </Reveal>
      </div>
      <ServiceDetail occurrence={selected} open={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
}
