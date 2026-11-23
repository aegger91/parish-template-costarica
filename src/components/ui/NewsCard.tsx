import { ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/content';
import { useI18n } from '@/i18n';
import { formatDate } from '@/lib/format';

export default function NewsCard({ item, readMore }: { item: NewsItem; readMore: string }) {
  const { t, language } = useI18n();
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-primary-900/10">
      {item.image && <img src={item.image} alt="" loading="lazy" className="h-48 w-full object-cover" />}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {item.date && (
          <time dateTime={item.date} className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-600">
            {formatDate(item.date, language.locale)}
          </time>
        )}
        <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug text-primary-900">{t(item.title)}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">{t(item.summary)}</p>
        {item.url && (
          <a
            href={item.url}
            className="group mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-600"
          >
            {readMore}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
