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
}

export interface Languages {
  default: string;
  storageKey: string;
  languages: Language[];
}

export interface Site {
  id: string;
  name: Localized;
  jurisdiction: Localized;
  diocese: Localized;
  dioceseUrl: string;
  jurisdictionUrl: string;
  logo: { src: string; alt: string };
  /** Faint background image behind every inner-page header. */
  pageHeroBackground: string;
  url: string;
  socialImage: string;
  contact: { email: string; phone: string };
  address: {
    street: string;
    locality: string;
    region: string;
    country: string;
    singleLine: Localized;
  };
  mapsUrl: string;
  calendar: { apiBase: string; default: 'gregorian' | 'julian' };
  orthodoxConnect: { joinUrl: string; feedUrl: string };
  footer: { copyright: Localized; tagline: Localized };
}

export interface NavItem {
  id: string;
  to?: string;
  label: Localized;
  children?: NavItem[];
}

export interface Navigation {
  header: NavItem[];
  donate: NavItem & { to: string };
  footer: {
    visitHeading: Localized;
    scheduleHeading: Localized;
    scheduleNote: Localized;
    scheduleLink: LinkRef;
    giveHeading: Localized;
  };
}

export interface Service {
  id: string;
  /** 0 = Sunday ... 6 = Saturday */
  weekday: number;
  /** 24h "HH:MM", for machines */
  time: string;
  /** Human display, e.g. "10:00 AM" */
  display: string;
  icon: string;
  highlight: boolean;
  name: Localized;
}

export interface ClergyMember {
  id: string;
  name: Localized;
  role: Localized;
  phone: string;
  email: string;
  photo: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: Localized;
  caption: Localized;
}

export interface NewsItem {
  id: string;
  date: string;
  title: Localized;
  summary: Localized;
  image?: string;
  url?: string;
}

export interface OrthodoxConnectItem {
  id: string;
  type: 'event' | 'volunteer' | 'need';
  date: string;
  title: Localized;
  summary: Localized;
  url: string;
}

export interface GivingConfig {
  /** "none" shows a not-connected notice; "endpoint" posts to checkoutEndpoint. */
  provider: 'none' | 'endpoint';
  checkoutEndpoint: string;
  currency: string;
  presetAmounts: number[];
  defaultAmount: number;
  minimumAmount: number;
  frequencies: { id: string; label: Localized }[];
  funds: { id: string; label: Localized }[];
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
  seo: { title: Localized; description: Localized };
  sections: SectionBase[];
}
