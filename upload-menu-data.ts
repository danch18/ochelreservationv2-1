import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface MenuData {
  categories: Array<{
    title: string;
    text?: string;
    status: 'active' | 'inactive';
  }>;
  subcategories: Array<{
    category_title: string;
    title: string;
    text?: string;
    status: 'active' | 'inactive';
  }>;
  menu_items: Array<{
    subcategory_title: string;
    title: string;
    text?: string;
    description: string;
    price: number;
    is_special: boolean;
    status: 'active' | 'inactive';
    image_path?: string | null;
    model_3d_url?: string | null;
    redirect_3d_url?: string | null;
    additional_image_url?: string | null;
  }>;
  addons: Array<{
    category_title?: string | null;
    subcategory_title?: string | null;
    title: string;
    description?: string;
    price: number;
    status: 'active' | 'inactive';
    image_path?: string | null;
  }>;
}

async function uploadMenuData() {
  try {
    console.log('🚀 Starting menu data upload...\n');

    // Read the JSON file
    const jsonPath = path.join(__dirname, 'menu-data.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const menuData: MenuData = JSON.parse(fileContent);

    // Maps to store IDs
    const categoryMap = new Map<string, number>();
    const subcategoryMap = new Map<string, number>();

    // 1. Upload Categories
    console.log('📁 Uploading categories...');
    for (const category of menuData.categories) {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          title: category.title,
          text: category.text,
          status: category.status,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error uploading category "${category.title}":`, error.message);
        continue;
      }

      categoryMap.set(category.title, data.id);
      console.log(`✅ Category "${category.title}" uploaded (ID: ${data.id})`);
    }
    console.log(`\n✨ ${categoryMap.size} categories uploaded\n`);

    // 2. Upload Subcategories
    console.log('📂 Uploading subcategories...');
    for (const subcategory of menuData.subcategories) {
      const categoryId = categoryMap.get(subcategory.category_title);

      if (!categoryId) {
        console.error(`❌ Category "${subcategory.category_title}" not found for subcategory "${subcategory.title}"`);
        continue;
      }

      const { data, error } = await supabase
        .from('subcategories')
        .insert({
          category_id: categoryId,
          title: subcategory.title,
          text: subcategory.text,
          status: subcategory.status,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error uploading subcategory "${subcategory.title}":`, error.message);
        continue;
      }

      subcategoryMap.set(subcategory.title, data.id);
      console.log(`✅ Subcategory "${subcategory.title}" uploaded (ID: ${data.id})`);
    }
    console.log(`\n✨ ${subcategoryMap.size} subcategories uploaded\n`);

    // 3. Upload Menu Items
    console.log('🍽️  Uploading menu items...');
    let menuItemCount = 0;
    for (const item of menuData.menu_items) {
      const subcategoryId = subcategoryMap.get(item.subcategory_title);

      if (!subcategoryId) {
        console.error(`❌ Subcategory "${item.subcategory_title}" not found for item "${item.title}"`);
        continue;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          subcategory_id: subcategoryId,
          title: item.title,
          text: item.text,
          description: item.description,
          price: item.price,
          is_special: item.is_special,
          status: item.status,
          image_path: item.image_path,
          model_3d_url: item.model_3d_url,
          redirect_3d_url: item.redirect_3d_url,
          additional_image_url: item.additional_image_url,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error uploading menu item "${item.title}":`, error.message);
        continue;
      }

      menuItemCount++;
      console.log(`✅ Menu item "${item.title}" uploaded (ID: ${data.id})`);
    }
    console.log(`\n✨ ${menuItemCount} menu items uploaded\n`);

    // 4. Upload Addons
    console.log('➕ Uploading addons...');
    let addonCount = 0;
    for (const addon of menuData.addons) {
      const categoryId = addon.category_title ? categoryMap.get(addon.category_title) : null;
      const subcategoryId = addon.subcategory_title ? subcategoryMap.get(addon.subcategory_title) : null;

      const { data, error } = await supabase
        .from('addons')
        .insert({
          category_id: categoryId,
          subcategory_id: subcategoryId,
          title: addon.title,
          description: addon.description,
          price: addon.price,
          status: addon.status,
          image_path: addon.image_path,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error uploading addon "${addon.title}":`, error.message);
        continue;
      }

      addonCount++;
      console.log(`✅ Addon "${addon.title}" uploaded (ID: ${data.id})`);
    }
    console.log(`\n✨ ${addonCount} addons uploaded\n`);

    console.log('🎉 Menu data upload completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Categories: ${categoryMap.size}`);
    console.log(`   Subcategories: ${subcategoryMap.size}`);
    console.log(`   Menu Items: ${menuItemCount}`);
    console.log(`   Addons: ${addonCount}`);

  } catch (error) {
    console.error('❌ Fatal error during upload:', error);
    process.exit(1);
  }
}

// Run the upload
uploadMenuData();
