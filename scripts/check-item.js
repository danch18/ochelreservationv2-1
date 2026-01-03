
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkItem() {
    console.log('Searching for "Scaloppina al limone"...');

    // Check piccolo_menu_items
    const { data: items, error } = await supabase
        .from('piccolo_menu_items')
        .select(`
            *,
            piccolo_subcategories (
                title,
                id
            )
        `)
        .ilike('title', '%Scaloppina%');

    if (error) {
        console.error('Error querying piccolo_menu_items:', error);
        return;
    }

    if (items && items.length > 0) {
        console.log(`Found ${items.length} items:`);
        items.forEach(item => {
            console.log(`- ID: ${item.id}`);
            console.log(`  Title: ${item.title}`);
            console.log(`  Subcategory: ${item.piccolo_subcategories?.title} (ID: ${item.subcategory_id})`);
            console.log(`  Status: ${item.status}`);
            console.log('-------------------');
        });
    } else {
        console.log('No items found in piccolo_menu_items with that title.');
    }
}

checkItem();
