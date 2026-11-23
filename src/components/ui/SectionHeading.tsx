import OrthodoxCross from './OrthodoxCross';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  rule?: boolean;
  as?: 'h1' | 'h2';
}

/** Eyebrow + serif heading + gold double-rule / cross ornament, used at the top of most sections. */
export default function SectionHeading({
  eyebrow,
  title,
  align = 'center',
  tone = 'light',
  rule = true,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : ''}>
      {eyebrow && (
        <p className={`eyebrow ${tone === 'dark' ? 'text-accent-300' : 'text-accent-700'}`}>{eyebrow}</p>
      )}
      <Tag className={`heading-section mt-3 ${tone === 'dark' ? 'text-white' : 'text-primary-900'}`}>{title}</Tag>
      {rule &&
        (centered ? (
          <div className={`ornament-divider mt-6 ${tone === 'dark' ? 'text-accent-300' : ''}`} aria-hidden>
            <OrthodoxCross className="ornament-divider__cross h-5 w-auto" strokeWidth={1.8} />
          </div>
        ) : (
          <div className={`accent-rule mt-6 ${tone === 'dark' ? 'opacity-90' : ''}`} />
        ))}
    </div>
  );
}
