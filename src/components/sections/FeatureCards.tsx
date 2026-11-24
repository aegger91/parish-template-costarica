import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { getPage } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface FeatureCard {
  id: string;
  icon: string;
  page?: string;
  anchor?: string;
  to?: string;
  title: Localized;
  text: Localized;
}

export interface FeatureCardsSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
  cards: FeatureCard[];
}

export default function FeatureCards({ section }: { section: FeatureCardsSection }) {
  const { t, ui } = useI18n();
  const cards = section.cards.flatMap((card) => {
    if (!card.page) return card.to ? [{ ...card, href: card.to }] : [];
    const target = getPage(card.page);
    return target ? [{ ...card, href: `${target.path}${card.anchor ? `#${card.anchor}` : ''}` }] : [];
  });
  if (!cards.length) return null;

  return (
    <section className="section bg-primary-50/50">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className={`mt-10 grid gap-4 ${cards.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={0.06 * i} className="h-full">
              <Link to={card.href} className="card group flex h-full flex-col p-7 transition-colors hover:border-accent-400 sm:p-8">
                <h3 className="font-heading text-2xl font-semibold text-primary-900">{t(card.title)}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">{t(card.text)}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-accent-700">
                  {ui('learnMore')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180" strokeWidth={2} aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
