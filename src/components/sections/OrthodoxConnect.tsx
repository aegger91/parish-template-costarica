import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, HandHeart, Info, Users } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { site } from '@/content';
import type { Localized, OrthodoxConnectItem, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { formatDate } from '@/lib/format';
import { loadOrthodoxConnectFeed } from '@/lib/orthodoxConnect';
import type { OrthodoxConnectFeed } from '@/lib/orthodoxConnect';

export interface OrthodoxConnectSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
  text?: Localized;
  sampleNotice: Localized;
  joinLabel: Localized;
  joinPending: Localized;
  types: Record<OrthodoxConnectItem['type'], Localized>;
}

const TYPE_ICON = { event: CalendarDays, volunteer: Users, need: HandHeart };

function FeedCard({ item, typeLabel, isSample }: { item: OrthodoxConnectItem; typeLabel: string; isSample: boolean }) {
  const { t, ui, language } = useI18n();
  const TypeIcon = TYPE_ICON[item.type] ?? CalendarDays;
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-600">
          <TypeIcon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          {typeLabel}
        </span>
        {isSample && (
          <span className="rounded-pill border border-accent-300 bg-accent-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-700">
            {ui('sample')}
          </span>
        )}
      </div>
      {item.date && (
        <time dateTime={item.date} className="mt-4 block text-sm text-ink-500">
          {formatDate(item.date, language.locale)}
        </time>
      )}
      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-primary-900">{t(item.title)}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{t(item.summary)}</p>
    </>
  );
  const cls =
    'block h-full rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition-all hover:border-accent-300 hover:shadow-lg hover:shadow-primary-900/10 sm:p-7';
  return item.url ? (
    <a href={item.url} target="_blank" rel="noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <article className={cls}>{body}</article>
  );
}

export default function OrthodoxConnect({ section }: { section: OrthodoxConnectSection }) {
  const { t } = useI18n();
  const [feed, setFeed] = useState<OrthodoxConnectFeed | null>(null);
  const joinUrl = site.orthodoxConnect.joinUrl;

  useEffect(() => {
    let cancelled = false;
    loadOrthodoxConnectFeed().then((f) => !cancelled && setFeed(f));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section bg-primary-50" aria-labelledby={`${section.id}-title`}>
      <div className="container-px container-max">
        <Reveal>
          <div id={`${section.id}-title`}>
            <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
          </div>
          {section.text && (
            <p className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-relaxed text-ink-700 sm:text-base">
              {t(section.text)}
            </p>
          )}
          {feed?.isSample && (
            <p className="mx-auto mt-5 flex max-w-xl items-start justify-center gap-2 text-center text-[13px] text-ink-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
              {t(section.sampleNotice)}
            </p>
          )}
        </Reveal>

        {feed && feed.items.length > 0 && (
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {feed.items.map((item, i) => (
              <li key={item.id}>
                <Reveal delay={0.08 * i} className="h-full">
                  <FeedCard item={item} typeLabel={t(section.types[item.type])} isSample={feed.isSample} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          {joinUrl ? (
            <a href={joinUrl} target="_blank" rel="noreferrer" className="btn-accent">
              {t(section.joinLabel)}
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </a>
          ) : (
            <span className="inline-flex flex-col items-center gap-2">
              <span
                aria-disabled="true"
                className="btn-accent cursor-not-allowed opacity-60 hover:bg-accent-400"
              >
                {t(section.joinLabel)}
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-[12px] text-ink-500">{t(section.joinPending)}</span>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
