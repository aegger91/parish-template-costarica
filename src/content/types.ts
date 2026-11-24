/** A translatable field: one string per language code, e.g. { "en": "...", "es": "..." }. */
export type Localized = Record<string, string>;

export interface LinkRef {
  to: string;
  label: Localized;
}

export interface ImageRef {
  src: string;
  alt: Localized | string;
}

export interface Language {
  code: string;
  label: string;
  short: string;
  htmlLang: string;
  locale: string;
  ogLocale: string;
  /** "rtl" for right-to-left scripts. Defaults to "ltr". */
  dir?: 'ltr' | 'rtl';
  /** Languages to try, in order, when a field has no text in this language. The default language is always tried last. */
  fallback?: string[];
}

export interface Languages {
  default: string;
  storageKey: string;
  languages: Language[];
}

export type LogoStyle = 'church' | 'seal' | 'kiot' | 'square' | 'wordmark';

/**
 * Site-level church calendar (no visitor toggle).
 * old: Julian / Old Calendar — fixed feasts 13 days behind the civil date; Orthodox Pascha.
 * new: Revised Julian / New Calendar — fixed feasts on the civil date; Orthodox Pascha.
 * Movable Pascha-based feasts follow the same Orthodox Paschalion in both.
 */
export type CalendarStyle = 'new' | 'old';

export type ModuleId = 'livestream' | 'store' | 'serviceRequests' | 'zapiski' | 'getInvolved';

export interface Site {
  id: string;
  name: Localized;
  jurisdiction: Localized;
  diocese: Localized;
  dioceseUrl: string;
  jurisdictionUrl: string;
  logo: {
    style: LogoStyle;
    src: string;
    alt: string;
    /** Small line under the name in the wordmark style. */
    wordmarkSubtitle?: Localized;
  };
  /** Faint background image behind every inner-page header. */
  pageHeroBackground: string;
  url: string;
  socialImage: string;
  /** IANA time zone of the parish, e.g. "America/Chicago". Service times are in this zone. */
  timeZone: string;
  contact: { email: string; phone: string };
  /** Short opening hours shown in the header, one line each, e.g. "Open daily" and "8:00 AM to 7:00 PM". */
  hours?: Localized[];
  address: {
    street: string;
    locality: string;
    region: string;
    country: string;
    singleLine: Localized;
  };
  mapsUrl: string;
  map: { lat: number | null; lng: number | null; zoom: number };
  calendar: {
    apiBase: string;
    /** The parish's church calendar. Feasts, fasts and saints follow it everywhere on the site. */
    style: CalendarStyle;
    weekStartsOn: 0 | 1;
    /** Saint names from the calendar service are in English; they are shown only in these languages. */
    saintsLanguages: string[];
  };
  /** Optional parts of the site. A switched-off module removes its pages, menu entries and shortcuts. */
  modules: Record<ModuleId, boolean>;
  /** "Live now" shows automatically during services marked "streamed" when the livestream module is on. */
  livestream: {
    watchUrl: string;
    embedUrl: string;
    providerLabel: string;
  };
  /** Where contact messages and service requests are sent. Empty: the form shows the parish email instead. */
  formsEndpoint: string;
  orthodoxConnect: {
    /** The parish's id on OrthodoxConnect, passed in every hand-off link. */
    parishId: string;
    /** Web address of the app, used when the app is not installed. */
    appUrl: string;
    deepLinkScheme: string;
    feedUrl: string;
    signupEndpoint: string;
    newsletter: { enabled: boolean; endpoint: string };
  };
  /** Church Slavonic-style font for headings. Empty uses the normal serif. */
  slavonicFont: '' | 'old-standard' | 'ponomar' | 'triodion';
  footer: { copyright: Localized; tagline: Localized };
}

export interface NavItem {
  id: string;
  /** Id of a page in src/content/pages. Its path and navLabel are used. */
  page?: string;
  /** A custom or external link, used when there is no page. */
  to?: string;
  label?: Localized;
  /** Shown as the gold call-to-action button in the desktop bar. */
  button?: boolean;
  children?: NavItem[];
}

export interface Navigation {
  header: NavItem[];
  footer: {
    visitHeading: Localized;
    scheduleHeading: Localized;
    scheduleNote: Localized;
    scheduleLink: LinkRef;
    giveHeading: Localized;
    newsletterHeading: Localized;
    newsletterText: Localized;
  };
}

export interface Service {
  id: string;
  /** 0 = Sunday ... 6 = Saturday (weekly services) */
  weekday?: number;
  /** "YYYY-MM-DD" (dated services) */
  date?: string;
  /** 24h "HH:MM" in the parish time zone */
  time: string;
  durationMinutes: number;
  icon: string;
  highlight: boolean;
  streamed: boolean;
  name: Localized;
}

export interface ClergyMember {
  id: string;
  name: Localized;
  role: Localized;
  bio?: Localized;
  phone: string;
  email: string;
  photo: string;
}

export interface Category {
  id: string;
  label: Localized;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  album: string;
  alt: Localized;
  caption: Localized;
}

export interface NewsItem {
  id: string;
  date: string;
  category: string;
  title: Localized;
  summary: Localized;
  image?: string;
  url?: string;
}

export interface Sermon {
  id: string;
  date: string;
  speakerId: string;
  category: string;
  title: Localized;
  summary?: Localized;
  scripture?: Localized;
  media: { type: 'audio'; src: string } | { type: 'video'; embedUrl: string };
}

export interface Feast {
  id: string;
  /** Church-calendar date "MM-DD", or days from Pascha. */
  date?: string;
  paschaOffset?: number;
  rank: 'pascha' | 'great' | 'parish';
  name: Localized;
}

/** An event, volunteer opportunity or parish need. Fields mirror OrthodoxConnect. */
export interface ConnectItem {
  id: string;
  kind: 'event' | 'volunteer' | 'need';
  title: Localized;
  summary?: Localized;
  /** "YYYY-MM-DD", or "" for an ongoing need */
  date: string;
  /** "HH:MM", or "" */
  time: string;
  location: Localized;
  /** 0 means no limit */
  capacity: number;
  signups: number;
  organizer: string;
  category: string;
}

export interface PaymentsConfig {
  /** Server route that starts a Stripe or Authorize.net checkout. Empty: a not-connected notice is shown. */
  checkoutEndpoint: string;
  currency: string;
}

export interface ProductVariant {
  id: string;
  label: Localized;
  /** Overrides the product price. */
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  category: string;
  name: Localized;
  summary: Localized;
  description: Localized;
  price: number;
  /** Stock when the product has no variants. */
  stock: number;
  images: string[];
  variants: ProductVariant[];
  shippable: boolean;
  featured?: boolean;
}

export interface StoreConfig {
  shipping: { flatRate: number; freeOver: number; countries: string[] };
  pickup: { location: Localized; note: Localized };
  lowStockAt: number;
  categories: (Category & { icon: string })[];
  products: Product[];
}

export interface ServiceRequestType {
  id: string;
  icon: string;
  /** Optional illustration; the icon is drawn in a frame when empty. */
  image: string;
  title: Localized;
  summary: Localized;
  price: 'free' | 'donation';
  /** Duration in minutes, or 0 when it does not apply */
  durationMinutes: number;
  /** Who receives the request: a clergy id, or "office" */
  sendTo: string;
  /** Link to another page instead of the form, e.g. the commemoration notes page */
  link?: string;
}

export interface ZapiskiConfig {
  maxNames: number;
  slipTypes: { id: 'health' | 'repose'; label: Localized; heading: Localized }[];
  prefixes: { id: string; group: 'clergy' | 'infant' | 'monastic'; label: Localized }[];
  commemorations: { id: string; for: ('health' | 'repose')[]; label: Localized; text?: Localized; suggested: number }[];
  candles: { id: string; label: Localized; price: number }[];
}

export interface GivingProject {
  id: string;
  title: Localized;
  text: Localized;
  goal: number;
  raised: number;
}

export interface GivingConfig {
  presetAmounts: number[];
  /** Suggested starting chip; 0 or omitted leaves the amount empty / $0. */
  defaultAmount: number;
  /** Deprecated: ignored. Forms never enforce a minimum amount. */
  minimumAmount?: number;
  frequencies: { id: string; label: Localized }[];
  funds: { id: string; label: Localized }[];
  /** Projects are also offered as designations in the gift form. */
  projects: GivingProject[];
  /** Clergy/contact id shown as the giving contact. */
  contactId: string;
}

export type UiStrings = { [key: string]: Localized | UiStrings };

export interface SectionBase {
  id: string;
  type: string;
  enabled: boolean;
}

export interface PageContent {
  id: string;
  path: string;
  /** Set to false to remove the page, its route, and its menu entries. */
  enabled?: boolean;
  /** The page belongs to an optional module and disappears when the module is off. */
  module?: ModuleId;
  navLabel?: Localized;
  /** Icon and summary used when the page is listed as a card on its parent page. */
  icon?: string;
  summary?: Localized;
  seo: { title: Localized; description: Localized };
  sections: SectionBase[];
}
