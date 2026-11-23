import { CalendarDays, Clock, Mail, MapPin, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import OrthodoxIcon from './OrthodoxIcon';
import type { OrthodoxIconName } from './OrthodoxIcon';
import iconData from './orthodoxIcons.json';

/*
  Icon names that content files may reference: generic utility icons, plus the
  Orthodox pictograms in orthodoxIcons.json (church, chalice, censer, candle,
  prayer-rope, gospel, icon, bells, cross).
*/
const UTILITY: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  clock: Clock,
  mail: Mail,
  'map-pin': MapPin,
  phone: Phone,
};

export default function Icon({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) {
  const Utility = UTILITY[name];
  if (Utility) return <Utility aria-hidden className={className} strokeWidth={strokeWidth} />;
  const orthodox = (name in iconData ? name : 'church') as OrthodoxIconName;
  return <OrthodoxIcon name={orthodox} className={className} strokeWidth={strokeWidth} />;
}
