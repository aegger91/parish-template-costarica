interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  rule?: boolean;
  as?: 'h1' | 'h2';
}

/** Eyebrow + serif heading + plain thin rule. */
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
      {eyebrow && <p className={`eyebrow ${tone === 'dark' ? 'text-accent-300' : 'text-accent-700'}`}>{eyebrow}</p>}
      <Tag className={`heading-section mt-3 ${tone === 'dark' ? 'text-white' : 'text-primary-900'}`}>{title}</Tag>
      {rule && <div className={`accent-rule mt-5 ${centered ? 'mx-auto' : ''} ${tone === 'dark' ? 'bg-accent-400/80' : ''}`} />}
    </div>
  );
}
