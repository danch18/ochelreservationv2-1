const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oblfrzmgwsxqogackdee.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibGZyem1nd3N4cW9nYWNrZGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODIxNjIsImV4cCI6MjA3NzI1ODE2Mn0.M6CLouYzyjCW2MlvGg-lik6c1Hw6dDpQ5xK-GTl0YK8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllImages() {
  console.log('=== CHECKING ALL RESTAURANTS ===\n');

  // Check both restaurants
  for (const restaurant of ['magnifiko', 'piccolo']) {
    console.log(`\n========== ${restaurant.toUpperCase()} ==========\n`);

    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('id, title, image_path')
      .not('image_path', 'is', null)
      .eq('restaurant_id', restaurant)
      .order('id');

    if (error) {
      console.error('Error:', error);
      continue;
    }

    console.log(`Total items with images: ${menuItems.length}\n`);

    // Categorize images
    const supabaseWebp = [];
    const supabasePng = [];
    const localPng = [];
    const localWebp = [];
    const other = [];

    menuItems.forEach(item => {
      const path = item.image_path;
      const ext = path.split('.').pop().toLowerCase();

      if (path.includes('supabase.co')) {
        if (ext === 'webp') {
          supabaseWebp.push(item);
        } else if (ext === 'png') {
          supabasePng.push(item);
        } else {
          other.push(item);
        }
      } else if (path.startsWith('/images/')) {
        if (ext === 'png') {
          localPng.push(item);
        } else if (ext === 'webp') {
          localWebp.push(item);
        } else {
          other.push(item);
        }
      } else {
        other.push(item);
      }
    });

    console.log('Image breakdown:');
    console.log(`  Supabase .webp: ${supabaseWebp.length}`);
    console.log(`  Supabase .png: ${supabasePng.length}`);
    console.log(`  Local .png: ${localPng.length}`);
    console.log(`  Local .webp: ${localWebp.length}`);
    console.log(`  Other: ${other.length}`);

    if (supabasePng.length > 0) {
      console.log('\n  Supabase .png files:');
      supabasePng.forEach(item => {
        console.log(`    - ${item.title} (ID: ${item.id})`);
        console.log(`      ${item.image_path}`);
      });
    }

    if (localPng.length > 0) {
      console.log('\n  Local .png files:');
      localPng.forEach(item => {
        console.log(`    - ${item.title} (ID: ${item.id})`);
        console.log(`      ${item.image_path}`);
      });
    }
  }
}

checkAllImages();
