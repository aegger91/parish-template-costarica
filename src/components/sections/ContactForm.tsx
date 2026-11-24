import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { MapPin, Navigation, Send } from 'lucide-react';
import FormNotice from '@/components/ui/FormNotice';
import type { FormState } from '@/components/ui/FormNotice';
import Reveal from '@/components/ui/Reveal';
import { site } from '@/content';
import type { Localized, SectionBase } from '@/content';
import { useI18n } from '@/i18n';
import { EMAIL_RE, maskPhone, phoneComplete, submitContactMessage } from '@/lib/forms';

export interface ContactFormSection extends SectionBase {
  title: Localized;
  text?: Localized;
  topics: { id: string; label: Localized }[];
}

type Field = 'name' | 'email' | 'phone' | 'message';

/** Map of the church. Uses OpenStreetMap when site.json "map" has coordinates. */
export function ParishMap({ className = '' }: { className?: string }) {
  const { t, ui } = useI18n();
  const { lat, lng, zoom } = site.map;
  if (lat !== null && lng !== null) {
    const d = 0.6 / 2 ** (zoom - 10);
    const bbox = [lng - d, lat - d / 2, lng + d, lat + d / 2].join(',');
    return (
      <iframe
        title={ui('contact.map')}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
        className={`h-full w-full border-0 ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <div className={`relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden bg-primary-50 p-6 text-center ${className}`}>
      <svg aria-hidden className="absolute inset-0 h-full w-full text-primary-200" preserveAspectRatio="none">
        <defs>
          <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <line x1="0" y1="70%" x2="100%" y2="56%" stroke="currentColor" strokeWidth="10" />
        <line x1="62%" y1="0" x2="54%" y2="100%" stroke="currentColor" strokeWidth="6" />
      </svg>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg">
        <MapPin className="h-6 w-6" strokeWidth={1.8} aria-hidden />
      </span>
      <p className="relative max-w-xs font-heading text-lg font-normal text-ink-900">{t(site.address.singleLine)}</p>
      <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="btn-primary relative" aria-label={`${ui('hero.directions')} (${ui('opensInNewTab')})`}>
        <Navigation className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        {ui('hero.directions')}
      </a>
    </div>
  );
}

export default function ContactForm({ section }: { section: ContactFormSection }) {
  const { t, ui, lang } = useI18n();
  const uid = useId();
  const [values, setValues] = useState({ name: '', email: '', phone: '', topic: section.topics[0]?.id ?? '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<FormState>('idle');

  const set = (k: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = ui('forms.errorName');
    if (!EMAIL_RE.test(values.email.trim())) next.email = ui('forms.errorEmail');
    if (values.phone && !phoneComplete(values.phone)) next.phone = ui('forms.errorPhone');
    if (!values.message.trim()) next.message = ui('forms.errorMessage');
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setState('sending');
    const topic = section.topics.find((x) => x.id === values.topic);
    const res = await submitContactMessage({ ...values, topic: topic ? t(topic.label) : '', lang });
    setState(res.status);
    if (res.status === 'success') setValues((s) => ({ ...s, message: '' }));
  };

  const err = (k: Field) =>
    errors[k] ? (
      <p id={`${uid}-${k}-error`} className="field-error">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: Field) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${uid}-${k}-error` : undefined });

  return (
    <section className="section">
      <div className="container-px mx-auto grid max-w-container gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
            <h2 className="font-heading text-[23px] font-normal text-ink-900 sm:text-3xl">{t(section.title)}</h2>
            <div className="accent-rule mt-5" />
            {section.text && <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{t(section.text)}</p>}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-name`} className="label">
                  {ui('forms.name')}
                </label>
                <input id={`${uid}-name`} className="field" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} />
                {err('name')}
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className="label">
                  {ui('forms.email')}
                </label>
                <input id={`${uid}-email`} type="email" className="field" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />
                {err('email')}
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className="label">
                  {ui('forms.phoneOptional')}
                </label>
                <input
                  id={`${uid}-phone`}
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  className="field text-start"
                  autoComplete="tel-national"
                  placeholder="(000)-000-0000"
                  value={values.phone}
                  onChange={(e) => set('phone', maskPhone(e.target.value))}
                  {...aria('phone')}
                />
                {err('phone')}
              </div>
              {section.topics.length > 0 && (
                <div>
                  <label htmlFor={`${uid}-topic`} className="label">
                    {ui('forms.topic')}
                  </label>
                  <select id={`${uid}-topic`} className="field" value={values.topic} onChange={(e) => set('topic', e.target.value)}>
                    {section.topics.map((x) => (
                      <option key={x.id} value={x.id}>
                        {t(x.label)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-message`} className="label">
                  {ui('forms.message')}
                </label>
                <textarea id={`${uid}-message`} rows={5} className="field" value={values.message} onChange={(e) => set('message', e.target.value)} {...aria('message')} />
                {err('message')}
              </div>
            </div>
            <button type="submit" disabled={state === 'sending'} className="btn-accent mt-6 w-full sm:w-auto">
              <Send className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.8} aria-hidden />
              {state === 'sending' ? ui('forms.sending') : ui('forms.send')}
            </button>
            <FormNotice
              state={state}
              success={ui('forms.sent')}
              notConfigured={ui('forms.notConfigured', { email: site.contact.email })}
              error={ui('forms.failed')}
            />
          </form>
        </Reveal>
        <Reveal delay={0.1} className="min-h-[22rem] overflow-hidden rounded-2xl border border-primary-100 shadow-sm lg:min-h-0">
          <ParishMap />
        </Reveal>
      </div>
    </section>
  );
}
