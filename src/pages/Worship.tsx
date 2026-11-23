import PageHero from '@/components/PageHero';
import OrthodoxCalendar from '@/components/OrthodoxCalendar';
import { useLang } from '@/context/LangContext';

export default function Worship() {
  const { lang } = useLang();

  return (
    <>
      <PageHero
        eyebrow={lang === 'es' ? 'Horario' : lang === 'ru' ? 'Расписание' : 'Schedule'}
        title={lang === 'es' ? 'Horario de los servicios' : lang === 'ru' ? 'Расписание богослужений' : 'Schedule of Services'}
        subtitle={
          lang === 'es'
            ? 'Domingos: Confesión 9:00 AM · Divina Liturgia 10:00 AM. Los servicios de semana se anuncian en la parroquia.'
            : lang === 'ru'
              ? 'Воскресенья: Исповедь 9:00 AM · Божественная литургия 10:00 AM. Богослужения по будням объявляются в приходе.'
              : 'Sundays: Confession 9:00 AM · Divine Liturgy 10:00 AM. Weekday services are announced in the parish.'
        }
      />

      <OrthodoxCalendar />
    </>
  );
}
