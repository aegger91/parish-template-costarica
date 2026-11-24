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
  /** CSS object-position of that photo, e.g. "50% 60%". */
  backgroundPosition?: string;
}

export function PageHeroFrame({
  eyebrow,
  title,
  subtitle,
  backgroundImage = site.pageHeroBackground,
  backgroundPosition = '50% 35%',
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="container-px mx-auto max-w-container pt-6 sm:pt-9 lg:pt-11">
      <Reveal>
        {crumbs.length > 1 && (
          <div className="mb-4">
            <Breadcrumbs items={crumbs} tone="light" />
          </div>
        )}
        <div className="tile tile-olive min-h-[14rem] justify-end p-7 sm:min-h-[17rem] sm:p-10 lg:min-h-[19rem] lg:p-12">
          {backgroundImage && (
            <>
              <img
                src={backgroundImage}
                alt=""
                {...{ fetchpriority: 'high' }}
                className="tile-image opacity-75 mix-blend-luminosity"
                style={{ objectPosition: backgroundPosition }}
              />
              <div aria-hidden className="tile-tint-olive" />
            </>
          )}
          {eyebrow && <p className="eyebrow text-white/85">{eyebrow}</p>}
          <h1 className="mt-2 max-w-2xl font-heading text-[32px] font-normal leading-[1.18] sm:text-[44px] lg:text-[48px]">{title}</h1>
          {subtitle && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">{subtitle}</p>}
          {children}
        </div>
      </Reveal>
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
      backgroundPosition={section.backgroundPosition}
      crumbs={crumbs}
    />
  );
}
