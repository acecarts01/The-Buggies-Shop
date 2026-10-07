import ShopClient from './ShopClient';
import { hubContent } from '@/src/config/category-content';
import { createLinker } from '@/lib/autolink';

// Server wrapper: the hub copy and FAQs live in the server-only
// category-content.ts and reach the client component as props.
export default function ShopPage() {
  const hub = hubContent();
  const linker = createLinker('/shop/', 6, 1);
  const sections = hub.sections.map((sec) => ({ ...sec, segs: linker.link(sec.body) }));
  return (
    <ShopClient
      hub={{ h1: hub.h1, intro: hub.intro, sections, faqs: hub.faqs }}
    />
  );
}
