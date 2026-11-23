import Reveal from '@/components/ui/Reveal';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface QuoteSection extends SectionBase {
  variant: 'dark' | 'light';
  text: Localized;
  source?: Localized;
  backgroundImage?: string;
}

export default function Quote({ section }: { section: QuoteSection }) {
  const { t } = useI18n();
  const dark = section.variant === 'dark';

  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-primary-800 py-14 sm:py-20' : 'bg-primary-50 py-12'}`}>
      {dark && section.backgroundImage && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url('${section.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        />
      )}
      <div className="container-px container-max relative">
        <Reveal>
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className={`font-serif text-xl italic leading-snug sm:text-3xl ${dark ? 'text-white' : 'text-primary-900'}`}>
              {t(section.text)}
            </p>
            {section.source && (
              <footer
                className={`mt-6 text-[12px] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-accent-300' : 'text-accent-600'}`}
              >
                {t(section.source)}
              </footer>
            )}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
