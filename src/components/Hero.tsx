import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

export default function Hero() {
  const { lang } = useLang();

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-navy-950">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/5177128844341743000_(1).jpg')" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,18,30,0.55) 0%, rgba(8,18,30,0.45) 50%, rgba(13,35,56,0.88) 100%)',
        }}
      />

      <div className="container-px container-max relative py-24 text-center sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
            {lang === 'es' ? (
              <>
                Iglesia de la <span className="text-gold-300">Virgen de Vladimir</span>
              </>
            ) : lang === 'ru' ? (
              <>
                Храм <span className="text-gold-300">Владимирской</span> иконы Божией Матери
              </>
            ) : (
              <>
                Our Lady of <span className="text-gold-300">Vladimir</span> Church
              </>
            )}
          </h1>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300 sm:text-[12px]">
            {lang === 'es'
              ? 'Iglesia Ortodoxa Rusa Fuera de Rusia'
              : lang === 'ru'
                ? 'Русская Православная Церковь Заграницей'
                : 'Russian Orthodox Church Outside of Russia'}
          </p>
          <p className="mt-5 text-base leading-relaxed text-navy-100 sm:text-lg">
            {lang === 'es' ? 'Todos son bienvenidos.' : lang === 'ru' ? 'Все приглашены.' : 'Everyone is welcome.'}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/visit"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-900 transition-all hover:bg-gold-300 sm:px-7 sm:py-3.5 sm:text-[13px] sm:tracking-[0.16em]"
            >
              {lang === 'es' ? 'Planee su visita' : lang === 'ru' ? 'Как нас найти' : 'Plan a Visit'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
            <Link
              to="/worship"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-gold-300 hover:text-gold-200 sm:px-7 sm:py-3.5 sm:text-[13px] sm:tracking-[0.16em]"
            >
              {lang === 'es' ? 'Horario de servicios' : lang === 'ru' ? 'Расписание богослужений' : 'Service Schedule'}
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-2 text-center text-sm font-medium text-white sm:mt-12 sm:flex-row">
            <Clock className="h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.8} />
            <span>
              {lang === 'es'
                ? 'Domingos: Confesión 9:00 AM · Liturgia 10:00 AM'
                : lang === 'ru'
                  ? 'Воскресные: Исповедь 9:00 AM · Литургия 10:00 AM'
                  : 'Sundays: Confession 9:00 AM · Liturgy 10:00 AM'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
