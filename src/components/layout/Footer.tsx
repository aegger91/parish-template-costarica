import { Link } from 'react-router-dom';
import { Globe, HandHeart, Mail, MapPin, Phone } from 'lucide-react';
import { navigation, services, site } from '@/content';
import { useI18n } from '@/i18n';
import { telHref } from '@/lib/format';

export default function Footer() {
  const { t } = useI18n();
  const f = navigation.footer;
  const host = site.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <footer className="bg-primary-950 text-primary-100">
      <div className="container-px container-max grid gap-10 py-12 sm:gap-12 sm:py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent-400/50 bg-white">
              <img src={site.logo.src} alt="" width={48} height={48} loading="lazy" className="h-full w-full object-cover" />
            </span>
            <p className="min-w-0 break-words font-serif text-lg leading-snug text-white sm:text-xl">{t(site.name)}</p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-primary-200">
            {site.dioceseUrl ? (
              <a href={site.dioceseUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent-200">
                {t(site.diocese)}
              </a>
            ) : (
              t(site.diocese)
            )}
          </p>
          <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-accent-300">{t(f.giveHeading)}</p>
          <Link to={navigation.donate.to} className="btn-accent mt-4">
            <HandHeart className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            {t(navigation.donate.label)}
          </Link>
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
                <a href={telHref(site.contact.phone)} className="transition-colors hover:text-accent-200">
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
                <span className="shrink-0 font-medium text-white">{s.display}</span>
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
      </div>

      <div className="border-t border-white/10">
        <div className="container-px container-max flex flex-col items-center justify-between gap-3 py-6 text-center text-[12px] text-primary-300 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {t(site.name)}. {t(site.footer.copyright)}
          </p>
          <p>{t(site.footer.tagline)}</p>
        </div>
      </div>
    </footer>
  );
}
