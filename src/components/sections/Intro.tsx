import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import type { ImageRef, LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface IntroSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
  paragraphs: Localized[];
  link?: LinkRef;
  image?: ImageRef;
  caption?: Localized;
}

export default function Intro({ section }: { section: IntroSection }) {
  const { t } = useI18n();

  return (
    <section className="section bg-white">
      <div className="container-px container-max grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} align="left" />
          <div className="prose-block mt-6 text-[15px] text-ink-700 sm:text-base">
            {section.paragraphs.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
          {section.link && (
            <Link
              to={section.link.to}
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-primary-700 transition-colors hover:text-accent-600"
            >
              {t(section.link.label)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" strokeWidth={2} aria-hidden />
            </Link>
          )}
        </Reveal>

        {section.image && (
          <Reveal delay={0.15} className="relative">
            <figure className="arch-frame relative bg-primary-900 shadow-2xl shadow-primary-900/25">
              <img
                src={section.image.src}
                alt={t(section.image.alt)}
                loading="lazy"
                className="h-[320px] w-full object-cover object-top sm:h-[480px]"
              />
              {section.caption && (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 55%, rgb(var(--color-primary-950) / 0.6) 100%)' }}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 font-heading text-lg italic text-white">
                    {t(section.caption)}
                  </figcaption>
                </>
              )}
            </figure>
            <div
              aria-hidden
              className="absolute -bottom-5 -end-5 -z-10 h-full w-full border-2 border-accent-400/60"
              style={{ borderRadius: '50% 50% 0.35rem 0.35rem / 28% 28% 0.35rem 0.35rem' }}
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}
