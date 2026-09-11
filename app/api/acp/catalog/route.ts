import { NextResponse } from 'next/server';
import { PRODUCTS, CATEGORIES, SHOP, SITE } from '@/src/config/site';
import { productUrl } from '@/lib/schema';

export async function GET() {
  return NextResponse.json(
    {
      protocol: { name: 'acp', version: '0.1.0' },
      organization: SITE.name,
      catalog: CATEGORIES.filter((c) => c.slug !== 'all').map((c) => ({
        slug: c.slug,
        name: c.name,
        url: `https://${SITE.domain}/shop/${c.slug}/`,
        // Empty product list by design, not a stock-out: nothing in the
        // range is listed or purchasable yet.
        ...(c.comingSoon ? { comingSoon: true } : {}),
        products: PRODUCTS.filter((p) => (c.rawCategory ? p.category === c.rawCategory : true)).map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price_aud,
          currency: SITE.currency,
          specs: p.key_specs,
          url: productUrl(p),
        })),
      })),
      currency: SITE.currency,
      minimumOrder: SHOP.minOrder,
      paymentMethods: SHOP.paymentMethods,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
