import { SECTIONS } from '@/components/sections/registry';
import type { PageContent } from '@/content';
import { useSeo } from '@/lib/seo';
import { PageContext } from './PageContext';

export default function Page({ page }: { page: PageContent }) {
  useSeo(page);

  return (
    <PageContext.Provider value={page}>
      {page.sections
        .filter((s) => s.enabled !== false)
        .map((section) => {
          const Section = SECTIONS[section.type];
          if (!Section) {
            if (import.meta.env.DEV) console.warn(`Unknown section type "${section.type}" on page "${page.id}"`);
            return null;
          }
          return (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              <Section section={section} />
            </div>
          );
        })}
    </PageContext.Provider>
  );
}
