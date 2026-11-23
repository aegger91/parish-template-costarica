import { site } from '@/content';

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
  return (
    <svg viewBox="0 0 48 48" className="h-3/5 w-3/5 text-primary-800" aria-hidden fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
      <path d="M24 6v36M16 13h16M12 22h24M18 33l12-5" />
    </svg>
  );
}
