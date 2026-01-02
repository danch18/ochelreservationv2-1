-- Clean deletion of ALL piccolo-next data
-- This will remove the 1 category and 2 subcategories shown in your diagnostic

-- First, let's see what we're deleting
SELECT 'Categories to delete:' as item, id, title, restaurant_id
FROM categories
WHERE restaurant_id = 'piccolo-next';

SELECT 'Subcategories to delete:' as item, id, title, restaurant_id
FROM subcategories
WHERE restaurant_id = 'piccolo-next';

-- Now delete everything for piccolo-next (in correct order)
DELETE FROM addons WHERE restaurant_id = 'piccolo-next';
DELETE FROM menu_items WHERE restaurant_id = 'piccolo-next';
DELETE FROM subcategories WHERE restaurant_id = 'piccolo-next';
DELETE FROM categories WHERE restaurant_id = 'piccolo-next';

-- Verify all are gone
SELECT
  'Verification - All should be 0' as status,
  (SELECT COUNT(*) FROM categories WHERE restaurant_id = 'piccolo-next') as categories,
  (SELECT COUNT(*) FROM subcategories WHERE restaurant_id = 'piccolo-next') as subcategories,
  (SELECT COUNT(*) FROM menu_items WHERE restaurant_id = 'piccolo-next') as menu_items,
  (SELECT COUNT(*) FROM addons WHERE restaurant_id = 'piccolo-next') as addons;
