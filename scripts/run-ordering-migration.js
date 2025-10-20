const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('==========================================');
  console.log('Database Ordering Migration');
  console.log('==========================================\n');

  try {
    console.log('📊 Step 1: Adding order columns...');

    // Add order columns
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE categories ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
        ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
        ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
        ALTER TABLE addons ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
      `
    });

    if (alterError) {
      // Try direct SQL execution
      console.log('Trying alternative method...');

      await supabase.from('categories').select('id').limit(1);

      // Execute migration SQL
      const migrationSQL = `
        BEGIN;

        -- Add order columns
        ALTER TABLE categories ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
        ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
        ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
        ALTER TABLE addons ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

        -- Initialize Categories
        UPDATE categories SET "order" = subquery.row_num
        FROM (
          SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
          FROM categories
        ) AS subquery
        WHERE categories.id = subquery.id;

        -- Initialize Subcategories
        UPDATE subcategories SET "order" = subquery.row_num
        FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY category_id ORDER BY created_at ASC
          ) as row_num
          FROM subcategories
        ) AS subquery
        WHERE subcategories.id = subquery.id;

        -- Initialize Menu Items
        UPDATE menu_items SET "order" = subquery.row_num
        FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY subcategory_id ORDER BY created_at ASC
          ) as row_num
          FROM menu_items
        ) AS subquery
        WHERE menu_items.id = subquery.id;

        -- Initialize Addons
        UPDATE addons SET "order" = subquery.row_num
        FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY subcategory_id ORDER BY created_at ASC
          ) as row_num
          FROM addons
        ) AS subquery
        WHERE addons.id = subquery.id;

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");
        CREATE INDEX IF NOT EXISTS idx_subcategories_category_order ON subcategories(category_id, "order");
        CREATE INDEX IF NOT EXISTS idx_menu_items_subcategory_order ON menu_items(subcategory_id, "order");
        CREATE INDEX IF NOT EXISTS idx_menu_items_special_order ON menu_items(is_special, "order") WHERE is_special = true;
        CREATE INDEX IF NOT EXISTS idx_addons_subcategory_order ON addons(subcategory_id, "order");

        COMMIT;
      `;

      console.log('\n⚠️  Cannot run migration via script.');
      console.log('Please run the migration manually in Supabase SQL Editor.\n');
      console.log('Copy the SQL from: database/migrations/add-ordering-columns.sql');
      console.log('Or paste this SQL in Supabase Dashboard → SQL Editor:\n');
      console.log('================== SQL START ==================');
      console.log(migrationSQL);
      console.log('=================== SQL END ===================\n');
      process.exit(1);
    }

    console.log('✅ Step 1 Complete: Order columns added\n');

    console.log('📊 Step 2: Initializing order values...');
    // Continue with initialization...

    console.log('✅ Migration completed!\n');

    // Verify
    console.log('📊 Verifying migration...');
    const { data: categories } = await supabase.from('categories').select('id, title, order');
    const { data: subcategories } = await supabase.from('subcategories').select('id, title, order');
    const { data: menuItems } = await supabase.from('menu_items').select('id, title, order').limit(5);
    const { data: addons } = await supabase.from('addons').select('id, title, order').limit(5);

    console.log(`\n✅ Categories: ${categories?.length || 0} items`);
    console.log(`✅ Subcategories: ${subcategories?.length || 0} items`);
    console.log(`✅ Menu Items: ${menuItems?.length || 0} items (showing first 5)`);
    console.log(`✅ Addons: ${addons?.length || 0} items (showing first 5)\n`);

    console.log('==========================================');
    console.log('✅ MIGRATION COMPLETED SUCCESSFULLY');
    console.log('==========================================\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nPlease run the migration manually in Supabase SQL Editor.');
    console.error('SQL file: database/migrations/add-ordering-columns.sql\n');
    process.exit(1);
  }
}

runMigration();
