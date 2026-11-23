import { site } from '@/content';
import type { LogoStyle } from '@/content';
import { useI18n } from '@/i18n';
import OrthodoxCross from './OrthodoxCross';

const FRAME: Record<Exclude<LogoStyle, 'wordmark'>, string> = {
  seal: 'rounded-full border border-white/40 aspect-square',
  // An icon case (kiot): arched top, square base, gilded edge.
  kiot: 'rounded-t-[999px] rounded-b-[5px] border-2 border-accent-400 aspect-[4/5] p-[3px]',
  square: 'rounded-[6px] border border-white/30 aspect-square',
};

const SIZE = {
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-14',
};

/** The logo image from site.json "logo.src" in its frame, or an Orthodox cross when no image is set. */
export function LogoMark({ style = site.logo.style, size = 'md', className = '' }: { style?: LogoStyle; size?: keyof typeof SIZE; className?: string }) {
  if (style === 'wordmark') return null;
  const inner = site.logo.src ? (
    <img src={site.logo.src} alt="" width={56} height={56} className="h-full w-full object-cover" />
  ) : (
    <OrthodoxCross className="h-3/5 w-3/5 text-primary-800" strokeWidth={2.2} />
  );
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-white transition-all duration-300 ${FRAME[style]} ${SIZE[size]} ${className}`}>
      {style === 'kiot' ? (
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-t-[999px] rounded-b-[3px] bg-white ring-1 ring-primary-900/10">
          {inner}
        </span>
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
  nameClassName = '',
}: {
  style?: LogoStyle;
  size?: keyof typeof SIZE;
  nameClassName?: string;
}) {
  const { t } = useI18n();
  if (style === 'wordmark') {
    return (
      <span className="flex min-w-0 flex-col">
        <span className={`font-heading font-semibold leading-tight tracking-wide text-white ${nameClassName}`}>{t(site.name)}</span>
        {site.logo.wordmarkSubtitle && (
          <span className="ornament mt-0.5 text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-accent-300 sm:text-[11px]">
            {t(site.logo.wordmarkSubtitle)}
          </span>
        )}
      </span>
    );
  }
  return (
    <>
      <LogoMark style={style} size={size} />
      <span className={`min-w-0 font-heading font-semibold leading-tight tracking-wide text-white ${nameClassName}`}>{t(site.name)}</span>
    </>
  );
}

export default LogoMark;
