export { formatDate } from './time';

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  return words
    .slice(-2)
    .map((w) => w[0])
    .join('');
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function formatDuration(minutes: number, locale: string): string {
  if (minutes < 60) return new Intl.NumberFormat(locale, { style: 'unit', unit: 'minute', unitDisplay: 'short' }).format(minutes);
  const hours = minutes / 60;
  return new Intl.NumberFormat(locale, { style: 'unit', unit: 'hour', unitDisplay: 'long', maximumFractionDigits: 1 }).format(hours);
}
