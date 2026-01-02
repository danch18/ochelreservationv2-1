-- Fix menu_items title unique constraint
-- Allow same title for different restaurants
-- Migration: fix_menu_items_unique_constraint.sql

-- Drop the existing unique constraint on title
ALTER TABLE menu_items
DROP CONSTRAINT IF EXISTS menu_items_title_key;

-- Add a new unique constraint that includes restaurant_id
-- This allows different restaurants to have items with the same title
ALTER TABLE menu_items
ADD CONSTRAINT menu_items_title_restaurant_id_key
UNIQUE (title, restaurant_id);

-- Add comment
COMMENT ON CONSTRAINT menu_items_title_restaurant_id_key ON menu_items
IS 'Ensures menu item titles are unique within each restaurant';
