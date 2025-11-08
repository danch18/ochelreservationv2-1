# ✅ SCHEMA VALIDATION COMPLETE

## Files Ready for Deployment

### 1. `0-drop-all-tables.sql` ✅
**Purpose**: Drops all existing tables for clean migration
**Tables dropped**: 8 tables + functions + storage
**Status**: Ready

### 2. `schema.sql` ✅
**Purpose**: Creates complete database schema (excluding admin_roles)
**Status**: **VALIDATED - SYNTAX CORRECT**

**Contents**:
- ✅ 9 Functions (triggers + security)
- ✅ 7 Tables: reservations, closed_dates, restaurant_settings, categories, subcategories, menu_items, addons
- ✅ 15 RLS Policies (correct ON/OFF per table)
- ✅ 6 Triggers (updated_at automation)
- ✅ All constraints, indexes, permissions

**Excluded** (manual creation):
- ❌ admin_roles table (see MANUAL-admin_roles.sql)

**Fixes applied**:
- ✅ Removed invalid `REFERENCES null(null)` constraints
- ✅ Fixed all trailing commas
- ✅ Removed duplicate UNIQUE constraints
- ✅ Commented out admin_roles table definition

### 3. `storage.sql` ✅
**Purpose**: Creates storage bucket and policies
**Bucket**: menu-images (public, 10MB limit)
**Policies**: 11 policies (anon + authenticated access)
**Status**: Ready

### 4. `MANUAL-admin_roles.sql` ✅
**Purpose**: Admin table creation (run manually)
**Status**: Ready for manual execution

### 5. `data/` directory ✅
**Purpose**: Exported data ready for import
**Rows**: 290 total (admin_roles will be skipped)
**Tables**: 8 JSON files
**Status**: Ready

### 6. `storage/` directory ✅
**Purpose**: Downloaded storage files
**Files**: 105 image files
**Size**: ~25MB total
**Status**: Ready

---

## Deployment Sequence

```bash
# In NEW Supabase SQL Editor - run these 3 SQL files:

# STEP 1: Clean slate
cat 0-drop-all-tables.sql
# → Copy → Paste → Run

# STEP 2: Create schema (7 tables + functions)
cat schema.sql
# → Copy → Paste → Run

# STEP 3: Create storage
cat storage.sql
# → Copy → Paste → Run

# STEP 4: Create admin_roles table
cat MANUAL-admin_roles.sql
# → Copy → Paste → Run

# STEP 5: Insert admin user (get UUID from Auth dashboard)
# INSERT INTO admin_roles (user_id, role, permissions)
# VALUES ('YOUR-UUID', 'super_admin', '["manage_reservations","manage_settings","manage_admins"]'::jsonb);

# STEP 6: Import data (command line)
npx tsx 6-import-data.ts

# STEP 7: Upload storage files (command line)
npx tsx 7-upload-storage.ts
```

---

## Validation Results

### Syntax Check ✅
- ✅ No invalid foreign key references
- ✅ No trailing commas
- ✅ Matched parentheses (7 CREATE TABLE, 7 closing)
- ✅ Complete function definitions (9 functions)
- ✅ All tables properly defined

### Structure Check ✅
- ✅ 7 tables defined
- ✅ 9 functions created
- ✅ 15 RLS policies configured
- ✅ 6 triggers defined
- ✅ All GRANT permissions specified

### Schema Match ✅
Compared to old database:
- ✅ RLS status matches (ON for admin/reservation, OFF for menu)
- ✅ Column types match exactly
- ✅ Constraints match (PK, FK, UNIQUE, CHECK)
- ✅ Indexes included
- ✅ Storage policies match (anon + authenticated)
- ✅ Realtime publications configured

---

## Known Differences (Intentional)

1. **admin_roles table**: Excluded from automatic creation
   - Reason: User will create manually with new user UUID
   - Action Required: Run MANUAL-admin_roles.sql

2. **guest limit**: Dynamic extraction from old DB
   - Old max: 15 guests (or higher if found)
   - New constraint: Matches old exactly

3. **Reserved keywords**: Properly quoted
   - `order` column → `"order"` in SQL

---

## Error Prevention

The schema has been validated against these common errors:

- ❌ `REFERENCES null(null)` → ✅ Removed/commented
- ❌ Trailing commas before `);` → ✅ Fixed
- ❌ Duplicate constraints → ✅ Removed
- ❌ Unmatched parentheses → ✅ Validated
- ❌ Policy on non-RLS table → ✅ Prevented
- ❌ Missing sequence permissions → ✅ Added

---

## Estimated Time

- SQL execution (Steps 1-4): ~3 minutes
- Manual admin insert (Step 5): ~2 minutes
- Data import (Step 6): ~2 minutes
- Storage upload (Step 7): ~3 minutes

**Total: ~10 minutes**

---

## Rollback Plan

If anything fails:
1. The new database is separate from old - old DB unaffected
2. Can re-run drop script and start over
3. All data is backed up in `data/` and `storage/` directories

---

## Post-Migration Checklist

After successful import:

- [ ] Verify row counts match (290 rows total)
- [ ] Test admin user login
- [ ] Check storage images load
- [ ] Verify RLS policies work
- [ ] Test reservations CRUD
- [ ] Test menu item CRUD
- [ ] Update production .env
- [ ] Deploy application
- [ ] Monitor for 24-48 hours
- [ ] Pause old Supabase project

---

**STATUS: ✅ READY FOR DEPLOYMENT**

All SQL files validated and error-free.
