import type { Lang } from '@/i18n';

export interface ClergyMember {
  id: string;
  role: Record<Lang, string>;
  honorific: Record<Lang, string>;
  phone?: string;
  email?: string;
}

export const CLERGY: ClergyMember[] = [
  {
    id: 'kaplanov',
    role: { en: 'Rector', es: 'Párroco', ru: 'Настоятель' },
    honorific: { en: 'Priest George Kaplanov', es: 'Sacerdote Jorge Kaplanov', ru: 'Иерей Георгий Капланов' },
    phone: '+1 (415) 205-4424',
    email: 'priest.kaplanov@pravmail.ru',
  },
  {
    id: 'miranda',
    role: { en: 'Priest', es: 'Sacerdote', ru: 'Священник' },
    honorific: { en: 'Archpriest Ignacio Miranda', es: 'Arcipreste Ignacio Miranda', ru: 'Протоиерей Игнасио Миранда' },
    phone: '+506 6031-9373',
    email: 'ignaciopadre@gmail.com',
  },
  {
    id: 'warden',
    role: { en: 'Warden (Starosta)', es: 'Starosta (encargado parroquial)', ru: 'Староста' },
    honorific: { en: 'Alexander Ivanov', es: 'Aleksandr Ivanov', ru: 'Александр Иванов' },
    phone: '+506 8399-9777',
    email: 'americatourscr@hotmail.com',
  },
  {
    id: 'sister',
    role: { en: 'Head Sister', es: 'Hermana mayor', ru: 'Старшая сестра' },
    honorific: { en: 'Matushka Doris Miranda', es: 'Matushka Doris Miranda', ru: 'Матушка Дорис Миранда' },
    phone: '+506 6274-3363',
  },
  {
    id: 'secretary',
    role: { en: 'Parish Secretary', es: 'Secretaria parroquial', ru: 'Секретарь прихода' },
    honorific: { en: 'Tatiana Klinkova', es: 'Tatiana Klinkova', ru: 'Татьяна Клинкова' },
    phone: '+506 4419-2968',
    email: 'tania@costaricaluxury.com',
  },
  {
    id: 'treasurer',
    role: { en: 'Treasurer', es: 'Tesorera', ru: 'Казначей' },
    honorific: { en: 'Alevtina Kiriushenko', es: 'Alevtina Kiriuschenko', ru: 'Алевтина Кирюшенко' },
    phone: '+506 8980-1479',
    email: 'aleftina_01@hotmail.com',
  },
];

export const PARISH = {
  nameEn: 'Our Lady of Vladimir Church',
  nameEs: 'Iglesia de la Virgen de Vladimir',
  nameRu: 'Храм Владимирской иконы Божией Матери',
  diocese: {
    en: 'Eastern American Diocese of the Russian Orthodox Church Abroad',
    es: 'Diócesis Oriental Americana de la Iglesia Ortodoxa Rusa en el Extranjero',
    ru: 'Восточно-Американская епархия Русской Православной Церкви Заграницей',
  },
  email: 'email@ortodoxacr.com',
  website: 'https://www.ortodoxacr.com/',
  mailingAddress: {
    en: 'Calle Corazón de Jesús, Vázquez de Coronado, San José, Costa Rica',
    es: 'Calle Corazón de Jesús, Vázquez de Coronado, San José, Costa Rica',
    ru: 'Калья Corason-de-Hesus, Васкес-де-Коронадо, Сан-Хосе, Коста-Рика',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Iglesia+Ortodoxa+Rusa+Vazquez+de+Coronado+San+Jose+Costa+Rica',
  services: {
    confession: '9:00 AM',
    liturgy: '10:00 AM',
  },
};

export const LINKS = {
  ROCOR: 'https://www.synod.com/',
  easternAmericanDiocese: 'https://www.eadioc.org/',
  ortodoxacr: 'https://www.ortodoxacr.com/',
};

export const ICON_PATH = '/images/mother-of-god-of-vladimir-559768.jpg';

export const GALLERY: { src: string; alt: Record<Lang, string>; caption: Record<Lang, string> }[] = [
  {
    src: '/images/5177128844341742977_(1).jpg',
    alt: {
      en: 'The white church with its blue starred dome at sunset',
      es: 'La iglesia blanca con su cúpula azul de estrellas al atardecer',
      ru: 'Белый храм с синей купол-звездой на закате',
    },
    caption: {
      en: 'The temple at sunset — the blue dome crowned with golden stars',
      es: 'El templo al atardecer — la cúpula azul coronada por estrellas doradas',
      ru: 'Храм на закате — синий купол, увенчанный золотыми звёздами',
    },
  },
  {
    src: '/images/5177128844341742986_(1).jpg',
    alt: {
      en: 'The church under a bright blue sky',
      es: 'La iglesia bajo un cielo azul brillante',
      ru: 'Храм под ярким синим небом',
    },
    caption: {
      en: 'The church grounds on a clear tropical morning',
      es: 'El terreno de la iglesia en una mañana tropical despejada',
      ru: 'Территория храма в ясное тропическое утро',
    },
  },
  {
    src: '/images/5177128844341742979_(1).jpg',
    alt: {
      en: 'The church lit warmly against the evening sky',
      es: 'La iglesia iluminada contra el cielo de la tarde',
      ru: 'Храм, тёплый свет на вечернем небе',
    },
    caption: {
      en: 'Vespers light — the church glowing at dusk',
      es: 'Luz de vísperas — la iglesia resplandeciente al anochecer',
      ru: 'Свет вечерни — храм сияет в сумерках',
    },
  },
  {
    src: '/images/5177128844341742975_(1).jpg',
    alt: {
      en: 'The parish community gathered around the altar after the Divine Liturgy',
      es: 'La comunidad parroquial reunida alrededor del altar después de la Divina Liturgia',
      ru: 'Приходская община вокруг алтаря после Божественной литургии',
    },
    caption: {
      en: 'The parish family gathered before the icon screen after Liturgy',
      es: 'La familia parroquial reunida ante el iconostasio después de la Liturgia',
      ru: 'Приходская семья перед иконостасом после литургии',
    },
  },
  {
    src: '/images/5177128844341742978_(1).jpg',
    alt: {
      en: 'Aerial view of the church and parish grounds in Vázquez de Coronado',
      es: 'Vista aérea de la iglesia y el terreno parroquial en Vázquez de Coronado',
      ru: 'Храм и приходская территория в Васкес-де-Коронадо с высоты',
    },
    caption: {
      en: 'The parish grounds in Vázquez de Coronado from above',
      es: 'El terreno parroquial en Vázquez de Coronado desde el aire',
      ru: 'Приходская территория в Васкес-де-Коронадо с высоты птичьего полёта',
    },
  },
  {
    src: '/images/mother-of-god-of-vladimir-559768.jpg',
    alt: {
      en: 'The Vladimir Icon of the Mother of God',
      es: 'El ícono de la Virgen de Vladimir',
      ru: 'Владимирская икона Божией Матери',
    },
    caption: {
      en: 'The Vladimir Icon of the Mother of God, protectress of the Russian land',
      es: 'El ícono de la Virgen de Vladimir, protectora de la tierra rusa',
      ru: 'Владимирская икона Божией Матери, покровительница Земли Русской',
    },
  },
  {
    src: '/images/gallery/5177128844341742973.jpg',
    alt: {
      en: 'The church at sunset beneath golden clouds',
      es: 'La iglesia al atardecer bajo nubes doradas',
      ru: 'Храм на закате под золотыми облаками',
    },
    caption: {
      en: 'Sunset over the church and the Costa Rican hills',
      es: 'Atardecer sobre la iglesia y las colinas costarricenses',
      ru: 'Закат над храмом и коста-риканскими холмами',
    },
  },
  {
    src: '/images/gallery/5177128844341742981.jpg',
    alt: {
      en: 'The clergy holding the cross in the altar',
      es: 'El clero con la cruz en el altar',
      ru: 'Духовенство с крестом в алтаре',
    },
    caption: {
      en: 'The clergy in the altar with the festal cross',
      es: 'El clero en el altar con la cruz festiva',
      ru: 'Духовенство в алтаре с праздничным крестом',
    },
  },
  {
    src: '/images/gallery/5177128844341742989.jpg',
    alt: {
      en: 'A guide speaking with visitors inside the church',
      es: 'Un guía conversa con visitantes dentro de la iglesia',
      ru: 'Экскурсовод с посетителями в храме',
    },
    caption: {
      en: 'Receiving visitors among the icons',
      es: 'Recibiendo visitantes entre los íconos',
      ru: 'Приём посетителей среди икон',
    },
  },
  {
    src: '/images/gallery/5177128844341742996.jpg',
    alt: {
      en: 'The community gathered on the parish grounds for a feast day',
      es: 'La comunidad reunida en el terreno parroquial en un día festivo',
      ru: 'Община на приходской территории в праздник',
    },
    caption: {
      en: 'The parish family gathered for a feast day',
      es: 'La familia parroquial reunida en un día festivo',
      ru: 'Приходская семья собралась на праздник',
    },
  },
  {
    src: '/images/gallery/5177128844341742997.jpg',
    alt: {
      en: 'Singers in traditional Russian dress at a parish festival',
      es: 'Cantantes con trajes tradicionales rusos en una fiesta parroquial',
      ru: 'Певцы в русской традиционной одежде на приходском празднике',
    },
    caption: {
      en: 'Traditional Russian song at the parish festival',
      es: 'Canto tradicional ruso en la fiesta parroquial',
      ru: 'Русская традиционная песнь на приходском празднике',
    },
  },
  {
    src: '/images/gallery/5177128844341742998.jpg',
    alt: {
      en: 'A folk ensemble dancing on the parish lawn',
      es: 'Un conjunto folclórico danza en el jardín parroquial',
      ru: 'Фольклорный ансамбль танцует на газоне',
    },
    caption: {
      en: 'Folk dancing on the grounds after the feast',
      es: 'Danza folclórica en los terrenos después de la fiesta',
      ru: 'Народные танцы на территории после праздника',
    },
  },
];
