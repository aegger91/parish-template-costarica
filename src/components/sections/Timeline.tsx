import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { history } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface TimelineSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
}

/** The parish history from src/content/history.json, as a vertical timeline. */
export default function Timeline({ section }: { section: TimelineSection }) {
  const { t } = useI18n();
  return (
    <section className="section">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <ol className="relative mx-auto mt-14 max-w-3xl">
          <span aria-hidden className="absolute bottom-2 start-[4.75rem] top-2 w-px bg-accent-300 sm:start-[6.25rem]" />
          {history.map((event, i) => (
            <li key={event.id} className="relative pb-10 last:pb-0">
              <Reveal delay={0.05 * i} className="grid grid-cols-[4.75rem_1fr] gap-x-6 sm:grid-cols-[6.25rem_1fr] sm:gap-x-10">
                <p className="pe-4 pt-0.5 text-end font-heading text-[23px] font-normal text-accent-700 sm:text-3xl">{event.year}</p>
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -start-[1.85rem] top-2.5 h-3 w-3 rounded-full border-2 border-accent-400 bg-white sm:-start-[2.85rem]"
                  />
                  <h3 className="font-heading text-xl font-normal leading-snug text-ink-900 sm:text-[23px]">{t(event.title)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{t(event.text)}</p>
                  {event.image && <img src={event.image} alt="" loading="lazy" className="mt-4 w-full max-w-md rounded-xl object-cover" />}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
