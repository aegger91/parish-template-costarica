import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Navigation, PlayCircle } from 'lucide-react';
import Highlight from '@/components/ui/Highlight';
import LiveBadge from '@/components/ui/LiveBadge';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { getPage, moduleOn, site } from '@/content';
import type { LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { commemorations, fastNote, feastsOn, isLive, liveService, nextFeast, upcomingServices, usesOrthocalCycle } from '@/lib/calendar';
import { useOrthocalDays, useParishNow } from '@/lib/hooks';
import { formatDay, formatTime, julianFromJdn } from '@/lib/time';
import { dayLabel } from '@/lib/when';

export interface HeroSection extends SectionBase {
  image: string;
  title: Localized;
  eyebrow?: Localized;
  tagline?: Localized;
  primaryCta?: LinkRef;
  secondaryCta?: LinkRef;
  /** Number of upcoming services in the at-a-glance panel. 0 hides the panel. */
  upcoming?: number;
  /** Small link to the commemoration notes page, when that module is on. */
  commemorationShortcut?: boolean;
}

function GlanceCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-primary-950/55 p-5 text-start backdrop-blur-md sm:p-6">
      <p className="eyebrow flex items-center gap-2 text-[11px] text-accent-300">
        {icon}
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Today() {
  const { t, ui, lang, language } = useI18n();
  const now = useParishNow();
  const style = site.calendar.style;
  const { days } = useOrthocalDays(style, now.jdn, now.jdn);
  const day = days.get(now.jdn);
  const feast = feastsOn(style, now.jdn)[0];
  const saint = site.calendar.saintsLanguages.includes(lang) ? commemorations(day, style)[0] : undefined;
  const upcoming = feast ? null : nextFeast(style, now.jdn + 1);
  const oldDate = julianFromJdn(now.jdn);
  return (
    <>
      <p className="font-heading text-xl font-semibold leading-snug text-white">
        {formatDay(now.jdn, language.locale, { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
      {style === 'julian' && (
        <p className="text-[13px] text-primary-200">
          {ui('calendar.oldStyleDate', {
            date: new Intl.DateTimeFormat(language.locale, { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
              new Date(Date.UTC(2001, oldDate.month - 1, oldDate.day)),
            ),
          })}
        </p>
      )}
      {feast ? (
        <p className="mt-3 flex items-start gap-2 text-[15px] font-semibold text-accent-200">
          <OrthodoxIcon name="cross" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          {t(feast.name)}
        </p>
      ) : saint ? (
        <p className="mt-3 line-clamp-2 text-[14px] leading-snug text-primary-100">{saint}</p>
      ) : null}
      {day && usesOrthocalCycle(style) && <p className="mt-2 text-[13px] text-primary-200">{fastNote(day, ui)}</p>}
      {upcoming && (
        <p className="mt-3 text-[13px] text-primary-200">
          {ui('hero.nextFeast')}: <span className="text-white">{t(upcoming.feast.name)}</span>,{' '}
          {dayLabel(upcoming.jdn, now.jdn, language.locale, ui)}
        </p>
      )}
    </>
  );
}

function Upcoming({ count }: { count: number }) {
  const { t, ui, language } = useI18n();
  const now = useParishNow();
  const style = site.calendar.style;
  const live = liveService(now);
  const list = upcomingServices(now, 10).slice(0, count);
  if (!list.length) return <p className="text-[14px] text-primary-200">{ui('hero.noServices')}</p>;
  return (
    <ul className="space-y-2.5">
      {list.map((o) => {
        const isOn = live && live.service.id === o.service.id && live.jdn === o.jdn;
        const feast = feastsOn(style, o.jdn)[0];
        return (
          <li key={`${o.jdn}-${o.service.id}`} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
            <span className="min-w-0">
              <span className={`block text-[15px] font-medium leading-snug ${o.service.highlight || feast ? 'text-accent-200' : 'text-white'}`}>
                {t(o.service.name)}
              </span>
              {feast && <span className="block text-[12px] text-accent-300">{t(feast.name)}</span>}
            </span>
            <span className="shrink-0 text-end text-[13px] text-primary-100">
              {isOn ? (
                <span className="font-semibold text-rose-300">{ui('live.now')}</span>
              ) : (
                <>
                  {dayLabel(o.jdn, now.jdn, language.locale, ui)}
                  <span className="block font-semibold text-white">{formatTime(o.service.time, language.locale)}</span>
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function Hero({ section }: { section: HeroSection }) {
  const { t, ui } = useI18n();
  const now = useParishNow();
  const live = isLive(now);
  const livestream = getPage('livestream');
  const services = getPage('services');
  const zapiski = getPage('zapiski');
  const upcoming = section.upcoming ?? 3;

  return (
    <section className="relative overflow-hidden bg-primary-950">
      <img src={section.image} alt="" {...{ fetchpriority: 'high' }} className="absolute inset-0 h-full w-full object-cover" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--color-primary-950) / 0.66) 0%, rgb(var(--color-primary-950) / 0.5) 45%, rgb(var(--color-primary-900) / 0.92) 100%)',
        }}
      />

      <div className="container-px relative mx-auto max-w-[80rem] pb-12 pt-28 sm:pb-16 sm:pt-36 lg:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          {live && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <LiveBadge />
              {livestream && (
                <Link to={livestream.path} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white underline-offset-4 hover:underline">
                  <PlayCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                  {ui('live.watch')}
                </Link>
              )}
            </div>
          )}
          <h1 className="font-heading text-[40px] font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
            <Highlight text={t(section.title)} />
          </h1>
          {section.eyebrow && <p className="eyebrow mt-6 text-[11px] text-accent-300 sm:text-[12px]">{t(section.eyebrow)}</p>}
          {section.tagline && <p className="mt-5 text-base leading-relaxed text-primary-100 sm:text-lg">{t(section.tagline)}</p>}

          {(section.primaryCta || section.secondaryCta) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {section.primaryCta && (
                <Link to={section.primaryCta.to} className="btn-accent group sm:px-7 sm:py-3.5 sm:text-[13px]">
                  {t(section.primaryCta.label)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" strokeWidth={2} aria-hidden />
                </Link>
              )}
              {section.secondaryCta && (
                <Link to={section.secondaryCta.to} className="btn-ghost-light sm:px-7 sm:py-3.5 sm:text-[13px]">
                  {t(section.secondaryCta.label)}
                </Link>
              )}
            </div>
          )}
          {section.commemorationShortcut && moduleOn('zapiski') && zapiski && (
            <Link
              to={zapiski.path}
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-accent-200 underline-offset-4 hover:underline"
            >
              <OrthodoxIcon name="note" className="h-4 w-4" strokeWidth={1.8} />
              {ui('hero.commemoration')}
            </Link>
          )}
        </motion.div>

        {upcoming > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3 lg:mt-16"
          >
            <GlanceCard title={ui('hero.upcoming')} icon={<Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />}>
              <Upcoming count={upcoming} />
              {services && (
                <Link to={services.path} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-200 hover:text-accent-100">
                  {ui('hero.fullSchedule')}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" strokeWidth={2} aria-hidden />
                </Link>
              )}
            </GlanceCard>
            <GlanceCard title={ui('today')} icon={<OrthodoxIcon name="cross" className="h-3.5 w-3.5" strokeWidth={2} />}>
              <Today />
            </GlanceCard>
            <GlanceCard title={ui('hero.findUs')} icon={<MapPin className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />}>
              <address className="text-[15px] not-italic leading-relaxed text-white">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region}
              </address>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-accent mt-4 min-h-10 px-5 py-2"
                aria-label={`${ui('hero.directions')} (${ui('opensInNewTab')})`}
              >
                <Navigation className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                {ui('hero.directions')}
              </a>
            </GlanceCard>
          </motion.div>
        )}
      </div>
    </section>
  );
}
