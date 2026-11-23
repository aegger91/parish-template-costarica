import {
  CalendarDays,
  Church,
  Clock,
  Globe2,
  HandHeart,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

/** Icon names that content files may reference. Add entries here to allow more. */
const ICONS: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  church: Church,
  clock: Clock,
  globe: Globe2,
  'hand-heart': HandHeart,
  'heart-handshake': HeartHandshake,
  mail: Mail,
  'map-pin': MapPin,
  phone: Phone,
  users: Users,
};

export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = ICONS[name] ?? Church;
  return <Component aria-hidden {...props} />;
}
