import { Link } from 'react-router-dom';
import { pageIsOn } from '@/lib/nav';
import { getPage } from '@/content';
import { useI18n } from '@/i18n';
import { isLive } from '@/lib/calendar';
import { useParishNow } from '@/lib/hooks';

/** A red "Live now" pill, shown while a streamed service is in progress. Links to the livestream page. */
export default function LiveBadge({ size = 'md', className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  const { ui } = useI18n();
  const now = useParishNow();
  if (!isLive(now)) return null;
  const to = pageIsOn('livestream') ? getPage('livestream')!.path : null;
  const cls = `inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-rose-600 font-medium uppercase text-white shadow-sm ${
    size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-[0.12em]' : 'px-2.5 py-1 text-[11px] tracking-[0.14em]'
  } ${className}`;
  const body = (
    <>
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      {ui('live.now')}
    </>
  );
  return to ? (
    <Link to={to} className={`${cls} transition-colors hover:bg-rose-500`}>
      {body}
    </Link>
  ) : (
    <span className={cls}>{body}</span>
  );
}
