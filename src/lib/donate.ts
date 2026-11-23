import { giving } from '@/content';

export interface DonationRequest {
  amount: number;
  currency: string;
  /** id from giving.json "frequencies", e.g. "once" or "monthly" */
  frequency: string;
  /** id from giving.json "funds", or "" when no designation was chosen */
  fundId: string;
  donor: { name: string; email: string };
  /** language code the donor was using, for receipts */
  lang: string;
}

export type DonationResult =
  | { status: 'redirect'; url: string }
  | { status: 'success' }
  | { status: 'not_configured' }
  | { status: 'error'; message?: string };

/**
 * Single entry point for online giving. The form calls only this function.
 *
 * TODO(payments): connect a payment provider here. No keys belong in this repo.
 *   - Keep card handling on the provider's hosted page (Stripe Checkout, Authorize.net
 *     Accept Hosted, etc.) so card data never touches this site.
 *   - The "endpoint" provider below expects a small server route (in the website builder)
 *     that receives this JSON, creates the one-time or recurring checkout session with the
 *     provider's secret key, and replies with { "redirectUrl": "https://..." }.
 *   - Set "provider": "endpoint" and "checkoutEndpoint" in src/content/giving.json to enable it.
 */
export async function submitDonation(request: DonationRequest): Promise<DonationResult> {
  switch (giving.provider) {
    case 'endpoint': {
      if (!giving.checkoutEndpoint) return { status: 'not_configured' };
      try {
        const res = await fetch(giving.checkoutEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
        if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` };
        const data = (await res.json()) as { redirectUrl?: string };
        return data.redirectUrl ? { status: 'redirect', url: data.redirectUrl } : { status: 'success' };
      } catch (err) {
        return { status: 'error', message: err instanceof Error ? err.message : undefined };
      }
    }
    case 'none':
    default:
      return { status: 'not_configured' };
  }
}
