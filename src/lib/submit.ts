export type SubmitResult =
  | { status: 'redirect'; url: string }
  | { status: 'success' }
  | { status: 'not_configured' }
  | { status: 'error'; message?: string };

/** Posts JSON to an endpoint. No endpoint means the feature is not connected yet. */
export async function postJson(endpoint: string, body: unknown): Promise<SubmitResult> {
  if (!endpoint) return { status: 'not_configured' };
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` };
    const data = (await res.json().catch(() => ({}))) as { redirectUrl?: string };
    return data.redirectUrl ? { status: 'redirect', url: data.redirectUrl } : { status: 'success' };
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : undefined };
  }
}
