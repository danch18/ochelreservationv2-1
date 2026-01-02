-- Disable Row Level Security on Piccolo tables
-- Run this if RLS is causing 400 errors

-- Disable RLS on all Piccolo tables
ALTER TABLE piccolo_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE piccolo_subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE piccolo_menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE piccolo_addons DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN 'RLS ENABLED ✗'
    ELSE 'RLS DISABLED ✓'
  END as status
FROM pg_tables
WHERE tablename LIKE 'piccolo%'
ORDER BY tablename;
