-- ============================================================================
-- STORAGE BUCKETS AND POLICIES
-- Generated: 2025-11-08T04:23:04.933Z
-- ============================================================================

BEGIN;

-- Bucket: menu-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Storage Policies
DROP POLICY IF EXISTS "Allow anon delete menu images" ON storage.objects;
CREATE POLICY "Allow anon delete menu images"
ON storage.objects FOR DELETE
TO anon
USING ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Allow anon update menu images" ON storage.objects;
CREATE POLICY "Allow anon update menu images"
ON storage.objects FOR UPDATE
TO anon
USING ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Allow anon upload menu images" ON storage.objects;
CREATE POLICY "Allow anon upload menu images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Authenticated users can delete from menu-images" ON storage.objects;
CREATE POLICY "Authenticated users can delete from menu-images"
ON storage.objects FOR DELETE
TO authenticated
USING ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Authenticated users can delete menu images" ON storage.objects;
CREATE POLICY "Authenticated users can delete menu images"
ON storage.objects FOR DELETE
TO authenticated
USING ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Authenticated users can update in menu-images" ON storage.objects;
CREATE POLICY "Authenticated users can update in menu-images"
ON storage.objects FOR UPDATE
TO authenticated
USING ((bucket_id = 'menu-images'::text))
WITH CHECK ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Authenticated users can update menu images" ON storage.objects;
CREATE POLICY "Authenticated users can update menu images"
ON storage.objects FOR UPDATE
TO authenticated
USING ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Authenticated users can upload menu images" ON storage.objects;
CREATE POLICY "Authenticated users can upload menu images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Authenticated users can upload to menu-images" ON storage.objects;
CREATE POLICY "Authenticated users can upload to menu-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Public can read menu images" ON storage.objects;
CREATE POLICY "Public can read menu images"
ON storage.objects FOR SELECT
USING ((bucket_id = 'menu-images'::text))
;

DROP POLICY IF EXISTS "Public read access for menu-images" ON storage.objects;
CREATE POLICY "Public read access for menu-images"
ON storage.objects FOR SELECT
USING ((bucket_id = 'menu-images'::text))
;

COMMIT;

-- ============================================================================
-- STORAGE SETUP COMPLETE
-- ============================================================================
