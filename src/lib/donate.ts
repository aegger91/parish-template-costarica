import { payments } from '@/content';
import { submitPayment } from './payments';
import type { SubmitResult } from './submit';

export interface DonationRequest {
  amount: number;
  /** id from giving.json "frequencies", e.g. "once" or "monthly" */
  frequency: string;
  /** id of a fund or project, or "" when no designation was chosen */
  fundId: string;
  fundLabel: string;
  donor: { name: string; email: string };
  lang: string;
}

export type DonationResult = SubmitResult;

/** Gifts go through the same payment hand-off as the store; see TODO(payments) in payments.ts. */
export function submitDonation(request: DonationRequest): Promise<DonationResult> {
  return submitPayment({
    purpose: 'gift',
    currency: payments.currency,
    lines: [{ kind: 'donation', ref: request.fundId, description: request.fundLabel, quantity: 1, unitAmount: request.amount }],
    total: request.amount,
    frequency: request.frequency,
    customer: request.donor,
    lang: request.lang,
  });
}
