╔════════════════════════════════════════════════════════════════╗
║         DATABASE MIGRATION VERIFICATION TOOLS                  ║
╚════════════════════════════════════════════════════════════════╝

📁 Location: database/migration/clean/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUICK VERIFICATION (AUTOMATED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run this AFTER completing the migration:

$ npx tsx verify-migration.ts

Checks:
  ✅ Row counts (289 rows across 7 tables)
  ✅ RLS configuration (accessible via API)
  ✅ Storage (bucket config + 105 files)
  ✅ Sample data integrity (non-auto fields match)
  ✅ CRUD operations (read/write tests)

Expected output:
  ✅ MIGRATION VERIFIED - Databases are equivalent!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETAILED VERIFICATION (MANUAL SQL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For complete schema comparison:

$ cat VERIFY-schemas.sql

Copy output → Run in BOTH OLD and NEW Supabase SQL Editors
→ Compare the results

12 Verification Queries:
  1. Table schemas (columns, types, defaults)
  2. Constraints (PK, FK, UNIQUE, CHECK)
  3. RLS status (ON/OFF per table)
  4. RLS policies (names, conditions, roles)
  5. Permissions (GRANT statements)
  6. Indexes
  7. Triggers
  8. Functions
  9. Realtime subscriptions
  10. Storage buckets
  11. Storage policies
  12. Row counts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILES CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. verify-migration.ts
   → Automated verification script (TypeScript)
   → Compares OLD vs NEW databases
   → Tests CRUD operations
   → Validates data integrity

2. VERIFY-schemas.sql
   → Manual SQL queries for detailed comparison
   → 12 comprehensive verification queries
   → Run in both databases and compare outputs

3. VERIFICATION-GUIDE.md
   → Complete verification guide
   → Step-by-step instructions
   → Troubleshooting tips
   → Success criteria checklist

4. VERIFICATION-README.txt
   → This file - quick reference

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT GETS COMPARED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Included in comparison:
  ✅ Table structures (columns, types, constraints)
  ✅ RLS policies (all 15 policies)
  ✅ Triggers (6 update_updated_at triggers)
  ✅ Functions (9 helper functions)
  ✅ Permissions (GRANT statements)
  ✅ Data values (289 rows)
  ✅ Storage bucket (menu-images)
  ✅ Storage files (105 images)
  ✅ Realtime subscriptions (7 tables)

Excluded from comparison:
  ❌ Auto-generated UUIDs (id fields)
  ❌ Timestamps (created_at, updated_at)
  ❌ admin_roles table (new UUID for admin user)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPECTED RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Row Counts (excluding admin_roles):
  reservations:         75 rows
  closed_dates:         13 rows
  restaurant_settings:  11 rows
  categories:            8 rows
  subcategories:        38 rows
  menu_items:          142 rows
  addons:                2 rows
  ──────────────────────────
  TOTAL:               289 rows

Storage:
  Bucket: menu-images (public, 10MB limit)
  Files: 105 images (.webp)

RLS Status:
  RLS ON:  reservations, closed_dates, restaurant_settings
  RLS OFF: categories, subcategories, menu_items, addons

Policies: 15 total
  reservations: 5 policies
  closed_dates: 4 policies
  restaurant_settings: 4 policies
  categories: 0 policies (RLS OFF)
  subcategories: 0 policies (RLS OFF)
  menu_items: 0 policies (RLS OFF)
  addons: 0 policies (RLS OFF)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAGE WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Complete Migration
  ✅ Run 0-drop-all-tables.sql
  ✅ Run schema.sql
  ✅ Run storage.sql
  ✅ Run EXACT-admin_roles.sql
  ✅ Run INSERT-admin-user.sql
  ✅ Run npx tsx 6-import-data.ts
  ✅ Run npx tsx 7-upload-storage.ts

Step 2: Quick Verification
  $ npx tsx verify-migration.ts
  → Should output: ✅ MIGRATION VERIFIED

Step 3: Detailed Verification (Optional)
  $ cat VERIFY-schemas.sql
  → Run in OLD database → Save results
  → Run in NEW database → Compare results

Step 4: Functional Testing
  → Test app with NEW database
  → Verify all CRUD operations work
  → Test admin login
  → Check image uploads
  → Test reservations flow

Step 5: Production Switch
  → Update production .env
  → Deploy app
  → Monitor for 24-48 hours
  → Keep OLD database active (backup)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If verification fails:

1. Row count mismatch
   → Re-run: npx tsx 6-import-data.ts

2. Storage file mismatch
   → Re-run: npx tsx 7-upload-storage.ts

3. Schema differences
   → Re-run: schema.sql and EXACT-admin_roles.sql

4. Admin login fails
   → Check admin_roles table
   → Verify user_id matches Auth dashboard UUID
   → Re-run INSERT-admin-user.sql if needed

5. CRUD operations fail
   → Check RLS policies (Query 4 in VERIFY-schemas.sql)
   → Check permissions (Query 5 in VERIFY-schemas.sql)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUCCESS CRITERIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Migration is successful when:

✅ Automated verification passes (all checks green)
✅ Row counts match (289 rows)
✅ Storage files match (105 files)
✅ All CRUD operations work (no errors)
✅ Admin can login and manage data
✅ App functions identically to before
✅ No errors in browser console or logs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 For detailed guide: See VERIFICATION-GUIDE.md
🛠️  For SQL queries: See VERIFY-schemas.sql
🔧 For automation: Run verify-migration.ts
