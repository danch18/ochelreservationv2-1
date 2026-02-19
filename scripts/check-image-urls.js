const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oblfrzmgwsxqogackdee.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibGZyem1nd3N4cW9nYWNrZGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODIxNjIsImV4cCI6MjA3NzI1ODE2Mn0.M6CLouYzyjCW2MlvGg-lik6c1Hw6dDpQ5xK-GTl0YK8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkImageUrls() {
  console.log('Fetching menu items with images...\n');

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('id, title, image_path, restaurant_id')
    .not('image_path', 'is', null)
    .eq('restaurant_id', 'magnifiko')
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${menuItems.length} menu items with images\n`);

  // Group by file extension
  const byExtension = {};

  menuItems.forEach(item => {
    const ext = item.image_path.split('.').pop().toLowerCase();
    if (!byExtension[ext]) {
      byExtension[ext] = [];
    }
    byExtension[ext].push(item);
  });

  console.log('Images by extension:');
  Object.keys(byExtension).forEach(ext => {
    console.log(`\n.${ext} files (${byExtension[ext].length}):`);
    byExtension[ext].forEach(item => {
      console.log(`  - ID ${item.id}: ${item.title}`);
      console.log(`    URL: ${item.image_path}`);
    });
  });

  // Check addons too
  console.log('\n\n=== ADDONS ===\n');
  const { data: addons, error: addonError } = await supabase
    .from('addons')
    .select('id, title, image_path, restaurant_id')
    .not('image_path', 'is', null)
    .eq('restaurant_id', 'magnifiko')
    .order('id');

  if (addonError) {
    console.error('Error:', addonError);
    return;
  }

  console.log(`Found ${addons.length} addons with images\n`);

  const addonsByExt = {};
  addons.forEach(item => {
    const ext = item.image_path.split('.').pop().toLowerCase();
    if (!addonsByExt[ext]) {
      addonsByExt[ext] = [];
    }
    addonsByExt[ext].push(item);
  });

  console.log('Addon images by extension:');
  Object.keys(addonsByExt).forEach(ext => {
    console.log(`\n.${ext} files (${addonsByExt[ext].length}):`);
    addonsByExt[ext].forEach(item => {
      console.log(`  - ID ${item.id}: ${item.title}`);
      console.log(`    URL: ${item.image_path}`);
    });
  });
}

checkImageUrls();
