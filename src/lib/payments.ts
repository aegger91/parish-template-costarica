import { payments } from '@/content';
import { postJson } from './submit';
import type { SubmitResult } from './submit';

export interface PaymentLine {
  kind: 'product' | 'zapiska' | 'donation';
  /** product id, slip id or fund id */
  ref: string;
  description: string;
  quantity: number;
  unitAmount: number;
}

export interface PaymentOrder {
  /** "order" for the store and commemoration notes, "gift" for donations */
  purpose: 'order' | 'gift';
  currency: string;
  lines: PaymentLine[];
  total: number;
  /** "once" or "monthly" for gifts */
  frequency?: string;
  fulfillment?: { method: 'shipping' | 'pickup'; shippingAmount: number; address?: Record<string, string> };
  customer: { name: string; email: string; phone?: string };
  /** Details the parish needs, e.g. the names on commemoration slips */
  details?: unknown;
  /** language code the buyer was using, for receipts */
  lang: string;
}

/**
 * Single entry point for every payment on the site: donations, the store and commemoration notes.
 *
 * TODO(payments): connect Stripe or Authorize.net here. No keys belong in this repo.
 *   - Keep card handling on the provider's hosted page (Stripe Checkout, Authorize.net Accept Hosted)
 *     so card data never touches this site.
 *   - This posts the order as JSON to a small server route (in the website builder) that creates
 *     the checkout session with the provider's secret key, checks prices and stock against
 *     src/content/store.json, and replies with { "redirectUrl": "https://..." }.
 *   - Set "checkoutEndpoint" in src/content/payments.json to enable it.
 */
export async function submitPayment(order: PaymentOrder): Promise<SubmitResult> {
  return postJson(payments.checkoutEndpoint, order);
}
