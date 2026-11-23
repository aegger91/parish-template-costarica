import { Minus, Plus } from 'lucide-react';
import { useI18n } from '@/i18n';

export default function QtyStepper({ value, max, onChange, label }: { value: number; max: number; onChange: (n: number) => void; label: string }) {
  const { ui } = useI18n();
  return (
    <div className="inline-flex items-center rounded-pill border border-primary-200 bg-white" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-full text-primary-800 disabled:opacity-40"
        aria-label={ui('store.less')}
      >
        <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
      <span className="min-w-8 text-center text-[15px] font-semibold tabular-nums text-primary-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center rounded-full text-primary-800 disabled:opacity-40"
        aria-label={ui('store.more')}
      >
        <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
