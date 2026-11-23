import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import FilterChips from '@/components/ui/FilterChips';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { gallery, galleryAlbums } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';

export interface GallerySection extends SectionBase {
  eyebrow?: Localized;
  title?: Localized;
  /** Show at most this many photos (e.g. a teaser on the home page). */
  limit?: number;
}

export default function Gallery({ section }: { section: GallerySection }) {
  const { t, ui, dir } = useI18n();
  const [album, setAlbum] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const photos = useMemo(() => {
    const list = album ? gallery.filter((p) => p.album === album) : gallery;
    return section.limit ? list.slice(0, section.limit) : list;
  }, [album, section.limit]);
  const count = photos.length;
  const counts = Object.fromEntries(galleryAlbums.map((a) => [a.id, gallery.filter((p) => p.album === a.id).length]));

  const close = useCallback(() => {
    setSelected(null);
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback((delta: number) => setSelected((i) => (i === null ? i : (i + delta + count) % count)), [count]);

  useEffect(() => {
    if (selected === null) return;
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === forward) step(1);
      if (e.key === back) step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected, close, step, dir]);

  const current = selected === null ? null : photos[selected];

  return (
    <>
      <section className="section bg-white">
        <div className="container-px container-max">
          {section.title && (
            <Reveal>
              <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
            </Reveal>
          )}
          {!section.limit && (
            <div className={section.title ? 'mt-10' : ''}>
              <FilterChips categories={galleryAlbums} value={album} onChange={setAlbum} label={ui('gallery.albums')} counts={counts} />
            </div>
          )}
          <ul className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {photos.map((photo, i) => (
              <li key={photo.id} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={(e) => {
                    lastTrigger.current = e.currentTarget;
                    setSelected(i);
                  }}
                  className="group relative block w-full overflow-hidden rounded-2xl shadow-sm"
                  aria-label={`${t(photo.caption)}. ${ui('gallery.open')}`}
                >
                  <img src={photo.src} alt={t(photo.alt)} className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ background: 'linear-gradient(180deg, transparent 40%, rgb(var(--color-primary-950) / 0.72) 100%)' }}
                  />
                  <p
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 p-4 text-start font-heading text-base italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-5 sm:text-lg"
                  >
                    {t(photo.caption)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(current.caption)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-primary-950/95 p-4 sm:p-6"
            onClick={close}
          >
            <button
              type="button"
              autoFocus
              className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-accent-300 hover:text-accent-200 sm:end-5 sm:top-5"
              onClick={close}
              aria-label={ui('close')}
            >
              <X className="h-5 w-5" strokeWidth={1.6} aria-hidden />
            </button>
            {count > 1 && (
              <>
                <button
                  type="button"
                  className="absolute start-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-primary-950/60 text-white transition-colors hover:border-accent-300 hover:text-accent-200 sm:start-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={ui('previous')}
                >
                  <ChevronLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={1.6} aria-hidden />
                </button>
                <button
                  type="button"
                  className="absolute end-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-primary-950/60 text-white transition-colors hover:border-accent-300 hover:text-accent-200 sm:end-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label={ui('next')}
                >
                  <ChevronRight className="h-5 w-5 rtl:rotate-180" strokeWidth={1.6} aria-hidden />
                </button>
              </>
            )}
            <motion.figure
              key={current.id}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-h-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={current.src} alt={t(current.alt)} className="max-h-[78vh] w-full rounded-xl bg-primary-900 object-contain" />
              <figcaption className="mt-4 text-center font-heading text-lg italic text-primary-100">
                {t(current.caption)}
                <span className="ms-3 text-[13px] not-italic text-primary-300">
                  {(selected ?? 0) + 1} / {count}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
