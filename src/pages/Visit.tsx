import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';
import { PARISH } from '@/data/parish';

export default function Visit() {
  const { lang } = useLang();

  return (
    <>
      <PageHero
        eyebrow={lang === 'es' ? 'Planee su visita' : lang === 'ru' ? 'Как нас найти' : 'Plan a Visit'}
        title={lang === 'es' ? 'Le esperamos' : lang === 'ru' ? 'Рады видеть вас' : 'We Look Forward to Your Visit'}
        subtitle={
          lang === 'es'
            ? 'La iglesia está en Vázquez de Coronado, San José, Costa Rica.'
            : lang === 'ru'
              ? 'Храм находится в Васкес-де-Коронадо, Сан-Хосе, Коста-Рика.'
              : 'The church is located in Vázquez de Coronado, San José, Costa Rica.'
        }
      />

      <section className="bg-white py-14 sm:py-24">
        <div className="container-px container-max grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Address */}
          <Reveal>
            <div className="h-full rounded-2xl bg-navy-900 p-6 text-navy-100 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-white">
                {lang === 'es' ? 'Dirección' : lang === 'ru' ? 'Адрес' : 'Address'}
              </h2>
              <address className="mt-5 not-italic text-[15px] leading-relaxed text-navy-100">
                {lang === 'es' ? 'Iglesia de la Virgen de Vladimir' : lang === 'ru' ? 'Храм Владимирской иконы Божией Матери' : 'Our Lady of Vladimir Church'}
                <br />
                Calle Corazón de Jesús
                <br />
                Vázquez de Coronado, San José
                <br />
                Costa Rica
              </address>
              <a
                href={PARISH.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900 transition-colors hover:bg-gold-300 sm:mt-8"
              >
                {lang === 'es' ? 'Cómo llegar' : lang === 'ru' ? 'Проложить маршрут' : 'Get Directions'}
              </a>
            </div>
          </Reveal>

          {/* What to expect */}
          <Reveal delay={0.12}>
            <div className="h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-navy-900">
                {lang === 'es' ? 'Qué esperar' : lang === 'ru' ? 'Что ожидать' : 'What to Expect'}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-700">
                <p>
                  {lang === 'es'
                    ? 'La Divina Liturgia comienza a las 10:00 AM y la confesión a las 9:00 AM.'
                    : lang === 'ru'
                      ? 'Божественная литургия начинается в 10:00 AM, исповедь — в 9:00 AM.'
                      : 'Divine Liturgy begins at 10:00 AM and confession at 9:00 AM.'}
                </p>
                <p>
                  {lang === 'es'
                    ? 'Solo los ortodoxos bautizados y confesados comulgan. Todos pueden venerar los íconos, encender una vela y recibir el pan bendito al final de la Divina Liturgia.'
                    : lang === 'ru'
                      ? 'Причащаются только крещёные и исповедовавшиеся православные. Все могут приложиться к иконам, поставить свечу и получить освящённый хлеб в конце литургии.'
                      : 'Only baptized and confessed Orthodox Christians receive communion. Everyone may venerate the icons, light a candle, and receive the blessed bread at the end of the Divine Liturgy.'}
                </p>
              </div>
              <div className="mt-8 rounded-xl bg-gold-50 p-5 text-sm leading-relaxed text-ink-700">
                <p className="font-medium text-navy-900">
                  {lang === 'es' ? 'Idiomas' : lang === 'ru' ? 'Языки' : 'Languages'}
                </p>
                <p className="mt-2">
                  {lang === 'es'
                    ? 'Los servicios se celebran en español, con partes en eslavo eclesiástico e inglés.'
                    : lang === 'ru'
                      ? 'Богослужения совершаются на испанском языке, частично на церковнославянском и английском.'
                      : 'Services are celebrated in Spanish, with portions in Church Slavonic and English.'}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
