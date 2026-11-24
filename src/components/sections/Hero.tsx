import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Navigation, PlayCircle } from 'lucide-react';
import Highlight from '@/components/ui/Highlight';
import LiveBadge from '@/components/ui/LiveBadge';
import OrnamentBand from '@/components/ui/OrnamentBand';
import OrthodoxCross from '@/components/ui/OrthodoxCross';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import ServiceDetail from '@/components/ui/ServiceDetail';
import { getPage, moduleOn, site } from '@/content';
import type { LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { commemorations, fastNote, feastsOn, isLive, liveService, nextFeast, upcomingServices, usesOrthocalCycle } from '@/lib/calendar';
import type { ServiceOccurrence } from '@/lib/calendar';
import { isOldCalendar } from '@/lib/calendarStyle';
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
    <div className="panel-kiot p-5 text-start sm:p-6">
      <p className="eyebrow flex items-center gap-2 text-[11px] text-accent-700">
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
  const civil = formatDay(now.jdn, language.locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const oldDate = julianFromJdn(now.jdn);
  const oldShort = new Intl.DateTimeFormat(language.locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2001, oldDate.month - 1, oldDate.day)),
  );
  const civilShort = formatDay(now.jdn, language.locale, { day: 'numeric', month: 'short' });
  return (
    <>
      <p className="font-heading text-xl font-semibold leading-snug text-primary-900">
        {isOldCalendar(style) ? ui('calendar.civilWithOldStyle', { civil: `${civil.split(',')[0]}, ${civilShort}`, old: oldShort }) : civil}
      </p>
      {feast ? (
        <p className="mt-3 flex items-start gap-2 text-[15px] font-semibold text-accent-800">
          <OrthodoxCross className="mt-0.5 h-4 w-auto shrink-0 text-accent-600" strokeWidth={1.8} />
          {t(feast.name)}
        </p>
      ) : saint ? (
        <p className="mt-3 line-clamp-2 text-[14px] leading-snug text-ink-700">{saint}</p>
      ) : null}
      {day && usesOrthocalCycle(style) && <p className="mt-2 text-[13px] text-ink-500">{fastNote(day, ui)}</p>}
      {upcoming && (
        <p className="mt-3 text-[13px] text-ink-700">
          {ui('hero.nextFeast')}: <span className="font-semibold text-primary-900">{t(upcoming.feast.name)}</span>,{' '}
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
  const [selected, setSelected] = useState<ServiceOccurrence | null>(null);
  if (!list.length) return <p className="text-[14px] text-ink-500">{ui('hero.noServices')}</p>;
  return (
    <>
      <ul className="space-y-2.5">
        {list.map((o) => {
          const isOn = live && live.service.id === o.service.id && live.jdn === o.jdn;
          const feast = feastsOn(style, o.jdn)[0];
          const name = t(o.service.name);
          return (
            <li key={`${o.jdn}-${o.service.id}`} className="border-b border-accent-300/35 pb-2.5 last:border-0 last:pb-0">
              <button
                type="button"
                onClick={() => setSelected(o)}
                className="flex w-full items-baseline justify-between gap-3 rounded-md text-start transition-colors hover:bg-accent-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                aria-label={ui('schedule.openDetails', { name })}
              >
                <span className="min-w-0">
                  <span className={`block text-[15px] font-medium leading-snug ${o.service.highlight || feast ? 'text-accent-800' : 'text-primary-900'}`}>
                    {name}
                  </span>
                  {feast && <span className="block text-[12px] text-accent-700">{t(feast.name)}</span>}
                </span>
                <span className="shrink-0 text-end text-[13px] text-ink-500">
                  {isOn ? (
                    <span className="font-semibold text-rose-700">{ui('live.now')}</span>
                  ) : (
                    <>
                      {dayLabel(o.jdn, now.jdn, language.locale, ui)}
                      <span className="block font-semibold text-primary-900">{formatTime(o.service.time, language.locale)}</span>
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <ServiceDetail occurrence={selected} open={!!selected} onClose={() => setSelected(null)} />
    </>
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
      <img
        src={section.image}
        alt=""
        {...{ fetchpriority: 'high' }}
        className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
      />
      <div aria-hidden className="hero-overlay absolute inset-0" />
      {/* Soft gold wash so the interior photo stays readable as a churchly plane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_18%,rgb(var(--color-accent-400)/0.18),transparent_65%)]"
      />

      <div className="container-px relative mx-auto max-w-[80rem] pb-10 pt-32 sm:pb-14 sm:pt-40 lg:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
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

          <p
            className="font-slavonic text-[17px] leading-snug text-accent-200 sm:text-xl"
            lang="cu"
            title={ui('hero.slavonicBlessingLabel')}
          >
            {ui('hero.slavonicBlessing')}
          </p>
          <div className="ornament-divider mt-4 text-accent-300" aria-hidden>
            <OrthodoxCross className="ornament-divider__cross h-5 w-auto" strokeWidth={1.7} />
          </div>

          <h1 className="mt-5 font-heading text-[40px] font-semibold leading-[1.18] text-white sm:text-6xl lg:text-7xl">
            <Highlight text={t(section.title)} />
          </h1>
          {section.eyebrow && <p className="eyebrow mt-6 text-[11px] text-accent-300 sm:text-[12px]">{t(section.eyebrow)}</p>}
          {section.tagline && <p className="mt-5 text-base leading-relaxed text-primary-50 sm:text-lg">{t(section.tagline)}</p>}

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
            transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
            className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3 lg:mt-14"
          >
            <GlanceCard title={ui('hero.upcoming')} icon={<Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />}>
              <Upcoming count={upcoming} />
              {services && (
                <Link to={services.path} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-800">
                  {ui('hero.fullSchedule')}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" strokeWidth={2} aria-hidden />
                </Link>
              )}
            </GlanceCard>
            <GlanceCard title={ui('today')} icon={<OrthodoxCross className="h-3.5 w-auto" strokeWidth={1.8} />}>
              <Today />
            </GlanceCard>
            <GlanceCard title={ui('hero.findUs')} icon={<MapPin className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />}>
              <address className="text-[15px] not-italic leading-relaxed text-primary-900">
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

      <OrnamentBand className="relative text-accent-300" />
    </section>
  );
}
