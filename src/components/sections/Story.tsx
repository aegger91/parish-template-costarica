import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface StorySection extends SectionBase {
  title: Localized;
  paragraphs: Localized[];
  aside?: {
    title: Localized;
    items: { id: string; icon: string; text: Localized }[];
  };
}

export default function Story({ section }: { section: StorySection }) {
  const { t } = useI18n();

  return (
    <section className="section bg-white">
      <div className="container-px container-max grid gap-10 sm:gap-12 lg:grid-cols-5">
        <Reveal className={section.aside ? 'lg:col-span-3' : 'lg:col-span-5'}>
          <h2 className="heading-section text-primary-900">{t(section.title)}</h2>
          <div className="accent-rule mt-6" />
          <div className="prose-block mt-6 text-[15px] text-ink-700 sm:text-base">
            {section.paragraphs.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
        </Reveal>

        {section.aside && (
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="rounded-2xl bg-primary-900 p-6 text-primary-100 sm:p-8">
              <h3 className="font-heading text-2xl font-semibold text-white">{t(section.aside.title)}</h3>
              <ul className="mt-6 space-y-5 text-sm leading-relaxed">
                {section.aside.items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Icon name={item.icon} className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" strokeWidth={1.6} />
                    {t(item.text)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
