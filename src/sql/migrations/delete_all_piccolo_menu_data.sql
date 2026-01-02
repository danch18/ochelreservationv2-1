-- Migration: Delete ALL menu data for Piccolo restaurants
-- This removes all categories, subcategories, menu items, and addons for piccolo and piccolo-next
-- Use this to start fresh with the new automatic namespacing system

-- WARNING: This will permanently delete all Piccolo menu data!
-- Make sure you have a backup if needed.

-- Show what will be deleted (run this first to verify)
SELECT 'Categories to delete:' as item_type, COUNT(*) as count
FROM categories
WHERE restaurant_id IN ('piccolo', 'piccolo-next')
UNION ALL
SELECT 'Subcategories to delete:', COUNT(*)
FROM subcategories
WHERE restaurant_id IN ('piccolo', 'piccolo-next')
UNION ALL
SELECT 'Menu items to delete:', COUNT(*)
FROM menu_items
WHERE restaurant_id IN ('piccolo', 'piccolo-next')
UNION ALL
SELECT 'Addons to delete:', COUNT(*)
FROM addons
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Delete in correct order (due to foreign key constraints)

-- Step 1: Delete addons
DELETE FROM addons
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Step 2: Delete menu items
DELETE FROM menu_items
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Step 3: Delete subcategories
DELETE FROM subcategories
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Step 4: Delete categories
DELETE FROM categories
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Verify deletion
SELECT 'Categories remaining:' as verification, COUNT(*) as count
FROM categories
WHERE restaurant_id IN ('piccolo', 'piccolo-next')
UNION ALL
SELECT 'Subcategories remaining:', COUNT(*)
FROM subcategories
WHERE restaurant_id IN ('piccolo', 'piccolo-next')
UNION ALL
SELECT 'Menu items remaining:', COUNT(*)
FROM menu_items
WHERE restaurant_id IN ('piccolo', 'piccolo-next')
UNION ALL
SELECT 'Addons remaining:', COUNT(*)
FROM addons
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- All counts should be 0
