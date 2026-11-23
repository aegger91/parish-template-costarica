import Icon from './Icon';

/**
 * Illustration slot for service cards. Shows the image when one is set; otherwise the icon
 * inside an arched, gilded frame like a small icon case, on a soft parchment ground.
 */
export default function IllustrationFrame({ image, icon, className = '' }: { image?: string; icon: string; className?: string }) {
  if (image) return <img src={image} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`} style={{ background: 'radial-gradient(circle at 50% 40%, rgb(var(--color-accent-50)), rgb(var(--color-primary-50)) 75%)' }}>
      <svg aria-hidden viewBox="0 0 200 120" className="absolute inset-0 h-full w-full text-accent-200" preserveAspectRatio="xMidYMid slice">
        <path d="M0 108 H200" stroke="currentColor" strokeWidth="1" />
        <path d="M0 112 H200" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <span className="relative flex h-[72%] max-h-28 items-center justify-center rounded-b-md rounded-t-full border-2 border-accent-400 bg-white px-[6%] shadow-sm ring-4 ring-white/60 aspect-[4/5]">
        <Icon name={icon} className="h-1/2 w-auto text-primary-800" strokeWidth={1.4} />
      </span>
    </div>
  );
}
