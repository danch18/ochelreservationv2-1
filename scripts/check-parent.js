
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkParent() {
    const { data, error } = await supabase
        .from('piccolo_subcategories')
        .select(`
            id,
            title,
            category_id,
            piccolo_categories (
                id,
                title
            )
        `)
        .eq('id', 3)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    console.log('Subcategory:', data.title);
    console.log('Parent Category:', data.piccolo_categories?.title);
}

checkParent();
