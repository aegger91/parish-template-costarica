import { useCallback, useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import FormNotice from '@/components/ui/FormNotice';
import type { FormState } from '@/components/ui/FormNotice';
import IllustrationFrame from '@/components/ui/IllustrationFrame';
import Modal from '@/components/ui/Modal';
import Reveal from '@/components/ui/Reveal';
import { clergy, serviceRequestTypes, site } from '@/content';
import type { Localized, SectionBase, ServiceRequestType } from '@/content';
import { useI18n } from '@/i18n';
import { formatDuration } from '@/lib/format';
import { EMAIL_RE, maskPhone, phoneComplete, submitServiceRequest } from '@/lib/forms';
import { isoFromJdn, parishNow } from '@/lib/time';

export interface ServiceRequestsSection extends SectionBase {
  intro?: Localized;
}

function PriceBadge({ price }: { price: ServiceRequestType['price'] }) {
  const { ui } = useI18n();
  return (
    <span className={`rounded-pill px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${price === 'free' ? 'bg-emerald-50 text-emerald-800' : 'bg-accent-50 text-accent-800'}`}>
      {ui(price === 'free' ? 'requests.free' : 'requests.donation')}
    </span>
  );
}

type Field = 'name' | 'phone' | 'email' | 'date';

function RequestForm({ type, onDone }: { type: ServiceRequestType; onDone: () => void }) {
  const { t, ui, lang } = useI18n();
  const uid = useId();
  const [v, setV] = useState({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<FormState>('idle');
  const recipient = clergy.find((c) => c.id === type.sendTo);
  const today = isoFromJdn(parishNow(site.timeZone).jdn);

  const set = (k: keyof typeof v, value: string) => {
    setV((s) => ({ ...s, [k]: value }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!v.name.trim()) next.name = ui('forms.errorName');
    if (!phoneComplete(v.phone)) next.phone = ui('forms.errorPhone');
    if (!EMAIL_RE.test(v.email.trim())) next.email = ui('forms.errorEmail');
    if (v.date && v.date < today) next.date = ui('requests.errorDate');
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setState('sending');
    const res = await submitServiceRequest({
      typeId: type.id,
      sendTo: type.sendTo,
      name: v.name.trim(),
      phone: v.phone,
      email: v.email.trim(),
      preferredDate: v.date,
      preferredTime: v.time,
      notes: v.notes.trim(),
      lang,
    });
    setState(res.status);
  };

  const errorFor = (k: Field) =>
    errors[k] ? (
      <p id={`${uid}-${k}-error`} className="field-error">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: Field) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${uid}-${k}-error` : undefined });

  if (state === 'success') {
    return (
      <div className="pt-4 text-center">
        <p className="font-heading text-2xl font-semibold text-primary-900">{ui('requests.thanks')}</p>
        <p className="mt-3 text-[15px] text-ink-700">{ui('requests.thanksText')}</p>
        <button type="button" onClick={onDone} className="btn-primary mt-6">
          {ui('close')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <p className="eyebrow text-[11px] text-accent-600">{ui('requests.formEyebrow')}</p>
      <h2 className="mt-1 pe-10 font-heading text-2xl font-semibold leading-snug text-primary-900 sm:text-3xl">{t(type.title)}</h2>
      <p className="mt-2 text-[13.5px] text-ink-500">
        {ui('requests.sentTo', { who: recipient ? `${t(recipient.name)}, ${t(recipient.role)}` : ui('requests.office') })}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-name`} className="label">
            {ui('forms.name')}
          </label>
          <input id={`${uid}-name`} className="field" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} />
          {errorFor('name')}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="label">
            {ui('forms.phone')}
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(000)-000-0000"
            className="field text-start"
            value={v.phone}
            onChange={(e) => set('phone', maskPhone(e.target.value))}
            {...aria('phone')}
          />
          {errorFor('phone')}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="label">
            {ui('forms.email')}
          </label>
          <input id={`${uid}-email`} type="email" autoComplete="email" className="field" value={v.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />
          {errorFor('email')}
        </div>
        <div>
          <label htmlFor={`${uid}-date`} className="label">
            {ui('requests.date')}
          </label>
          <input id={`${uid}-date`} type="date" min={today} className="field" value={v.date} onChange={(e) => set('date', e.target.value)} {...aria('date')} />
          {errorFor('date')}
        </div>
        <div>
          <label htmlFor={`${uid}-time`} className="label">
            {ui('requests.time')}
          </label>
          <input id={`${uid}-time`} type="time" className="field" value={v.time} onChange={(e) => set('time', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-notes`} className="label">
            {ui('requests.notes')}
          </label>
          <textarea id={`${uid}-notes`} rows={3} className="field" value={v.notes} onChange={(e) => set('notes', e.target.value)} placeholder={ui('requests.notesHint')} />
        </div>
      </div>
      <button type="submit" disabled={state === 'sending'} className="btn-accent mt-6 w-full">
        {state === 'sending' ? ui('forms.sending') : ui('requests.send')}
      </button>
      <FormNotice state={state} success={ui('requests.thanks')} notConfigured={ui('forms.notConfigured', { email: site.contact.email })} error={ui('forms.failed')} />
    </form>
  );
}

export default function ServiceRequests({ section }: { section: ServiceRequestsSection }) {
  const { t, ui, language } = useI18n();
  const [open, setOpen] = useState<ServiceRequestType | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="section bg-primary-50">
      <div className="container-px mx-auto max-w-[80rem]">
        {section.intro && <p className="mx-auto max-w-3xl text-center text-[15px] leading-relaxed text-ink-700">{t(section.intro)}</p>}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviceRequestTypes.map((type, i) => {
            const body = (
              <>
                <div className="aspect-[5/3] overflow-hidden border-b border-primary-100">
                  <IllustrationFrame image={type.image} icon={type.icon} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <PriceBadge price={type.price} />
                    {type.durationMinutes > 0 && (
                      <span className="inline-flex items-center gap-1 text-[12px] text-ink-500">
                        <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                        {formatDuration(type.durationMinutes, language.locale)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-primary-900">{t(type.title)}</h3>
                  <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink-700">{t(type.summary)}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-700">
                    {ui(type.link ? 'requests.open' : 'requests.request')}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" strokeWidth={2} aria-hidden />
                  </span>
                </div>
              </>
            );
            const cls =
              'group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white text-start shadow-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-primary-900/10';
            return (
              <li key={type.id}>
                <Reveal delay={0.04 * (i % 4)} className="h-full">
                  {type.link ? (
                    <Link to={type.link} className={cls}>
                      {body}
                    </Link>
                  ) : (
                    <button type="button" onClick={() => setOpen(type)} className={cls} aria-haspopup="dialog">
                      {body}
                    </button>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
      <Modal open={!!open} onClose={close} title={open ? t(open.title) : ''}>
        {open && <RequestForm key={open.id} type={open} onDone={close} />}
      </Modal>
    </section>
  );
}
