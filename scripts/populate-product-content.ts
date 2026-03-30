
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const richContent = {
  'red-chilli-powder': {
    what_is: {
      description: 'Our Red Chilli Powder is made from the finest sun-dried Guntur chillies, known for their vibrant red color and moderate heat. It adds both flavor and visual appeal to any dish.',
      origin: 'Guntur, Andhra Pradesh',
      botanical_name: 'Capsicum annuum'
    },
    health_benefits: [
      { name: 'Rich in Vitamin C', description: 'Helps boost immunity and skin health.' },
      { name: 'Metabolism Boost', description: 'Capsaicin may help increase metabolic rate.' }
    ],
    culinary_uses: [
      { dish: 'Curries & Tadkas', tip: 'Add to hot oil at the end for a rich red color without burning.' },
      { dish: 'Marinades', tip: 'Mix with curd and ginger-garlic paste for a spicy coat.' }
    ],
    faqs: [
      { question: 'Is it very spicy?', answer: 'It has a moderate heat level, balanced for regular Indian cooking.' },
      { question: 'Are there any colors added?', answer: 'No, our chilli powder is 100% natural with no artificial colors.' }
    ]
  },
  'turmeric-powder-haldi': {
    what_is: {
      description: 'Savika Turmeric is sourced from the heart of Salem, containing high curcumin levels. Its earthy flavor and deep golden hue are markers of its purity.',
      origin: 'Salem, Tamil Nadu',
      botanical_name: 'Curcuma longa'
    },
    health_benefits: [
      { name: 'Anti-inflammatory', description: 'Curcumin is a natural anti-inflammatory compound.' },
      { name: 'Antioxidant', description: 'Helps fight oxidative damage in the body.' }
    ],
    culinary_uses: [
      { dish: 'Lentils & Vegetables', tip: 'A pinch is enough for color and health benefits.' },
      { dish: 'Turmeric Latte', tip: 'Mix with warm milk and a pinch of black pepper for absorption.' }
    ],
    faqs: [
      { question: 'What is the curcumin content?', answer: 'Our turmeric consistently tests above 3% curcumin level.' }
    ]
  },
  'coriander-powder-dhaniya': {
    what_is: {
      description: 'Freshly ground from bold Rajasthani coriander seeds, our powder has a cooling effect and a citrusy, floral aroma.',
      origin: 'Kota, Rajasthan',
      botanical_name: 'Coriandrum sativum'
    },
    health_benefits: [
      { name: 'Digestive Aid', description: 'Helps in soothing the digestive tract.' },
      { name: 'Heart Health', description: 'May help manage cholesterol levels.' }
    ],
    culinary_uses: [
      { dish: 'Base Gravies', tip: 'Use generously as it provides body and thickness to gravies.' }
    ],
    faqs: [
      { question: 'How is it processed?', answer: 'Cold-ground to retain natural essential oils.' }
    ]
  },
  'garam-masala': {
    what_is: {
      description: 'A masterfully balanced blend of 12 whole spices, roasted and ground to perfection. It is the finishing touch every Indian dish deserves.',
      origin: 'Multi-regional Blend',
      botanical_name: 'Mixed Spice Blend'
    },
    health_benefits: [
      { name: 'Metabolic Heat', description: 'Spices like cinnamon and clove help keep the body warm and active.' }
    ],
    culinary_uses: [
      { dish: 'Biryanis & Pulaos', tip: 'Sprinkle over the dish just before serving for maximum aroma.' }
    ],
    faqs: [
      { question: 'When should I add Garam Masala?', answer: 'Always add it at the end of the cooking process to preserve its delicate aroma.' }
    ]
  },
  'chicken-masala': {
    what_is: {
      description: 'Crafted specifically for poultry, this blend balances heat, tang, and depth to create restaurant-style chicken dishes at home.',
      origin: 'Savika Traditional Recipe',
      botanical_name: 'Proprietary Blend'
    },
    health_benefits: [
      { name: 'Appetite Stimulant', description: 'The blend of aromatics helps stimulate digestion.' }
    ],
    culinary_uses: [
      { dish: 'Chicken Curry', tip: 'Marinate chicken with this masala for at least 30 minutes.' }
    ],
    faqs: [
      { question: 'Does it contain salt?', answer: 'Yes, a small amount is included for flavor balance, adjust accordingly.' }
    ]
  },
  'meat-masala': {
    what_is: {
      description: 'A robust blend designed to penetrate tough meat fibers and infuse them with deep, smoky, and spicy notes.',
      origin: 'North Indian Heritage',
      botanical_name: 'Proprietary Blend'
    },
    health_benefits: [
      { name: 'Digestive Support', description: 'Contains cumin and cardamom to aid in digesting heavy meats.' }
    ],
    culinary_uses: [
      { dish: 'Mutton Curry', tip: 'Sauté the masala well with onions until oil separates.' }
    ],
    faqs: [
      { question: 'Is it very hot?', answer: 'It is medium-spicy to allow the flavor of the meat to shine through.' }
    ]
  },
  'deshi-ghati-masala': {
    what_is: {
      description: 'The soul of Maharashtrian cuisine. Our Ghati Masala is a complex blend of 20+ spices, including dry coconut and sesame.',
      origin: 'Western Ghats, Maharashtra',
      botanical_name: 'Traditional Maharashtrian Blend'
    },
    health_benefits: [
      { name: 'Rich in Minerals', description: 'Coconut and sesame provide essential healthy fats.' }
    ],
    culinary_uses: [
      { dish: 'Misal Pav & Vada Pav', tip: 'The key ingredient for that authentic spicy "rassa".' }
    ],
    faqs: [
      { question: 'What makes it different?', answer: 'Unlike regular masalas, Ghati Masala uses roasted coconut and onion for a unique depth.' }
    ]
  }
}

async function run() {
  console.log('🚀 Starting content migration...')
  
  for (const [slug, content] of Object.entries(richContent)) {
    console.log(`Processing: ${slug}`)
    
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, metadata')
      .eq('slug', slug)
      .single()
      
    if (fetchError || !product) {
      console.error(`Error fetching ${slug}:`, fetchError?.message)
      continue
    }
    
    const updatedMetadata = {
      ...(product.metadata || {}),
      generated_content: content
    }
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ metadata: updatedMetadata })
      .eq('id', product.id)
      
    if (updateError) {
      console.error(`Error updating ${slug}:`, updateError.message)
    } else {
      console.log(`✅ ${slug} updated successfully.`)
    }
  }
  
  console.log('✨ All products updated.')
}

run().catch(console.error)
