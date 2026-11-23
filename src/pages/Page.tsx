import { SECTIONS } from '@/components/sections/registry';
import type { PageContent } from '@/content';
import { useSeo } from '@/lib/seo';

export default function Page({ page }: { page: PageContent }) {
  useSeo(page);

  return (
    <>
      {page.sections
        .filter((s) => s.enabled !== false)
        .map((section) => {
          const Section = SECTIONS[section.type];
          if (!Section) {
            if (import.meta.env.DEV) console.warn(`Unknown section type "${section.type}" on page "${page.id}"`);
            return null;
          }
          return <Section key={section.id} section={section} />;
        })}
    </>
  );
}
