import { MetadataRoute } from 'next';
import { SITE, PRODUCTS, POSTS, CATEGORIES } from '@/src/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${SITE.domain}`;

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Product pages. product.category holds the display name, so map it back to
  // the category slug the route actually uses (same lookup as generateStaticParams).
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((product) => {
    const cat = CATEGORIES.find((c) => c.rawCategory === product.category);
    return {
      url: `${baseUrl}/shop/${cat?.slug ?? 'fleet'}/${product.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    };
  });

  // Blog post pages
  const blogRoutes: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
