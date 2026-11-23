import { Mail, Phone } from 'lucide-react';
import type { ClergyMember } from '@/content';
import { useI18n } from '@/i18n';
import { initials, telHref } from '@/lib/format';

export default function ClergyCard({ member }: { member: ClergyMember }) {
  const { t } = useI18n();
  const name = t(member.name);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary-900/10 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-semibold text-primary-900">{name}</h3>
          <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-600">{t(member.role)}</p>
        </div>
        {member.photo ? (
          <img src={member.photo} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-900 font-serif text-base font-semibold text-accent-300"
          >
            {initials(name)}
          </span>
        )}
      </div>
      {(member.phone || member.email) && (
        <div className="mt-5 space-y-2.5 border-t border-primary-100 pt-5 text-sm text-ink-700">
          {member.phone && (
            <a href={telHref(member.phone)} className="flex min-h-6 items-center gap-2.5 transition-colors hover:text-primary-900">
              <Phone className="h-3.5 w-3.5 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
              {member.phone}
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex min-h-6 items-center gap-2.5 break-all transition-colors hover:text-primary-900"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
              {member.email}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
