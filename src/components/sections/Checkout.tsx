import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Church, Lock, Truck } from 'lucide-react';
import CartLineView from '@/components/store/CartLineView';
import FormNotice from '@/components/ui/FormNotice';
import type { FormState } from '@/components/ui/FormNotice';
import { getPage, payments, site, store } from '@/content';
import type { SectionBase } from '@/content';

export type CheckoutSection = SectionBase;
import { useI18n } from '@/i18n';
import { clearCart, findProduct, slipLabels, findVariant, lineTotal, shippingFor, unitPrice, useCart } from '@/lib/cart';
import { formatMoney } from '@/lib/format';
import { EMAIL_RE, maskPhone, phoneComplete } from '@/lib/forms';
import { submitPayment } from '@/lib/payments';
import type { PaymentLine } from '@/lib/payments';

type Field = 'name' | 'email' | 'phone' | 'line1' | 'city' | 'postal' | 'consent';

export default function Checkout() {
  const { t, ui, lang, language } = useI18n();
  const uid = useId();
  const lines = useCart();
  const cart = getPage('cart');
  const money = (n: number) => formatMoney(n, payments.currency, language.locale);

  const shippableTotal = lines.reduce((n, l) => (l.kind === 'product' && findProduct(l.productId)?.shippable ? n + lineTotal(l) : n), 0);
  const hasShippable = shippableTotal > 0;
  const hasSlips = lines.some((l) => l.kind === 'zapiska');
  const [method, setMethod] = useState<'shipping' | 'pickup'>('pickup');
  const [v, setV] = useState({ name: '', email: '', phone: '', line1: '', line2: '', city: '', region: '', postal: '', country: store.shipping.countries[0] ?? '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<FormState>('idle');

  const subtotal = lines.reduce((n, l) => n + lineTotal(l), 0);
  const shipping = hasShippable && method === 'shipping' ? shippingFor(shippableTotal) : 0;
  const total = subtotal + shipping;
  const shipToHome = hasShippable && method === 'shipping';

  const set = (k: keyof typeof v, value: string) => {
    setV((s) => ({ ...s, [k]: value }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!v.name.trim()) next.name = ui('forms.errorName');
    if (!EMAIL_RE.test(v.email.trim())) next.email = ui('forms.errorEmail');
    if (v.phone && !phoneComplete(v.phone)) next.phone = ui('forms.errorPhone');
    if (shipToHome) {
      if (!v.line1.trim()) next.line1 = ui('forms.required');
      if (!v.city.trim()) next.city = ui('forms.required');
      if (!v.postal.trim()) next.postal = ui('forms.required');
    }
    if (hasSlips && !consent) next.consent = ui('zapiski.consentRequired');
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setState('sending');
    const paymentLines: PaymentLine[] = lines.map((l) => {
      if (l.kind === 'zapiska') {
        const labels = slipLabels(l.slip, t);
        return { kind: 'zapiska', ref: l.slip.id, description: `${labels.type}, ${labels.commemoration}`, quantity: 1, unitAmount: lineTotal(l) };
      }
      const product = findProduct(l.productId)!;
      const variant = findVariant(product, l.variantId);
      return {
        kind: 'product',
        ref: variant ? `${product.id}:${variant.id}` : product.id,
        description: [t(product.name), variant && t(variant.label)].filter(Boolean).join(', '),
        quantity: l.qty,
        unitAmount: unitPrice(product, l.variantId),
      };
    });
    const res = await submitPayment({
      purpose: 'order',
      currency: payments.currency,
      lines: paymentLines,
      total,
      fulfillment: hasShippable
        ? {
            method,
            shippingAmount: shipping,
            address: shipToHome ? { line1: v.line1, line2: v.line2, city: v.city, region: v.region, postal: v.postal, country: v.country } : undefined,
          }
        : undefined,
      customer: { name: v.name.trim(), email: v.email.trim(), phone: v.phone || undefined },
      details: { slips: lines.flatMap((l) => (l.kind === 'zapiska' ? [l.slip] : [])) },
      lang,
    });
    if (res.status === 'redirect') {
      window.location.assign(res.url);
      return;
    }
    setState(res.status);
    if (res.status === 'success') clearCart();
  };

  const field = (k: Field & keyof typeof v, label: string, props: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={`${uid}-${k}`} className="label">
        {label}
      </label>
      <input
        id={`${uid}-${k}`}
        className="field"
        value={v[k]}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `${uid}-${k}-error` : undefined}
        {...props}
      />
      {errors[k] && (
        <p id={`${uid}-${k}-error`} className="field-error">
          {errors[k]}
        </p>
      )}
    </div>
  );

  if (!lines.length && state !== 'success') {
    return (
      <section className="section">
        <div className="container-px mx-auto max-w-xl text-center">
          <p className="font-heading text-[23px] font-normal text-ink-900">{ui('cart.empty')}</p>
          {cart && (
            <Link to={cart.path} className="btn-outline mt-6">
              {ui('cart.label')}
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <form onSubmit={submit} noValidate className="container-px mx-auto grid max-w-container gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-8">
          <fieldset className="card p-6 sm:p-8">
            <legend className="sr-only">{ui('checkout.contact')}</legend>
            <h2 className="font-heading text-[23px] font-normal text-ink-900">{ui('checkout.contact')}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {field('name', ui('forms.name'), { autoComplete: 'name' })}
              {field('email', ui('forms.email'), { type: 'email', autoComplete: 'email' })}
              <div className="sm:col-span-2 sm:max-w-[50%] sm:pe-2.5">
                <label htmlFor={`${uid}-phone`} className="label">
                  {ui('forms.phoneOptional')}
                </label>
                <input
                  id={`${uid}-phone`}
                  type="tel"
                  dir="ltr"
                  inputMode="tel"
                  className="field text-start"
                  placeholder="(000)-000-0000"
                  autoComplete="tel-national"
                  value={v.phone}
                  onChange={(e) => set('phone', maskPhone(e.target.value))}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
            </div>
          </fieldset>

          {hasShippable && (
            <fieldset className="card p-6 sm:p-8">
              <legend className="sr-only">{ui('checkout.delivery')}</legend>
              <h2 className="font-heading text-[23px] font-normal text-ink-900">{ui('checkout.delivery')}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(['pickup', 'shipping'] as const).map((m) => (
                  <label
                    key={m}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-400 ${
                      method === m ? 'border-accent-400 bg-accent-50' : 'border-primary-200 hover:border-accent-300'
                    }`}
                  >
                    <input type="radio" name={`${uid}-method`} checked={method === m} onChange={() => setMethod(m)} className="mt-1 accent-[rgb(var(--color-primary-900))]" />
                    <span>
                      <span className="flex items-center gap-2 font-semibold text-primary-900">
                        {m === 'pickup' ? <Church className="h-4 w-4 text-accent-600" strokeWidth={1.8} aria-hidden /> : <Truck className="h-4 w-4 text-accent-600" strokeWidth={1.8} aria-hidden />}
                        {ui(`checkout.${m}`)}
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-ink-500">
                        {m === 'pickup'
                          ? `${t(store.pickup.location)}. ${t(store.pickup.note)}`
                          : shippingFor(shippableTotal) === 0
                            ? ui('checkout.freeShipping')
                            : ui('checkout.shippingCost', { rate: money(store.shipping.flatRate), free: money(store.shipping.freeOver) })}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {shipToHome && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">{field('line1', ui('checkout.address1'), { autoComplete: 'address-line1' })}</div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`${uid}-line2`} className="label">
                      {ui('checkout.address2')}
                    </label>
                    <input id={`${uid}-line2`} className="field" autoComplete="address-line2" value={v.line2} onChange={(e) => set('line2', e.target.value)} />
                  </div>
                  {field('city', ui('checkout.city'), { autoComplete: 'address-level2' })}
                  <div>
                    <label htmlFor={`${uid}-region`} className="label">
                      {ui('checkout.region')}
                    </label>
                    <input id={`${uid}-region`} className="field" autoComplete="address-level1" value={v.region} onChange={(e) => set('region', e.target.value)} />
                  </div>
                  {field('postal', ui('checkout.postal'), { autoComplete: 'postal-code' })}
                  <div>
                    <label htmlFor={`${uid}-country`} className="label">
                      {ui('checkout.country')}
                    </label>
                    <select id={`${uid}-country`} className="field" value={v.country} onChange={(e) => set('country', e.target.value)}>
                      {store.shipping.countries.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </fieldset>
          )}

          {hasSlips && (
            <div className="card p-6 sm:p-8">
              <label className="flex gap-3 text-[14px] leading-relaxed text-ink-700">
                <input
                  id={`${uid}-consent`}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setErrors((er) => ({ ...er, consent: undefined }));
                  }}
                  className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--color-primary-900))]"
                  aria-invalid={!!errors.consent}
                />
                {ui('zapiski.consent', { parish: t(site.name) })}
              </label>
              {errors.consent && <p className="field-error">{errors.consent}</p>}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-primary-50 p-6 lg:sticky lg:top-28">
          <h2 className="font-heading text-[23px] font-normal text-ink-900">{ui('checkout.summary')}</h2>
          <ul className="mt-2 divide-y divide-primary-100">
            {lines.map((l) => (
              <CartLineView key={l.key} line={l} editable={false} />
            ))}
          </ul>
          <dl className="mt-2 space-y-2 border-t border-primary-200 pt-4 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-ink-700">{ui('cart.subtotal')}</dt>
              <dd className="font-medium text-primary-900">{money(subtotal)}</dd>
            </div>
            {hasShippable && (
              <div className="flex justify-between">
                <dt className="text-ink-700">{ui(method === 'pickup' ? 'checkout.pickup' : 'checkout.shipping')}</dt>
                <dd className="font-medium text-primary-900">{shipping ? money(shipping) : ui('checkout.free')}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-primary-200 pt-3 text-lg">
              <dt className="font-semibold text-primary-900">{ui('checkout.total')}</dt>
              <dd className="font-semibold text-primary-900">{money(total)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={state === 'sending' || !lines.length} className="btn-accent mt-6 w-full">
            <Lock className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            {state === 'sending' ? ui('give.processing') : ui('checkout.pay', { amount: money(total) })}
          </button>
          <p className="mt-3 text-center text-[12px] text-ink-500">{ui('checkout.secure')}</p>
          <FormNotice state={state} success={ui('checkout.success')} notConfigured={ui('checkout.notConfigured', { email: site.contact.email })} error={ui('forms.failed')} />
        </aside>
      </form>
    </section>
  );
}

