-- Remove unique constraint on title for piccolo_menu_items
ALTER TABLE piccolo_menu_items DROP CONSTRAINT IF EXISTS piccolo_menu_items_title_key;

-- Also remove it for categories/subcategories if desired, but user specifically asked for "item name".
-- We will stick to items for now to be safe.
