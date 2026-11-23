import Reveal from '@/components/ui/Reveal';
import { site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface PageHeroSection extends SectionBase {
  eyebrow: Localized;
  title: Localized;
  subtitle?: Localized;
  /** Overrides site.pageHeroBackground for this page. Use "" for no image. */
  backgroundImage?: string;
}

export default function PageHero({ section }: { section: PageHeroSection }) {
  const { t } = useI18n();
  const bg = section.backgroundImage ?? site.pageHeroBackground;

  return (
    <section className="relative overflow-hidden bg-primary-900 pb-14 pt-32 sm:pb-16 sm:pt-40">
      {bg && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={{ backgroundImage: `url('${bg}')`, backgroundSize: 'cover', backgroundPosition: 'center 22%' }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--color-primary-950) / 0.72) 0%, rgb(var(--color-primary-950) / 0.62) 40%, rgb(var(--color-primary-900)) 100%)',
        }}
      />
      <div className="container-px container-max relative">
        <Reveal>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-300 sm:text-[12px] sm:tracking-[0.24em]">
            {t(section.eyebrow)}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-[32px] font-semibold leading-[1.12] text-white sm:text-5xl">
            {t(section.title)}
          </h1>
          <div className="accent-rule mt-6" />
          {section.subtitle && (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-primary-100 sm:text-base">{t(section.subtitle)}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
