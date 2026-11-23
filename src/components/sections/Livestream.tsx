import { ExternalLink } from 'lucide-react';
import LiveBadge from '@/components/ui/LiveBadge';
import OrthodoxCross from '@/components/ui/OrthodoxCross';
import Reveal from '@/components/ui/Reveal';
import { site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { isLive, upcomingServices } from '@/lib/calendar';
import { useParishNow } from '@/lib/hooks';
import { formatTime } from '@/lib/time';
import { dayLabel } from '@/lib/when';

export interface LivestreamSection extends SectionBase {
  title: Localized;
  text?: Localized;
}

export default function Livestream({ section }: { section: LivestreamSection }) {
  const { t, ui, language } = useI18n();
  const now = useParishNow();
  const live = isLive(now);
  const nextStreamed = upcomingServices(now, 14).find((o) => o.service.streamed && !(o.jdn === now.jdn && o.start <= now.minutes));
  const { embedUrl, watchUrl, providerLabel } = site.livestream;

  return (
    <section className="section bg-white">
      <div className="container-px mx-auto grid max-w-[80rem] gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        <Reveal>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-primary-950 shadow-2xl shadow-primary-900/25">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={t(section.title)}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <OrthodoxCross className="h-14 w-14 text-accent-300/80" strokeWidth={1.4} />
                <p className="max-w-sm font-heading text-xl text-white sm:text-2xl">{ui('livestream.placeholder')}</p>
                <p className="max-w-sm text-[13px] text-primary-200">{ui('livestream.placeholderHelp')}</p>
              </div>
            )}
            {live && (
              <span className="absolute start-4 top-4">
                <LiveBadge />
              </span>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="heading-section text-primary-900">{t(section.title)}</h2>
          <div className="accent-rule mt-5" />
          {section.text && <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{t(section.text)}</p>}
          <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5">
            <p className="eyebrow text-[11px] text-accent-600">{live ? ui('live.now') : ui('livestream.next')}</p>
            {nextStreamed && !live ? (
              <p className="mt-2 text-[15px] text-primary-900">
                <span className="font-semibold">{t(nextStreamed.service.name)}</span>
                <br />
                {dayLabel(nextStreamed.jdn, now.jdn, language.locale, ui)}, {formatTime(nextStreamed.service.time, language.locale)}
              </p>
            ) : live ? (
              <p className="mt-2 text-[15px] text-primary-900">{ui('livestream.joinUs')}</p>
            ) : (
              <p className="mt-2 text-[15px] text-ink-700">{ui('livestream.none')}</p>
            )}
          </div>
          {watchUrl && (
            <a href={watchUrl} target="_blank" rel="noreferrer" className="btn-accent mt-6">
              {ui('livestream.watchOn', { provider: providerLabel })}
              <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden />
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
