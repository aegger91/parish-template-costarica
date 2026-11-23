import NewsCard from '@/components/ui/NewsCard';
import Reveal from '@/components/ui/Reveal';
import { NoticeCard } from '@/components/sections/ComingSoon';
import { news } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface NewsListSection extends SectionBase {
  emptyTitle: Localized;
  emptyText: Localized;
  readMore: Localized;
  limit?: number;
}

export default function NewsList({ section }: { section: NewsListSection }) {
  const { t } = useI18n();
  const items = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, section.limit ?? news.length);

  if (items.length === 0) {
    return (
      <section className="bg-white py-20 sm:py-32">
        <div className="container-px container-max">
          <Reveal>
            <NoticeCard title={t(section.emptyTitle)} text={t(section.emptyText)} />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white">
      <div className="container-px container-max grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={0.06 * i}>
            <NewsCard item={item} readMore={t(section.readMore)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
