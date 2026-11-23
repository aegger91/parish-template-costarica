import { Mail, MapPin, Phone } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { clergy, site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { telHref } from '@/lib/format';

export interface ContactCardsSection extends SectionBase {
  emailTitle: Localized;
  addressTitle: Localized;
  mapLabel: Localized;
  directTitle?: Localized;
  showDirectContacts?: boolean;
}

function CardTitle({ icon: IconCmp, children }: { icon: typeof Mail; children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-900 text-accent-300">
        <IconCmp className="h-5 w-5" strokeWidth={1.6} aria-hidden />
      </span>
      <h2 className="font-heading text-xl font-semibold text-primary-900">{children}</h2>
    </div>
  );
}

export default function ContactCards({ section }: { section: ContactCardsSection }) {
  const { t, ui } = useI18n();
  const a = site.address;

  return (
    <section className="section bg-primary-50">
      <div className="container-px container-max">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
              <CardTitle icon={Mail}>{t(section.emailTitle)}</CardTitle>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-5 block break-all text-lg font-medium text-primary-900 underline-offset-4 hover:text-accent-600 hover:underline"
              >
                {site.contact.email}
              </a>
              {site.contact.phone && (
                <a
                  href={telHref(site.contact.phone)}
                  className="mt-3 flex items-center gap-2 text-[15px] text-ink-700 hover:text-primary-900"
                >
                  <Phone className="h-4 w-4 text-accent-600" strokeWidth={1.8} aria-hidden />
                  {site.contact.phone}
                </a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
              <CardTitle icon={MapPin}>{t(section.addressTitle)}</CardTitle>
              <address className="mt-5 text-[15px] not-italic leading-relaxed text-ink-700">
                {a.street}
                <br />
                {a.locality}, {a.region}
                <br />
                {a.country}
              </address>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t(section.mapLabel)} (${ui('opensInNewTab')})`}
                className="mt-5 inline-flex min-h-11 w-fit items-center text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-600 underline-offset-4 hover:underline"
              >
                {t(section.mapLabel)}
              </a>
            </div>
          </Reveal>
        </div>

        {section.showDirectContacts !== false && section.directTitle && (
          <Reveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-xl font-semibold text-primary-900">{t(section.directTitle)}</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clergy.map((member) => (
                  <li key={member.id} className="rounded-xl bg-primary-50 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-600">{t(member.role)}</p>
                    <p className="mt-1 font-medium text-primary-900">{t(member.name)}</p>
                    {member.phone && (
                      <a
                        href={telHref(member.phone)}
                        className="mt-1 block text-sm text-ink-700 transition-colors hover:text-primary-900"
                      >
                        {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-0.5 block break-all text-sm text-ink-700 transition-colors hover:text-primary-900"
                      >
                        {member.email}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
