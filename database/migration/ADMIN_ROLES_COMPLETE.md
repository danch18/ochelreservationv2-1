# admin_roles Table - Complete Reference

## Current Data (from OLD database)

```json
{
  "id": "aaff7f58-f453-4ead-98af-4b20a09cfc83",
  "user_id": "49f64bfc-8a29-4fb6-836c-55f3a2ed2cda",
  "role": "super_admin",
  "permissions": [
    "manage_reservations",
    "manage_settings",
    "manage_admins"
  ],
  "created_at": "2025-08-31T21:30:53.193478+00:00",
  "updated_at": "2025-08-31T21:30:53.193478+00:00"
}
```

## Schema Definition

### Table Structure
```sql
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID,                                           -- Links to auth.users.id
  role VARCHAR(50) NOT NULL DEFAULT 'admin',              -- 'admin' or 'super_admin'
  permissions JSONB DEFAULT '[]'::jsonb,                  -- Array of permission strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id)                                         -- One role per user
);
```

### Constraints
- **PRIMARY KEY**: `id` (UUID)
- **UNIQUE**: `user_id` (one admin role per user)
- **NOT NULL**: `id`, `role`
- **NULLABLE**: `user_id` (but should always have a value in practice)

### Triggers
```sql
DROP TRIGGER IF EXISTS update_admin_roles_updated_at ON admin_roles;
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS)
RLS is **ENABLED** on admin_roles.

#### Policies

**1. Admin roles are manageable by super admins** (ALL operations)
```sql
CREATE POLICY "Admin roles are manageable by super admins"
ON admin_roles FOR ALL
USING ((EXISTS (
  SELECT 1 FROM admin_roles ar
  WHERE ((ar.user_id = auth.uid()) AND ((ar.role)::text = 'super_admin'::text))
)));
```
- Allows super_admins to INSERT, UPDATE, DELETE admin_roles

**2. Allow authenticated users to view admin roles** (SELECT)
```sql
CREATE POLICY "Allow authenticated users to view admin roles"
ON admin_roles FOR SELECT
USING ((auth.uid() IS NOT NULL));
```
- Allows any authenticated user to view admin_roles

### Permissions (GRANT)
```sql
GRANT SELECT ON admin_roles TO anon, authenticated;
```

### Related Functions

**1. current_user_role()**
```sql
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS character varying
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT role FROM public.admin_roles
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$function$;
```

**2. is_admin(user_uuid uuid)**
```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = user_uuid
    AND role IN ('admin', 'super_admin')
  );
END;
$function$;
```

**3. setup_admin_role(user_email text)**
```sql
CREATE OR REPLACE FUNCTION public.setup_admin_role(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  -- Insert or update admin role
  INSERT INTO admin_roles (user_id, role, permissions)
  VALUES (
    target_user_id,
    'super_admin',
    '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    role = 'super_admin',
    permissions = '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb,
    updated_at = now();

  RAISE NOTICE 'Admin role setup complete for user: %', user_email;
END;
$function$;
```

### Realtime Subscription
admin_roles is **NOT** included in the `supabase_realtime` publication.
(This is intentional for security reasons)

---

## Migration Instructions

### Option 1: Manual Insert (Recommended for New User)

1. **Create user in NEW Supabase Dashboard**
   - Go to: Authentication → Users
   - Click "Invite user" or "Add user"
   - Enter email and password
   - Copy the new user's UUID

2. **Run MANUAL-admin_roles.sql**
   ```bash
   cat MANUAL-admin_roles.sql
   # Copy → Paste in NEW Supabase SQL Editor → Run
   ```

3. **Insert admin user**
   ```sql
   INSERT INTO admin_roles (user_id, role, permissions)
   VALUES (
     'NEW-USER-UUID-HERE',
     'super_admin',
     '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
   );
   ```

### Option 2: Using setup_admin_role Function

```sql
SELECT setup_admin_role('admin@example.com');
```

### Option 3: Migrate Existing User

If you want to use the SAME user from the old database:

1. **Export user from OLD database**
   - Go to OLD Supabase → Authentication → Users
   - Find user with ID: `49f64bfc-8a29-4fb6-836c-55f3a2ed2cda`
   - Note their email address

2. **Create same user in NEW database**
   - Go to NEW Supabase → Authentication → Users
   - Invite the same email address
   - User will receive invite email
   - Copy the NEW UUID (it will be different!)

3. **Insert with NEW UUID**
   ```sql
   INSERT INTO admin_roles (user_id, role, permissions)
   VALUES (
     'NEW-UUID-FROM-STEP-2',
     'super_admin',
     '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
   );
   ```

---

## Testing Admin Access

After creating the admin user, test access:

```sql
-- Test 1: Check role is created
SELECT * FROM admin_roles;

-- Test 2: Test is_admin function
SELECT is_admin('YOUR-USER-UUID');
-- Should return: true

-- Test 3: Test current_user_role (run as logged-in user)
SELECT current_user_role();
-- Should return: 'super_admin'
```

---

## Important Notes

1. **UUID Mismatch**: Auth user UUIDs are different between old and new projects
   - Don't copy the old UUID
   - Create new user in new project → get new UUID

2. **First Admin Problem**: The policy requires an existing super_admin to create new admins
   - Solution: First admin must be inserted directly via SQL Editor
   - Subsequent admins can be created through the app

3. **RLS Bypass**: Use the Supabase SQL Editor (service role) for the first insert
   - SQL Editor bypasses RLS policies
   - This allows bootstrapping the first super_admin

4. **Permissions Format**: Must be JSONB array
   - Correct: `'["manage_reservations"]'::jsonb`
   - Wrong: `'["manage_reservations"]'`

---

## Security Considerations

- ✅ RLS enabled - prevents unauthorized access
- ✅ Only super_admins can modify admin_roles
- ✅ All authenticated users can view (needed for role checks)
- ✅ Functions use SECURITY DEFINER for controlled elevation
- ✅ Not in realtime publication (prevents leaking admin changes)
- ⚠️ First admin must be inserted via SQL Editor (manual process)

---

## Troubleshooting

**Error: "new row violates row-level security policy"**
- You're trying to insert as a user, not via SQL Editor
- Solution: Use Supabase SQL Editor (service role access)

**Error: "duplicate key value violates unique constraint"**
- A user already has an admin role
- Solution: UPDATE instead of INSERT, or use setup_admin_role function

**Error: "User with email X not found"**
- User doesn't exist in auth.users
- Solution: Create user first in Authentication dashboard
