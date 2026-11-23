import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { services } from '@/content';
import type { LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { weekdayName } from '@/lib/calendar';

export interface ServiceTimesSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
  note?: Localized;
  link?: LinkRef;
}

export default function ServiceTimes({ section }: { section: ServiceTimesSection }) {
  const { t, language } = useI18n();

  return (
    <section className="bg-primary-900 py-12 sm:py-20">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} tone="dark" rule={false} />
          <ul className={`mx-auto mt-10 grid gap-6 ${services.length > 1 ? 'max-w-2xl sm:grid-cols-2' : 'max-w-sm'}`}>
            {services.map((s) => (
              <li
                key={s.id}
                className={[
                  'rounded-2xl border bg-primary-800/60 p-6 text-center',
                  s.highlight ? 'border-accent-400/40 bg-primary-800/80 shadow-lg shadow-accent-900/10' : 'border-white/10',
                ].join(' ')}
              >
                <Icon name={s.icon} className="mx-auto h-6 w-6 text-accent-300" strokeWidth={1.6} />
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-primary-200">
                  {weekdayName(s.weekday, language.locale)}
                </p>
                <p className={`mt-1 font-serif text-2xl font-semibold ${s.highlight ? 'text-accent-200' : 'text-white'}`}>
                  <time dateTime={s.time}>{s.display}</time>
                </p>
                <p className="text-sm text-primary-200">{t(s.name)}</p>
              </li>
            ))}
          </ul>
          {(section.note || section.link) && (
            <p className="mt-8 text-center text-sm text-primary-200">
              {section.note && `${t(section.note)} `}
              {section.link && (
                <Link to={section.link.to} className="font-medium text-accent-300 underline-offset-4 hover:underline">
                  {t(section.link.label)}
                </Link>
              )}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
