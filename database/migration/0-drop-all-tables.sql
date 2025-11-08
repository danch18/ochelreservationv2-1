-- ============================================================================
-- CLEAN SLATE - DROP ALL TABLES
-- ============================================================================
-- Run this FIRST in the new database to start fresh
-- ============================================================================

BEGIN;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS addons CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS restaurant_settings CASCADE;
DROP TABLE IF EXISTS closed_dates CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS current_user_role() CASCADE;
DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS setup_admin_role(TEXT) CASCADE;

-- Drop storage bucket and all policies
DO $$
BEGIN
  -- Delete all objects from bucket
  DELETE FROM storage.objects WHERE bucket_id = 'menu-images';

  -- Drop bucket
  DELETE FROM storage.buckets WHERE id = 'menu-images';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Storage cleanup: %', SQLERRM;
END $$;

COMMIT;

-- Verify clean state
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';

  RAISE NOTICE '=======================================================';
  RAISE NOTICE '✓ CLEAN SLATE COMPLETE';
  RAISE NOTICE '=======================================================';
  RAISE NOTICE 'Remaining public tables: %', table_count;
  RAISE NOTICE 'Database is ready for fresh migration';
  RAISE NOTICE '=======================================================';
END $$;
