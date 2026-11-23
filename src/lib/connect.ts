import { useEffect, useState } from 'react';
import { connectSampleItems, site } from '@/content';
import type { ConnectItem } from '@/content';
import { postJson } from './submit';
import type { SubmitResult } from './submit';

export interface ConnectFeed {
  items: ConnectItem[];
  isSample: boolean;
}

/**
 * Loads events, volunteer opportunities and needs from OrthodoxConnect.
 *
 * TODO(orthodoxconnect): set "orthodoxConnect.feedUrl" in site.json once the API is available,
 * and adjust the mapping below to its response. Until then the sample items in
 * src/content/connect.json are shown and labeled as samples.
 */
export async function loadConnectFeed(): Promise<ConnectFeed> {
  const url = site.orthodoxConnect.feedUrl;
  if (!url) return { items: connectSampleItems, isSample: true };
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { items?: ConnectItem[] };
    return { items: data.items ?? [], isSample: false };
  } catch {
    return { items: [], isSample: false };
  }
}

export type ConnectAction = 'create-event' | 'post-need' | 'open-item';

/**
 * Hand-off links into the OrthodoxConnect app, carrying the parish id.
 * TODO(orthodoxconnect): confirm the real link format with the OrthodoxConnect team.
 */
export function connectLinks(action: ConnectAction, itemId?: string): { app: string; web: string } {
  const { parishId, appUrl, deepLinkScheme } = site.orthodoxConnect;
  const path = `parish/${encodeURIComponent(parishId)}/${action}${itemId ? `/${encodeURIComponent(itemId)}` : ''}`;
  return { app: `${deepLinkScheme}${path}`, web: `${appUrl.replace(/\/$/, '')}/${path}` };
}

export interface ConnectSignup {
  itemId: string;
  name: string;
  email: string;
  lang: string;
}

/**
 * Sign-ups and RSVPs use the visitor's OrthodoxConnect account.
 * TODO(orthodoxconnect): replace with the account sign-in and sign-up call once available.
 */
export function signUpOnConnect(signup: ConnectSignup): Promise<SubmitResult> {
  return postJson(site.orthodoxConnect.signupEndpoint, { parishId: site.orthodoxConnect.parishId, ...signup });
}

export function useConnectFeed(): ConnectFeed | null {
  const [feed, setFeed] = useState<ConnectFeed | null>(null);
  useEffect(() => {
    let alive = true;
    loadConnectFeed().then((f) => alive && setFeed(f));
    return () => {
      alive = false;
    };
  }, []);
  return feed;
}
