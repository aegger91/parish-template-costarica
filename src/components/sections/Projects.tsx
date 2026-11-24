import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { getPage, giving, payments } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { formatMoney } from '@/lib/format';

export interface ProjectsSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
}

/** Parish projects from giving.json with progress toward each goal. */
export default function Projects({ section }: { section: ProjectsSection }) {
  const { t, ui, language } = useI18n();
  const donate = getPage('donate');
  if (!giving.projects.length) return null;
  return (
    <section className="section">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {giving.projects.map((p, i) => {
            const pct = p.goal > 0 ? Math.min(100, Math.round((p.raised / p.goal) * 100)) : 0;
            return (
              <Reveal key={p.id} delay={0.08 * i} className="h-full">
                <article className="card flex h-full flex-col p-6 sm:p-8">
                  <h3 className="font-heading text-[23px] font-normal leading-snug text-ink-900">{t(p.title)}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">{t(p.text)}</p>
                  <div className="mt-6">
                    <div
                      className="h-2.5 overflow-hidden rounded-pill bg-primary-100"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      aria-label={t(p.title)}
                    >
                      <div className="h-full rounded-pill bg-accent-400" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-2 flex flex-wrap justify-between gap-2 text-[13px] text-ink-500">
                      <span>
                        <span className="font-semibold text-primary-900">{formatMoney(p.raised, payments.currency, language.locale)}</span>{' '}
                        {ui('give.raisedOf', { goal: formatMoney(p.goal, payments.currency, language.locale) })}
                      </span>
                      <span>{pct}%</span>
                    </p>
                  </div>
                  {donate && (
                    <Link to={`${donate.path}?fund=${encodeURIComponent(p.id)}#give`} className="btn-outline mt-6 w-fit">
                      {ui('give.toProject')}
                    </Link>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
