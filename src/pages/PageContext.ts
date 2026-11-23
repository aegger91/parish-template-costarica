import { createContext, useContext } from 'react';
import type { PageContent } from '@/content';

export const PageContext = createContext<PageContent | null>(null);

/** The page whose sections are being rendered. */
export function usePage(): PageContent | null {
  return useContext(PageContext);
}
