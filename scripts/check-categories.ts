
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, (process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey))

async function checkCategories() {
  const { data, error } = await supabase.from('categories').select('id, name')
  if (error) {
    console.log('Error:', error.message)
    return
  }
  console.log('CATEGORIES_JSON_START')
  console.log(JSON.stringify(data, null, 2))
  console.log('CATEGORIES_JSON_END')
}

checkCategories().catch(console.error)
