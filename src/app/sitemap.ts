import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.savikafoods.in'

  // Fetch all active product slugs from Supabase
  const supabase = createStaticClient()
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  // Fetch all category slugs
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .order('name', { ascending: true })

  const now = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/why-savika`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Product pages (highest priority after homepage)
  const productPages: MetadataRoute.Sitemap = (products ?? []).map((product: { slug: string, updated_at?: string }) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updated_at ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((category: { slug: string, updated_at?: string }) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updated_at ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
