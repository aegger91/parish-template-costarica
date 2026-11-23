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

export function formatDate(iso: string, locale: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
}
