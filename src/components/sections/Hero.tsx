import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import Highlight from '@/components/ui/Highlight';
import type { LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface HeroSection extends SectionBase {
  image: string;
  title: Localized;
  eyebrow?: Localized;
  tagline?: Localized;
  primaryCta?: LinkRef;
  secondaryCta?: LinkRef;
  servicesLine?: Localized;
}

export default function Hero({ section }: { section: HeroSection }) {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-primary-950">
      <img
        src={section.image}
        alt=""
        {...{ fetchpriority: 'high' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--color-primary-950) / 0.6) 0%, rgb(var(--color-primary-950) / 0.48) 50%, rgb(var(--color-primary-900) / 0.88) 100%)',
        }}
      />

      <div className="container-px container-max relative py-24 text-center sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
            <Highlight text={t(section.title)} />
          </h1>
          {section.eyebrow && (
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-300 sm:text-[12px]">
              {t(section.eyebrow)}
            </p>
          )}
          {section.tagline && (
            <p className="mt-5 text-base leading-relaxed text-primary-100 sm:text-lg">{t(section.tagline)}</p>
          )}

          {(section.primaryCta || section.secondaryCta) && (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {section.primaryCta && (
                <Link
                  to={section.primaryCta.to}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-pill bg-accent-400 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-900 transition-all hover:bg-accent-300 sm:px-7 sm:py-3.5 sm:text-[13px] sm:tracking-[0.16em]"
                >
                  {t(section.primaryCta.label)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
                </Link>
              )}
              {section.secondaryCta && (
                <Link
                  to={section.secondaryCta.to}
                  className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-white/30 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-accent-300 hover:text-accent-200 sm:px-7 sm:py-3.5 sm:text-[13px] sm:tracking-[0.16em]"
                >
                  {t(section.secondaryCta.label)}
                </Link>
              )}
            </div>
          )}

          {section.servicesLine && (
            <div className="mt-10 flex flex-col items-center justify-center gap-2 text-center text-sm font-medium text-white sm:mt-12 sm:flex-row">
              <Clock className="h-4 w-4 shrink-0 text-accent-300" strokeWidth={1.8} aria-hidden />
              <span>{t(section.servicesLine)}</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
