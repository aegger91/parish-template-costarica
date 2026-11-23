import Reveal from '@/components/ui/Reveal';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface QuoteSection extends SectionBase {
  text: Localized;
  source?: Localized;
  /** Faint image behind the quote. Optional. */
  backgroundImage?: string;
}

export default function Quote({ section }: { section: QuoteSection }) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-primary-800 py-14 sm:py-20">
      {section.backgroundImage && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: `url('${section.backgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
        />
      )}
      <div className="container-px container-max relative">
        <Reveal>
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-xl italic leading-snug text-white sm:text-3xl">{t(section.text)}</p>
            {section.source && <footer className="eyebrow mt-6 text-[12px] text-accent-300">{t(section.source)}</footer>}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
