import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface FeatureCard {
  id: string;
  icon: string;
  to: string;
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

  return (
    <section className="section bg-primary-50">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {section.cards.map((card, i) => (
            <Reveal key={card.id} delay={0.1 * i}>
              <Link
                to={card.to}
                className="group block h-full rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-primary-900/10 sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-900 text-accent-300 transition-colors group-hover:bg-accent-400 group-hover:text-primary-900">
                  <Icon name={card.icon} className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-primary-900">{t(card.title)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{t(card.text)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-600">
                  {ui('learnMore')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
