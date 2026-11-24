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
    <section className="section">
      <div className="container-px container-max grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} align="left" />
          <div className="prose-block mt-6 text-[15px] text-ink-700 sm:text-base">
            {section.paragraphs.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
          {section.link && (
            <Link to={section.link.to} className="btn-outline group mt-8">
              {t(section.link.label)}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180" strokeWidth={1.8} aria-hidden />
            </Link>
          )}
        </Reveal>

        {section.image && (
          <Reveal delay={0.1}>
            <figure>
              <div className="overflow-hidden rounded-2xl bg-cream-deep">
                <img
                  src={section.image.src}
                  alt={t(section.image.alt)}
                  loading="lazy"
                  className="h-[320px] w-full object-cover object-[50%_20%] sm:h-[440px]"
                />
              </div>
              {section.caption && <figcaption className="mt-3 text-[13px] text-ink-500">{t(section.caption)}</figcaption>}
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
