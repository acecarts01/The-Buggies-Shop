import { NextResponse } from 'next/server';
import { PRODUCTS, FAQ, POSTS, SITE } from '@/src/config/site';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  if (!q) {
    return NextResponse.json({
      query: '',
      results: [],
      posts: [],
      faqs: [],
    });
  }

  const matchedProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.key_specs.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.target_audience.toLowerCase().includes(q)
  ).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price_aud: p.price_aud,
    price_display: p.price_display,
    specs: p.key_specs,
    url: `/shop/${p.slug}/`,
  }));

  const matchedPosts = POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
  ).map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    readTime: post.readTime,
    excerpt: post.excerpt,
    url: `/blog/${post.slug}/`,
  }));

  const matchedFaqs = FAQ.filter(
    (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );

  return NextResponse.json(
    {
      query: q,
      total_products: matchedProducts.length,
      total_posts: matchedPosts.length,
      products: matchedProducts,
      posts: matchedPosts,
      faqs: matchedFaqs,
      store: SITE.name,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120',
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
