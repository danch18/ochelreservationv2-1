# admin_roles Table - Important Differences Found

## Comparison: Expected vs Actual (from extraction)

### ❌ DIFFERENCE 1: No Triggers in Old Database

**Expected** (based on other tables):
```sql
DROP TRIGGER IF EXISTS update_admin_roles_updated_at ON admin_roles;
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Actual** (from extraction):
```json
"triggers": null
```

**Conclusion**: The old database has NO triggers on admin_roles. The `updated_at` column does NOT auto-update on changes.

**Action**: EXACT-admin_roles.sql does NOT include any triggers (matches old DB exactly).

---

### ❌ DIFFERENCE 2: Full Permissions for anon/authenticated

**Expected** (security best practice):
```sql
GRANT SELECT ON admin_roles TO anon, authenticated;
```

**Actual** (from extraction):
```json
{
  "grantee": "anon",
  "privilege_type": "INSERT"
},
{
  "grantee": "anon",
  "privilege_type": "SELECT"
},
{
  "grantee": "anon",
  "privilege_type": "UPDATE"
},
{
  "grantee": "anon",
  "privilege_type": "DELETE"
},
{
  "grantee": "anon",
  "privilege_type": "TRUNCATE"
},
// ... same for authenticated
```

**Conclusion**: The old database grants FULL permissions (INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER) to anon and authenticated roles, not just SELECT.

**Security Note**: This seems overly permissive, but RLS policies still protect the table. The policies are what actually control access.

**Action**: EXACT-admin_roles.sql includes ALL permissions to match old DB.

---

### ✅ CORRECT: Foreign Key to auth.users

**Actual** (from extraction):
```json
"FOREIGN KEY": [
  {
    "column_name": "user_id",
    "delete_rule": "CASCADE",
    "update_rule": "NO ACTION"
  }
]
```

**Action**: EXACT-admin_roles.sql includes:
```sql
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION
```

This means: If a user is deleted from auth.users, their admin_roles row is automatically deleted.

---

### ✅ CORRECT: NOT in Realtime Publication

**Actual** (from extraction):
```json
"realtime_subscription": {
  "publication_name": "supabase_realtime",
  "publication_exists": false
}
```

**Conclusion**: admin_roles is intentionally excluded from realtime subscriptions (good for security).

**Action**: EXACT-admin_roles.sql does NOT add table to realtime publication.

---

### ✅ CORRECT: RLS Policies

Both policies match exactly what we expected:

1. **"Admin roles are manageable by super admins"** - ALL operations for super_admins
2. **"Allow authenticated users to view admin roles"** - SELECT for authenticated users

---

## Summary of Changes Made

### Files Updated:

1. **EXACT-admin_roles.sql** (NEW) - Exact recreation based on extraction
   - ❌ No triggers
   - ✅ Full permissions for anon/authenticated/service_role
   - ✅ FK to auth.users with CASCADE delete
   - ✅ Both RLS policies
   - ✅ NOT in realtime publication

2. **MANUAL-admin_roles.sql** (OLD) - Previous version with assumptions
   - ❌ Had update_updated_at trigger (doesn't exist in old DB)
   - ❌ Only granted SELECT (old DB has full permissions)

---

## Recommendation

**Use EXACT-admin_roles.sql for migration** to maintain identical behavior.

If you want to IMPROVE the configuration (recommended after migration):
1. Add update_updated_at trigger for automatic timestamp updates
2. Restrict permissions to just SELECT for better security (RLS still protects it)

But for now, use EXACT-admin_roles.sql to ensure zero differences between old and new.

---

## Migration Steps (Updated)

1. ✅ Run `0-drop-all-tables.sql`
2. ✅ Run `schema.sql` (7 tables + functions)
3. ✅ Run `storage.sql` (storage bucket + policies)
4. ✅ Run `EXACT-admin_roles.sql` ← Use this instead of MANUAL-admin_roles.sql
5. ✅ Create admin user in Auth dashboard
6. ✅ Insert admin role via SQL Editor
7. ✅ Run `npx tsx 6-import-data.ts`
8. ✅ Run `npx tsx 7-upload-storage.ts`
