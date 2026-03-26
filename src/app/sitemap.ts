import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'

const BASE_URL = 'https://savikafoods.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient()

  // Fetch all product slugs
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  // Fetch all category slugs
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const productEntries: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryEntries: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/our-story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/why-savika`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...staticRoutes, ...categoryEntries, ...productEntries]
}
