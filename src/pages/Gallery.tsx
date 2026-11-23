import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';
import { GALLERY } from '@/data/parish';

export default function Gallery() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <PageHero
        eyebrow={lang === 'es' ? 'Galería' : lang === 'ru' ? 'Галерея' : 'Gallery'}
        title={
          lang === 'es'
            ? 'La vida de nuestra comunidad'
            : lang === 'ru'
              ? 'Жизнь нашей общины'
              : 'The Life of Our Community'
        }
        subtitle={
          lang === 'es'
            ? 'El templo, su cúpula azul con estrellas doradas, y la vida de nuestra parroquia en Vázquez de Coronado.'
            : lang === 'ru'
              ? 'Храм, его голубой купол с золотыми звёздами и жизнь нашего прихода в Васкес-де-Коронадо.'
              : 'The temple, its sky-blue dome with golden stars, and the life of our parish in Vázquez de Coronado.'
        }
      />

      <section className="bg-white py-14 sm:py-24">
        <div className="container-px container-max">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {GALLERY.map((photo, i) => (
                <Reveal key={photo.src} delay={0.05 * i} className="break-inside-avoid">
                  <button
                    onClick={() => setSelected(i)}
                    className="group relative block w-full overflow-hidden rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt[lang]}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(8,24,40,0) 40%, rgba(8,24,40,0.72) 100%)',
                      }}
                    />
                    <p className="absolute inset-x-0 bottom-0 p-4 text-left font-serif text-base italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-5 sm:text-lg">
                      {photo.caption[lang]}
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>
        </div>
      </section>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-6"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-gold-300 hover:text-gold-200"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-h-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY[selected].src}
                alt={GALLERY[selected].alt[lang]}
                className="max-h-[78vh] w-full rounded-xl bg-navy-900 object-contain"
              />
              <figcaption className="mt-4 text-center font-serif text-lg italic text-navy-100">
                {GALLERY[selected].caption[lang]}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
