import { orthodoxConnectSampleItems, site } from '@/content';
import type { OrthodoxConnectItem } from '@/content';

export interface OrthodoxConnectFeed {
  items: OrthodoxConnectItem[];
  isSample: boolean;
}

/**
 * Loads the parish feed (events, volunteer requests, needs) from OrthodoxConnect.
 *
 * TODO(orthodoxconnect): set `orthodoxConnect.feedUrl` in src/content/site.json once the
 * OrthodoxConnect API is available, and adjust the mapping below to its response shape.
 * Until then, the sample items in src/content/orthodoxconnect.sample.json are shown and
 * labeled as sample data.
 */
export async function loadOrthodoxConnectFeed(): Promise<OrthodoxConnectFeed> {
  const url = site.orthodoxConnect.feedUrl;
  if (!url) return { items: orthodoxConnectSampleItems, isSample: true };

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { items?: OrthodoxConnectItem[] };
    return { items: data.items ?? [], isSample: false };
  } catch {
    return { items: [], isSample: false };
  }
}
