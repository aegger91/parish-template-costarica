import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock, HandHeart, MapPin, Users } from 'lucide-react';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';

export default function Home() {
  const { lang } = useLang();

  return (
    <>
      <Hero />

      {/* Welcome */}
      <section className="bg-white py-14 sm:py-24">
        <div className="container-px container-max grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-600">
              {lang === 'es' ? 'Bienvenido' : lang === 'ru' ? 'Добро пожаловать' : 'Welcome'}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-navy-900 sm:text-4xl">
              {lang === 'es'
                ? 'Una casa de oración para todos los pueblos'
                : lang === 'ru'
                  ? 'Дом молитвы для всех народов'
                  : 'A house of prayer for all peoples'}
            </h2>
            <div className="gold-rule mt-6" />
            <div className="prose-block mt-6 text-[15px] text-ink-700 sm:text-base">
              <p>
                {lang === 'es'
                  ? 'La Iglesia de la Virgen de Vladimir es una parroquia de la Diócesis Oriental Americana de la Iglesia Ortodoxa Rusa Fuera de Rusia (ROCOR), ubicada en Vázquez de Coronado, en la provincia de San José. Somos una familia espiritual de costarricenses, rusos y ortodoxos de muchas naciones, unidos por la fe ortodoxa y la liturgia sagrada.'
                  : lang === 'ru'
                    ? 'Храм Владимирской иконы Божией Матери — приход Восточно-Американской епархии Русской Православной Церкви Заграницей (РПЦЗ), расположенный в Васкес-де-Коронадо, в провинции Сан-Хосе. Мы — духовная семья костариканцев, русских и православных многих народов, объединённых православной верой и священной литургией.'
                    : 'Our Lady of Vladimir Church is a parish of the Eastern American Diocese of the Russian Orthodox Church Outside of Russia (ROCOR), located in Vázquez de Coronado in the province of San José. We are a spiritual family of Costa Ricans, Russians, and Orthodox Christians of many nations, united by the Orthodox faith and the sacred liturgy.'}
              </p>
              <p>
                {lang === 'es'
                  ? 'Los servicios se celebran en español, con partes en eslavo eclesiástico e inglés. Sea cual sea su origen, será recibido con calidez cristiana.'
                  : lang === 'ru'
                    ? 'Богослужения совершаются на испанском языке, частично на церковнославянском и английском. Кто бы вы ни были, вас примут с христианской теплотой.'
                    : 'Services are celebrated in Spanish, with portions in Church Slavonic and English. Whatever your background, you will be received with Christian warmth.'}
              </p>
            </div>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-navy-700 transition-colors hover:text-gold-600"
            >
              {lang === 'es' ? 'Conozca nuestra parroquia' : lang === 'ru' ? 'О нашем приходе' : 'Meet Our Parish'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </Link>
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-navy-900 shadow-2xl shadow-navy-900/25">
              <img
                src="/images/mother-of-god-of-vladimir-559768.jpg"
                alt={
                  lang === 'es'
                    ? 'Ícono de la Virgen de Vladimir'
                    : lang === 'ru'
                      ? 'Владимирская икона Божией Матери'
                      : 'The Vladimir Icon of the Mother of God'
                }
                className="h-[320px] w-full object-cover object-top sm:h-[480px]"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(8,24,40,0) 55%, rgba(8,24,40,0.55) 100%)',
                }}
              />
              <p className="absolute inset-x-0 bottom-0 p-6 font-serif text-lg italic text-white">
                {lang === 'es'
                  ? 'La Virgen de Vladimir, protectora de la tierra rusa'
                  : lang === 'ru'
                    ? 'Владимирская икона Божией Матери, покровительница Земли Русской'
                    : 'The Vladimir Icon of the Mother of God, protectress of the Russian land'}
              </p>
            </div>
            <div
              aria-hidden
              className="absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-2xl border-2 border-gold-300"
            />
          </Reveal>
        </div>
      </section>

      {/* Service times band */}
      <section className="bg-navy-900 py-12 sm:py-20">
        <div className="container-px container-max">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                {lang === 'es' ? 'Horario de servicios' : lang === 'ru' ? 'Богослужения' : 'Service Schedule'}
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-white sm:text-4xl">
                {lang === 'es' ? 'Domingos en la parroquia' : lang === 'ru' ? 'Воскресные богослужения' : 'Sundays at the Parish'}
              </h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 text-center">
                <CalendarDays className="mx-auto h-6 w-6 text-gold-300" strokeWidth={1.6} />
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-navy-200">
                  {lang === 'es' ? 'Domingo' : lang === 'ru' ? 'Воскресенье' : 'Sunday'}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-white">9:00 AM</p>
                <p className="text-sm text-navy-200">
                  {lang === 'es' ? 'Confesión' : lang === 'ru' ? 'Исповедь' : 'Confession'}
                </p>
              </div>
              <div className="rounded-2xl border border-gold-400/40 bg-navy-800/80 p-6 text-center shadow-lg shadow-gold-900/10">
                <Clock className="mx-auto h-6 w-6 text-gold-300" strokeWidth={1.6} />
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-navy-200">
                  {lang === 'es' ? 'Domingo' : lang === 'ru' ? 'Воскресенье' : 'Sunday'}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-gold-200">10:00 AM</p>
                <p className="text-sm text-navy-200">
                  {lang === 'es' ? 'Divina Liturgia' : lang === 'ru' ? 'Божественная литургия' : 'Divine Liturgy'}
                </p>
              </div>
            </div>
            <p className="mt-8 text-center text-sm text-navy-200">
              {lang === 'es' ? 'Los días de semana según el calendario. ' : lang === 'ru' ? 'Богослужения по будням — по объявлению. ' : 'Weekday services as announced. '}
              <Link to="/worship" className="font-medium text-gold-300 underline-offset-4 hover:underline">
                {lang === 'es' ? 'Ver el calendario' : lang === 'ru' ? 'Открыть календарь' : 'See the calendar'}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Visit cards */}
      <section className="bg-navy-50 py-14 sm:py-24">
        <div className="container-px container-max">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                {lang === 'es' ? 'Visítenos' : lang === 'ru' ? 'Приезжайте' : 'Visit Us'}
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-navy-900 sm:text-4xl">
                {lang === 'es' ? 'Le esperamos' : lang === 'ru' ? 'Рады видеть вас' : 'We Look Forward to Meeting You'}
              </h2>
              <div className="gold-rule mx-auto mt-6" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: lang === 'es' ? 'Cómo llegar' : lang === 'ru' ? 'Как добраться' : 'Getting Here',
                text:
                  lang === 'es'
                    ? 'Calle Corazón de Jesús, Vázquez de Coronado, San José — a pocos minutos del centro de San José.'
                    : lang === 'ru'
                      ? 'Калья Корасон-де-Хесус, Васкес-де-Коронадо, Сан-Хосе — недалеко от центра Сан-Хосе.'
                      : 'Calle Corazón de Jesús, Vázquez de Coronado, San José — a short drive from downtown San José.',
                to: '/visit',
              },
              {
                icon: HandHeart,
                title: lang === 'es' ? 'Primera visita' : lang === 'ru' ? 'Первое посещение' : 'First Visit',
                text:
                  lang === 'es'
                    ? 'No necesita saber nada para venir. Rece con nosotros y alguien le acompañará con gusto durante el servicio.'
                    : lang === 'ru'
                      ? 'Не нужно ничего знать заранее. Приходите помолиться с нами — кто-нибудь с радостью поможет вам во время службы.'
                      : 'You do not need to know anything to visit. Simply come and pray with us — someone will gladly guide you through the service.',
                to: '/visit',
              },
              {
                icon: Users,
                title: lang === 'es' ? 'Comunidad' : lang === 'ru' ? 'Община' : 'Community',
                text:
                  lang === 'es'
                    ? 'Una familia espiritual de costarricenses, rusos y ortodoxos de muchas naciones, unidos en la fe y en el culto.'
                    : lang === 'ru'
                      ? 'Духовная семья костариканцев, русских и православных многих народов, объединённых верой и богослужением.'
                      : 'A spiritual family of Costa Ricans, Russians, and Orthodox Christians of many nations, united in faith and worship.',
                to: '/about',
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={0.1 * i}>
                <Link
                  to={card.to}
                  className="group block h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-navy-900/10 sm:p-8"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-gold-300 transition-colors group-hover:bg-gold-400 group-hover:text-navy-900">
                    <card.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl font-semibold text-navy-900">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{card.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                    {lang === 'es' ? 'Aprender más' : lang === 'ru' ? 'Подробнее' : 'Learn more'}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="relative overflow-hidden bg-navy-800 py-14 sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "url('/images/mother-of-god-of-vladimir-559768.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        />
        <div className="container-px container-max relative">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl text-center">
              <p className="font-serif text-xl italic leading-snug text-white sm:text-3xl">
                {lang === 'es'
                  ? '«Es verdaderamente justo llamarte bienaventurada, Oh Madre de Dios, la siempre bienaventurada e inmaculada y Madre de nuestro Dios.»'
                  : lang === 'ru'
                    ? '«Достойно есть яко воистину блажити Тя, Богородицу, присноблаженную и пречистую, и Матерь Бога нашего.»'
                    : '“It is truly meet to bless you, O Theotokos, the ever-blessed and most immaculate Mother of our God.”'}
              </p>
              <footer className="mt-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                {lang === 'es'
                  ? '«Digno es en verdad» · Divina Liturgia'
                  : lang === 'ru'
                    ? '«Достойно есть» · Божественная литургия'
                    : 'Axion Estin — “It Is Truly Meet” · Divine Liturgy'}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>
    </>
  );
}
