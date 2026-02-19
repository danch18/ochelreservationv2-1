const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oblfrzmgwsxqogackdee.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibGZyem1nd3N4cW9nYWNrZGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODIxNjIsImV4cCI6MjA3NzI1ODE2Mn0.M6CLouYzyjCW2MlvGg-lik6c1Hw6dDpQ5xK-GTl0YK8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const OLD_DOMAIN = 'jhugrvpaizlzeemazuna.supabase.co';
const NEW_DOMAIN = 'oblfrzmgwsxqogackdee.supabase.co';

async function checkOldUrls() {
  console.log('Checking for items using old Supabase URLs...\n');

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

  const oldUrls = menuItems.filter(item =>
    item.image_path && item.image_path.includes(OLD_DOMAIN)
  );

  const newUrls = menuItems.filter(item =>
    item.image_path && item.image_path.includes(NEW_DOMAIN)
  );

  console.log(`Total items with images: ${menuItems.length}`);
  console.log(`Items using OLD Supabase (${OLD_DOMAIN}): ${oldUrls.length}`);
  console.log(`Items using NEW Supabase (${NEW_DOMAIN}): ${newUrls.length}\n`);

  if (oldUrls.length > 0) {
    console.log('=== ITEMS USING OLD SUPABASE (Need to be updated) ===\n');
    oldUrls.forEach(item => {
      console.log(`ID ${item.id}: ${item.title}`);
    });

    console.log('\n\nThese images may not be accessible anymore.');
    console.log('You have two options:');
    console.log('1. Re-upload these images through the admin panel');
    console.log('2. Migrate the images from old to new Supabase storage (if old storage is still accessible)');
  }
}

checkOldUrls();
