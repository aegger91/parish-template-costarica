import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import FormNotice from '@/components/ui/FormNotice';
import type { FormState } from '@/components/ui/FormNotice';
import { Brand } from '@/components/ui/Logo';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { navigation, services, site } from '@/content';
import { useI18n } from '@/i18n';
import { telHref } from '@/lib/format';
import { EMAIL_RE, subscribeNewsletter } from '@/lib/forms';
import { donateItem } from '@/lib/nav';
import { formatTime, weekdayName } from '@/lib/time';

function Newsletter() {
  const { t, ui, lang } = useI18n();
  const f = navigation.footer;
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [invalid, setInvalid] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setState('sending');
    const result = await subscribeNewsletter(email.trim(), lang);
    setState(result.status);
    if (result.status === 'success') setEmail('');
  };

  return (
    <div>
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent-300">{t(f.newsletterHeading)}</h2>
      <p className="mt-5 text-sm leading-relaxed text-primary-200">{t(f.newsletterText)}</p>
      <form onSubmit={submit} noValidate className="mt-4">
        <label htmlFor="newsletter-email" className="sr-only">
          {ui('forms.email')}
        </label>
        <div className="flex flex-col gap-2 min-[420px]:flex-row md:flex-col 2xl:flex-row">
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={ui('forms.emailPlaceholder')}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'newsletter-error' : undefined}
            className="min-h-11 min-w-0 flex-1 rounded-pill border border-white/20 bg-white/5 px-4 text-[14px] text-white outline-none placeholder:text-primary-300 focus:border-accent-300"
          />
          <button type="submit" disabled={state === 'sending'} className="btn-accent shrink-0 px-5">
            {ui('newsletter.subscribe')}
          </button>
        </div>
        {invalid && (
          <p id="newsletter-error" className="mt-2 text-[13px] text-rose-200">
            {ui('forms.errorEmail')}
          </p>
        )}
        <FormNotice
          state={state}
          tone="dark"
          success={ui('newsletter.success')}
          notConfigured={ui('newsletter.notConfigured')}
          error={ui('forms.failed')}
        />
      </form>
      <p className="mt-3 flex items-center gap-1.5 text-[12px] text-primary-300">
        <OrthodoxIcon name="church" className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.8} />
        {ui('connect.via')}
      </p>
    </div>
  );
}

export default function Footer() {
  const { t, language } = useI18n();
  const f = navigation.footer;
  const host = site.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const newsletter = site.orthodoxConnect.newsletter.enabled;

  return (
    <footer className="bg-primary-950 text-primary-100">
      <div
        className={`container-px mx-auto grid max-w-[88rem] gap-10 py-12 sm:gap-12 sm:py-16 md:grid-cols-2 ${newsletter ? 'xl:grid-cols-4' : 'lg:grid-cols-3'}`}
      >
        <div>
          <Link to="/" className="flex items-center gap-3">
            <Brand nameClassName="break-words text-lg leading-snug sm:text-xl" />
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-primary-200">
            {site.dioceseUrl ? (
              <a href={site.dioceseUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent-200">
                {t(site.diocese)}
              </a>
            ) : (
              t(site.diocese)
            )}
          </p>
          {donateItem && (
            <>
              <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-accent-300">{t(f.giveHeading)}</p>
              <Link to={donateItem.to} className="btn-accent mt-4">
                <OrthodoxIcon name="candle" className="h-4 w-4" strokeWidth={1.8} />
                {t(donateItem.label)}
              </Link>
            </>
          )}
        </div>

        <div>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent-300">{t(f.visitHeading)}</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" strokeWidth={1.6} aria-hidden />
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="min-w-0 break-words transition-colors hover:text-accent-200">
                {t(site.address.singleLine)}
              </a>
            </li>
            {site.contact.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" strokeWidth={1.6} aria-hidden />
                <a href={telHref(site.contact.phone)} dir="ltr" className="transition-colors hover:text-accent-200">
                  {site.contact.phone}
                </a>
              </li>
            )}
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" strokeWidth={1.6} aria-hidden />
              <a href={`mailto:${site.contact.email}`} className="min-w-0 break-all transition-colors hover:text-accent-200">
                {site.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" strokeWidth={1.6} aria-hidden />
              <a href={site.url} className="transition-colors hover:text-accent-200">
                {host}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent-300">{t(f.scheduleHeading)}</h2>
          <ul className="mt-5 space-y-3 text-sm text-primary-200">
            {services.map((s) => (
              <li key={s.id} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="min-w-0">{t(s.name)}</span>
                <span className="shrink-0 text-end font-medium text-white">
                  {s.weekday !== undefined && `${weekdayName(s.weekday, language.locale, 'short')} `}
                  {formatTime(s.time, language.locale)}
                </span>
              </li>
            ))}
            <li className="pt-1 text-[13px] italic text-primary-300">{t(f.scheduleNote)}</li>
          </ul>
          <Link
            to={f.scheduleLink.to}
            className="mt-6 inline-flex min-h-11 items-center rounded-pill border border-accent-400/60 px-5 py-2 text-[12px] font-medium uppercase tracking-[0.16em] text-accent-200 transition-colors hover:bg-accent-400/10"
          >
            {t(f.scheduleLink.label)}
          </Link>
        </div>

        {newsletter && <Newsletter />}
      </div>

      <div className="border-t border-white/10">
        <div className="container-px mx-auto flex max-w-[88rem] flex-col items-center justify-between gap-3 py-6 text-center text-[12px] text-primary-300 sm:flex-row sm:text-start">
          <p>
            © {new Date().getFullYear()} {t(site.name)}. {t(site.footer.copyright)}
          </p>
          <p>{t(site.footer.tagline)}</p>
        </div>
      </div>
    </footer>
  );
}
