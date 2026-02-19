const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oblfrzmgwsxqogackdee.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibGZyem1nd3N4cW9nYWNrZGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODIxNjIsImV4cCI6MjA3NzI1ODE2Mn0.M6CLouYzyjCW2MlvGg-lik6c1Hw6dDpQ5xK-GTl0YK8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLocalImages() {
  console.log('Checking for items with local image paths...\n');

  // Check menu items
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

  const localImages = menuItems.filter(item =>
    item.image_path && item.image_path.startsWith('/images/')
  );

  console.log(`Found ${localImages.length} menu items with local image paths:\n`);

  localImages.forEach(item => {
    const ext = item.image_path.split('.').pop().toLowerCase();
    console.log(`  - ID ${item.id}: ${item.title}`);
    console.log(`    Path: ${item.image_path} (.${ext})`);
  });

  // Group by extension
  const byExt = {};
  localImages.forEach(item => {
    const ext = item.image_path.split('.').pop().toLowerCase();
    if (!byExt[ext]) byExt[ext] = 0;
    byExt[ext]++;
  });

  console.log('\n\nLocal images by extension:');
  Object.keys(byExt).forEach(ext => {
    console.log(`  .${ext}: ${byExt[ext]} items`);
  });

  // Check addons
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

  const localAddonImages = addons.filter(item =>
    item.image_path && item.image_path.startsWith('/images/')
  );

  console.log(`Found ${localAddonImages.length} addons with local image paths:\n`);

  localAddonImages.forEach(item => {
    const ext = item.image_path.split('.').pop().toLowerCase();
    console.log(`  - ID ${item.id}: ${item.title}`);
    console.log(`    Path: ${item.image_path} (.${ext})`);
  });
}

checkLocalImages();
