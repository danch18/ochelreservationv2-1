
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTranslations() {
    console.log('Fetching Piccolo Categories...');

    const { data: categories, error } = await supabase
        .from('piccolo_categories')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    console.log('Categories found:', categories.length);
    categories.forEach(cat => {
        console.log(`Category ID: ${cat.id}`);
        console.log(`  title (fr): ${cat.title}`);
        console.log(`  title_en: ${cat.title_en}`);
        console.log(`  title_it: ${cat.title_it}`);
        console.log(`  title_es: ${cat.title_es}`);
    });

    console.log('\nFetching Piccolo Menu Items...');
    const { data: items, error: itemsError } = await supabase
        .from('piccolo_menu_items')
        .select('*')
        .limit(5);

    if (itemsError) {
        console.error('Error fetching items:', itemsError);
        return;
    }

    console.log('Items found:', items.length);
    items.forEach(item => {
        console.log(`Item ID: ${item.id}`);
        console.log(`  title (fr): ${item.title}`);
        console.log(`  title_en: ${item.title_en}`);
        console.log(`  title_it: ${item.title_it}`);
        console.log(`  title_es: ${item.title_es}`);
    });

    console.log('\nFetching Legacy/Shared Categories for piccolo...');
    const { data: legacyCats, error: legacyError } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', 'piccolo');

    if (legacyError) {
        console.log('Error fetching legacy cats (might safely ignore):', legacyError.message);
    } else {
        console.log('Legacy Categories found:', legacyCats ? legacyCats.length : 0);
        if (legacyCats) {
            legacyCats.forEach(cat => {
                console.log(`Category ID: ${cat.id}`);
                console.log(`  title (fr): ${cat.title}`);
                console.log(`  title_en: ${cat.title_en}`);
            });
        }
    }
}

checkTranslations();
