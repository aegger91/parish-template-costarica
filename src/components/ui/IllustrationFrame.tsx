import Icon from './Icon';

/** Illustration slot for service cards. Shows the image when one is set; otherwise the icon in a thin gold ring. */
export default function IllustrationFrame({ image, icon, className = '' }: { image?: string; icon: string; className?: string }) {
  if (image) return <img src={image} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-cream-deep/70 ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent-400/70 bg-paper">
        <Icon name={icon} className="h-7 w-7 text-accent-700" strokeWidth={1.4} />
      </span>
    </div>
  );
}
