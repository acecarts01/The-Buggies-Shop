import { NextResponse } from 'next/server';
import { SITE } from '@/src/config/site';
import { PRODUCTS_FULL } from '@/src/config/product-details';
import { productUrl } from '@/lib/schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const fuelType = searchParams.get('fuel_type');
  const q = searchParams.get('q');
  const limit = searchParams.get('limit');

  // Full records (description, FAQs, keywords): this is the agent-facing
  // catalogue, so it carries everything the product page shows.
  let filtered = [...PRODUCTS_FULL];

  if (category && category !== 'all') {
    const slugNorm = category.toLowerCase().replace(/-/g, ' ');
    filtered = filtered.filter((p) => {
      const catNorm = p.category.toLowerCase();
      return catNorm.includes(slugNorm) || p.slug.includes(category);
    });
  }

  if (fuelType && fuelType !== 'all') {
    filtered = filtered.filter((p) => p.fuel_type.toLowerCase().includes(fuelType.toLowerCase()));
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.key_specs.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query)
    );
  }

  if (limit) {
    const count = parseInt(limit, 10);
    if (!isNaN(count)) filtered = filtered.slice(0, count);
  }

  const responseData = filtered.map((p) => ({
    ...p,
    currency: SITE.currency,
    // Product routes are /shop/<category>/<slug>/; the old /shop/<slug>/ 404d.
    url: productUrl(p),
  }));

  return NextResponse.json(
    {
      total: responseData.length,
      currency: SITE.currency,
      products: responseData,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}
