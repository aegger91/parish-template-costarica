import type { ReactNode } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import Reveal from '@/components/ui/Reveal';
import { site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { useCrumbs } from '@/lib/crumbs';

export interface PageHeroSection extends SectionBase {
  eyebrow: Localized;
  title: Localized;
  subtitle?: Localized;
  /** Overrides site.pageHeroBackground for this page. Use "" for no image. */
  backgroundImage?: string;
}

export function PageHeroFrame({
  eyebrow,
  title,
  subtitle,
  backgroundImage = site.pageHeroBackground,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-900 pb-12 pt-28 sm:pb-16 sm:pt-36 lg:pt-44">
      {backgroundImage && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={{ backgroundImage: `url('${backgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center 22%' }}
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
          <Breadcrumbs items={crumbs} />
          {eyebrow && (
            <p className="eyebrow mt-5 text-[11px] text-accent-300 sm:text-[12px]">{eyebrow}</p>
          )}
          <h1 className="mt-3 max-w-3xl font-heading text-[32px] font-semibold leading-[1.12] text-white sm:text-5xl">{title}</h1>
          <div className="accent-rule mt-6" />
          {subtitle && <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-primary-100 sm:text-base">{subtitle}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export default function PageHero({ section }: { section: PageHeroSection }) {
  const { t } = useI18n();
  const crumbs = useCrumbs();
  return (
    <PageHeroFrame
      eyebrow={t(section.eyebrow)}
      title={t(section.title)}
      subtitle={section.subtitle ? t(section.subtitle) : undefined}
      backgroundImage={section.backgroundImage ?? site.pageHeroBackground}
      crumbs={crumbs}
    />
  );
}
