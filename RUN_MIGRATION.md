# Run Menu Translation Migration

## Step 1: Run Database Migration

### Option A: Supabase Dashboard (Recommended - Easiest)

1. Go to https://supabase.com/dashboard
2. Select your project: `jhugrvpaizlzeemazuna`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of:
   ```
   src/sql/migrations/add_menu_multi_language_support.sql
   ```
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Option B: Using psql (if you have it installed)

```bash
# Not recommended - use Supabase Dashboard instead
```

---

## Step 2: Verify Migration

Run this query in Supabase SQL Editor to verify columns were added:

```sql
-- Check categories table
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'categories'
  AND column_name LIKE '%_en' OR column_name LIKE '%_it' OR column_name LIKE '%_es'
ORDER BY column_name;

-- Should show: text_en, text_es, text_it, title_en, title_es, title_it
```

If you see those 6 columns, migration was successful! ✅

---

## Step 3: Run Bulk Translation

After migration is complete, translate all existing menu items:

```bash
npx tsx scripts/translate-menu.ts
```

This will automatically translate all existing categories, subcategories, menu items, and addons.

---

## Troubleshooting

**Q: I see "column already exists" error**
A: That's okay! The migration uses `ADD COLUMN IF NOT EXISTS`, so it's safe to run multiple times.

**Q: How do I know if migration worked?**
A: Check Step 2 above, or just try the translation script - it will fail if columns don't exist.
