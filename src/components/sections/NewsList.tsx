import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NoticeCard } from '@/components/sections/ComingSoon';
import FilterChips from '@/components/ui/FilterChips';
import NewsCard from '@/components/ui/NewsCard';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { getPage, news, newsCategories } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface NewsListSection extends SectionBase {
  eyebrow?: Localized;
  title?: Localized;
  /** Show only the newest few, with a link to the news page (for the home page). */
  limit?: number;
  emptyTitle: Localized;
  emptyText: Localized;
}

export default function NewsList({ section }: { section: NewsListSection }) {
  const { t, ui } = useI18n();
  const [category, setCategory] = useState('');
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = category ? sorted.filter((n) => n.category === category) : sorted;
  const items = section.limit ? filtered.slice(0, section.limit) : filtered;
  const newsPage = getPage('news');

  return (
    <section className={`section ${section.limit ? 'bg-primary-50' : 'bg-white'}`}>
      <div className="container-px container-max">
        {section.title && (
          <Reveal>
            <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
          </Reveal>
        )}
        {!section.limit && news.length > 0 && (
          <div className={section.title ? 'mt-10' : ''}>
            <FilterChips categories={newsCategories} value={category} onChange={setCategory} label={ui('news.categories')} />
          </div>
        )}
        {items.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={0.06 * (i % 3)} className="h-full">
                <NewsCard item={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <NoticeCard title={t(section.emptyTitle)} text={t(section.emptyText)} />
          </div>
        )}
        {section.limit && newsPage && news.length > section.limit && (
          <div className="mt-10 text-center">
            <Link to={newsPage.path} className="btn-outline">
              {ui('news.all')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
