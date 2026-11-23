import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import type { LinkRef, Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface ComingSoonSection extends SectionBase {
  title: Localized;
  text: Localized;
  link?: LinkRef;
}

/** A centered notice card. Used for pages without content yet and for the 404 page. */
export function NoticeCard({ title, text, link }: { title: string; text: string; link?: LinkRef }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-primary-100 bg-primary-50 p-6 text-center sm:p-10">
      <p className="font-heading text-2xl font-semibold text-primary-900">{title}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{text}</p>
      {link && (
        <Link
          to={link.to}
          className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-primary-700 transition-colors hover:text-accent-600"
        >
          {t(link.label)}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" strokeWidth={2} aria-hidden />
        </Link>
      )}
    </div>
  );
}

export default function ComingSoon({ section }: { section: ComingSoonSection }) {
  const { t } = useI18n();
  return (
    <section className="bg-white py-20 sm:py-32">
      <div className="container-px container-max">
        <Reveal>
          <NoticeCard title={t(section.title)} text={t(section.text)} link={section.link} />
        </Reveal>
      </div>
    </section>
  );
}
