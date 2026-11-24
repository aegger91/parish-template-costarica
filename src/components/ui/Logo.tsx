import { site } from '@/content';
import type { LogoStyle } from '@/content';
import { useI18n } from '@/i18n';
import ChurchMark from './ChurchMark';
import OrthodoxCross from './OrthodoxCross';

type FramedStyle = Exclude<LogoStyle, 'wordmark' | 'church'>;

const FRAME: Record<FramedStyle, string> = {
  seal: 'rounded-full border border-accent-400/60 aspect-square',
  kiot: 'rounded-t-[999px] rounded-b-[5px] border border-accent-400/70 aspect-[4/5] p-[3px]',
  square: 'rounded-[6px] border border-accent-400/60 aspect-square',
};

const SIZE = {
  sm: { frame: 'h-10', church: 'h-9' },
  md: { frame: 'h-[3.25rem]', church: 'h-12' },
  lg: { frame: 'h-16', church: 'h-[4.25rem]' },
};

type Size = keyof typeof SIZE;
type Tone = 'dark' | 'light';

/** The parish mark: the church line drawing, or the image from site.json "logo.src" in its frame. */
export function LogoMark({
  style = site.logo.style,
  size = 'md',
  tone = 'dark',
  className = '',
}: {
  style?: LogoStyle;
  size?: Size;
  tone?: Tone;
  className?: string;
}) {
  if (style === 'wordmark') return null;
  if (style === 'church') {
    return (
      <ChurchMark
        className={`w-auto shrink-0 ${SIZE[size].church} ${tone === 'light' ? 'text-accent-300' : 'text-accent-500'} ${className}`}
        strokeWidth={size === 'sm' ? 2 : 1.7}
      />
    );
  }
  const inner = site.logo.src ? (
    <img src={site.logo.src} alt="" width={56} height={56} className="h-full w-full object-cover" />
  ) : (
    <OrthodoxCross className="h-3/5 w-3/5 text-accent-600" strokeWidth={2.2} />
  );
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-paper ${FRAME[style]} ${SIZE[size].frame} ${className}`}>
      {style === 'kiot' ? (
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-t-[999px] rounded-b-[3px] bg-paper">{inner}</span>
      ) : (
        inner
      )}
    </span>
  );
}

/** Logo plus parish name. In the wordmark style the name is the whole logo. */
export function Brand({
  style = site.logo.style,
  size = 'md',
  tone = 'dark',
  nameClassName = '',
}: {
  style?: LogoStyle;
  size?: Size;
  tone?: Tone;
  nameClassName?: string;
}) {
  const { t } = useI18n();
  const color = tone === 'light' ? 'text-white' : 'text-ink-900';
  const name = (
    <span className={`min-w-0 font-heading font-normal leading-[1.18] [text-wrap:balance] ${color} ${nameClassName}`}>{t(site.name)}</span>
  );
  if (style === 'wordmark') {
    return (
      <span className="flex min-w-0 flex-col">
        {name}
        {site.logo.wordmarkSubtitle && (
          <span className={`eyebrow mt-1 text-[10px] sm:text-[11px] ${tone === 'light' ? 'text-accent-300' : 'text-accent-600'}`}>
            {t(site.logo.wordmarkSubtitle)}
          </span>
        )}
      </span>
    );
  }
  return (
    <>
      <LogoMark style={style} size={size} tone={tone} />
      {name}
    </>
  );
}

export default LogoMark;
