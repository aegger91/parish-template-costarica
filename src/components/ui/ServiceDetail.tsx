import { CalendarPlus, ExternalLink, MapPin, Navigation, PlayCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { getPage, moduleOn, site } from '@/content';
import { useI18n } from '@/i18n';
import type { ServiceOccurrence } from '@/lib/calendar';
import { isOldCalendar } from '@/lib/calendarStyle';
import { buildIcs, downloadIcs, googleCalendarUrl } from '@/lib/ics';
import { formatDay, formatTime, julianFromJdn } from '@/lib/time';

function civilWithOldStyle(jdn: number, locale: string, ui: (path: string, vars?: Record<string, string>) => string): string {
  const civil = formatDay(jdn, locale, { month: 'short', day: 'numeric' });
  if (!isOldCalendar(site.calendar.style)) {
    return formatDay(jdn, locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  const j = julianFromJdn(jdn);
  const old = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2001, j.month - 1, j.day)),
  );
  const year = formatDay(jdn, locale, { year: 'numeric' });
  const weekday = formatDay(jdn, locale, { weekday: 'long' });
  return `${weekday}, ${ui('calendar.civilWithOldStyle', { civil, old })} ${year}`;
}

/** Detail panel for a schedule row: name, date, time, place, note, calendar / directions / livestream. */
export default function ServiceDetail({
  occurrence,
  open,
  onClose,
}: {
  occurrence: ServiceOccurrence | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t, ui, language } = useI18n();
  if (!occurrence) return null;

  const title = t(occurrence.service.name);
  const place = t(site.address.singleLine);
  const dateLabel = civilWithOldStyle(occurrence.jdn, language.locale, ui);
  const timeLabel = formatTime(occurrence.service.time, language.locale);
  const note = ui('schedule.detailNote');
  const description = `${dateLabel} · ${timeLabel}\n${place}\n${note}`;
  const livestream = getPage('livestream');
  const showLive = occurrence.service.streamed && moduleOn('livestream') && (site.livestream.watchUrl || livestream);

  const addIcs = () => {
    downloadIcs(
      `${occurrence.service.id}-${occurrence.jdn}`,
      buildIcs(occurrence, title, description, place),
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="pe-8">
        <p className="eyebrow text-accent-700">{ui('schedule.detailEyebrow')}</p>
        <h2 className="mt-2 font-heading text-[23px] font-normal text-ink-900 sm:text-3xl">{title}</h2>
        <div className="accent-rule mt-5" />
      </div>

      <dl className="mt-6 space-y-4 text-[15px]">
        <div>
          <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary-700">{ui('schedule.date')}</dt>
          <dd className="mt-1 text-ink-900">{dateLabel}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary-700">{ui('schedule.time')}</dt>
          <dd className="mt-1 text-ink-900">
            <time dateTime={occurrence.service.time}>{timeLabel}</time>
          </dd>
        </div>
        <div>
          <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary-700">{ui('schedule.place')}</dt>
          <dd className="mt-1 flex items-start gap-2 text-ink-900">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
            <span>{place}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary-700">{ui('schedule.note')}</dt>
          <dd className="mt-1 text-ink-700">{note}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={addIcs} className="btn-accent">
          <CalendarPlus className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          {ui('schedule.addToCalendar')}
        </button>
        <a
          href={googleCalendarUrl(occurrence, title, description, place)}
          target="_blank"
          rel="noreferrer"
          className="btn-outline"
          aria-label={`${ui('schedule.googleCalendar')} (${ui('opensInNewTab')})`}
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          {ui('schedule.googleCalendar')}
        </a>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-outline"
          aria-label={`${ui('hero.directions')} (${ui('opensInNewTab')})`}
        >
          <Navigation className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          {ui('hero.directions')}
        </a>
        {showLive && (
          <a
            href={site.livestream.watchUrl || livestream!.path}
            target={site.livestream.watchUrl ? '_blank' : undefined}
            rel={site.livestream.watchUrl ? 'noreferrer' : undefined}
            className="btn-primary"
          >
            <PlayCircle className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            {ui('live.watch')}
          </a>
        )}
      </div>

      {occurrence.service.streamed && moduleOn('livestream') && (
        <p className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-rose-800">
          <OrthodoxIcon name="cross" className="h-3.5 w-3.5" strokeWidth={2} />
          {ui('live.streamed')}
        </p>
      )}
    </Modal>
  );
}
