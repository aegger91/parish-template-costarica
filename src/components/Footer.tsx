import { Link } from 'react-router-dom';
import { MapPin, Mail, Globe } from 'lucide-react';
import { PARISH } from '@/data/parish';
import { useLang } from '@/context/LangContext';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-px container-max grid gap-10 py-12 sm:gap-12 sm:py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-400/50 bg-white">
              <img
                src="/images/5177128844341742972_(1)%20copy.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <div className="min-w-0">
              <p className="break-words font-serif text-lg leading-snug text-white sm:text-xl">
                {lang === 'es'
                  ? 'Iglesia de la Virgen de Vladimir'
                  : lang === 'ru'
                    ? 'Храм Владимирской иконы Божией Матери'
                    : 'Our Lady of Vladimir Church'}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-navy-200">
            {lang === 'es'
              ? 'Diócesis Oriental Americana de la Iglesia Ortodoxa Rusa Fuera de Rusia'
              : lang === 'ru'
                ? 'Восточно-Американская епархия Русской Православной Церкви Заграницей'
                : 'Eastern American Diocese of the Russian Orthodox Church Outside of Russia'}
          </p>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            {lang === 'es' ? 'Visítenos' : lang === 'ru' ? 'Приезжайте' : 'Visit Us'}
          </h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
              <span className="min-w-0 break-words">{PARISH.mailingAddress[lang]}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
              <a href={`mailto:${PARISH.email}`} className="min-w-0 break-all transition-colors hover:text-gold-200">
                {PARISH.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
              <a
                href={PARISH.website}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-gold-200"
              >
                ortodoxacr.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-300">
            {lang === 'es' ? 'Horario de servicios' : lang === 'ru' ? 'Богослужения' : 'Service Schedule'}
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-navy-200">
            <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span className="min-w-0">{lang === 'es' ? 'Confesión' : lang === 'ru' ? 'Исповедь' : 'Confession'}</span>
              <span className="shrink-0 font-medium text-white">{PARISH.services.confession}</span>
            </li>
            <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span className="min-w-0">{lang === 'es' ? 'Liturgia Divina' : lang === 'ru' ? 'Божественная литургия' : 'Divine Liturgy'}</span>
              <span className="shrink-0 font-medium text-white">{PARISH.services.liturgy}</span>
            </li>
            <li className="pt-1 text-[13px] italic text-navy-300">
              {lang === 'es'
                ? 'Los domingos y días festivos. Consulte el horario para servicios de días de semana.'
                : lang === 'ru'
                  ? 'По воскресеньям и праздникам. О будничных богослужениях смотрите расписание.'
                  : 'Sundays and feast days. See the schedule for weekday services.'}
            </li>
          </ul>
          <Link
            to="/worship"
            className="mt-6 inline-block rounded-full border border-gold-400/60 px-5 py-2 text-[12px] font-medium uppercase tracking-[0.16em] text-gold-200 transition-colors hover:bg-gold-400/10"
          >
            {lang === 'es' ? 'Horario' : lang === 'ru' ? 'Расписание' : 'Schedule'}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px container-max flex flex-col items-center justify-between gap-3 py-6 text-[12px] text-navy-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{' '}
            {lang === 'es'
              ? 'Iglesia de la Virgen de Vladimir. Todos los derechos reservados.'
              : lang === 'ru'
                ? 'Храм Владимирской иконы Божией Матери. Все права защищены.'
                : 'Our Lady of Vladimir Church. All rights reserved.'}
          </p>
          <p>{lang === 'es' ? 'Hecho con oración en Costa Rica' : lang === 'ru' ? 'Создано с молитвой в Коста-Рике' : 'Made with prayer in Costa Rica'}</p>
        </div>
      </div>
    </footer>
  );
}
