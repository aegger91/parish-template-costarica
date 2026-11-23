import { ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/content';
import { newsCategories } from '@/content';
import { useI18n } from '@/i18n';
import { formatDate } from '@/lib/format';

export default function NewsCard({ item }: { item: NewsItem }) {
  const { t, ui, language } = useI18n();
  const category = newsCategories.find((c) => c.id === item.category);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-primary-900/10">
      {item.image && <img src={item.image} alt="" loading="lazy" className="h-48 w-full object-cover" />}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.14em]">
          {category && <span className="rounded-pill bg-primary-50 px-2.5 py-0.5 text-primary-700">{t(category.label)}</span>}
          {item.date && (
            <time dateTime={item.date} className="text-accent-600">
              {formatDate(item.date, language.locale)}
            </time>
          )}
        </p>
        <h3 className="mt-3 font-heading text-2xl font-semibold leading-snug text-primary-900">{t(item.title)}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">{t(item.summary)}</p>
        {item.url && (
          <a href={item.url} className="group mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-600">
            {ui('readMore')}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180" strokeWidth={2} aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
