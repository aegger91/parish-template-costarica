import { useId, useState } from 'react';
import { ChevronDown, Mail, Phone } from 'lucide-react';
import type { ClergyMember } from '@/content';
import { useI18n } from '@/i18n';
import { initials, telHref } from '@/lib/format';

export default function ClergyCard({ member }: { member: ClergyMember }) {
  const { t, ui } = useI18n();
  const [open, setOpen] = useState(false);
  const bioId = useId();
  const name = t(member.name);
  const bio = t(member.bio);

  return (
    <article className="card flex h-full flex-col overflow-visible transition-shadow hover:border-accent-400">
      <div className="arch-frame-top relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-primary-900">
        {member.photo ? (
          <img src={member.photo} alt={name} loading="lazy" className="h-full w-full object-cover object-top" />
        ) : (
          <span aria-hidden className="flex h-24 w-24 items-center justify-center rounded-t-full rounded-b-md border-2 border-accent-400/60 font-heading text-4xl font-semibold text-accent-300">
            {initials(name)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="eyebrow text-[11px] text-accent-600">{t(member.role)}</p>
        <h3 className="mt-1.5 font-heading text-2xl font-semibold leading-snug text-primary-900">{name}</h3>
        {bio && (
          <>
            <p id={bioId} className={`mt-3 text-[15px] leading-relaxed text-ink-700 ${open ? '' : 'line-clamp-3'}`}>
              {bio}
            </p>
            {bio.length > 140 && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={bioId}
                className="mt-2 inline-flex min-h-9 w-fit items-center gap-1 text-[13px] font-semibold text-accent-700 hover:text-accent-800"
              >
                {ui(open ? 'showLess' : 'readMore')}
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden />
              </button>
            )}
          </>
        )}
        {(member.phone || member.email) && (
          <div className="mt-auto space-y-2.5 border-t border-primary-100 pt-5 text-sm text-ink-700 [&:not(:first-child)]:mt-5">
            {member.phone && (
              <a href={telHref(member.phone)} dir="ltr" className="flex min-h-6 w-fit items-center gap-2.5 transition-colors hover:text-primary-900">
                <Phone className="h-3.5 w-3.5 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
                {member.phone}
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex min-h-6 items-center gap-2.5 break-all transition-colors hover:text-primary-900">
                <Mail className="h-3.5 w-3.5 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
                {member.email}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
