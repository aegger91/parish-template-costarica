import { Church, Globe2, HeartHandshake, Phone, Mail } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';
import { CLERGY, PARISH } from '@/data/parish';

export default function About() {
  const { lang } = useLang();

  return (
    <>
      <PageHero
        eyebrow={lang === 'es' ? 'Nuestra parroquia' : lang === 'ru' ? 'Наш приход' : 'Our Parish'}
        title={
          lang === 'es'
            ? 'La Iglesia de la Virgen de Vladimir'
            : 'Our Lady of Vladimir Church'
        }
        subtitle={
          lang === 'es'
            ? PARISH.diocese.es
            : lang === 'ru'
              ? PARISH.diocese.ru
              : PARISH.diocese.en
        }
      />

      {/* Story */}
      <section className="bg-white py-14 sm:py-24">
        <div className="container-px container-max grid gap-10 sm:gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <h2 className="font-serif text-2xl font-semibold text-navy-900 sm:text-4xl">
              {lang === 'es' ? 'Nuestra historia' : lang === 'ru' ? 'Наша история' : 'Our Story'}
            </h2>
            <div className="gold-rule mt-6" />
            <div className="prose-block mt-6 text-[15px] text-ink-700 sm:text-base">
              <p>
                {lang === 'es'
                  ? 'La presencia ortodoxa rusa en Costa Rica reúne a fieles de habla hispana, rusa e inglesa bajo el techo de una sola iglesia. La parroquia de la Virgen de Vladimir pertenece a la Diócesis Oriental Americana de la Iglesia Ortodoxa Rusa Fuera de Rusia (ROCOR), bajo la protección de la venerada imagen de la Madre de Dios de Vladimir.'
                  : lang === 'ru'
                    ? 'Русское православие в Коста-Рике собирает верующих, говорящих по-испански, по-русски и по-английски, под кровом одной церкви. Приход Владимирской иконы Божией Матери принадлежит Восточно-Американской епархии Русской Православной Церкви Заграницей (РПЦЗ), под покровом чтимого образа Владимирской иконы Божией Матери.'
                    : 'The Russian Orthodox presence in Costa Rica gathers Spanish-, Russian-, and English-speaking faithful under the roof of a single church. The parish of Our Lady of Vladimir belongs to the Eastern American Diocese of the Russian Orthodox Church Outside of Russia (ROCOR), under the protection of the revered image of the Mother of God of Vladimir.'}
              </p>
              <p>
                {lang === 'es'
                  ? 'El templo, de estilo ruso con su cúpula azul celete coronada por estrellas doradas y la cruz ortodoxa de tres barras, fue levantado en Vázquez de Coronado. Junto a la iglesia se encuentran la casa parroquial y espacios para la comunidad, en un terreno verde y tranquilo típico de las montañas costarricenses.'
                  : lang === 'ru'
                    ? 'Храм, построенный в русском стиле с голубым куполом, увенчанным золотыми звёздами, и с трехконечным православным крестом, возведён в Васкес-де-Коронадо. Рядом с храмом — причтовый дом и помещения для общины, на тихой зелёной территории, типичной для гор Коста-Рики.'
                    : 'The temple, built in the Russian style with its sky-blue dome crowned by golden stars and the three-barred Orthodox cross, was raised in Vázquez de Coronado. Beside the church stand the rectory and spaces for community life, on the green and quiet grounds typical of the Costa Rican highlands.'}
              </p>
              <p>
                {lang === 'es'
                  ? 'La Divina Liturgia se celebra en español, con partes en eslavo eclesiástico. La parroquia sigue el calendario juliano para las fiestas principales y mantiene viva la tradición litúrgica rusa: cantos a capela, íconos, incienso y la comunión regular de los fieles.'
                  : lang === 'ru'
                    ? 'Божественная литургия совершается на испанском языке, частично на церковнославянском. Приход следует юлианскому календарю для главных праздников и хранит русское богослужебное предание: пение a cappella, иконы, каждение и регулярное причащение верующих.'
                    : 'The Divine Liturgy is celebrated in Spanish, with portions in Church Slavonic. The parish follows the Julian calendar for major feasts and keeps the Russian liturgical tradition alive: a cappella singing, icons, incense, and the regular communion of the faithful.'}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="rounded-2xl bg-navy-900 p-6 text-navy-100 sm:p-8">
              <h3 className="font-serif text-2xl font-semibold text-white">
                {lang === 'es' ? 'Nuestra fe' : lang === 'ru' ? 'Наша вера' : 'Our Faith'}
              </h3>
              <ul className="mt-6 space-y-5 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <Church className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
                  {lang === 'es'
                    ? 'Pertenecemos a la Iglesia Ortodoxa Rusa Fuera de Rusia (ROCOR).'
                    : lang === 'ru'
                      ? 'Мы принадлежим к Русской Православной Церкви Заграницей (РПЦЗ).'
                      : 'We belong to the Russian Orthodox Church Outside of Russia (ROCOR).'}
                </li>
                <li className="flex gap-3">
                  <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
                  {lang === 'es'
                    ? 'Celebramos en español, con partes en eslavo e inglés — la oración pertenece a todos.'
                    : lang === 'ru'
                      ? 'Богослужения — на испанском, частично на славянском и английском: молитва принадлежит всем.'
                      : 'We celebrate in Spanish, with portions in Slavonic and English — prayer belongs to all.'}
                </li>
                <li className="flex gap-3">
                  <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
                  {lang === 'es'
                    ? 'Todos son bienvenidos a la oración, ortodoxos y visitantes por igual.'
                    : lang === 'ru'
                      ? 'Все допущены к молитве — православные и паломники наравне.'
                      : 'All are welcome to prayer, Orthodox faithful and visitors alike.'}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quote from a Russian saint */}
      <section className="bg-navy-50 py-12">
        <div className="container-px container-max">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl text-center">
              <p className="font-serif text-xl italic leading-snug text-navy-900 sm:text-3xl">
                {lang === 'es'
                  ? '«Alégrate, Oh Virgen Madre de Dios, María llena de gracia, el Señor es contigo; bendita tú entre las mujeres, y bendito el fruto de tu vientre, porque diste a luz al Salvador de nuestras almas.»'
                  : lang === 'ru'
                    ? '«Радуйся, Дево Богородице, Марие благодатная, Господь с Тобою; благословенна Ты в женах, и благословен плод чрева Твоего, яко Спаса родила еси душ наших.»'
                    : '“Rejoice, O Virgin Theotokos, Mary full of grace, the Lord is with you; blessed are you among women, and blessed is the fruit of your womb, for you have borne the Savior of our souls.”'}
              </p>
              <footer className="mt-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                {lang === 'es'
                  ? 'Himno «Alégrate, Virgen Madre de Dios» · tono 4'
                  : lang === 'ru'
                    ? '«Радуйся, Дево Богородице» · глас 4'
                    : 'Theotokion, Tone 4 — “Rejoice, O Virgin Theotokos”'}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Clergy & contacts */}
      <section className="bg-navy-50 py-14 sm:py-24">
        <div className="container-px container-max">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                {lang === 'es' ? 'Clero y contactos' : lang === 'ru' ? 'Духовенство и контакты' : 'Clergy & Contacts'}
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-navy-900 sm:text-4xl">
                {lang === 'es' ? 'Sirviendo a la parroquia' : lang === 'ru' ? 'Служение приходу' : 'Serving the Parish'}
              </h2>
              <div className="gold-rule mx-auto mt-6" />
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CLERGY.map((member, i) => (
              <Reveal key={member.id} delay={0.06 * i}>
                <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-navy-900/10 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-navy-900">
                        {member.honorific[lang]}
                      </h3>
                      <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                        {member.role[lang]}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 font-serif text-base font-semibold text-gold-300">
                      {member.honorific[lang].split(' ').slice(-2)[0][0]}
                      {member.honorific[lang].split(' ').slice(-1)[0][0] ?? ''}
                    </span>
                  </div>
                  <div className="mt-5 space-y-2.5 border-t border-navy-100 pt-5 text-sm text-ink-700">
                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/[^+\d]/g, '')}`}
                        className="flex items-center gap-2.5 transition-colors hover:text-navy-900"
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0 text-gold-600" strokeWidth={1.8} />
                        {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2.5 break-all transition-colors hover:text-navy-900"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0 text-gold-600" strokeWidth={1.8} />
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
