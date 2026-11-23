import Reveal from '@/components/ui/Reveal';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

interface Sacrament {
  id: string;
  icon: string;
  name: Localized;
  text: Localized;
}

export interface SacramentsSection extends SectionBase {
  featured?: Sacrament;
  items: Sacrament[];
  footnote?: Localized;
}

function IconPanel({ src, large = false }: { src: string; large?: boolean }) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full border border-accent-300/60 bg-white shadow-inner ring-1 ring-primary-900/10 ${
        large ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-14 w-14'
      }`}
    >
      <img src={src} alt="" loading="lazy" width={80} height={80} className="h-full w-full object-cover" />
    </div>
  );
}

export default function Sacraments({ section }: { section: SacramentsSection }) {
  const { t } = useI18n();
  const featured = section.featured;

  return (
    <section className="section bg-white">
      <div className="container-px container-max">
        {featured && (
          <Reveal>
            <div className="rounded-2xl bg-primary-900 p-6 sm:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                <IconPanel src={featured.icon} large />
                <div className="min-w-0">
                  <h2 className="font-heading text-2xl font-semibold leading-snug text-white sm:text-3xl">{t(featured.name)}</h2>
                  <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-primary-100 sm:text-base">{t(featured.text)}</p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {section.items.map((s, i) => (
            <Reveal key={s.id} delay={0.05 * i}>
              <article className="flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-primary-900/10 sm:p-8">
                <IconPanel src={s.icon} />
                <h3 className="mt-5 font-heading text-2xl font-semibold leading-snug text-primary-900">{t(s.name)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{t(s.text)}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {section.footnote && (
          <Reveal delay={0.1}>
            <p className="mt-10 text-center text-sm leading-relaxed text-ink-500">{t(section.footnote)}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
