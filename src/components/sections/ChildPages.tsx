import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { navTrail } from '@/lib/nav';
import type { ResolvedNavItem } from '@/lib/nav';
import { usePage } from '@/pages/PageContext';

export interface ChildPagesSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
}

/**
 * Cards for the pages next to or under this one in the menu, so a parent page always lists
 * whatever pages the builder has added beneath it.
 */
export default function ChildPages({ section }: { section: ChildPagesSection }) {
  const { t, ui } = useI18n();
  const page = usePage();
  if (!page) return null;
  const trail = navTrail(page.id);
  const self = trail[trail.length - 1];
  const parent = trail[trail.length - 2];
  const items: ResolvedNavItem[] = (self?.children.length ? self.children : (parent?.children ?? [])).filter((i) => i.page?.id !== page.id);
  if (!items.length) return null;

  return (
    <section className="section">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className={`mt-12 grid gap-6 sm:grid-cols-2 ${items.length % 3 === 0 || items.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
          {items.map((item, i) => (
            <Reveal key={item.id} delay={0.06 * i}>
              <Link
                to={item.to}
                className="card group flex h-full flex-col p-6 lift sm:p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-400/60 text-accent-600 transition-colors group-hover:border-accent-500 group-hover:bg-accent-50">
                  <Icon name={item.page?.icon ?? 'church'} className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-heading text-[23px] font-normal text-ink-900">{t(item.label)}</h3>
                {item.page?.summary && <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-700">{t(item.page.summary)}</p>}
                <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-primary-700 underline-offset-4 group-hover:underline">
                  {ui('learnMore')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" strokeWidth={2} aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
