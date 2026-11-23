import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Info, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import FormNotice from '@/components/ui/FormNotice';
import type { FormState } from '@/components/ui/FormNotice';
import OrthodoxCross from '@/components/ui/OrthodoxCross';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import { getPage, moduleOn, payments, site, zapiski } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { addSlips, newId, slipLabels, slipTotal } from '@/lib/cart';
import type { ZapiskaSlip } from '@/lib/cart';
import { formatMoney } from '@/lib/format';
import { EMAIL_RE } from '@/lib/forms';
import { submitPayment } from '@/lib/payments';

export interface ZapiskiSection extends SectionBase {
  intro?: Localized;
}

function blankSlip(type: ZapiskaSlip['type'] = 'health'): ZapiskaSlip {
  const commemoration = zapiski.commemorations.find((c) => c.for.includes(type))?.id ?? '';
  return { id: newId('slip'), type, names: [{ prefix: '', name: '' }, { prefix: '', name: '' }, { prefix: '', name: '' }], commemoration, candle: '', extra: 0 };
}

function SlipEditor({
  slip,
  index,
  count,
  error,
  onChange,
  onRemove,
}: {
  slip: ZapiskaSlip;
  index: number;
  count: number;
  error?: string;
  onChange: (s: ZapiskaSlip) => void;
  onRemove: () => void;
}) {
  const { t, ui, language } = useI18n();
  const uid = useId();
  const repose = slip.type === 'repose';
  const type = zapiski.slipTypes.find((s) => s.id === slip.type);
  const money = (n: number) => formatMoney(n, payments.currency, language.locale);
  const ink = repose ? 'text-ink-900' : 'text-rose-800';
  const rule = repose ? 'border-ink-900/25' : 'border-rose-700/25';
  const filled = slip.names.filter((n) => n.name.trim()).length;

  const setType = (next: ZapiskaSlip['type']) => {
    const ok = zapiski.commemorations.find((c) => c.id === slip.commemoration)?.for.includes(next);
    onChange({ ...slip, type: next, commemoration: ok ? slip.commemoration : (zapiski.commemorations.find((c) => c.for.includes(next))?.id ?? '') });
  };
  const setName = (i: number, patch: Partial<ZapiskaSlip['names'][number]>) =>
    onChange({ ...slip, names: slip.names.map((n, j) => (j === i ? { ...n, ...patch } : n)) });

  return (
    <fieldset className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-describedby={error ? `${uid}-error` : undefined}>
      <legend className="sr-only">{ui('zapiski.slipN', { n: String(index + 1) })}</legend>
      {/* The paper slip */}
      <div className={`relative rounded-md bg-white p-5 shadow-md sm:p-8 ${repose ? 'border-[6px] border-ink-900' : 'border-2 border-rose-700'}`}>
        {count > 1 && (
          <button type="button" onClick={onRemove} className="absolute end-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-500 hover:bg-primary-50" aria-label={ui('zapiski.removeSlip')}>
            <X className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          </button>
        )}
        <div className={`flex flex-col items-center ${ink}`}>
          <OrthodoxCross className="h-12 w-12" strokeWidth={1.8} />
          <p className="ornament mt-2 text-center text-xl font-semibold uppercase tracking-[0.12em] sm:text-2xl">{type ? t(type.heading) : ''}</p>
        </div>

        <div role="radiogroup" aria-label={ui('zapiski.type')} className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-1 rounded-pill border border-primary-200 bg-primary-50 p-1">
          {zapiski.slipTypes.map((s) => (
            <label
              key={s.id}
              className={`flex min-h-10 cursor-pointer items-center justify-center rounded-pill px-2 text-center text-[13px] font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-400 ${
                slip.type === s.id ? (s.id === 'repose' ? 'bg-ink-900 text-white' : 'bg-rose-700 text-white') : 'text-primary-700'
              }`}
            >
              <input type="radio" name={`${uid}-type`} checked={slip.type === s.id} onChange={() => setType(s.id)} className="sr-only" />
              {t(s.label)}
            </label>
          ))}
        </div>

        <ol className="mt-6 space-y-2">
          {slip.names.map((n, i) => (
            <li key={i} className={`flex items-end gap-2 border-b ${rule} pb-1.5`}>
              <span className={`w-5 shrink-0 pb-2 text-end text-[13px] tabular-nums ${ink} opacity-60`}>{i + 1}</span>
              <label className="sr-only" htmlFor={`${uid}-prefix-${i}`}>
                {ui('zapiski.prefix')}
              </label>
              <select
                id={`${uid}-prefix-${i}`}
                value={n.prefix}
                onChange={(e) => setName(i, { prefix: e.target.value })}
                className="min-h-10 w-[6.5rem] shrink-0 rounded-lg border-0 bg-primary-50 px-2 text-[12.5px] text-primary-800 sm:w-32"
              >
                <option value="">{ui('zapiski.noPrefix')}</option>
                {zapiski.prefixes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {t(p.label)}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor={`${uid}-name-${i}`}>
                {ui('zapiski.nameN', { n: String(i + 1) })}
              </label>
              <input
                id={`${uid}-name-${i}`}
                value={n.name}
                onChange={(e) => setName(i, { name: e.target.value })}
                placeholder={i === 0 ? ui('zapiski.namePlaceholder') : ''}
                autoComplete="off"
                className={`min-h-10 min-w-0 flex-1 bg-transparent px-1 font-heading text-lg outline-none placeholder:font-sans placeholder:text-[13px] placeholder:text-ink-500 ${ink}`}
              />
              {slip.names.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...slip, names: slip.names.filter((_, j) => j !== i) })}
                  className="flex h-10 w-9 shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-primary-50 hover:text-rose-700"
                  aria-label={ui('zapiski.removeName', { n: String(i + 1) })}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                </button>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            disabled={slip.names.length >= zapiski.maxNames}
            onClick={() => onChange({ ...slip, names: [...slip.names, { prefix: '', name: '' }] })}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-pill px-3 text-[13px] font-semibold text-primary-800 hover:bg-primary-50 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
            {ui('zapiski.addName')}
          </button>
          <span className="text-[12px] text-ink-500">{ui('zapiski.namesCount', { n: String(filled), max: String(zapiski.maxNames) })}</span>
        </div>
        {error && (
          <p id={`${uid}-error`} className="field-error">
            {error}
          </p>
        )}
      </div>

      {/* Options for this slip */}
      <div className="space-y-5">
        <fieldset>
          <legend className="label">{ui('zapiski.commemoration')}</legend>
          <div className="space-y-2">
            {zapiski.commemorations
              .filter((c) => c.for.includes(slip.type))
              .map((c) => (
                <label
                  key={c.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-400 ${
                    slip.commemoration === c.id ? 'border-accent-400 bg-accent-50' : 'border-primary-200 bg-white hover:border-accent-300'
                  }`}
                >
                  <input type="radio" name={`${uid}-comm`} checked={slip.commemoration === c.id} onChange={() => onChange({ ...slip, commemoration: c.id })} className="mt-1 accent-[rgb(var(--color-primary-900))]" />
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between gap-2 text-[14px] font-semibold text-primary-900">
                      {t(c.label)}
                      <span className="shrink-0 font-medium text-ink-700">{money(c.suggested)}</span>
                    </span>
                    <span className="block text-[12.5px] leading-snug text-ink-500">{t(c.text)}</span>
                  </span>
                </label>
              ))}
          </div>
          <p className="mt-1.5 text-[12px] text-ink-500">{ui('zapiski.suggested')}</p>
        </fieldset>
        <div>
          <label htmlFor={`${uid}-candle`} className="label">
            <OrthodoxIcon name="candle" className="me-1.5 inline h-4 w-4 align-[-3px] text-accent-600" strokeWidth={1.8} />
            {ui('zapiski.candleOptional')}
          </label>
          <select id={`${uid}-candle`} className="field" value={slip.candle} onChange={(e) => onChange({ ...slip, candle: e.target.value })}>
            <option value="">{ui('zapiski.noCandle')}</option>
            {zapiski.candles.map((c) => (
              <option key={c.id} value={c.id}>
                {t(c.label)} · {money(c.price)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-extra`} className="label">
            {ui('zapiski.extra')}
          </label>
          <input
            id={`${uid}-extra`}
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            className="field"
            value={slip.extra || ''}
            onChange={(e) => onChange({ ...slip, extra: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <p className="flex justify-between border-t border-primary-200 pt-3 text-[15px] font-semibold text-primary-900">
          <span>{ui('zapiski.slipTotal')}</span>
          <span>{money(slipTotal(slip))}</span>
        </p>
      </div>
    </fieldset>
  );
}

export default function Zapiski({ section }: { section: ZapiskiSection }) {
  const { t, ui, lang, language } = useI18n();
  const uid = useId();
  const [slips, setSlips] = useState<ZapiskaSlip[]>(() => [blankSlip()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [donor, setDonor] = useState({ name: '', email: '' });
  const [donorErrors, setDonorErrors] = useState<{ name?: string; email?: string; consent?: string }>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>('idle');
  const [added, setAdded] = useState(0);
  const cart = getPage('cart');
  const canCart = moduleOn('store') && !!cart;
  const money = (n: number) => formatMoney(n, payments.currency, language.locale);
  const total = slips.reduce((n, s) => n + slipTotal(s), 0);

  const clean = () => slips.map((s) => ({ ...s, names: s.names.filter((n) => n.name.trim()).map((n) => ({ ...n, name: n.name.trim() })) }));

  const validateSlips = () => {
    const next: Record<string, string> = {};
    slips.forEach((s) => {
      if (!s.names.some((n) => n.name.trim())) next[s.id] = ui('zapiski.errorNames');
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const addToCart = () => {
    setState('idle');
    if (!validateSlips()) return;
    addSlips(clean());
    setAdded(slips.length);
    setSlips([blankSlip()]);
  };

  const donate = async (e: FormEvent) => {
    e.preventDefault();
    setAdded(0);
    const okSlips = validateSlips();
    const next: typeof donorErrors = {};
    if (!donor.name.trim()) next.name = ui('forms.errorName');
    if (!EMAIL_RE.test(donor.email.trim())) next.email = ui('forms.errorEmail');
    if (!consent) next.consent = ui('zapiski.consentRequired');
    setDonorErrors(next);
    if (!okSlips || Object.keys(next).length) return;
    setState('sending');
    const cleaned = clean();
    const res = await submitPayment({
      purpose: 'order',
      currency: payments.currency,
      lines: cleaned.map((s) => {
        const l = slipLabels(s, t);
        return { kind: 'zapiska', ref: s.id, description: `${l.type}, ${l.commemoration}`, quantity: 1, unitAmount: slipTotal(s) };
      }),
      total,
      customer: { name: donor.name.trim(), email: donor.email.trim() },
      details: { slips: cleaned },
      lang,
    });
    if (res.status === 'redirect') {
      window.location.assign(res.url);
      return;
    }
    setState(res.status);
    if (res.status === 'success') setSlips([blankSlip()]);
  };

  return (
    <section className="section bg-primary-50">
      <div className="container-px mx-auto max-w-[72rem]">
        {section.intro && <p className="max-w-3xl text-[15px] leading-relaxed text-ink-700">{t(section.intro)}</p>}
        <p className="mt-5 flex gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4 text-[14px] leading-relaxed text-ink-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" strokeWidth={1.8} aria-hidden />
          <span>{ui('zapiski.namesHint')}</span>
        </p>

        <form onSubmit={donate} noValidate className="mt-8">
          <div className="space-y-10">
            {slips.map((s, i) => (
              <SlipEditor
                key={s.id}
                slip={s}
                index={i}
                count={slips.length}
                error={errors[s.id]}
                onChange={(ns) => {
                  setSlips((list) => list.map((x) => (x.id === s.id ? ns : x)));
                  setErrors((er) => ({ ...er, [s.id]: '' }));
                }}
                onRemove={() => setSlips((list) => list.filter((x) => x.id !== s.id))}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setSlips((l) => [...l, blankSlip('health')])} className="btn-outline">
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              {ui('zapiski.addHealth')}
            </button>
            <button type="button" onClick={() => setSlips((l) => [...l, blankSlip('repose')])} className="btn-outline">
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              {ui('zapiski.addRepose')}
            </button>
          </div>

          <div className="card mt-10 p-6 sm:p-8">
            <p className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-heading text-2xl font-semibold text-primary-900">{ui('zapiski.total', { n: String(slips.length) })}</span>
              <span className="font-heading text-3xl font-semibold text-primary-900">{money(total)}</span>
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-name`} className="label">
                  {ui('forms.name')}
                </label>
                <input
                  id={`${uid}-name`}
                  className="field"
                  autoComplete="name"
                  value={donor.name}
                  onChange={(e) => setDonor((d) => ({ ...d, name: e.target.value }))}
                  aria-invalid={!!donorErrors.name}
                />
                {donorErrors.name && <p className="field-error">{donorErrors.name}</p>}
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className="label">
                  {ui('forms.email')}
                </label>
                <input
                  id={`${uid}-email`}
                  type="email"
                  className="field"
                  autoComplete="email"
                  value={donor.email}
                  onChange={(e) => setDonor((d) => ({ ...d, email: e.target.value }))}
                  aria-invalid={!!donorErrors.email}
                />
                {donorErrors.email && <p className="field-error">{donorErrors.email}</p>}
              </div>
            </div>

            <label className="mt-5 flex gap-3 text-[14px] leading-relaxed text-ink-700">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--color-primary-900))]" aria-invalid={!!donorErrors.consent} />
              {ui('zapiski.consent', { parish: t(site.name) })}
            </label>
            {donorErrors.consent && <p className="field-error">{donorErrors.consent}</p>}
            {canCart && <p className="mt-2 text-[12.5px] text-ink-500">{ui('zapiski.cartHint')}</p>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={state === 'sending'} className="btn-accent">
                <OrthodoxIcon name="candle" className="h-4 w-4" strokeWidth={1.8} />
                {state === 'sending' ? ui('give.processing') : ui('zapiski.donateSubmit', { amount: money(total) })}
              </button>
              {canCart && (
                <button type="button" onClick={addToCart} className="btn-outline">
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                  {ui('zapiski.addToCart')}
                </button>
              )}
            </div>
            <div role="status" aria-live="polite">
              {added > 0 && cart && (
                <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-900">
                  {ui('zapiski.added', { n: String(added) })}{' '}
                  <Link to={cart.path} className="font-semibold underline">
                    {ui('store.viewCart')}
                  </Link>
                </p>
              )}
            </div>
            <FormNotice state={state} success={ui('zapiski.success')} notConfigured={ui('checkout.notConfigured', { email: site.contact.email })} error={ui('forms.failed')} />
          </div>
        </form>
      </div>
    </section>
  );
}
