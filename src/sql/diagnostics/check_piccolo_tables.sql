-- Check if Piccolo tables exist

-- Check for piccolo_categories table
SELECT
  'piccolo_categories' as table_name,
  CASE
    WHEN EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'piccolo_categories'
    ) THEN 'EXISTS ✓'
    ELSE 'NOT FOUND ✗'
  END as status;

-- Check for piccolo_subcategories table
SELECT
  'piccolo_subcategories' as table_name,
  CASE
    WHEN EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'piccolo_subcategories'
    ) THEN 'EXISTS ✓'
    ELSE 'NOT FOUND ✗'
  END as status;

-- Check for piccolo_menu_items table
SELECT
  'piccolo_menu_items' as table_name,
  CASE
    WHEN EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'piccolo_menu_items'
    ) THEN 'EXISTS ✓'
    ELSE 'NOT FOUND ✗'
  END as status;

-- Check for piccolo_addons table
SELECT
  'piccolo_addons' as table_name,
  CASE
    WHEN EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'piccolo_addons'
    ) THEN 'EXISTS ✓'
    ELSE 'NOT FOUND ✗'
  END as status;
