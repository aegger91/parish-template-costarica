import { useCallback, useId, useState } from 'react';
import type { FormEvent, MouseEvent, ReactNode } from 'react';
import { ExternalLink, MapPin, User, Users } from 'lucide-react';
import FormNotice from '@/components/ui/FormNotice';
import type { FormState } from '@/components/ui/FormNotice';
import Modal from '@/components/ui/Modal';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { connectCategories } from '@/content';
import type { ConnectItem } from '@/content';
import { useI18n } from '@/i18n';
import { connectLinks, signUpOnConnect } from '@/lib/connect';
import type { ConnectAction, ConnectFeed } from '@/lib/connect';
import { EMAIL_RE } from '@/lib/forms';
import { formatDay, formatTime, jdnFromIso } from '@/lib/time';

/** Tries the OrthodoxConnect app first and falls back to the web app when it is not installed. */
function openInConnect(e: MouseEvent<HTMLAnchorElement>, action: ConnectAction, itemId?: string) {
  const { app, web } = connectLinks(action, itemId);
  e.preventDefault();
  const fallback = window.setTimeout(() => window.location.assign(web), 900);
  const cancel = () => window.clearTimeout(fallback);
  window.addEventListener('blur', cancel, { once: true });
  document.addEventListener('visibilitychange', cancel, { once: true });
  window.location.href = app;
}

export function ConnectBadge() {
  const { ui } = useI18n();
  return (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-pill border border-primary-200 bg-white px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-primary-700">
      <OrthodoxIcon name="church" className="h-3 w-3 text-accent-600" strokeWidth={2} />
      {ui('connect.badge')}
    </span>
  );
}

export function ConnectActions({ actions }: { actions: { action: ConnectAction; label: string }[] }) {
  const { ui } = useI18n();
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-3 text-[14px] leading-relaxed text-ink-700">
        <OrthodoxIcon name="church" className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" strokeWidth={1.6} />
        {ui('connect.intro')}
      </p>
      <div className="flex shrink-0 flex-wrap gap-2">
        {actions.map((a) => (
          <a key={a.action} href={connectLinks(a.action).web} onClick={(e) => openInConnect(e, a.action)} className="btn-primary min-h-10 px-4 py-2">
            {a.label}
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}

export function SampleNote({ feed }: { feed: ConnectFeed | null }) {
  const { ui } = useI18n();
  if (!feed?.isSample) return null;
  return <p className="mt-3 text-[12.5px] italic text-ink-500">{ui('connect.sample')}</p>;
}

export function Capacity({ item }: { item: ConnectItem }) {
  const { ui } = useI18n();
  if (!item.capacity) {
    return (
      <p className="flex items-center gap-1.5 text-[13px] text-ink-500">
        <Users className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
        {ui('connect.going', { n: String(item.signups) })}
      </p>
    );
  }
  const pct = Math.min(100, Math.round((item.signups / item.capacity) * 100));
  const left = Math.max(0, item.capacity - item.signups);
  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-pill bg-primary-100" aria-hidden>
        <div className={`h-full rounded-pill ${left ? 'bg-accent-400' : 'bg-primary-400'}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 flex justify-between gap-2 text-[12.5px] text-ink-500">
        <span>{ui(item.kind === 'event' ? 'connect.goingOf' : 'connect.filledOf', { n: String(item.signups), max: String(item.capacity) })}</span>
        <span className={left ? 'font-semibold text-accent-700' : 'font-semibold text-primary-700'}>{left ? ui('connect.left', { n: String(left) }) : ui('connect.full')}</span>
      </p>
    </div>
  );
}

export function ItemMeta({ item, showDate = true }: { item: ConnectItem; showDate?: boolean }) {
  const { t, ui, language } = useI18n();
  const category = connectCategories.find((c) => c.id === item.category);
  const when = [
    showDate && item.date ? formatDay(jdnFromIso(item.date), language.locale, { weekday: 'short', day: 'numeric', month: 'short' }) : '',
    item.time ? formatTime(item.time, language.locale) : '',
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <div className="space-y-1 text-[13px] text-ink-500">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {category && <span className="font-medium uppercase tracking-[0.1em] text-accent-700">{t(category.label)}</span>}
        {when && <span>{when}</span>}
        {!item.date && <span>{ui(item.kind === 'need' ? 'connect.ongoing' : 'connect.regular')}</span>}
      </p>
      {t(item.location) && (
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden />
          {t(item.location)}
        </p>
      )}
      <p className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden />
        {ui('connect.organizer', { name: item.organizer })}
      </p>
    </div>
  );
}

/** RSVP or sign-up with an OrthodoxConnect account. */
export function SignupButton({ item, label }: { item: ConnectItem; label: string }) {
  const { t, ui, lang } = useI18n();
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ name: '', email: '' });
  const [err, setErr] = useState<{ name?: string; email?: string }>({});
  const [state, setState] = useState<FormState>('idle');
  const close = useCallback(() => setOpen(false), []);
  const full = item.capacity > 0 && item.signups >= item.capacity;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof err = {};
    if (!v.name.trim()) next.name = ui('forms.errorName');
    if (!EMAIL_RE.test(v.email.trim())) next.email = ui('forms.errorEmail');
    setErr(next);
    if (Object.keys(next).length) return;
    setState('sending');
    const res = await signUpOnConnect({ itemId: item.id, name: v.name.trim(), email: v.email.trim(), lang });
    setState(res.status);
  };

  return (
    <>
      <button type="button" disabled={full} onClick={() => setOpen(true)} className={full ? 'btn-outline' : 'btn-accent min-h-10 px-5 py-2'}>
        {full ? ui('connect.full') : label}
      </button>
      <Modal open={open} onClose={close} title={t(item.title)}>
        <form onSubmit={submit} noValidate>
          <ConnectBadge />
          <h2 className="mt-3 pe-10 font-heading text-[23px] font-normal leading-snug text-ink-900">{t(item.title)}</h2>
          <div className="mt-3">
            <ItemMeta item={item} />
          </div>
          <p className="mt-5 rounded-xl bg-primary-50 p-4 text-[13.5px] leading-relaxed text-ink-700">{ui('connect.accountNote')}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-name`} className="label">
                {ui('forms.name')}
              </label>
              <input id={`${uid}-name`} className="field" autoComplete="name" value={v.name} onChange={(e) => setV((s) => ({ ...s, name: e.target.value }))} aria-invalid={!!err.name} />
              {err.name && <p className="field-error">{err.name}</p>}
            </div>
            <div>
              <label htmlFor={`${uid}-email`} className="label">
                {ui('forms.email')}
              </label>
              <input id={`${uid}-email`} type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => setV((s) => ({ ...s, email: e.target.value }))} aria-invalid={!!err.email} />
              {err.email && <p className="field-error">{err.email}</p>}
            </div>
          </div>
          <button type="submit" disabled={state === 'sending'} className="btn-accent mt-6 w-full">
            {state === 'sending' ? ui('forms.sending') : ui('connect.confirm')}
          </button>
          <FormNotice state={state} success={ui('connect.signedUp')} notConfigured={ui('connect.notConfigured')} error={ui('forms.failed')} />
        </form>
      </Modal>
    </>
  );
}

export function ItemCard({ item, action, children }: { item: ConnectItem; action: string; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <article className="flex h-full flex-col rounded-2xl border border-primary-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        {children}
        <ConnectBadge />
      </div>
      <h3 className="mt-3 font-heading text-xl font-normal leading-snug text-ink-900">{t(item.title)}</h3>
      {item.summary && <p className="mt-1.5 text-[14px] leading-relaxed text-ink-700">{t(item.summary)}</p>}
      <div className="mt-3">
        <ItemMeta item={item} />
      </div>
      <div className="mt-auto space-y-4 pt-5">
        <Capacity item={item} />
        <SignupButton item={item} label={action} />
      </div>
    </article>
  );
}
