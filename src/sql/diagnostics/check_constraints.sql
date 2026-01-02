-- Check unique constraints on menu tables

-- Check constraints on categories
SELECT
  'categories' as table_name,
  conname as constraint_name,
  pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE cl.relname = 'categories'
  AND c.contype = 'u';  -- unique constraints

-- Check constraints on subcategories
SELECT
  'subcategories' as table_name,
  conname as constraint_name,
  pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE cl.relname = 'subcategories'
  AND c.contype = 'u';

-- Check constraints on menu_items
SELECT
  'menu_items' as table_name,
  conname as constraint_name,
  pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE cl.relname = 'menu_items'
  AND c.contype = 'u';

-- Check constraints on addons
SELECT
  'addons' as table_name,
  conname as constraint_name,
  pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE cl.relname = 'addons'
  AND c.contype = 'u';
