const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://klhiledoucohypuopccw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsaGlsZWRvdWNvaHlwdW9wY2N3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAwMjQ3NCwiZXhwIjoyMDg5NTc4NDc0fQ.hUWC5rytZFKD37PNkO36rUXNsbT5Hc8D-gAXaxQBbRY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductSchema() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching products:', error.message);
  } else {
    console.log('---SCHEMA_START---');
    console.log(JSON.stringify(data[0] || {}));
    console.log('---SCHEMA_END---');
  }
}

checkProductSchema();
