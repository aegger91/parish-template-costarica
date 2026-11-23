import { site } from '@/content';
import OrthodoxCross from './OrthodoxCross';

/** The parish logo from site.json "logo.src", or an Orthodox cross when no logo is set. */
export default function Logo({ decorative = false }: { decorative?: boolean }) {
  if (site.logo.src) {
    return (
      <img
        src={site.logo.src}
        alt={decorative ? '' : site.logo.alt}
        width={48}
        height={48}
        className="h-full w-full object-cover"
      />
    );
  }
  return <OrthodoxCross className="h-3/5 w-3/5 text-primary-800" strokeWidth={2.2} />;
}
