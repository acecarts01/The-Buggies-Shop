import ShopClient from './ShopClient';
import { hubContent } from '@/src/config/category-content';

// Server wrapper: the hub copy and FAQs live in the server-only
// category-content.ts and reach the client component as props.
export default function ShopPage() {
  const hub = hubContent();
  return (
    <ShopClient
      hub={{ h1: hub.h1, intro: hub.intro, sections: hub.sections, faqs: hub.faqs }}
    />
  );
}
