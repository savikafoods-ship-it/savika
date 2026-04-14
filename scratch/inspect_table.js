import { createServiceClient } from './src/lib/supabase/server.js';

async function inspect() {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error fetching site_settings:', error);
    } else {
        console.log('Sample data from site_settings:', data);
        if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        } else {
            console.log('Table is empty.');
        }
    }
}

inspect();
