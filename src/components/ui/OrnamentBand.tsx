/** Thin Byzantine / Slavonic ornamental band — gold diamonds with a three-bar cross. */
export default function OrnamentBand({ className = '' }: { className?: string }) {
  return (
    <div className={`ornament-band ${className}`} aria-hidden>
      <svg className="ornament-band__motif" viewBox="0 0 480 12" preserveAspectRatio="none">
        <defs>
          <pattern id="ornament-diamonds" width="40" height="12" patternUnits="userSpaceOnUse">
            <path d="M20 1.5 L23.5 6 L20 10.5 L16.5 6 Z" fill="currentColor" opacity="0.55" />
            <path d="M0 6 H14 M26 6 H40" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
          </pattern>
        </defs>
        <rect width="480" height="12" fill="url(#ornament-diamonds)" />
        {/* Center three-bar cross accent */}
        <g transform="translate(232 0)" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" fill="none">
          <path d="M8 1.2v9.6M5.6 3.2h4.8M3.2 5.4h9.6M5.2 8l5.6 2" />
        </g>
      </svg>
    </div>
  );
}
