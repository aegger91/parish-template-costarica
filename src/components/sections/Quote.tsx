import Reveal from '@/components/ui/Reveal';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface QuoteSection extends SectionBase {
  text: Localized;
  source?: Localized;
  /** Kept for older content files; the quote no longer shows an image. */
  backgroundImage?: string;
}

export default function Quote({ section }: { section: QuoteSection }) {
  const { t } = useI18n();

  return (
    <section className="section">
      <div className="container-px container-max">
        <Reveal>
          <blockquote className="mx-auto max-w-3xl text-center">
            <div className="accent-rule mx-auto mb-8" />
            <p className="font-heading text-[22px] italic leading-[1.45] text-ink-900 sm:text-[30px]">{t(section.text)}</p>
            {section.source && <footer className="eyebrow mt-6 text-accent-700">{t(section.source)}</footer>}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
