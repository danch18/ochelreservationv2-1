
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpData() {
    console.log('Fetching all Piccolo data...');

    const { data: categories } = await supabase.from('piccolo_categories').select('*').order('id');
    const { data: subcategories } = await supabase.from('piccolo_subcategories').select('*').order('id');
    const { data: menuItems } = await supabase.from('piccolo_menu_items').select('*').order('id');
    const { data: addons } = await supabase.from('piccolo_addons').select('*').order('id');

    const dump = {
        categories,
        subcategories,
        menuItems,
        addons
    };

    fs.writeFileSync('piccolo_data_dump.json', JSON.stringify(dump, null, 2));
    console.log('Data dumped to piccolo_data_dump.json');
}

dumpData();
