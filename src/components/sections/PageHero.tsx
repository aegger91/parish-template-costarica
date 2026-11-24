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
    <section className="relative overflow-hidden bg-primary-900 pb-14 pt-32 sm:pb-16 sm:pt-36">
      {backgroundImage && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url('${backgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center 22%' }}
        />
      )}
      <div aria-hidden className="hero-overlay absolute inset-0" />
      <div className="container-px container-max relative">
        <Reveal>
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="eyebrow mt-5 text-accent-300">{eyebrow}</p>}
          <h1 className="mt-3 max-w-3xl font-heading text-[2rem] font-semibold leading-[1.2] text-white sm:text-5xl">{title}</h1>
          <div className="accent-rule mt-5 bg-accent-400/80" />
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
