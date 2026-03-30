/**
 * Savika Foods – Seed all 7 products into Supabase
 * Run: npx tsx scripts/seed-products.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local from project root
dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function ensureCategory(name: string, slug: string) {
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) return existing.id

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug, sort_order: slug === 'ground-powdered' ? 1 : 2 })
    .select('id')
    .single()

  if (error) {
    console.error(`Failed to create category "${name}":`, error.message)
    process.exit(1)
  }
  return data.id
}

interface ProductSeed {
  name: string
  slug: string
  tagline: string
  local_name: string
  category_slug: string
  price: number
  compare_price: number
  stock: number
  description: string
  weight_options: { label: string; price: number }[]
}

const products: ProductSeed[] = [
  {
    name: 'Red Chilli Powder',
    slug: 'red-chilli-powder',
    tagline: 'Tikha Swad',
    local_name: 'Laal Mirch',
    category_slug: 'ground-powdered',
    price: 59,
    compare_price: 99,
    stock: 100,
    description: 'Pure Red Chilli Powder sourced from Guntur. No artificial color.',
    weight_options: [
      { label: '50gm', price: 39 },
      { label: '100gm', price: 59 },
      { label: '200gm', price: 99 },
      { label: '500gm', price: 269 },
      { label: '1000gm', price: 529 },
    ],
  },
  {
    name: 'Turmeric Powder',
    slug: 'turmeric-powder-haldi',
    tagline: 'Rang Aur Shuddhta',
    local_name: 'Haldi',
    category_slug: 'ground-powdered',
    price: 59,
    compare_price: 89,
    stock: 100,
    description: 'High-curcumin Turmeric Powder. Pure and natural.',
    weight_options: [
      { label: '50gm', price: 39 },
      { label: '100gm', price: 59 },
      { label: '200gm', price: 109 },
      { label: '500gm', price: 239 },
      { label: '1000gm', price: 469 },
    ],
  },
  {
    name: 'Coriander Powder',
    slug: 'coriander-powder-dhaniya',
    tagline: 'Khushboo Bhara Taste',
    local_name: 'Dhaniya',
    category_slug: 'ground-powdered',
    price: 49,
    compare_price: 69,
    stock: 100,
    description: 'Freshly ground Coriander Powder from bold Rajasthani seeds.',
    weight_options: [
      { label: '50gm', price: 34 },
      { label: '100gm', price: 49 },
      { label: '200gm', price: 79 },
      { label: '500gm', price: 189 },
      { label: '1000gm', price: 369 },
    ],
  },
  {
    name: 'Garam Masala',
    slug: 'garam-masala',
    tagline: 'Rich Aroma',
    local_name: 'Garam Masala',
    category_slug: 'blends-masalas',
    price: 89,
    compare_price: 129,
    stock: 100,
    description: 'Masterfully balanced blend of 12 whole spices.',
    weight_options: [
      { label: '50gm', price: 49 },
      { label: '100gm', price: 89 },
      { label: '200gm', price: 169 },
      { label: '500gm', price: 415 },
      { label: '1000gm', price: 819 },
    ],
  },
  {
    name: 'Chicken Masala',
    slug: 'chicken-masala',
    tagline: 'Perfect Non-Veg Taste',
    local_name: 'Murgh Masala',
    category_slug: 'blends-masalas',
    price: 89,
    compare_price: 129,
    stock: 100,
    description: 'Precision-blended spice mix for restaurant-quality chicken.',
    weight_options: [
      { label: '50gm', price: 49 },
      { label: '100gm', price: 89 },
      { label: '200gm', price: 169 },
      { label: '500gm', price: 415 },
      { label: '1000gm', price: 819 },
    ],
  },
  {
    name: 'Meat Masala',
    slug: 'meat-masala',
    tagline: 'Dumdar Flavour',
    local_name: 'Gosht Masala',
    category_slug: 'blends-masalas',
    price: 89,
    compare_price: 129,
    stock: 100,
    description: 'Bold spice blend for mutton, lamb, and beef.',
    weight_options: [
      { label: '50gm', price: 49 },
      { label: '100gm', price: 89 },
      { label: '200gm', price: 169 },
      { label: '500gm', price: 415 },
      { label: '1000gm', price: 819 },
    ],
  },
  {
    name: 'Deshi Ghati Masala',
    slug: 'deshi-ghati-masala',
    tagline: 'Special Traditional Blend',
    local_name: 'Ghati Masala',
    category_slug: 'blends-masalas',
    price: 69,
    compare_price: 99,
    stock: 100,
    description: 'Authentic spice blend from the Sahyadri culinary tradition.',
    weight_options: [
      { label: '50gm', price: 39 },
      { label: '100gm', price: 69 },
      { label: '200gm', price: 119 },
      { label: '500gm', price: 289 },
      { label: '1000gm', price: 569 },
    ],
  },
]

async function main() {
  console.log('🌱 Seeding products with image-accurate pricing...\n')

  const categoryIds: Record<string, string> = {}
  categoryIds['ground-powdered'] = await ensureCategory('Ground & Powdered', 'ground-powdered')
  categoryIds['blends-masalas'] = await ensureCategory('Blends & Masalas', 'blends-masalas')

  for (const p of products) {
    const record = {
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      local_name: p.local_name,
      price: p.price,
      compare_price: p.compare_price,
      stock: p.stock,
      description: p.description,
      is_active: true,
      category_id: categoryIds[p.category_slug],
      weight_options: p.weight_options.map(opt => opt.label),
      metadata: {
        weight_pricing: p.weight_options
      },
    }

    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', p.slug)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('products')
        .update(record)
        .eq('id', existing.id)
      if (error) console.error(`❌ Update failed for ${p.name}:`, error.message)
      else console.log(`📝 Updated: ${p.name}`)
    } else {
      const { error } = await supabase
        .from('products')
        .insert(record)
      if (error) console.error(`❌ Insert failed for ${p.name}:`, error.message)
      else console.log(`✅ Inserted: ${p.name}`)
    }
  }
}

main().catch(console.error)
