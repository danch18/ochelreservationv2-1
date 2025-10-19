/**
 * Bulk Menu Translation Script
 *
 * This script translates all existing menu items from French to English, Italian, and Spanish
 * using Google Translate API and saves the translations to the database.
 *
 * Usage:
 *   npx tsx scripts/translate-menu.ts
 *
 * Prerequisites:
 *   - Database migration must be run first (add_menu_multi_language_support.sql)
 *   - Internet connection for Google Translate API
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { translateText } from '../src/lib/translate';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗');
  console.error('\n   Make sure .env file exists with these variables.');
  console.error('\n   IMPORTANT: Run scripts/temp-disable-rls.sql in Supabase BEFORE running this script!');
  console.error('   Then run scripts/enable-rls.sql AFTER this script completes.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TranslationProgress {
  total: number;
  completed: number;
  failed: number;
  errors: Array<{ id: number; table: string; error: string }>;
}

const progress: TranslationProgress = {
  total: 0,
  completed: 0,
  failed: 0,
  errors: []
};

/**
 * Translate and update categories
 */
async function translateCategories() {
  console.log('\n📂 Translating Categories...');

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, title, text')
    .eq('status', 'active');

  if (error) {
    console.error('❌ Error fetching categories:', error);
    return;
  }

  if (!categories || categories.length === 0) {
    console.log('   No active categories found.');
    return;
  }

  console.log(`   Found ${categories.length} categories to translate`);
  progress.total += categories.length;

  for (const category of categories) {
    try {
      console.log(`   Translating: "${category.title}"...`);

      const translations = {
        title_en: await translateText(category.title, 'en'),
        title_it: await translateText(category.title, 'it'),
        title_es: await translateText(category.title, 'es'),
        text_en: category.text ? await translateText(category.text, 'en') : null,
        text_it: category.text ? await translateText(category.text, 'it') : null,
        text_es: category.text ? await translateText(category.text, 'es') : null,
      };

      const { error: updateError } = await supabase
        .from('categories')
        .update(translations)
        .eq('id', category.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`   ✅ "${category.title}" → EN: "${translations.title_en}", IT: "${translations.title_it}", ES: "${translations.title_es}"`);
      progress.completed++;
    } catch (err) {
      console.error(`   ❌ Failed to translate category ${category.id}:`, err);
      progress.failed++;
      progress.errors.push({
        id: category.id,
        table: 'categories',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }
}

/**
 * Translate and update subcategories
 */
async function translateSubcategories() {
  console.log('\n📁 Translating Subcategories...');

  const { data: subcategories, error } = await supabase
    .from('subcategories')
    .select('id, title, text')
    .eq('status', 'active');

  if (error) {
    console.error('❌ Error fetching subcategories:', error);
    return;
  }

  if (!subcategories || subcategories.length === 0) {
    console.log('   No active subcategories found.');
    return;
  }

  console.log(`   Found ${subcategories.length} subcategories to translate`);
  progress.total += subcategories.length;

  for (const subcategory of subcategories) {
    try {
      console.log(`   Translating: "${subcategory.title}"...`);

      const translations = {
        title_en: await translateText(subcategory.title, 'en'),
        title_it: await translateText(subcategory.title, 'it'),
        title_es: await translateText(subcategory.title, 'es'),
        text_en: subcategory.text ? await translateText(subcategory.text, 'en') : null,
        text_it: subcategory.text ? await translateText(subcategory.text, 'it') : null,
        text_es: subcategory.text ? await translateText(subcategory.text, 'es') : null,
      };

      const { error: updateError } = await supabase
        .from('subcategories')
        .update(translations)
        .eq('id', subcategory.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`   ✅ "${subcategory.title}" translated`);
      progress.completed++;
    } catch (err) {
      console.error(`   ❌ Failed to translate subcategory ${subcategory.id}:`, err);
      progress.failed++;
      progress.errors.push({
        id: subcategory.id,
        table: 'subcategories',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }
}

/**
 * Translate and update menu items
 */
async function translateMenuItems() {
  console.log('\n🍽️  Translating Menu Items...');

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('id, title, text, description')
    .eq('status', 'active');

  if (error) {
    console.error('❌ Error fetching menu items:', error);
    return;
  }

  if (!menuItems || menuItems.length === 0) {
    console.log('   No active menu items found.');
    return;
  }

  console.log(`   Found ${menuItems.length} menu items to translate`);
  progress.total += menuItems.length;

  for (const item of menuItems) {
    try {
      console.log(`   Translating: "${item.title}"...`);

      const translations = {
        title_en: await translateText(item.title, 'en'),
        title_it: await translateText(item.title, 'it'),
        title_es: await translateText(item.title, 'es'),
        text_en: item.text ? await translateText(item.text, 'en') : null,
        text_it: item.text ? await translateText(item.text, 'it') : null,
        text_es: item.text ? await translateText(item.text, 'es') : null,
        description_en: await translateText(item.description, 'en'),
        description_it: await translateText(item.description, 'it'),
        description_es: await translateText(item.description, 'es'),
      };

      const { error: updateError } = await supabase
        .from('menu_items')
        .update(translations)
        .eq('id', item.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`   ✅ "${item.title}" translated`);
      progress.completed++;
    } catch (err) {
      console.error(`   ❌ Failed to translate menu item ${item.id}:`, err);
      progress.failed++;
      progress.errors.push({
        id: item.id,
        table: 'menu_items',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }
}

/**
 * Translate and update addons
 */
async function translateAddons() {
  console.log('\n🧩 Translating Addons...');

  const { data: addons, error } = await supabase
    .from('addons')
    .select('id, title, description')
    .eq('status', 'active');

  if (error) {
    console.error('❌ Error fetching addons:', error);
    return;
  }

  if (!addons || addons.length === 0) {
    console.log('   No active addons found.');
    return;
  }

  console.log(`   Found ${addons.length} addons to translate`);
  progress.total += addons.length;

  for (const addon of addons) {
    try {
      console.log(`   Translating: "${addon.title}"...`);

      const translations = {
        title_en: await translateText(addon.title, 'en'),
        title_it: await translateText(addon.title, 'it'),
        title_es: await translateText(addon.title, 'es'),
        description_en: addon.description ? await translateText(addon.description, 'en') : null,
        description_it: addon.description ? await translateText(addon.description, 'it') : null,
        description_es: addon.description ? await translateText(addon.description, 'es') : null,
      };

      const { error: updateError } = await supabase
        .from('addons')
        .update(translations)
        .eq('id', addon.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`   ✅ "${addon.title}" translated`);
      progress.completed++;
    } catch (err) {
      console.error(`   ❌ Failed to translate addon ${addon.id}:`, err);
      progress.failed++;
      progress.errors.push({
        id: addon.id,
        table: 'addons',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🌍 Starting Menu Translation Script');
  console.log('=====================================\n');

  const startTime = Date.now();

  await translateCategories();
  await translateSubcategories();
  await translateMenuItems();
  await translateAddons();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n=====================================');
  console.log('✨ Translation Complete!');
  console.log(`   Total items: ${progress.total}`);
  console.log(`   ✅ Completed: ${progress.completed}`);
  console.log(`   ❌ Failed: ${progress.failed}`);
  console.log(`   ⏱️  Duration: ${duration}s`);

  if (progress.errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    progress.errors.forEach(err => {
      console.log(`   - ${err.table} (ID: ${err.id}): ${err.error}`);
    });
  }

  console.log('\n');
}

main().catch(console.error);
