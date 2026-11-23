import siteJson from './site.json';
import languagesJson from './languages.json';
import navigationJson from './navigation.json';
import servicesJson from './services.json';
import clergyJson from './clergy.json';
import galleryJson from './gallery.json';
import newsJson from './news.json';
import givingJson from './giving.json';
import uiJson from './ui.json';
import orthodoxConnectSample from './orthodoxconnect.sample.json';
import type {
  ClergyMember,
  GalleryPhoto,
  GivingConfig,
  Languages,
  Navigation,
  NewsItem,
  OrthodoxConnectItem,
  PageContent,
  Service,
  Site,
  UiStrings,
} from './types';

export const site = siteJson as Site;
export const languages = languagesJson as Languages;
export const navigation = navigationJson as Navigation;
export const services = servicesJson.weekly as Service[];
export const clergy = clergyJson.members as ClergyMember[];
export const gallery = galleryJson.photos as GalleryPhoto[];
export const news = newsJson.items as NewsItem[];
export const giving = givingJson as GivingConfig;
export const ui = uiJson as UiStrings;
export const orthodoxConnectSampleItems = orthodoxConnectSample.items as OrthodoxConnectItem[];

const pageModules = import.meta.glob<PageContent>('./pages/*.json', { eager: true, import: 'default' });

export const pages: PageContent[] = Object.values(pageModules);

export function getPage(id: string): PageContent | undefined {
  return pages.find((p) => p.id === id);
}

export * from './types';
