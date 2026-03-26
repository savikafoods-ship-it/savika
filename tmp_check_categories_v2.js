const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://klhiledoucohypuopccw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsaGlsZWRvdWNvaHlwdW9wY2N3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAwMjQ3NCwiZXhwIjoyMDg5NTc4NDc0fQ.hUWC5rytZFKD37PNkO36rUXNsbT5Hc8D-gAXaxQBbRY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  const { data, error } = await supabase.from('categories').select('id, slug, name');
  
  if (error) {
    console.error('Error fetching categories:', error.message);
  } else {
    for (const cat of data) {
      console.log(`CAT:${cat.slug}=${cat.id}`);
    }
  }
}

checkCategories();
