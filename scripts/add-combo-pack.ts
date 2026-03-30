/**
 * Savika Foods – Add 50gm Masala Combo Pack product
 * Run: npx tsx scripts/add-combo-pack.ts
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

async function main() {
  console.log('🌱 Adding 50gm Masala Combo Pack product...\n')

  const product = {
    name: '50gm Masala Combo Pack',
    slug: '50gm-masala-combo-pack',
    tagline: 'All-in-One Spice Solution',
    local_name: 'Combo Masala Pack',
    price: 117,
    compare_price: 149,
    stock: 100,
    description: 'A premium curated collection of our best 50gm masala packs. Perfect for your daily cooking needs.',
    is_active: true,
    category_id: '16b99e6e-cba5-4e9b-a1e5-01c78497a9ef', // Blends & Masalas
    image_urls: ['/product-images/all_in_one.jpg'], // Using the file present in public
    weight_options: ['50gm'],
    metadata: {
      weight_pricing: [
        { label: '50gm', price: 117, salePrice: 117 }
      ],
      generated_content: {
        what_is: {
          description: 'A comprehensive starter pack of our finest blends.',
          origin: 'India',
          botanical_name: 'Mixed Herbs & Spices'
        }
      }
    },
  }

  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', product.slug)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', existing.id)
    if (error) console.error(`❌ Update failed for ${product.name}:`, error.message)
    else console.log(`📝 Updated: ${product.name}`)
  } else {
    const { error } = await supabase
      .from('products')
      .insert(product)
    if (error) console.error(`❌ Insert failed for ${product.name}:`, error.message)
    else console.log(`✅ Inserted: ${product.name}`)
  }
}

main().catch(console.error)
