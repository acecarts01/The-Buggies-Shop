import { NextResponse } from 'next/server';
import { CATEGORIES, PRODUCTS, SITE } from '@/src/config/site';

export async function GET() {
  const data = CATEGORIES.map((c) => {
    let count = 0;
    if (c.slug === 'all') {
      count = PRODUCTS.length;
    } else if (c.rawCategory) {
      count = PRODUCTS.filter((p) => p.category === c.rawCategory).length;
    }

    return {
      slug: c.slug,
      name: c.name,
      count,
      url: `https://${SITE.domain}/shop/${c.slug}/`,
      // A count of 0 on its own reads as sold out; this says the range is
      // not yet listed and the page takes register-interest details only.
      ...(c.comingSoon ? { comingSoon: true } : {}),
    };
  });

  return NextResponse.json(
    {
      categories: data,
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
    },
  });
}
