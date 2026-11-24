import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import LiveBadge from '@/components/ui/LiveBadge';
import Reveal from '@/components/ui/Reveal';
import ServiceDetail from '@/components/ui/ServiceDetail';
import { getPage, moduleOn, site } from '@/content';
import type { LinkRef, Localized, ModuleId, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { feastsOn, isLive, liveService, upcomingServices } from '@/lib/calendar';
import type { ServiceOccurrence } from '@/lib/calendar';
import { useParishNow } from '@/lib/hooks';
import { formatTime } from '@/lib/time';
import { dayLabel } from '@/lib/when';

export interface HeroTile {
  id: string;
  /** olive: solid tile. ochre: wide gold tile, with a faded photo when "image" is set. */
  tone: 'olive' | 'ochre';
  title: Localized;
  text?: Localized;
  /** Shows the parish calendar (Old or New Calendar) above the text. */
  calendarNote?: boolean;
  /** Id of the page the button opens. The tile is hidden when that page is switched off. */
  page: string;
  button: Localized;
  image?: string;
  module?: ModuleId;
}

export interface HeroSection extends SectionBase {
  /** Photo of the tall tile. */
  image: string;
  /** Title of the tall photo tile. */
  title: Localized;
  tagline?: Localized;
  primaryCta?: LinkRef;
  /** Number of upcoming services listed in the tall tile. */
  upcoming?: number;
  tiles?: HeroTile[];
}

function UpcomingList({ count }: { count: number }) {
  const { t, ui, language } = useI18n();
  const now = useParishNow();
  const live = liveService(now);
  const list = upcomingServices(now, 10).slice(0, count);
  const [selected, setSelected] = useState<ServiceOccurrence | null>(null);
  if (!list.length) return <p className="text-[14.5px] text-white/85">{ui('hero.noServices')}</p>;
  return (
    <>
      <ul className="divide-y divide-white/20 border-y border-white/20">
        {list.map((o) => {
          const isOn = live && live.service.id === o.service.id && live.jdn === o.jdn;
          const feast = feastsOn(site.calendar.style, o.jdn)[0];
          const name = t(o.service.name);
          return (
            <li key={`${o.jdn}-${o.service.id}`}>
              <button
                type="button"
                onClick={() => setSelected(o)}
                className="group/item flex w-full items-center gap-4 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={ui('schedule.openDetails', { name })}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] leading-snug text-white underline-offset-4 group-hover/item:underline">{name}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-white/75">
                    {isOn ? (
                      <span className="font-medium text-white">{ui('live.now')}</span>
                    ) : (
                      <>
                        {dayLabel(o.jdn, now.jdn, language.locale, ui)}, <span dir="ltr">{formatTime(o.service.time, language.locale)}</span>
                      </>
                    )}
                    {feast && <span className="text-accent-200"> · {t(feast.name)}</span>}
                  </span>
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-white/60 transition-transform duration-200 group-hover/item:translate-x-0.5 rtl:rotate-180"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
      <ServiceDetail occurrence={selected} open={!!selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Tile({ tile, wide }: { tile: HeroTile; wide: boolean }) {
  const { t, ui } = useI18n();
  const page = getPage(tile.page)!;
  const line = tile.text && t(tile.text);
  return (
    <article
      className={`tile ${tile.tone === 'ochre' ? 'tile-ochre' : 'tile-olive'} h-full min-h-[13.5rem] p-7 sm:p-8 lg:p-6 xl:p-7`}
    >
      {tile.image && (
        <>
          <img src={tile.image} alt="" loading="lazy" className="tile-image object-[50%_35%] opacity-60 mix-blend-luminosity" />
          <div aria-hidden className={tile.tone === 'ochre' ? 'tile-tint-ochre' : 'tile-tint-olive'} />
        </>
      )}
      <h2 className="heading-tile max-w-[18ch]">{t(tile.title)}</h2>
      {tile.calendarNote && (
        <p className="eyebrow mt-3 text-white/85">{ui(`calendar.styles.${site.calendar.style}`)}</p>
      )}
      {line && <p className={`mt-3 text-[14.5px] leading-relaxed text-white/90 ${wide ? 'max-w-md' : ''}`}>{line}</p>}
      <div className="mt-auto pt-6">
        <Link to={page.path} className="btn-ghost-light min-h-10 px-5 py-2 text-[13.5px]">
          {t(tile.button)}
        </Link>
      </div>
    </article>
  );
}

export default function Hero({ section }: { section: HeroSection }) {
  const { t, ui } = useI18n();
  const now = useParishNow();
  const live = isLive(now);
  const livestream = getPage('livestream');
  const tiles = (section.tiles ?? []).filter((tile) => getPage(tile.page) && (!tile.module || moduleOn(tile.module)));
  const small = tiles.filter((tile) => tile.tone === 'olive');
  const wide = tiles.filter((tile) => tile.tone !== 'olive');

  return (
    <section className="container-px mx-auto max-w-container pb-6 pt-6 sm:pt-10 lg:pt-12">
      <h1 className="sr-only">{t(site.name)}</h1>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Reveal className="h-full">
          <article className="tile tile-photo h-full min-h-[31rem] p-7 sm:min-h-[30rem] sm:p-9 lg:min-h-[37rem]">
            <img
              src={section.image}
              alt=""
              {...{ fetchpriority: 'high' }}
              className="tile-image object-[50%_30%]"
            />
            <div aria-hidden className="tile-shade" />
            {live && (
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <LiveBadge />
                {livestream && (
                  <Link to={livestream.path} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white underline-offset-4 hover:underline">
                    <PlayCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                    {ui('live.watch')}
                  </Link>
                )}
              </div>
            )}
            <h2 className="font-heading text-[32px] font-normal leading-[1.15] sm:text-[38px]">{t(section.title)}</h2>
            {section.tagline && <p className="mt-3 text-[15px] text-white/90">{t(section.tagline)}</p>}
            <div className="mt-6 max-w-[26rem]">
              <UpcomingList count={section.upcoming ?? 4} />
            </div>
            {section.primaryCta && (
              <div className="mt-auto pt-7">
                <Link to={section.primaryCta.to} className="btn-ghost-light min-h-10 px-5 py-2 text-[13.5px]">
                  {t(section.primaryCta.label)}
                </Link>
              </div>
            )}
          </article>
        </Reveal>

        {tiles.length > 0 && (
          <div className={`grid gap-4 sm:grid-cols-2 lg:gap-5 ${small.length && wide.length ? 'lg:grid-rows-2' : ''}`}>
            {small.map((tile, i) => (
              <Reveal key={tile.id} delay={0.06 * (i + 1)} className={`h-full ${small.length % 2 && i === small.length - 1 ? 'sm:col-span-2' : ''}`}>
                <Tile tile={tile} wide={small.length % 2 === 1 && i === small.length - 1} />
              </Reveal>
            ))}
            {wide.map((tile, i) => (
              <Reveal key={tile.id} delay={0.06 * (small.length + i + 1)} className="h-full sm:col-span-2">
                <Tile tile={tile} wide />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
