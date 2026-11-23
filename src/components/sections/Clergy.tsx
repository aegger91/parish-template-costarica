import ClergyCard from '@/components/ui/ClergyCard';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { clergy } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface ClergySection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
  /** Optional subset of clergy ids to show, in order. Defaults to everyone. */
  memberIds?: string[];
}

export default function Clergy({ section }: { section: ClergySection }) {
  const { t } = useI18n();
  const members = section.memberIds
    ? section.memberIds.map((id) => clergy.find((m) => m.id === id)).filter((m) => m !== undefined)
    : clergy;

  return (
    <section className="section bg-primary-50">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <Reveal key={member.id} delay={0.06 * i} className="h-full">
              <ClergyCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
