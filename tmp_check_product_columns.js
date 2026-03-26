const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://klhiledoucohypuopccw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsaGlsZWRvdWNvaHlwdW9wY2N3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAwMjQ3NCwiZXhwIjoyMDg5NTc4NDc0fQ.hUWC5rytZFKD37PNkO36rUXNsbT5Hc8D-gAXaxQBbRY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductColumns() {
  const { data, error } = await supabase
    .rpc('get_table_columns', { table_name: 'products' });

  if (error) {
    // If RPC doesn't exist, try a direct query via a sneaky way if possible
    // or just list one row if it exists.
    // Actually, I'll just try to insert a dummy row and read it back.
    console.error('RPC Error (likely does not exist):', error.message);
    
    // Fallback: try to get one row again but specifically check for keys
    const { data: data2, error: error2 } = await supabase.from('products').select('*').limit(1);
    if (error2) {
      console.error('Error fetching products:', error2.message);
    } else {
      console.log('---COLUMNS_START---');
      console.log(JSON.stringify(data2[0] || 'TABLE_EMPTY'));
      console.log('---COLUMNS_END---');
    }
  } else {
    console.log('---COLUMNS_START---');
    console.log(JSON.stringify(data));
    console.log('---COLUMNS_END---');
  }
}

checkProductColumns();
