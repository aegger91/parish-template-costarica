import Reveal from '@/components/ui/Reveal';
import { site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface VisitInfoSection extends SectionBase {
  addressTitle: Localized;
  directionsLabel: Localized;
  expectTitle: Localized;
  expectParagraphs: Localized[];
  languagesTitle?: Localized;
  languagesText?: Localized;
}

export function AddressLines() {
  const { t } = useI18n();
  const a = site.address;
  return (
    <>
      {t(site.name)}
      <br />
      {a.street}
      <br />
      {a.locality}, {a.region}
      <br />
      {a.country}
    </>
  );
}

export default function VisitInfo({ section }: { section: VisitInfoSection }) {
  const { t, ui } = useI18n();

  return (
    <section className="section bg-white">
      <div className="container-px container-max grid gap-6 sm:gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl bg-primary-900 p-6 text-primary-100 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-white">{t(section.addressTitle)}</h2>
            <address className="mt-5 text-[15px] not-italic leading-relaxed text-primary-100">
              <AddressLines />
            </address>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-accent mt-6 sm:mt-8"
              aria-label={`${t(section.directionsLabel)} (${ui('opensInNewTab')})`}
            >
              {t(section.directionsLabel)}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="h-full rounded-2xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-primary-900">{t(section.expectTitle)}</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-700">
              {section.expectParagraphs.map((p, i) => (
                <p key={i}>{t(p)}</p>
              ))}
            </div>
            {section.languagesText && (
              <div className="mt-8 rounded-xl bg-accent-50 p-5 text-sm leading-relaxed text-ink-700">
                <p className="font-medium text-primary-900">{t(section.languagesTitle)}</p>
                <p className="mt-2">{t(section.languagesText)}</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
