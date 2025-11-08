-- ============================================================================
-- ADMIN_ROLES TABLE - MANUAL CREATION
-- ============================================================================
-- Run this AFTER the main schema.sql
-- Then manually INSERT your admin user data
-- ============================================================================

BEGIN;

-- Table: admin_roles
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID,
  role VARCHAR(50) NOT NULL DEFAULT 'admin'::character varying,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id)
);

-- Trigger: Update updated_at on changes
DROP TRIGGER IF EXISTS update_admin_roles_updated_at ON admin_roles;
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Super admins can manage admin roles
DROP POLICY IF EXISTS "Admin roles are manageable by super admins" ON admin_roles;
CREATE POLICY "Admin roles are manageable by super admins"
ON admin_roles FOR ALL
USING ((EXISTS ( SELECT 1
   FROM admin_roles ar
  WHERE ((ar.user_id = auth.uid()) AND ((ar.role)::text = 'super_admin'::text)))))
;

-- Policy: Authenticated users can view admin roles
DROP POLICY IF EXISTS "Allow authenticated users to view admin roles" ON admin_roles;
CREATE POLICY "Allow authenticated users to view admin roles"
ON admin_roles FOR SELECT
USING ((auth.uid() IS NOT NULL))
;

-- Grant permissions
GRANT SELECT ON admin_roles TO anon, authenticated;

COMMIT;

-- ============================================================================
-- NEXT: INSERT YOUR ADMIN USER
-- ============================================================================
--
-- 1. Create user in Supabase Auth dashboard (or invite existing user)
-- 2. Copy the user UUID
-- 3. Run:
--
-- INSERT INTO admin_roles (user_id, role, permissions)
-- VALUES (
--   'YOUR-USER-UUID-HERE',
--   'super_admin',
--   '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
-- );
--
-- ============================================================================
