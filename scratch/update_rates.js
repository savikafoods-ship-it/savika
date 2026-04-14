const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://klhiledoucohypuopccw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsaGlsZWRvdWNvaHlwdW9wY2N3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAwMjQ3NCwiZXhwIjoyMDg5NTc4NDc0fQ.hUWC5rytZFKD37PNkO36rUXNsbT5Hc8D-gAXaxQBbRY'
);

async function update() {
    const { error: err1 } = await supabase
        .from('site_settings')
        .upsert({ 
            id: 'shipping', 
            value: { standardShippingRate: 25, freeShippingThreshold: 599 },
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

    const { error: err2 } = await supabase
        .from('site_settings')
        .upsert({ 
            id: 'shipping_config', 
            value: { standard_rate: 25, free_threshold: 599 },
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

    if (err1 || err2) {
        console.error('Update failed:', err1, err2);
    } else {
        console.log('Successfully updated shipping rates to 25rs in database.');
    }
}

update();
