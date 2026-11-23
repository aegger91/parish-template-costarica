import type { ComponentType } from 'react';
import type { SectionBase } from '@/content';
import Calendar from './Calendar';
import Cart from './Cart';
import Checkout from './Checkout';
import ChildPages from './ChildPages';
import Clergy from './Clergy';
import ComingSoon from './ComingSoon';
import ConnectEvents from './ConnectEvents';
import ConnectVolunteer from './ConnectVolunteer';
import ContactCards from './ContactCards';
import ContactForm from './ContactForm';
import FeatureCards from './FeatureCards';
import Gallery from './Gallery';
import GiveForm from './GiveForm';
import Hero from './Hero';
import Intro from './Intro';
import Livestream from './Livestream';
import NewsList from './NewsList';
import PageHero from './PageHero';
import ProductDetail from './ProductDetail';
import Projects from './Projects';
import Quote from './Quote';
import Sacraments from './Sacraments';
import Sermons from './Sermons';
import ServiceRequests from './ServiceRequests';
import ServiceTimes from './ServiceTimes';
import StoreCatalog from './StoreCatalog';
import Story from './Story';
import Timeline from './Timeline';
import VisitInfo from './VisitInfo';
import Zapiski from './Zapiski';

/**
 * Maps the "type" of a section in src/content/pages/*.json to its component.
 * Any section can be placed on any page, reordered, or switched off with "enabled": false.
 */
export const SECTIONS = {
  hero: Hero,
  pageHero: PageHero,
  intro: Intro,
  story: Story,
  quote: Quote,
  featureCards: FeatureCards,
  childPages: ChildPages,
  serviceTimes: ServiceTimes,
  calendar: Calendar,
  visitInfo: VisitInfo,
  sacraments: Sacraments,
  clergy: Clergy,
  timeline: Timeline,
  gallery: Gallery,
  newsList: NewsList,
  livestream: Livestream,
  sermons: Sermons,
  giveForm: GiveForm,
  projects: Projects,
  contactForm: ContactForm,
  contactCards: ContactCards,
  comingSoon: ComingSoon,
  storeCatalog: StoreCatalog,
  productDetail: ProductDetail,
  cart: Cart,
  checkout: Checkout,
  serviceRequests: ServiceRequests,
  zapiski: Zapiski,
  connectEvents: ConnectEvents,
  connectVolunteer: ConnectVolunteer,
} as unknown as Record<string, ComponentType<{ section: SectionBase }>>;
