-- Diagnostic Query: Check what menu data exists in the database
-- This will help us understand why you're getting duplicate errors

-- Check all categories
SELECT 'CATEGORIES' as table_name, restaurant_id, title, id, created_at
FROM categories
ORDER BY restaurant_id, title;

-- Check all subcategories
SELECT 'SUBCATEGORIES' as table_name, restaurant_id, title, id, category_id
FROM subcategories
ORDER BY restaurant_id, title;

-- Check all menu items
SELECT 'MENU_ITEMS' as table_name, restaurant_id, title, id, subcategory_id
FROM menu_items
ORDER BY restaurant_id, title;

-- Check all addons
SELECT 'ADDONS' as table_name, restaurant_id, title, id
FROM addons
ORDER BY restaurant_id, title;

-- Count by restaurant
SELECT
  'SUMMARY' as info,
  restaurant_id,
  (SELECT COUNT(*) FROM categories WHERE categories.restaurant_id = r.restaurant_id) as categories_count,
  (SELECT COUNT(*) FROM subcategories WHERE subcategories.restaurant_id = r.restaurant_id) as subcategories_count,
  (SELECT COUNT(*) FROM menu_items WHERE menu_items.restaurant_id = r.restaurant_id) as menu_items_count,
  (SELECT COUNT(*) FROM addons WHERE addons.restaurant_id = r.restaurant_id) as addons_count
FROM (
  SELECT DISTINCT restaurant_id FROM categories
  UNION
  SELECT DISTINCT restaurant_id FROM subcategories
  UNION
  SELECT DISTINCT restaurant_id FROM menu_items
  UNION
  SELECT DISTINCT restaurant_id FROM addons
) r
ORDER BY restaurant_id;

-- Check for potential duplicates
SELECT 'POTENTIAL_DUPLICATES' as info, title, restaurant_id, COUNT(*) as count
FROM menu_items
GROUP BY title, restaurant_id
HAVING COUNT(*) > 1;
