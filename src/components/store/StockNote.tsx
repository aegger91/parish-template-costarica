import { store } from '@/content';
import { useI18n } from '@/i18n';

export default function StockNote({ stock, className = '' }: { stock: number; className?: string }) {
  const { ui } = useI18n();
  if (stock <= 0) return <span className={`text-[12px] font-semibold text-rose-700 ${className}`}>{ui('store.soldOut')}</span>;
  if (stock <= store.lowStockAt) return <span className={`text-[12px] font-semibold text-accent-700 ${className}`}>{ui('store.fewLeft', { count: String(stock) })}</span>;
  return <span className={`text-[12px] text-emerald-700 ${className}`}>{ui('store.inStock')}</span>;
}
