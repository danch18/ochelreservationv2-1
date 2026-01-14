
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTranslation() {
    console.log('Updating translation for Item ID 1...');

    const { data, error } = await supabase
        .from('piccolo_menu_items')
        .update({ title_en: 'Penne Arrabbiata (EN TEST)' })
        .eq('id', 1)
        .select();

    if (error) {
        console.error('Error updating item:', error);
        return;
    }
    console.log('Update successful:', data);

    console.log('Updating translation for Category ID 1...');
    const { data: catData, error: catError } = await supabase
        .from('piccolo_categories')
        .update({ title_en: 'Antipasti (EN TEST)' })
        .eq('id', 1)
        .select();

    if (catError) {
        console.error('Error updating category:', catError);
        return;
    }
    console.log('Update successful:', catData);
}

updateTranslation();
