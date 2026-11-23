import { useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import FilterChips from '@/components/ui/FilterChips';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { clergy, sermonCategories, sermons } from '@/content';
import type { Localized, SectionBase, Sermon } from '@/content';
import { useI18n } from '@/i18n';
import { formatDate } from '@/lib/format';

export interface SermonsSection extends SectionBase {
  eyebrow?: Localized;
  title: Localized;
}

function Player({ sermon }: { sermon: Sermon }) {
  const { t, ui, language } = useI18n();
  const speaker = clergy.find((c) => c.id === sermon.speakerId);
  return (
    <div className="rounded-2xl bg-primary-900 p-5 text-white sm:p-7">
      <p className="eyebrow text-[11px] text-accent-300">{ui('sermons.nowPlaying')}</p>
      <h3 className="mt-2 font-heading text-2xl font-semibold leading-snug">{t(sermon.title)}</h3>
      <p className="mt-1 text-[13px] text-primary-200">
        {[speaker && t(speaker.name), formatDate(sermon.date, language.locale), sermon.scripture && t(sermon.scripture)].filter(Boolean).join(' · ')}
      </p>
      <div className="mt-5">
        {sermon.media.type === 'audio' ? (
          <audio key={sermon.id} controls preload="metadata" src={sermon.media.src} className="w-full" autoPlay>
            {ui('sermons.noAudio')}
          </audio>
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <iframe key={sermon.id} src={sermon.media.embedUrl} title={t(sermon.title)} className="absolute inset-0 h-full w-full" allowFullScreen loading="lazy" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sermons({ section }: { section: SermonsSection }) {
  const { t, ui, language } = useI18n();
  const [category, setCategory] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [current, setCurrent] = useState<string | null>(null);
  const speakers = clergy.filter((c) => sermons.some((s) => s.speakerId === c.id));
  const list = useMemo(
    () =>
      [...sermons]
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter((s) => (!category || s.category === category) && (!speaker || s.speakerId === speaker)),
    [category, speaker],
  );
  const playing = sermons.find((s) => s.id === current);

  return (
    <section className="section bg-primary-50">
      <div className="container-px container-max">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <FilterChips categories={sermonCategories} value={category} onChange={setCategory} label={ui('sermons.categories')} />
          {speakers.length > 1 && (
            <label className="flex items-center gap-2 text-[13px] text-ink-700">
              {ui('sermons.speaker')}
              <select value={speaker} onChange={(e) => setSpeaker(e.target.value)} className="min-h-11 rounded-pill border border-primary-200 bg-white px-4 text-[13px] font-medium text-primary-800">
                <option value="">{ui('all')}</option>
                {speakers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(c.name)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {playing && (
          <div className="mt-8">
            <Player sermon={playing} />
          </div>
        )}

        {list.length ? (
          <ul className="mt-8 divide-y divide-primary-100 overflow-hidden rounded-2xl border border-primary-100 bg-white">
            {list.map((s) => {
              const who = clergy.find((c) => c.id === s.speakerId);
              const cat = sermonCategories.find((c) => c.id === s.category);
              const active = s.id === current;
              return (
                <li key={s.id} className={`flex items-start gap-4 p-4 sm:p-5 ${active ? 'bg-accent-50' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setCurrent(active ? null : s.id)}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                      active ? 'bg-accent-400 text-primary-900' : 'bg-primary-900 text-accent-300 hover:bg-primary-700'
                    }`}
                    aria-label={`${ui(active ? 'sermons.close' : 'sermons.play')}: ${t(s.title)}`}
                  >
                    {active ? <Pause className="h-4 w-4" strokeWidth={2} aria-hidden /> : <Play className="h-4 w-4 translate-x-px rtl:-scale-x-100" strokeWidth={2} aria-hidden />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-lg font-semibold leading-snug text-primary-900 sm:text-xl">{t(s.title)}</p>
                    <p className="mt-0.5 text-[13px] text-ink-500">
                      {[formatDate(s.date, language.locale), who && t(who.name), s.scripture && t(s.scripture)].filter(Boolean).join(' · ')}
                    </p>
                    {s.summary && <p className="mt-1.5 text-[14px] leading-relaxed text-ink-700">{t(s.summary)}</p>}
                  </div>
                  {cat && <span className="hidden shrink-0 rounded-pill bg-primary-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-700 sm:inline">{t(cat.label)}</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 text-center text-[15px] text-ink-500">{ui('sermons.none')}</p>
        )}
      </div>
    </section>
  );
}
