import type { ComponentType } from 'react';
import { CalendarDays, Clock, Globe2, HandHeart, HeartHandshake, Mail, MapPin, Phone, Users } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import ChurchIcon from './ChurchIcon';

type IconComponent = ComponentType<Pick<LucideProps, 'className' | 'strokeWidth' | 'aria-hidden'>>;

/** Icon names that content files may reference. Add entries here to allow more. */
const ICONS: Record<string, IconComponent> = {
  calendar: CalendarDays,
  church: ChurchIcon,
  clock: Clock,
  globe: Globe2,
  'hand-heart': HandHeart,
  'heart-handshake': HeartHandshake,
  mail: Mail,
  'map-pin': MapPin,
  phone: Phone,
  users: Users,
};

export default function Icon({ name, className, strokeWidth }: { name: string } & Pick<LucideProps, 'className' | 'strokeWidth'>) {
  const Component = ICONS[name] ?? ChurchIcon;
  return <Component aria-hidden className={className} strokeWidth={strokeWidth} />;
}
