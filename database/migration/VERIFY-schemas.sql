-- ============================================================================
-- MANUAL SCHEMA VERIFICATION QUERIES
-- ============================================================================
-- Run these queries in BOTH OLD and NEW Supabase SQL Editors
-- Compare the outputs to verify identical configuration
-- ============================================================================

-- ============================================================================
-- 1. TABLE SCHEMAS (columns, types, nullability, defaults)
-- ============================================================================

SELECT
  table_name,
  column_name,
  data_type,
  udt_name,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'reservations', 'closed_dates', 'restaurant_settings',
    'categories', 'subcategories', 'menu_items', 'addons'
  )
ORDER BY table_name, ordinal_position;

-- ============================================================================
-- 2. CONSTRAINTS (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)
-- ============================================================================

SELECT
  tc.table_name,
  tc.constraint_type,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column,
  rc.update_rule,
  rc.delete_rule,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
  AND tc.table_schema = rc.constraint_schema
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
  AND tc.table_schema = cc.constraint_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name IN (
    'reservations', 'closed_dates', 'restaurant_settings',
    'categories', 'subcategories', 'menu_items', 'addons'
  )
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) STATUS
-- ============================================================================

SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'reservations', 'closed_dates', 'restaurant_settings',
    'categories', 'subcategories', 'menu_items', 'addons'
  )
ORDER BY tablename;

-- Expected:
-- reservations: true
-- closed_dates: true
-- restaurant_settings: true
-- categories: false
-- subcategories: false
-- menu_items: false
-- addons: false

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'reservations', 'closed_dates', 'restaurant_settings',
    'categories', 'subcategories', 'menu_items', 'addons'
  )
ORDER BY tablename, policyname;

-- ============================================================================
-- 5. TABLE PERMISSIONS (GRANT)
-- ============================================================================

SELECT
  table_schema,
  table_name,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name IN (
    'reservations', 'closed_dates', 'restaurant_settings',
    'categories', 'subcategories', 'menu_items', 'addons'
  )
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- ============================================================================
-- 6. INDEXES
-- ============================================================================

SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'reservations', 'closed_dates', 'restaurant_settings',
    'categories', 'subcategories', 'menu_items', 'addons'
  )
ORDER BY tablename, indexname;

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

SELECT
  trigger_schema,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN (
    'reservations', 'closed_dates', 'restaurant_settings',
    'categories', 'subcategories', 'menu_items', 'addons'
  )
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- 8. FUNCTIONS (related to tables)
-- ============================================================================

SELECT
  routine_schema,
  routine_name,
  data_type,
  security_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (
    routine_name LIKE '%updated_at%'
    OR routine_name LIKE '%admin%'
  )
ORDER BY routine_name;

-- ============================================================================
-- 9. REALTIME SUBSCRIPTIONS
-- ============================================================================

SELECT
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND schemaname = 'public'
ORDER BY tablename;

-- Expected: All 7 tables should be listed

-- ============================================================================
-- 10. STORAGE BUCKETS
-- ============================================================================

SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY name;

-- Expected: menu-images bucket with public=true, limit=10485760

-- ============================================================================
-- 11. STORAGE POLICIES
-- ============================================================================

SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;

-- Expected: 11 policies for menu-images bucket

-- ============================================================================
-- 12. ROW COUNTS (excluding admin_roles)
-- ============================================================================

SELECT
  'reservations' as table_name,
  COUNT(*) as row_count
FROM reservations

UNION ALL

SELECT
  'closed_dates' as table_name,
  COUNT(*) as row_count
FROM closed_dates

UNION ALL

SELECT
  'restaurant_settings' as table_name,
  COUNT(*) as row_count
FROM restaurant_settings

UNION ALL

SELECT
  'categories' as table_name,
  COUNT(*) as row_count
FROM categories

UNION ALL

SELECT
  'subcategories' as table_name,
  COUNT(*) as row_count
FROM subcategories

UNION ALL

SELECT
  'menu_items' as table_name,
  COUNT(*) as row_count
FROM menu_items

UNION ALL

SELECT
  'addons' as table_name,
  COUNT(*) as row_count
FROM addons

ORDER BY table_name;

-- Expected totals:
-- reservations: 75
-- closed_dates: 13
-- restaurant_settings: 11
-- categories: 8
-- subcategories: 38
-- menu_items: 142
-- addons: 2
-- TOTAL: 289 rows

-- ============================================================================
-- END OF VERIFICATION QUERIES
-- ============================================================================
