import siteJson from './site.json';
import languagesJson from './languages.json';
import navigationJson from './navigation.json';
import servicesJson from './services.json';
import clergyJson from './clergy.json';
import galleryJson from './gallery.json';
import newsJson from './news.json';
import sermonsJson from './sermons.json';
import feastsJson from './feasts.json';
import historyJson from './history.json';
import givingJson from './giving.json';
import paymentsJson from './payments.json';
import storeJson from './store.json';
import requestsJson from './requests.json';
import zapiskiJson from './zapiski.json';
import connectJson from './connect.json';
import uiJson from './ui.json';
import type {
  Category,
  ClergyMember,
  ConnectItem,
  Feast,
  GalleryPhoto,
  GivingConfig,
  Languages,
  Localized,
  ModuleId,
  Navigation,
  NewsItem,
  PageContent,
  PaymentsConfig,
  Sermon,
  Service,
  ServiceRequestType,
  Site,
  StoreConfig,
  UiStrings,
  ZapiskiConfig,
} from './types';

export const site = siteJson as Site;
export const languages = languagesJson as Languages;
export const navigation = navigationJson as Navigation;
export const services = servicesJson.weekly as Service[];
export const datedServices = servicesJson.dated as Service[];
export const clergy = clergyJson.members as ClergyMember[];
export const galleryAlbums = galleryJson.albums as Category[];
export const gallery = galleryJson.photos as GalleryPhoto[];
export const newsCategories = newsJson.categories as Category[];
export const news = newsJson.items as NewsItem[];
export const sermonCategories = sermonsJson.categories as Category[];
export const sermons = sermonsJson.items as Sermon[];
export const feasts = feastsJson.feasts as Feast[];
export const history = historyJson.events as { id: string; year: string; title: Localized; text: Localized; image?: string }[];
export const giving = givingJson as GivingConfig;
export const payments = paymentsJson as PaymentsConfig;
export const store = storeJson as StoreConfig;
export const serviceRequestTypes = requestsJson.types as ServiceRequestType[];
export const zapiski = zapiskiJson as ZapiskiConfig;
export const connectCategories = connectJson.categories as Category[];
export const connectSampleItems = connectJson.items as ConnectItem[];
export const ui = uiJson as UiStrings;

export function moduleOn(id: ModuleId): boolean {
  return site.modules[id] !== false;
}

const pageModules = import.meta.glob<PageContent>('./pages/*.json', { eager: true, import: 'default' });

/** Pages in use: "enabled" is not false and their module, if any, is switched on. */
export const pages: PageContent[] = Object.values(pageModules).filter(
  (p) => p.enabled !== false && (!p.module || moduleOn(p.module)),
);

export function getPage(id: string): PageContent | undefined {
  return pages.find((p) => p.id === id);
}

export function pagePath(id: string): string | undefined {
  return getPage(id)?.path;
}

export * from './types';
