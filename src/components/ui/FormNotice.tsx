import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { SubmitResult } from '@/lib/submit';

export type FormState = 'idle' | 'sending' | SubmitResult['status'];

/** Status message under a form, read out by screen readers when it changes. */
export default function FormNotice({
  state,
  success,
  notConfigured,
  error,
  tone = 'light',
}: {
  state: FormState;
  success: string;
  notConfigured: string;
  error: string;
  tone?: 'light' | 'dark';
}) {
  const map = {
    success: { text: success, Icon: CheckCircle2, cls: tone === 'dark' ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100' : 'border-emerald-200 bg-emerald-50 text-emerald-900' },
    redirect: { text: success, Icon: CheckCircle2, cls: tone === 'dark' ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100' : 'border-emerald-200 bg-emerald-50 text-emerald-900' },
    not_configured: { text: notConfigured, Icon: Info, cls: tone === 'dark' ? 'border-accent-300/40 bg-accent-400/10 text-accent-100' : 'border-accent-200 bg-accent-50 text-accent-900' },
    error: { text: error, Icon: AlertCircle, cls: tone === 'dark' ? 'border-rose-300/40 bg-rose-400/10 text-rose-100' : 'border-rose-200 bg-rose-50 text-rose-900' },
  } as const;
  const entry = state === 'idle' || state === 'sending' ? null : map[state];
  return (
    <div role="status" aria-live="polite">
      {entry && (
        <p className={`mt-4 flex gap-2.5 rounded-xl border px-4 py-3 text-[14px] leading-relaxed ${entry.cls}`}>
          <entry.Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
          <span>{entry.text}</span>
        </p>
      )}
    </div>
  );
}
