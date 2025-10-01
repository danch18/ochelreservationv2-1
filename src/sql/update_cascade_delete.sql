-- ============================================================================
-- UPDATE CASCADE DELETE FOR MENU SYSTEM
-- ============================================================================
-- This migration updates the foreign key constraint on menu_items.subcategory_id
-- to enable cascade delete instead of restrict delete
-- Run this in Supabase SQL Editor after the initial menu_system.sql

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE menu_items
DROP CONSTRAINT IF EXISTS menu_items_subcategory_id_fkey;

-- Step 2: Add the foreign key constraint with CASCADE delete
ALTER TABLE menu_items
ADD CONSTRAINT menu_items_subcategory_id_fkey
FOREIGN KEY (subcategory_id)
REFERENCES subcategories(id)
ON DELETE CASCADE;

-- Verify the changes
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('menu_items', 'addons', 'subcategories')
ORDER BY tc.table_name, kcu.column_name;

-- Expected Result:
-- menu_items.subcategory_id should have delete_rule = 'CASCADE'
-- addons.category_id should have delete_rule = 'CASCADE'
-- addons.subcategory_id should have delete_rule = 'CASCADE'
-- subcategories.category_id should have delete_rule = 'CASCADE'
