# Menu Multi-Restaurant Migration Guide

## Overview

This guide explains how to enable multi-restaurant menu management for both **Magnifiko** and **Piccolo Magnifiko** restaurants. The migration adds `restaurant_id` to all menu tables, making categories, subcategories, menu items, and addons **completely separate** for each restaurant. All existing Magnifiko data will be preserved.

## What Changed

### Database Changes
- Added `restaurant_id` column to **ALL** menu tables:
  - `categories` - Each restaurant has its own categories
  - `subcategories` - Each restaurant has its own subcategories
  - `menu_items` - Each restaurant has its own menu items
  - `addons` - Each restaurant has its own addons

### Admin Dashboard Changes
- **Magnifiko Menu** tab - manages ALL menu data for Magnifiko restaurant (categories, subcategories, items, addons)
- **Piccolo Menu** tab (new) - manages ALL menu data for Piccolo Magnifiko restaurant (starts empty)
- Both tabs are **completely independent** - changes in one won't affect the other
- You can create the same category names for both restaurants without conflicts

## Migration Steps

### Step 1: Run the SQL Migration

**IMPORTANT:** This migration is safe and will NOT delete any existing data. All current menu items will be preserved and assigned to Magnifiko.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `src/sql/migrations/add_restaurant_id_to_menu.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** button
7. Wait for completion message: "✓ RESTAURANT_ID MIGRATION COMPLETE"

#### Option B: Using Supabase CLI

```bash
# From your project root directory
supabase db push

# Or run the specific migration file
psql $DATABASE_URL -f src/sql/migrations/add_restaurant_id_to_menu.sql
```

### Step 2: Verify Migration

After running the migration, verify it was successful:

1. Go to **Supabase Dashboard > Table Editor**
2. Open the `categories` table
3. You should see a new column: `restaurant_id`
4. All existing records should have `restaurant_id = 'magnifiko'`
5. Repeat check for `subcategories`, `menu_items`, and `addons` tables

## How to Use

### Access the Admin Dashboard

1. Navigate to `/admin` in your application
2. Log in with your admin credentials
3. You'll see two menu tabs:
   - **Magnifiko Menu** - All existing menu items are here
   - **Piccolo Menu** - New, empty menu for Piccolo restaurant

### Creating Piccolo Menu Items

1. Click on the **Piccolo Menu** tab
2. **The Piccolo menu starts completely empty** - you'll need to create everything from scratch:
   - Categories (e.g., "Antipasti", "Pasta", "Pizza")
   - Subcategories (e.g., "Fresh Pasta", "Baked Pasta")
   - Menu items with prices and descriptions
   - Add-ons if needed
3. All items created here will **only** appear on the Piccolo website (`/piccolo-next/menu`)
4. Items will NOT appear on the Magnifiko website
5. You can reuse the same category/subcategory names from Magnifiko if you want

### Important Notes

⚠️ **Restaurant Isolation - Completely Separate**
- **Magnifiko** has its own categories, subcategories, menu items, and addons → Shows on `/menu`
- **Piccolo** has its own categories, subcategories, menu items, and addons → Shows on `/piccolo-next/menu`
- **Piccolo menu starts empty** - no items, no categories, nothing
- You can have the same category name "Pizza" in both restaurants without conflicts
- Creating/editing/deleting items in one restaurant will NOT affect the other

✅ **Data Safety**
- All existing menu data is automatically assigned to Magnifiko
- **No Magnifiko data is deleted or modified**
- No data is lost during migration
- Piccolo starts fresh with an empty menu
- You can run the migration multiple times safely (it's idempotent)

## Database Schema Changes

### Before Migration
```sql
categories:
- id (SERIAL PRIMARY KEY)
- title (VARCHAR UNIQUE)
- text
- status
...

subcategories:
- id (SERIAL PRIMARY KEY)
- category_id (INTEGER)
- title (VARCHAR UNIQUE)
...

menu_items:
- id (SERIAL PRIMARY KEY)
- subcategory_id (INTEGER)
- title (VARCHAR UNIQUE)
- price (DECIMAL)
...

addons:
- id (SERIAL PRIMARY KEY)
- title (VARCHAR UNIQUE)
- price (DECIMAL)
...
```

### After Migration
```sql
categories:
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- restaurant_id (VARCHAR NOT NULL DEFAULT 'magnifiko')
- text
- status
...
-- New unique constraint: UNIQUE(title, restaurant_id)

subcategories:
- id (SERIAL PRIMARY KEY)
- category_id (INTEGER)
- title (VARCHAR)
- restaurant_id (VARCHAR NOT NULL DEFAULT 'magnifiko')
...
-- New unique constraint: UNIQUE(title, restaurant_id)

menu_items:
- id (SERIAL PRIMARY KEY)
- subcategory_id (INTEGER)
- title (VARCHAR)
- restaurant_id (VARCHAR NOT NULL DEFAULT 'magnifiko')
- price (DECIMAL)
...
-- New unique constraint: UNIQUE(title, restaurant_id)

addons:
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- restaurant_id (VARCHAR NOT NULL DEFAULT 'magnifiko')
- price (DECIMAL)
...
-- New unique constraint: UNIQUE(title, restaurant_id)
```

This means:
- **Same names can exist for both restaurants** (e.g., both can have "Pizza" category)
- Each restaurant's data is **completely separate**
- Filtering by `restaurant_id` keeps data isolated
- **All existing data automatically gets `restaurant_id = 'magnifiko'`**
- **Piccolo starts with empty tables** (no categories, no items, nothing)

## Troubleshooting

### Migration Fails with "Column already exists"
This is normal if you've run the migration before. The migration is idempotent and safe to run multiple times.

### Existing items not showing in Magnifiko Menu
1. Check database: `SELECT * FROM categories WHERE restaurant_id = 'magnifiko';`
2. If empty, run this SQL:
   ```sql
   UPDATE categories SET restaurant_id = 'magnifiko' WHERE restaurant_id IS NULL OR restaurant_id = '';
   UPDATE subcategories SET restaurant_id = 'magnifiko' WHERE restaurant_id IS NULL OR restaurant_id = '';
   UPDATE menu_items SET restaurant_id = 'magnifiko' WHERE restaurant_id IS NULL OR restaurant_id = '';
   UPDATE addons SET restaurant_id = 'magnifiko' WHERE restaurant_id IS NULL OR restaurant_id = '';
   ```

### Menu items showing on wrong restaurant page
This indicates a filtering issue. Check that:
1. Menu queries include `WHERE restaurant_id = ?`
2. MenuDisplay component is passing correct `restaurantId` prop
3. API routes are filtering by `restaurant_id`

## Code Changes Summary

### Files Modified
1. `src/sql/migrations/add_restaurant_id_to_menu.sql` - New migration file
2. `src/components/admin/AdminTabs.tsx` - Added Piccolo Menu tab
3. `src/components/admin/MenuManagementTab.tsx` - Added restaurant prop
4. `src/app/admin/page.tsx` - Handle both menu tabs
5. `src/locales/en.json` - Added Piccolo Menu translations
6. `src/locales/fr.json` - Added Piccolo Menu translations

### Components That Need Restaurant ID
When creating or querying menu items, these components now require `restaurantId`:
- `CategoriesManagement`
- `SubcategoriesManagement`
- `MenuItemsManagement`
- `AddonsManagement`
- `MenuDisplay` (frontend)

## Next Steps

After running the migration:

1. ✅ **Test Magnifiko Menu**
   - Verify all existing items still appear
   - Test creating/editing/deleting items
   - Confirm items only show on Magnifiko pages

2. ✅ **Create Piccolo Menu**
   - Go to Piccolo Menu tab
   - Create categories for Piccolo
   - Add subcategories and menu items
   - Verify items only show on Piccolo pages

3. ✅ **Update Menu Components**
   - Ensure all menu API calls filter by `restaurant_id`
   - Update menu service to include `restaurant_id` in queries
   - Test menu display on both restaurant websites

## Support

If you encounter any issues:
1. Check the migration completion message in SQL Editor
2. Verify `restaurant_id` column exists in all tables
3. Confirm existing data has `restaurant_id = 'magnifiko'`
4. Review error logs in browser console or server logs

## Rollback (If Needed)

⚠️ **Only use if absolutely necessary**

To rollback the migration:
```sql
-- Remove restaurant_id column from all tables
ALTER TABLE categories DROP COLUMN IF EXISTS restaurant_id;
ALTER TABLE subcategories DROP COLUMN IF EXISTS restaurant_id;
ALTER TABLE menu_items DROP COLUMN IF EXISTS restaurant_id;
ALTER TABLE addons DROP COLUMN IF EXISTS restaurant_id;

-- Restore original unique constraints
ALTER TABLE categories ADD CONSTRAINT categories_title_key UNIQUE (title);
ALTER TABLE subcategories ADD CONSTRAINT subcategories_title_key UNIQUE (title);
ALTER TABLE menu_items ADD CONSTRAINT menu_items_title_key UNIQUE (title);
ALTER TABLE addons ADD CONSTRAINT addons_title_key UNIQUE (title);
```

**Note:** This will remove all Piccolo menu items. Only use if you haven't created Piccolo menu items yet.
