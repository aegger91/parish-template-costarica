import type { LucideIcon } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';
import type { Lang } from '@/i18n';

interface Sacrament {
  icon: string;
  name: Record<Lang, string>;
  text: Record<Lang, string>;
}

const EUCHARIST: Sacrament = {
  icon: '/images/sacraments/eucharist.webp',
  name: {
    en: 'Holy Eucharist · Holy Communion',
    es: 'Santa Eucaristía · Santa Comunión',
    ru: 'Святая Евхаристия · Святое Причастие',
  },
  text: {
    en: 'The centre of Orthodox life. Under the bread and wine, the faithful receive the true Body and Blood of Christ for the remission of sins and life everlasting.',
    es: 'El centro de la vida ortodoxa. Bajo el pan y el vino, los fieles reciben el verdadero Cuerpo y Sangre de Cristo para la remisión de los pecados y la vida eterna.',
    ru: 'Средоточие православной жизни. Под видом хлеба и вина верные принимают истинное Тело и Кровь Христовы во оставление грехов и жизнь вечную.',
  },
};

const SACRAMENTS: Sacrament[] = [
  {
    icon: '/images/sacraments/baptism.webp',
    name: { en: 'Baptism', es: 'Bautismo', ru: 'Крещение' },
    text: {
      en: 'The gateway into the Church. Through threefold immersion in the name of the Father, the Son, and the Holy Spirit, a person is born into new life in Christ.',
      es: 'La puerta de entrada a la Iglesia. Por la triple inmersión en el nombre del Padre, del Hijo y del Espíritu Santo, se nace a una vida nueva en Cristo.',
      ru: 'Вход в Церковь. Троекратным погружением во имя Отца, Сына и Святого Духа человек рождается в новую жизнь во Христе.',
    },
  },
  {
    icon: '/images/sacraments/chrismation.webp',
    name: { en: 'Chrismation', es: 'Crismación', ru: 'Миропомазание' },
    text: {
      en: 'Immediately after Baptism, the newly enlightened is anointed with holy chrism and sealed with the gift of the Holy Spirit.',
      es: 'Inmediatamente después del Bautismo, el recién iluminado es ungido con el santo crisma y sellado con el don del Espíritu Santo.',
      ru: 'Сразу после Крещения новопросвещённый помазуется святым миром и запечатлевается даром Святого Духа.',
    },
  },
  {
    icon: '/images/sacraments/confession.webp',
    name: { en: 'Confession', es: 'Confesión', ru: 'Исповедь' },
    text: {
      en: 'Repentance before God in the presence of the priest. Sins confessed are absolved, and the penitent is reconciled to Christ and to the Church.',
      es: 'Arrepentimiento ante Dios en presencia del sacerdote. Los pecados confesados son absueltos y el penitente se reconcilia con Cristo y con la Iglesia.',
      ru: 'Покаяние пред Богом в присутствии священника. Исповеданные грехи разрешаются, и кающийся примиряется со Христом и Церковью.',
    },
  },
  {
    icon: '/images/sacraments/unction.webp',
    name: {
      en: 'Holy Unction',
      es: 'Santa Unción',
      ru: 'Елеосвящение',
    },
    text: {
      en: 'By prayer and the anointing with blessed oil, the sick receive healing of soul and body. The Church does not abandon her children in affliction.',
      es: 'Por la oración y la unción con óleo bendito, los enfermos reciben sanación del alma y del cuerpo. La Iglesia no abandona a sus hijos en la aflicción.',
      ru: 'Молитвой и помазанием освящённым елеем болящие получают исцеление души и тела. Церковь не оставляет своих чад в скорби.',
    },
  },
  {
    icon: '/images/sacraments/marriage.webp',
    name: { en: 'Marriage', es: 'Matrimonio', ru: 'Брак · Венчание' },
    text: {
      en: 'A man and a woman are joined and crowned before the Church, their union becoming an image of the bond between Christ and His Church.',
      es: 'Un hombre y una mujer se unen y son coronados ante la Iglesia, y su unión se convierte en imagen del vínculo entre Cristo y Su Iglesia.',
      ru: 'Мужчина и женщина соединяются и венчаются пред Церковью; их союз становится образом единства Христа и Его Церкви.',
    },
  },
  {
    icon: '/images/sacraments/ordination.webp',
    name: { en: 'Ordination', es: 'Ordenación', ru: 'Священство' },
    text: {
      en: 'Through the laying on of hands by a bishop, deacons, priests, and bishops are ordained to serve and shepherd the flock of Christ.',
      es: 'Por la imposición de manos del obispo, diáconos, presbíteros y obispos son ordenados para servir y pastorear el rebaño de Cristo.',
      ru: 'Через возложение рук епископа поставляются диаконы, пресвитеры и епископы — служить и пасти стадо Христово.',
    },
  },
];

function IconPanel({ src, large = false }: { src: string; large?: boolean }) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full border border-gold-300/60 bg-white shadow-inner ring-1 ring-navy-900/10 ${
        large ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-14 w-14'
      }`}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function Card({ s }: { s: Sacrament }) {
  const { lang } = useLang();
  return (
    <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-xl hover:shadow-navy-900/10 sm:p-8">
      <IconPanel src={s.icon} />
      <h3 className="mt-5 font-serif text-2xl font-semibold leading-snug text-navy-900">
        {s.name[lang]}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{s.text[lang]}</p>
    </div>
  );
}

export default function Sacraments() {
  const { lang } = useLang();

  return (
    <>
      <PageHero
        eyebrow={lang === 'es' ? 'Sacramentos' : lang === 'ru' ? 'Таинства' : 'Sacraments'}
        title={
          lang === 'es'
            ? 'Los Sagrados Misterios'
            : lang === 'ru'
              ? 'Священные Таинства'
              : 'The Holy Mysteries'
        }
        subtitle={
          lang === 'es'
            ? 'Los siete sacramentos de la Iglesia Ortodoxa, por los cuales la gracia invisible de Dios se comunica a los fieles.'
            : lang === 'ru'
              ? 'Семь таинств Православной Церкви, через которые верным подаётся невидимая благодать Божия.'
              : 'The seven sacraments of the Orthodox Church, through which the invisible grace of God is given to the faithful.'
        }
      />

      <section className="bg-white py-14 sm:py-24">
        <div className="container-px container-max">
          {/* Featured: the centre of Orthodox life */}
          <Reveal>
            <div className="rounded-2xl bg-navy-900 p-6 sm:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                <IconPanel src={EUCHARIST.icon} large />
                <div className="min-w-0">
                  <h2 className="font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl">
                    {EUCHARIST.name[lang]}
                  </h2>
                  <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-navy-100 sm:text-base">
                    {EUCHARIST.text[lang]}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SACRAMENTS.map((s, i) => (
              <Reveal key={s.name.en} delay={0.05 * i}>
                <Card s={s} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-10 text-center text-sm leading-relaxed text-ink-500">
              {lang === 'es'
                ? 'Para bautismos, bodas, confesiones o cualquier pregunta, hable con el párroco después de la Divina Liturgia.'
                : lang === 'ru'
                  ? 'По вопросам крещения, венчания, исповеди или другим вопросам обращайтесь к настоятелю после Божественной литургии.'
                  : 'For baptisms, weddings, confessions, or any questions, speak with the rector after the Divine Liturgy.'}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
