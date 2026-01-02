-- Migration: Add " piccolo" suffix to all existing Piccolo restaurant menu items
-- This ensures existing items don't conflict with the new automatic namespacing system

-- Update categories table
UPDATE categories
SET
  title = CASE
    WHEN title IS NOT NULL AND title NOT LIKE '% piccolo' THEN title || ' piccolo'
    ELSE title
  END,
  title_en = CASE
    WHEN title_en IS NOT NULL AND title_en NOT LIKE '% piccolo' THEN title_en || ' piccolo'
    ELSE title_en
  END,
  title_it = CASE
    WHEN title_it IS NOT NULL AND title_it NOT LIKE '% piccolo' THEN title_it || ' piccolo'
    ELSE title_it
  END,
  title_es = CASE
    WHEN title_es IS NOT NULL AND title_es NOT LIKE '% piccolo' THEN title_es || ' piccolo'
    ELSE title_es
  END,
  text = CASE
    WHEN text IS NOT NULL AND text NOT LIKE '% piccolo' THEN text || ' piccolo'
    ELSE text
  END,
  text_en = CASE
    WHEN text_en IS NOT NULL AND text_en NOT LIKE '% piccolo' THEN text_en || ' piccolo'
    ELSE text_en
  END,
  text_it = CASE
    WHEN text_it IS NOT NULL AND text_it NOT LIKE '% piccolo' THEN text_it || ' piccolo'
    ELSE text_it
  END,
  text_es = CASE
    WHEN text_es IS NOT NULL AND text_es NOT LIKE '% piccolo' THEN text_es || ' piccolo'
    ELSE text_es
  END
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Update subcategories table
UPDATE subcategories
SET
  title = CASE
    WHEN title IS NOT NULL AND title NOT LIKE '% piccolo' THEN title || ' piccolo'
    ELSE title
  END,
  title_en = CASE
    WHEN title_en IS NOT NULL AND title_en NOT LIKE '% piccolo' THEN title_en || ' piccolo'
    ELSE title_en
  END,
  title_it = CASE
    WHEN title_it IS NOT NULL AND title_it NOT LIKE '% piccolo' THEN title_it || ' piccolo'
    ELSE title_it
  END,
  title_es = CASE
    WHEN title_es IS NOT NULL AND title_es NOT LIKE '% piccolo' THEN title_es || ' piccolo'
    ELSE title_es
  END,
  text = CASE
    WHEN text IS NOT NULL AND text NOT LIKE '% piccolo' THEN text || ' piccolo'
    ELSE text
  END,
  text_en = CASE
    WHEN text_en IS NOT NULL AND text_en NOT LIKE '% piccolo' THEN text_en || ' piccolo'
    ELSE text_en
  END,
  text_it = CASE
    WHEN text_it IS NOT NULL AND text_it NOT LIKE '% piccolo' THEN text_it || ' piccolo'
    ELSE text_it
  END,
  text_es = CASE
    WHEN text_es IS NOT NULL AND text_es NOT LIKE '% piccolo' THEN text_es || ' piccolo'
    ELSE text_es
  END
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Update menu_items table
UPDATE menu_items
SET
  title = CASE
    WHEN title IS NOT NULL AND title NOT LIKE '% piccolo' THEN title || ' piccolo'
    ELSE title
  END,
  title_en = CASE
    WHEN title_en IS NOT NULL AND title_en NOT LIKE '% piccolo' THEN title_en || ' piccolo'
    ELSE title_en
  END,
  title_it = CASE
    WHEN title_it IS NOT NULL AND title_it NOT LIKE '% piccolo' THEN title_it || ' piccolo'
    ELSE title_it
  END,
  title_es = CASE
    WHEN title_es IS NOT NULL AND title_es NOT LIKE '% piccolo' THEN title_es || ' piccolo'
    ELSE title_es
  END,
  text = CASE
    WHEN text IS NOT NULL AND text NOT LIKE '% piccolo' THEN text || ' piccolo'
    ELSE text
  END,
  text_en = CASE
    WHEN text_en IS NOT NULL AND text_en NOT LIKE '% piccolo' THEN text_en || ' piccolo'
    ELSE text_en
  END,
  text_it = CASE
    WHEN text_it IS NOT NULL AND text_it NOT LIKE '% piccolo' THEN text_it || ' piccolo'
    ELSE text_it
  END,
  text_es = CASE
    WHEN text_es IS NOT NULL AND text_es NOT LIKE '% piccolo' THEN text_es || ' piccolo'
    ELSE text_es
  END,
  description = CASE
    WHEN description IS NOT NULL AND description NOT LIKE '% piccolo' THEN description || ' piccolo'
    ELSE description
  END,
  description_en = CASE
    WHEN description_en IS NOT NULL AND description_en NOT LIKE '% piccolo' THEN description_en || ' piccolo'
    ELSE description_en
  END,
  description_it = CASE
    WHEN description_it IS NOT NULL AND description_it NOT LIKE '% piccolo' THEN description_it || ' piccolo'
    ELSE description_it
  END,
  description_es = CASE
    WHEN description_es IS NOT NULL AND description_es NOT LIKE '% piccolo' THEN description_es || ' piccolo'
    ELSE description_es
  END
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Update addons table
UPDATE addons
SET
  title = CASE
    WHEN title IS NOT NULL AND title NOT LIKE '% piccolo' THEN title || ' piccolo'
    ELSE title
  END,
  title_en = CASE
    WHEN title_en IS NOT NULL AND title_en NOT LIKE '% piccolo' THEN title_en || ' piccolo'
    ELSE title_en
  END,
  title_it = CASE
    WHEN title_it IS NOT NULL AND title_it NOT LIKE '% piccolo' THEN title_it || ' piccolo'
    ELSE title_it
  END,
  title_es = CASE
    WHEN title_es IS NOT NULL AND title_es NOT LIKE '% piccolo' THEN title_es || ' piccolo'
    ELSE title_es
  END,
  description = CASE
    WHEN description IS NOT NULL AND description NOT LIKE '% piccolo' THEN description || ' piccolo'
    ELSE description
  END,
  description_en = CASE
    WHEN description_en IS NOT NULL AND description_en NOT LIKE '% piccolo' THEN description_en || ' piccolo'
    ELSE description_en
  END,
  description_it = CASE
    WHEN description_it IS NOT NULL AND description_it NOT LIKE '% piccolo' THEN description_it || ' piccolo'
    ELSE description_it
  END,
  description_es = CASE
    WHEN description_es IS NOT NULL AND description_es NOT LIKE '% piccolo' THEN description_es || ' piccolo'
    ELSE description_es
  END
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

-- Verify the changes
SELECT 'Categories updated:' as migration_step, COUNT(*) as affected_rows
FROM categories
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

SELECT 'Subcategories updated:' as migration_step, COUNT(*) as affected_rows
FROM subcategories
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

SELECT 'Menu items updated:' as migration_step, COUNT(*) as affected_rows
FROM menu_items
WHERE restaurant_id IN ('piccolo', 'piccolo-next');

SELECT 'Addons updated:' as migration_step, COUNT(*) as affected_rows
FROM addons
WHERE restaurant_id IN ('piccolo', 'piccolo-next');
