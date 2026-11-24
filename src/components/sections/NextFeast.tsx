import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import OrthodoxCross from '@/components/ui/OrthodoxCross';
import { getPage, site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { feastsOn, nextFeast } from '@/lib/calendar';
import { useParishNow } from '@/lib/hooks';
import { formatDay } from '@/lib/time';
import { dayLabel } from '@/lib/when';

export interface NextFeastSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
}

/** Quiet block for today's feast or the next upcoming feast. */
export default function NextFeast({ section }: { section: NextFeastSection }) {
  const { t, ui, language } = useI18n();
  const now = useParishNow();
  const style = site.calendar.style;
  const today = feastsOn(style, now.jdn)[0];
  const upcoming = today ? null : nextFeast(style, now.jdn + 1);
  const feast = today ?? upcoming?.feast;
  const jdn = today ? now.jdn : upcoming?.jdn;
  const services = getPage('services');

  if (!feast || jdn === undefined) return null;

  return (
    <section className="section border-y border-primary-100 bg-primary-50/60">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
          <div className="mx-auto mt-10 max-w-xl text-center">
            <OrthodoxCross className="mx-auto h-7 w-auto text-accent-600" strokeWidth={1.7} />
            <p className="mt-5 font-heading text-2xl font-semibold leading-snug text-primary-900 sm:text-3xl">{t(feast.name)}</p>
            <p className="mt-3 text-[15px] text-ink-700">
              {today
                ? formatDay(jdn, language.locale, { weekday: 'long', day: 'numeric', month: 'long' })
                : dayLabel(jdn, now.jdn, language.locale, ui)}
            </p>
            {services && (
              <Link to={services.path} className="mt-6 inline-flex text-[14px] font-semibold text-accent-700 underline-offset-4 hover:underline">
                {ui('hero.fullSchedule')}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
