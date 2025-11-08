# Migration Verification Guide

Complete guide to verify that OLD and NEW databases are identical (except auto-generated fields and admin_roles).

## Goal

Ensure the app works exactly the same with only .env changes:
- ✅ Same schema (tables, columns, types, constraints)
- ✅ Same data (289 rows across 7 tables)
- ✅ Same configs (RLS, policies, permissions)
- ✅ Same storage (bucket + 105 files)
- ✅ Same subscriptions (realtime)
- ✅ All CRUD operations work without errors

## Quick Verification (Automated)

### 1. Run Automated Verification Script

```bash
cd /home/atm-shifat/Desktop/Work/Ochel/ochelreservationv2/database/migration/clean
npx tsx verify-migration.ts
```

This will automatically compare:
- ✅ Row counts (all tables)
- ✅ RLS accessibility
- ✅ Storage bucket & file counts
- ✅ Sample data integrity
- ✅ Basic CRUD operations

**Expected output:**
```
✅ Row Counts: All row counts match
✅ RLS: All tables accessible (RLS configured correctly)
✅ Storage: Storage bucket and 105 files match
✅ Data Integrity: Sample data comparisons match
✅ CRUD Operations: All basic CRUD operations working

Summary: 5 passed, 0 failed, 0 warnings

✅ MIGRATION VERIFIED - Databases are equivalent!
```

---

## Detailed Verification (Manual SQL)

### 2. Run SQL Comparison Queries

For detailed schema comparison, run the queries in `VERIFY-schemas.sql`:

**In OLD Supabase SQL Editor:**
```bash
cat VERIFY-schemas.sql
# Copy → Paste in OLD database SQL Editor → Run each query
# Save outputs to compare
```

**In NEW Supabase SQL Editor:**
```bash
cat VERIFY-schemas.sql
# Copy → Paste in NEW database SQL Editor → Run each query
# Compare outputs with OLD database
```

### Key Queries to Compare:

#### Query 1: Table Schemas
Compare column names, types, nullability, defaults for all 7 tables.

**Expected:** Identical output for both databases.

#### Query 2: Constraints
Compare PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK constraints.

**Expected:** Identical constraints (including CHECK clauses).

#### Query 3: RLS Status
Check which tables have RLS enabled.

**Expected:**
- RLS ON: reservations, closed_dates, restaurant_settings
- RLS OFF: categories, subcategories, menu_items, addons

#### Query 4: RLS Policies
Compare all policies (names, roles, commands, conditions).

**Expected:** Identical policies for each table.

#### Query 12: Row Counts
**Expected:**
```
reservations: 75
closed_dates: 13
restaurant_settings: 11
categories: 8
subcategories: 38
menu_items: 142
addons: 2
─────────────
TOTAL: 289 rows
```

---

## Storage Verification

### 3. Verify Storage Files

**Automated (via script):**
```bash
npx tsx verify-migration.ts
# Checks file counts automatically
```

**Manual (via Supabase Dashboard):**

1. Go to OLD Supabase → Storage → menu-images
2. Count total files (should be 105)
3. Go to NEW Supabase → Storage → menu-images
4. Count total files (should be 105)
5. Spot-check a few image URLs to ensure they load

**File count check:**
```bash
# Count files in exported storage directory
find storage -type f -name "*.webp" | wc -l
# Should output: 103 (plus 2 placeholder files = 105 total)
```

---

## Functional Testing

### 4. Test CRUD Operations

After migration, test basic app functionality:

#### Categories (RLS OFF - Public)
```bash
# Test in browser console or API client
# Should work without authentication

# READ
fetch('https://oblfrzmgwsxqogackdee.supabase.co/rest/v1/categories?select=*', {
  headers: { 'apikey': 'YOUR-ANON-KEY' }
})

# Expected: List of 8 categories
```

#### Menu Items (RLS OFF - Public)
```bash
# READ
fetch('https://oblfrzmgwsxqogackdee.supabase.co/rest/v1/menu_items?select=*', {
  headers: { 'apikey': 'YOUR-ANON-KEY' }
})

# Expected: List of 142 menu items
```

#### Reservations (RLS ON - Requires Auth)
Test via your app:
1. Create new reservation (should work for anon users)
2. View own reservation (should work with email)
3. Login as admin
4. View all reservations (should work for admin)
5. Update reservation status (should work for admin)

#### Admin Operations
Login as admin user and test:
- ✅ View all reservations
- ✅ Confirm/cancel reservations
- ✅ Manage closed dates
- ✅ Update restaurant settings
- ✅ Manage menu items (create, update, delete)
- ✅ Upload menu images

---

## Verification Checklist

Run through this checklist to ensure complete verification:

### Schema & Config
- [ ] Run automated verification script (passes all checks)
- [ ] Compare table schemas (12 queries in VERIFY-schemas.sql)
- [ ] Verify row counts (289 total)
- [ ] Check RLS status (ON for 3 tables, OFF for 4 tables)
- [ ] Compare RLS policies (all policies match)
- [ ] Verify constraints (CHECK, UNIQUE, FK all present)
- [ ] Check triggers (update_updated_at on 6 tables)
- [ ] Verify functions (9 functions present)
- [ ] Check realtime subscriptions (7 tables subscribed)

### Storage
- [ ] Verify bucket exists (menu-images)
- [ ] Check bucket config (public=true, limit=10MB)
- [ ] Verify file count (105 files)
- [ ] Spot-check image URLs (images load correctly)
- [ ] Check storage policies (11 policies)

### Data Integrity
- [ ] All row counts match (289 rows)
- [ ] Sample data comparison (verify-migration.ts)
- [ ] Check special characters (non-ASCII in titles/descriptions)
- [ ] Verify JSONB data (permissions, settings)
- [ ] Check date/time formats
- [ ] Verify price decimals (menu items, addons)

### Functional Testing
- [ ] Public read operations work (categories, menu_items)
- [ ] Anon can create reservations
- [ ] Email-based reservation retrieval works
- [ ] Admin login works (with new UUID)
- [ ] Admin can view all reservations
- [ ] Admin can update reservation status
- [ ] Admin can manage menu items
- [ ] Image uploads work
- [ ] Closed dates management works
- [ ] Settings updates work

### Environment
- [ ] .env updated with NEW credentials
- [ ] App deployed with new .env
- [ ] All API calls use new URL
- [ ] Storage URLs point to new bucket
- [ ] No errors in browser console
- [ ] No errors in server logs

---

## Expected Differences (Acceptable)

These differences are expected and acceptable:

### 1. Auto-generated UUIDs
- `id` fields will be different (randomly generated)
- `created_at` / `updated_at` timestamps will be different

### 2. Admin User
- `admin_roles.user_id` will be different (new auth user UUID)
- Old: `49f64bfc-8a29-4fb6-836c-55f3a2ed2cda`
- New: `b7a68a11-91b8-470f-9291-62d024d918c4`

### 3. Storage File Metadata
- Internal file IDs may differ
- Upload timestamps will differ
- But file names, paths, and content should be identical

---

## Troubleshooting

### Issue: Row counts don't match

**Check:**
```bash
npx tsx verify-migration.ts
# Look at row count details
```

**Fix:**
```bash
# Re-run data import
npx tsx 6-import-data.ts
```

### Issue: Storage file count mismatch

**Check:**
```bash
# List files in NEW database
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('NEW_URL', 'NEW_KEY');
supabase.storage.from('menu-images').list('').then(console.log);
"
```

**Fix:**
```bash
# Re-upload storage files
npx tsx 7-upload-storage.ts
```

### Issue: CRUD operations fail

**Check RLS policies:**
- Run Query 4 from VERIFY-schemas.sql in both databases
- Compare policy definitions

**Check permissions:**
- Run Query 5 from VERIFY-schemas.sql in both databases
- Verify GRANT statements match

### Issue: Admin login fails

**Check admin_roles:**
```sql
SELECT * FROM admin_roles;
```

**Verify:**
- user_id matches the UUID from Authentication dashboard
- role is 'super_admin'
- permissions array is correct

**Fix:**
```sql
DELETE FROM admin_roles;  -- if wrong
-- Then re-run INSERT-admin-user.sql with correct UUID
```

---

## Final Sign-Off

Before switching production to NEW database:

✅ **Automated verification passes** (verify-migration.ts)
✅ **All manual checks pass** (VERIFY-schemas.sql)
✅ **Functional testing complete** (all CRUD operations work)
✅ **No errors in testing** (browser console + server logs clean)
✅ **Team sign-off** (all stakeholders approve)

Then:
1. ✅ Update production .env with NEW credentials
2. ✅ Deploy application
3. ✅ Monitor for 24-48 hours
4. ✅ Keep OLD database active (backup)
5. ✅ After 1 week of stable operation → Pause OLD project

---

## Emergency Rollback

If issues occur after switching to NEW database:

1. **Immediate rollback:**
   ```bash
   # Restore old .env
   cp .env.old .env
   # Redeploy
   ```

2. **OLD database still accessible** (kept running for 1 week)

3. **No data loss** (both databases active during transition)

---

## Success Criteria

Migration is successful when:

✅ **Zero schema differences** (all queries match)
✅ **Zero data loss** (289 rows + 105 files)
✅ **Zero functionality breaks** (all features work)
✅ **Zero errors** (logs are clean)
✅ **Admin access works** (new admin user can login)
✅ **App runs identically** (users notice no difference)

---

**Last updated:** 2025-11-08
**Migration package:** `/database/migration/clean/`
