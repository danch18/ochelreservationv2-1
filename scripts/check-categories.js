
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listCategories() {
    const { data, error } = await supabase
        .from('piccolo_categories')
        .select('id, title, status')
        .order('id');

    if (error) {
        console.error(error);
        return;
    }

    console.log('Categories:');
    data.forEach(c => console.log(`- [${c.id}] ${c.title} (${c.status})`));
}

listCategories();
