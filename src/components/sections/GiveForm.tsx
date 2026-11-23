import { useEffect, useId, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, Info, Loader2, Mail, Phone } from 'lucide-react';
import OrthodoxIcon from '@/components/ui/OrthodoxIcon';
import Reveal from '@/components/ui/Reveal';
import { useSearchParams } from 'react-router-dom';
import { clergy, giving, payments } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { submitDonation } from '@/lib/donate';
import type { DonationResult } from '@/lib/donate';
import { formatMoney, telHref } from '@/lib/format';
import { EMAIL_RE } from '@/lib/forms';

export interface GiveFormSection extends SectionBase {
  formTitle: Localized;
  asideTitle?: Localized;
  asideText?: Localized;
  quote?: Localized;
}

type Errors = Partial<Record<'amount' | 'name' | 'email', string>>;


function currencySymbol(currency: string, locale: string): string {
  return (
    new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find((p) => p.type === 'currency')?.value ?? currency
  );
}

export default function GiveForm({ section }: { section: GiveFormSection }) {
  const { t, ui, lang, language } = useI18n();
  const uid = useId();
  const [frequency, setFrequency] = useState(giving.frequencies[0]?.id ?? 'once');
  const [preset, setPreset] = useState<number | null>(giving.defaultAmount && giving.defaultAmount > 0 ? giving.defaultAmount : null);
  const [custom, setCustom] = useState('');
  const [params] = useSearchParams();
  const designations = [...giving.funds.map((f) => ({ id: f.id, label: f.label })), ...giving.projects.map((p) => ({ id: p.id, label: p.title }))];
  const [fundId, setFundId] = useState(() => {
    const wanted = params.get('fund');
    return designations.some((d) => d.id === wanted) ? wanted! : (giving.funds[0]?.id ?? '');
  });
  const wantedFund = params.get('fund');
  useEffect(() => {
    if (wantedFund && designations.some((d) => d.id === wantedFund)) setFundId(wantedFund);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantedFund]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<DonationResult | null>(null);

  const contact = clergy.find((m) => m.id === giving.contactId);
  const symbol = useMemo(() => currencySymbol(payments.currency, language.locale), [language.locale]);
  const rawCustom = custom.trim();
  const amount = rawCustom ? Number(rawCustom.replace(',', '.')) : (preset ?? 0);
  const amountEntered = rawCustom !== '' || preset !== null;
  const validAmount = !amountEntered || (Number.isFinite(amount) && amount >= 0);
  const money = Number.isFinite(amount) && amount > 0 ? formatMoney(amount, payments.currency, language.locale) : formatMoney(0, payments.currency, language.locale);
  const recurring = frequency !== 'once';

  const submitLabel =
    amount > 0
      ? ui(recurring ? 'give.submitRecurring' : 'give.submitOnce', { amount: money })
      : ui('give.submitEmpty');

  const validate = (): Errors => {
    const next: Errors = {};
    if (!validAmount) next.amount = ui('give.errorAmount');
    if (!name.trim()) next.name = ui('give.errorName');
    if (!EMAIL_RE.test(email.trim())) next.email = ui('give.errorEmail');
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setResult(null);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    const res = await submitDonation({
      amount,
      frequency,
      fundId,
      fundLabel: t(designations.find((d) => d.id === fundId)?.label),
      donor: { name: name.trim(), email: email.trim() },
      lang,
    });
    setSubmitting(false);
    if (res.status === 'redirect') {
      window.location.assign(res.url);
      return;
    }
    setResult(res);
  };

  const pill = (active: boolean) =>
    [
      'flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center font-semibold transition-colors',
      'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-400 has-[:focus-visible]:ring-offset-2',
      active
        ? 'border-accent-400 bg-accent-50 text-primary-900 shadow-sm'
        : 'border-primary-200 bg-white text-primary-700 hover:border-accent-300',
    ].join(' ');

  const labelCls = 'block text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-700';
  const errorCls = 'mt-2 flex items-center gap-1.5 text-sm text-rose-700';

  return (
    <section className="section bg-primary-50">
      <div className="container-px container-max grid gap-6 lg:grid-cols-5 lg:gap-8">
        <Reveal className="lg:col-span-3">
          <form
            noValidate
            onSubmit={onSubmit}
            className="h-full rounded-2xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8"
            aria-labelledby={`${uid}-title`}
          >
            <h2 id={`${uid}-title`} className="font-heading text-2xl font-semibold text-primary-900 sm:text-3xl">
              {t(section.formTitle)}
            </h2>
            <div className="accent-rule mt-5" />

            {giving.frequencies.length > 1 && (
              <fieldset className="mt-8">
                <legend className={labelCls}>{ui('give.frequency')}</legend>
                <div
                  className="mt-3 grid gap-1 rounded-pill border border-primary-200 bg-primary-50 p-1"
                  style={{ gridTemplateColumns: `repeat(${giving.frequencies.length}, minmax(0, 1fr))` }}
                >
                  {giving.frequencies.map((f) => (
                    <label
                      key={f.id}
                      className={[
                        'flex min-h-10 cursor-pointer items-center justify-center rounded-pill px-3 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors',
                        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-400',
                        frequency === f.id ? 'bg-primary-900 text-white shadow' : 'text-primary-700 hover:text-primary-900',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name={`${uid}-frequency`}
                        value={f.id}
                        checked={frequency === f.id}
                        onChange={() => setFrequency(f.id)}
                        className="sr-only"
                      />
                      {t(f.label)}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset className="mt-8" aria-describedby={errors.amount ? `${uid}-amount-error` : undefined}>
              <legend className={labelCls}>{ui('give.amount')}</legend>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {giving.presetAmounts.map((value) => (
                  <label key={value} className={`${pill(!custom && preset === value)} text-lg`}>
                    <input
                      type="radio"
                      name={`${uid}-amount`}
                      value={value}
                      checked={!custom && preset === value}
                      onChange={() => {
                        setPreset(value);
                        setCustom('');
                        setErrors((er) => ({ ...er, amount: undefined }));
                      }}
                      className="sr-only"
                    />
                    {formatMoney(value, payments.currency, language.locale)}
                  </label>
                ))}
              </div>
              <label htmlFor={`${uid}-amount`} className="mt-4 block text-sm font-medium text-ink-700">
                {ui('give.otherAmount')}
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-ink-500">
                  {symbol}
                </span>
                <input
                  id={`${uid}-amount`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value.replace(/[^\d.,]/g, ''));
                    setPreset(null);
                    setErrors((er) => ({ ...er, amount: undefined }));
                  }}
                  aria-invalid={!!errors.amount}
                  className="field"
                  style={{ paddingInlineStart: `${Math.max(2.25, symbol.length * 0.6 + 1.5)}rem` }}
                />
              </div>
              {errors.amount && (
                <p id={`${uid}-amount-error`} className={errorCls}>
                  <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
                  {errors.amount}
                </p>
              )}
            </fieldset>

            {giving.funds.length > 0 && (
              <div className="mt-8">
                <label htmlFor={`${uid}-fund`} className={labelCls}>
                  {ui('give.fund')}
                </label>
                <div className="relative mt-3">
                  <select
                    id={`${uid}-fund`}
                    value={fundId}
                    onChange={(e) => setFundId(e.target.value)}
                    className="field appearance-none pe-10"
                  >
                    {giving.funds.map((f) => (
                      <option key={f.id} value={f.id}>
                        {t(f.label)}
                      </option>
                    ))}
                    {giving.projects.length > 0 && (
                      <optgroup label={ui('give.projects')}>
                        {giving.projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {t(p.title)}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </div>
              </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-name`} className={labelCls}>
                  {ui('give.name')}
                </label>
                <input
                  id={`${uid}-name`}
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((er) => ({ ...er, name: undefined }));
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                  className="field mt-3"
                />
                {errors.name && (
                  <p id={`${uid}-name-error`} className={errorCls}>
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className={labelCls}>
                  {ui('give.email')}
                </label>
                <input
                  id={`${uid}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((er) => ({ ...er, email: undefined }));
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={`${uid}-email-help${errors.email ? ` ${uid}-email-error` : ''}`}
                  className="field mt-3"
                />
                <p id={`${uid}-email-help`} className="mt-2 text-[13px] text-ink-500">
                  {ui('give.emailHelp')}
                </p>
                {errors.email && (
                  <p id={`${uid}-email-error`} className={errorCls}>
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-accent mt-10 w-full py-4 text-[13px] disabled:opacity-70">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
              ) : (
                <OrthodoxIcon name="candle" className="h-4 w-4" strokeWidth={1.8} />
              )}
              {submitting ? ui('give.processing') : submitLabel}
            </button>

            <div aria-live="polite" className="empty:hidden">
              {result?.status === 'not_configured' && (
                <p className="mt-5 flex gap-3 rounded-xl bg-accent-50 p-4 text-sm leading-relaxed text-ink-700">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.8} aria-hidden />
                  {ui('give.notConfigured')}
                </p>
              )}
              {result?.status === 'success' && (
                <p className="mt-5 flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
                  {ui('give.success')}
                </p>
              )}
              {result?.status === 'error' && (
                <p className="mt-5 flex gap-3 rounded-xl bg-rose-50 p-4 text-sm leading-relaxed text-rose-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
                  {ui('give.failed')}
                </p>
              )}
            </div>
          </form>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-2">
          <aside className="flex flex-col rounded-2xl bg-primary-900 p-6 text-primary-100 sm:p-8">
            {section.asideTitle && (
              <h2 className="font-heading text-2xl font-semibold text-white">{t(section.asideTitle)}</h2>
            )}
            {section.asideText && <p className="mt-4 text-[15px] leading-relaxed">{t(section.asideText)}</p>}
            {contact && (
              <div className="mt-6 rounded-xl border border-white/10 bg-primary-800/60 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-300">{t(contact.role)}</p>
                <p className="mt-1 font-heading text-xl font-semibold text-white">{t(contact.name)}</p>
                <div className="mt-3 space-y-2 text-sm">
                  {contact.phone && (
                    <a href={telHref(contact.phone)} className="flex min-h-6 items-center gap-2.5 hover:text-accent-200">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-accent-300" strokeWidth={1.8} aria-hidden />
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="flex min-h-6 items-center gap-2.5 break-all hover:text-accent-200">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-accent-300" strokeWidth={1.8} aria-hidden />
                      {contact.email}
                    </a>
                  )}
                </div>
              </div>
            )}
            {section.quote && (
              <p className="mt-8 border-t border-white/10 pt-6 font-heading text-lg italic leading-snug text-primary-100">
                {t(section.quote)}
              </p>
            )}
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
