/**
 * Savika Foods – Update Masala Prices & Weight Options
 * Run: npx tsx scripts/update-prices.ts
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

const PRICE_MATRIX: Record<string, Record<string, number>> = {
  'turmeric-powder-haldi': { '50g': 39, '100g': 59, '200g': 109, '500g': 239, '1000g': 469 },
  'red-chilli-powder':     { '50g': 39, '100g': 59, '200g': 99,  '500g': 269, '1000g': 529 },
  'coriander-powder-dhaniya': { '50g': 34, '100g': 49, '200g': 79,  '500g': 189, '1000g': 369 },
  'garam-masala':          { '50g': 49, '100g': 89, '200g': 169, '500g': 415, '1000g': 819 },
  'chicken-masala':        { '50g': 49, '100g': 89, '200g': 169, '500g': 415, '1000g': 819 },
  'meat-masala':           { '50g': 49, '100g': 89, '200g': 169, '500g': 415, '1000g': 819 },
  'deshi-ghati-masala':    { '50g': 39, '100g': 69, '200g': 119, '500g': 289, '1000g': 569 }
}

async function main() {
  console.log('🌱 Starting Bulk Price Update...\n')

  for (const [slug, prices] of Object.entries(PRICE_MATRIX)) {
    const weightOptions = Object.keys(prices) // ['50g', '100g', '200g', '500g', '1000g']
    const weightPricing = weightOptions.map(w => ({
      label: w,
      price: prices[w],
      salePrice: prices[w]
    }))

    const { data: existing } = await supabase
      .from('products')
      .select('id, metadata')
      .eq('slug', slug)
      .single()

    if (!existing) {
      console.warn(`⚠️  Product not found: ${slug}`)
      continue
    }

    const { error } = await supabase
      .from('products')
      .update({
        weight_options: weightOptions,
        price: prices['50g'], // Smallest variant as base price
        metadata: {
          ...existing.metadata as any,
          weight_pricing: weightPricing
        }
      })
      .eq('id', existing.id)

    if (error) {
      console.error(`❌ Update failed for ${slug}:`, error.message)
    } else {
      console.log(`✅ Updated: ${slug}`)
    }
  }

  console.log('\n✨ Price update complete.')
}

main().catch(console.error)
