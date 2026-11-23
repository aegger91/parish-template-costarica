import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';

export default function Announcements() {
  const { lang } = useLang();

  return (
    <>
      <PageHero
        eyebrow={lang === 'es' ? 'Noticias' : lang === 'ru' ? 'Новости' : 'News'}
        title={lang === 'es' ? 'Noticias de la parroquia' : lang === 'ru' ? 'Приходские новости' : 'Parish News'}
        subtitle={
          lang === 'es'
            ? 'Próximamente compartiremos aquí noticias y avisos de la parroquia.'
            : lang === 'ru'
              ? 'Скоро здесь появятся новости и объявления прихода.'
              : 'News and notices from the parish will appear here soon.'
        }
      />
      <section className="bg-white py-20 sm:py-32">
        <div className="container-px container-max">
          <Reveal>
            <div className="mx-auto max-w-xl rounded-2xl border border-navy-100 bg-navy-50 p-6 text-center sm:p-10">
              <p className="font-serif text-2xl font-semibold text-navy-900">
                {lang === 'es' ? 'Próximamente' : lang === 'ru' ? 'Скоро' : 'Coming soon'}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
                {lang === 'es'
                  ? 'Esta página aún no tiene contenido. Vuelva pronto para conocer las novedades.'
                  : lang === 'ru'
                    ? 'Эта страница пока пуста. Загляните позже — здесь появятся обновления.'
                    : 'This page is not ready yet. Please check back soon for updates.'}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
