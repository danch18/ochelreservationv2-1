-- ============================================================================
-- EXACT admin_roles TABLE RECREATION
-- Generated from: extract-admin_roles-full.sql output
-- Source: OLD database (jhugrvpaizlzeemazuna.supabase.co)
-- ============================================================================
-- IMPORTANT: This is the EXACT configuration from old DB
-- Notable findings:
--   - NO triggers (no update_updated_at trigger exists in old DB)
--   - FULL permissions for anon/authenticated (not just SELECT)
--   - user_id has FK to auth.users (CASCADE delete)
--   - NOT in realtime publication
-- ============================================================================

BEGIN;

-- ============================================================================
-- TABLE: admin_roles
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID,
  role VARCHAR(50) NOT NULL DEFAULT 'admin'::character varying,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admin roles are manageable by super admins" ON admin_roles;
CREATE POLICY "Admin roles are manageable by super admins"
ON admin_roles FOR ALL
TO public
USING ((EXISTS ( SELECT 1
   FROM admin_roles ar
  WHERE ((ar.user_id = auth.uid()) AND ((ar.role)::text = 'super_admin'::text)))))
;

DROP POLICY IF EXISTS "Allow authenticated users to view admin roles" ON admin_roles;
CREATE POLICY "Allow authenticated users to view admin roles"
ON admin_roles FOR SELECT
TO public
USING ((auth.uid() IS NOT NULL))
;

-- ============================================================================
-- PERMISSIONS
-- ============================================================================
-- NOTE: Old DB has FULL permissions for anon/authenticated, not just SELECT!

GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON admin_roles TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON admin_roles TO authenticated;
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON admin_roles TO service_role;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
-- NOTE: Old DB has NO triggers on admin_roles table!
-- The update_updated_at trigger does NOT exist in the old database.
-- If you want auto-update of updated_at, add it manually after migration.

-- ============================================================================
-- REALTIME SUBSCRIPTION
-- ============================================================================
-- NOTE: admin_roles is NOT in supabase_realtime publication (intentionally excluded)

COMMIT;

-- ============================================================================
-- NEXT: INSERT ADMIN USER
-- ============================================================================
--
-- 1. Create user in NEW Supabase Auth dashboard
-- 2. Copy the user UUID
-- 3. Run:
--
-- INSERT INTO admin_roles (user_id, role, permissions)
-- VALUES (
--   'YOUR-NEW-USER-UUID-HERE',
--   'super_admin',
--   '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
-- );
--
-- Or use the setup_admin_role function:
-- SELECT setup_admin_role('admin@example.com');
--
-- ============================================================================
