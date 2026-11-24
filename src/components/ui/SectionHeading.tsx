interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  rule?: boolean;
  as?: 'h1' | 'h2';
}

/** Eyebrow, serif heading and a short gold hairline, used at the top of most sections. */
export default function SectionHeading({
  eyebrow,
  title,
  align = 'center',
  tone = 'light',
  rule = true,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center';
  const dark = tone === 'dark';
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : ''}>
      {eyebrow && <p className={`eyebrow ${dark ? 'text-accent-200' : 'text-accent-700'}`}>{eyebrow}</p>}
      <Tag className={`heading-section mt-2.5 ${dark ? 'text-white' : 'text-ink-900'}`}>{title}</Tag>
      {rule && <div className={`accent-rule mt-5 ${centered ? 'mx-auto' : ''} ${dark ? 'opacity-90' : ''}`} />}
    </div>
  );
}
