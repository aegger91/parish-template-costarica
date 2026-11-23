import { useMemo, useState } from 'react';
import { ConnectActions, ItemCard, SampleNote } from '@/components/connect/ConnectParts';
import { useConnectFeed } from '@/lib/connect';
import Icon from '@/components/ui/Icon';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { useParishNow } from '@/lib/hooks';
import { jdnFromIso } from '@/lib/time';

export interface ConnectVolunteerSection extends SectionBase {
  intro?: Localized;
}

const ICONS: Record<string, string> = { fellowship: 'chalice', care: 'church', worship: 'bells', service: 'prayer-rope', learning: 'gospel' };

export default function ConnectVolunteer({ section }: { section: ConnectVolunteerSection }) {
  const { t, ui } = useI18n();
  const feed = useConnectFeed();
  const now = useParishNow();
  const [kind, setKind] = useState<'' | 'volunteer' | 'need'>('');

  const items = useMemo(
    () =>
      (feed?.items ?? [])
        .filter((i) => (i.kind === 'volunteer' || i.kind === 'need') && (!i.date || jdnFromIso(i.date) >= now.jdn))
        .filter((i) => !kind || i.kind === kind)
        .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999')),
    [feed, kind, now.jdn],
  );

  return (
    <section className="section bg-primary-50">
      <div className="container-px mx-auto max-w-[80rem]">
        {section.intro && <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-700">{t(section.intro)}</p>}
        <ConnectActions actions={[{ action: 'post-need', label: ui('connect.postNeed') }]} />

        <div role="group" aria-label={ui('connect.show')} className="mt-8 flex flex-wrap gap-2">
          {([
            ['', 'all'],
            ['volunteer', 'connect.volunteer'],
            ['need', 'connect.needs'],
          ] as const).map(([id, key]) => (
            <button key={id || 'all'} type="button" onClick={() => setKind(id)} aria-pressed={kind === id} className={`chip ${kind === id ? 'chip-on' : 'chip-off'}`}>
              {ui(key)}
            </button>
          ))}
        </div>

        {feed === null ? (
          <p className="mt-8 text-[15px] text-ink-500">{ui('connect.loading')}</p>
        ) : items.length ? (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} action={ui(item.kind === 'need' ? 'connect.help' : 'connect.signUp')}>
                  <span className="flex items-center gap-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-900 text-accent-300">
                      <Icon name={ICONS[item.category] ?? 'church'} className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${item.kind === 'need' ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
                      {ui(item.kind === 'need' ? 'connect.need' : 'connect.volunteerOne')}
                    </span>
                  </span>
                </ItemCard>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-2xl border border-primary-100 bg-white p-6 text-center text-[15px] text-ink-500">{ui('connect.noNeeds')}</p>
        )}
        <SampleNote feed={feed} />
      </div>
    </section>
  );
}
