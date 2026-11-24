import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Highlight from '@/components/ui/Highlight';
import LiveBadge from '@/components/ui/LiveBadge';
import { getPage } from '@/content';
import type { LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { isLive } from '@/lib/calendar';
import { useParishNow } from '@/lib/hooks';

export interface HeroSection extends SectionBase {
  image: string;
  title: Localized;
  eyebrow?: Localized;
  tagline?: Localized;
  primaryCta?: LinkRef;
  secondaryCta?: LinkRef;
  /** Kept for content compatibility; homepage hero no longer embeds glance panels. */
  upcoming?: number;
  commemorationShortcut?: boolean;
}

/** Clean full-bleed hero: photo, dark overlay, title, one line, two buttons. */
export default function Hero({ section }: { section: HeroSection }) {
  const { t, ui } = useI18n();
  const now = useParishNow();
  const live = isLive(now);
  const livestream = getPage('livestream');

  return (
    <section className="relative overflow-hidden bg-primary-950">
      <img
        src={section.image}
        alt=""
        {...{ fetchpriority: 'high' }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div aria-hidden className="hero-overlay absolute inset-0" />

      <div className="container-px relative mx-auto flex min-h-[78vh] max-w-container flex-col justify-center py-28 sm:min-h-[72vh] sm:py-36 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center"
        >
          {live && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <LiveBadge />
              {livestream && (
                <Link to={livestream.path} className="text-[14px] font-semibold text-white underline-offset-4 hover:underline">
                  {ui('live.watch')}
                </Link>
              )}
            </div>
          )}

          <h1 className="font-heading text-[2.5rem] font-semibold leading-[1.15] text-white sm:text-5xl lg:text-6xl">
            <Highlight text={t(section.title)} />
          </h1>
          {section.tagline && <p className="mt-5 text-base text-white/85 sm:text-lg">{t(section.tagline)}</p>}

          {(section.primaryCta || section.secondaryCta) && (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {section.primaryCta && (
                <Link to={section.primaryCta.to} className="btn-accent group">
                  {t(section.primaryCta.label)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" strokeWidth={2} aria-hidden />
                </Link>
              )}
              {section.secondaryCta && (
                <Link to={section.secondaryCta.to} className="btn-ghost-light">
                  {t(section.secondaryCta.label)}
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
