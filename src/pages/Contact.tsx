import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLang } from '@/context/LangContext';
import { CLERGY, PARISH } from '@/data/parish';

const [EMAIL_USER, EMAIL_DOMAIN] = PARISH.email.split('@');
const EMAIL = `${EMAIL_USER}@${EMAIL_DOMAIN}`;

export default function Contact() {
  const { lang } = useLang();
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <PageHero
        eyebrow={lang === 'es' ? 'Contacto' : lang === 'ru' ? 'Контакты' : 'Contact'}
        title={lang === 'es' ? 'Estamos para servirle' : lang === 'ru' ? 'Мы к вашим услугам' : 'We Are Here to Serve You'}
        subtitle={
          lang === 'es'
            ? 'Para bautismos, bodas, confesiones, visitas o cualquier pregunta sobre la fe ortodoxa.'
            : lang === 'ru'
              ? 'По вопросам крещения, венчания, исповеди, посещения или о православной вере.'
              : 'For baptisms, weddings, confessions, visits, or any question about the Orthodox faith.'
        }
      />

      <section className="bg-navy-50 py-14 sm:py-24">
        <div className="container-px container-max">
          {/* Two matching cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-300">
                    <Mail className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-navy-900">
                    {lang === 'es' ? 'Correo de la parroquia' : lang === 'ru' ? 'Приходская почта' : 'Parish Email'}
                  </h3>
                </div>
                {revealed ? (
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-5 block break-all text-lg font-medium text-navy-900 underline-offset-4 hover:text-gold-600 hover:underline"
                  >
                    {EMAIL}
                  </a>
                ) : (
                  <button
                    onClick={() => setRevealed(true)}
                    className="mt-5 block text-lg font-medium text-gold-600 underline-offset-4 hover:underline"
                  >
                    {lang === 'es' ? 'Mostrar correo' : lang === 'ru' ? 'Показать адрес' : 'Show email'}
                  </button>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-300">
                    <MapPin className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-navy-900">
                    {lang === 'es' ? 'Dirección' : lang === 'ru' ? 'Адрес' : 'Address'}
                  </h3>
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-700">
                  Calle Corazón de Jesús
                  <br />
                  Vázquez de Coronado, San José
                  <br />
                  Costa Rica
                </p>
                <a
                  href={PARISH.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block w-fit text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-600 underline-offset-4 hover:underline"
                >
                  {lang === 'es' ? 'Ver en el mapa' : lang === 'ru' ? 'Открыть на карте' : 'View on map'}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Direct contacts */}
          <Reveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-serif text-xl font-semibold text-navy-900">
                {lang === 'es' ? 'Contactos directos' : lang === 'ru' ? 'Прямые контакты' : 'Direct Contacts'}
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CLERGY.map((member) => (
                  <div key={member.id} className="rounded-xl bg-navy-50 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                      {member.role[lang]}
                    </p>
                    <p className="mt-1 font-medium text-navy-900">{member.honorific[lang]}</p>
                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/[^+\d]/g, '')}`}
                        className="mt-1 block text-sm text-ink-700 transition-colors hover:text-navy-900"
                      >
                        {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-0.5 block break-all text-sm text-ink-700 transition-colors hover:text-navy-900"
                      >
                        {member.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
