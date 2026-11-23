import type { ComponentType } from 'react';
import type { SectionBase } from '@/content';
import Calendar from './Calendar';
import Clergy from './Clergy';
import ComingSoon from './ComingSoon';
import ContactCards from './ContactCards';
import FeatureCards from './FeatureCards';
import Gallery from './Gallery';
import GiveForm from './GiveForm';
import Hero from './Hero';
import Intro from './Intro';
import NewsList from './NewsList';
import OrthodoxConnect from './OrthodoxConnect';
import PageHero from './PageHero';
import Quote from './Quote';
import Sacraments from './Sacraments';
import ServiceTimes from './ServiceTimes';
import Story from './Story';
import VisitInfo from './VisitInfo';

/**
 * Maps the "type" of a section in src/content/pages/*.json to its component.
 * Any section can be placed on any page, reordered, or switched off with "enabled": false.
 */
export const SECTIONS = {
  hero: Hero,
  pageHero: PageHero,
  intro: Intro,
  serviceTimes: ServiceTimes,
  featureCards: FeatureCards,
  quote: Quote,
  story: Story,
  clergy: Clergy,
  visitInfo: VisitInfo,
  calendar: Calendar,
  sacraments: Sacraments,
  gallery: Gallery,
  comingSoon: ComingSoon,
  newsList: NewsList,
  orthodoxConnect: OrthodoxConnect,
  contactCards: ContactCards,
  giveForm: GiveForm,
} as unknown as Record<string, ComponentType<{ section: SectionBase }>>;
