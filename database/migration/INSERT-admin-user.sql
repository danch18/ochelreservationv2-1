-- ============================================================================
-- INSERT ADMIN USER
-- ============================================================================
-- New user UUID: b7a68a11-91b8-470f-9291-62d024d918c4
-- Role: super_admin (from old DB)
-- Permissions: manage_reservations, manage_settings, manage_admins (from old DB)
-- ============================================================================
-- Run this in NEW Supabase SQL Editor after creating admin_roles table
-- ============================================================================

INSERT INTO admin_roles (user_id, role, permissions)
VALUES (
  'b7a68a11-91b8-470f-9291-62d024d918c4',
  'super_admin',
  '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
);

-- ============================================================================
-- Verify the insert
-- ============================================================================

SELECT * FROM admin_roles;

-- Expected result:
-- id: (auto-generated UUID)
-- user_id: b7a68a11-91b8-470f-9291-62d024d918c4
-- role: super_admin
-- permissions: ["manage_reservations", "manage_settings", "manage_admins"]
-- created_at: (current timestamp)
-- updated_at: (current timestamp)
