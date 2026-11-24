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
      <div className={`container-px container-max grid items-center gap-10 lg:gap-14 ${section.image ? 'lg:grid-cols-2' : ''}`}>
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} align={section.image ? 'left' : 'center'} />
          <div className={`prose-block mt-6 text-[15px] text-ink-700 sm:text-base ${section.image ? '' : 'mx-auto max-w-2xl text-center'}`}>
            {section.paragraphs.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
          {section.link && (
            <Link
              to={section.link.to}
              className={`group mt-8 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-accent-700 transition-colors hover:text-accent-800 ${
                section.image ? '' : 'mx-auto'
              }`}
            >
              {t(section.link.label)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" strokeWidth={2} aria-hidden />
            </Link>
          )}
        </Reveal>

        {section.image && (
          <Reveal delay={0.1}>
            <figure className="overflow-hidden rounded-[var(--radius-card)] border border-primary-200 bg-primary-50">
              <img
                src={section.image.src}
                alt={t(section.image.alt)}
                loading="lazy"
                className="h-[280px] w-full object-cover object-top sm:h-[400px]"
              />
              {section.caption && (
                <figcaption className="border-t border-primary-100 px-5 py-3 text-center text-[14px] text-ink-500">{t(section.caption)}</figcaption>
              )}
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
