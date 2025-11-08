#!/bin/bash

set -e

echo "======================================================================="
echo "  COMPLETE DATABASE MIGRATION - CLEAN AUTOMATED PROCESS"
echo "======================================================================="
echo ""
echo "This script will perform a COMPLETE migration:"
echo "  1. Drop all existing tables in new DB (clean slate)"
echo "  2. Extract exact schema from old DB"
echo "  3. Build SQL for schema and storage"
echo "  4. Export all data from old DB"
echo "  5. Download all storage files"
echo "  6. Import schema to new DB"
echo "  7. Import storage config to new DB"
echo "  8. Import data to new DB (skip admin_roles)"
echo "  9. Upload storage files to new DB"
echo ""
echo "Prerequisites:"
echo "  ✓ Old DB credentials in ../../../.env"
echo "  ✓ New DB credentials in ../../../.env.backup"
echo "  ✓ Node.js and npm installed"
echo ""
echo "⚠️  WARNING: This will DROP ALL TABLES in the new database!"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Migration cancelled."
  exit 0
fi

echo ""
echo "======================================================================="
echo "STEP 1/9: Building Schema from Extracted Data"
echo "======================================================================="
npx tsx 2-build-schema-sql.ts
if [ $? -ne 0 ]; then
  echo "❌ Schema build failed!"
  exit 1
fi

echo ""
echo "======================================================================="
echo "STEP 2/9: Building Storage SQL"
echo "======================================================================="
npx tsx 3-build-storage-sql.ts
if [ $? -ne 0 ]; then
  echo "❌ Storage SQL build failed!"
  exit 1
fi

echo ""
echo "======================================================================="
echo "STEP 3/9: Exporting Data from Old Database"
echo "======================================================================="
npx tsx 4-export-data.ts
if [ $? -ne 0 ]; then
  echo "❌ Data export failed!"
  exit 1
fi

echo ""
echo "======================================================================="
echo "STEP 4/9: Downloading Storage Files"
echo "======================================================================="
npx tsx 5-download-storage.ts
if [ $? -ne 0 ]; then
  echo "❌ Storage download failed!"
  exit 1
fi

echo ""
echo "======================================================================="
echo "STEP 5/9: Dropping Existing Tables in New Database"
echo "======================================================================="
echo ""
echo "⚠️  About to drop ALL tables in new database"
echo "   URL: $(grep NEXT_PUBLIC_SUPABASE_URL ../../../.env.backup | cut -d= -f2)"
echo ""
read -p "Confirm drop all tables? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Migration cancelled - tables not dropped"
  exit 1
fi

echo ""
echo "Copy and paste this into your NEW Supabase SQL Editor:"
echo "----------------------------------------------------------------------"
cat 0-drop-all-tables.sql
echo "----------------------------------------------------------------------"
echo ""
read -p "Press ENTER after running the DROP script in Supabase..."

echo ""
echo "======================================================================="
echo "STEP 6/9: Creating Schema in New Database"
echo "======================================================================="
echo ""
echo "Copy and paste this into your NEW Supabase SQL Editor:"
echo "----------------------------------------------------------------------"
cat schema.sql
echo "----------------------------------------------------------------------"
echo ""
read -p "Press ENTER after running the SCHEMA script in Supabase..."

echo ""
echo "======================================================================="
echo "STEP 7/9: Creating Storage Buckets in New Database"
echo "======================================================================="
echo ""
echo "Copy and paste this into your NEW Supabase SQL Editor:"
echo "----------------------------------------------------------------------"
cat storage.sql
echo "----------------------------------------------------------------------"
echo ""
read -p "Press ENTER after running the STORAGE script in Supabase..."

echo ""
echo "======================================================================="
echo "STEP 8/9: Importing Data to New Database"
echo "======================================================================="
npx tsx 6-import-data.ts
if [ $? -ne 0 ]; then
  echo "❌ Data import failed!"
  exit 1
fi

echo ""
echo "======================================================================="
echo "STEP 9/9: Uploading Storage Files to New Database"
echo "======================================================================="
npx tsx 7-upload-storage.ts
if [ $? -ne 0 ]; then
  echo "❌ Storage upload failed!"
  exit 1
fi

echo ""
echo "======================================================================="
echo "✅ MIGRATION COMPLETE!"
echo "======================================================================="
echo ""
echo "IMPORTANT NEXT STEPS:"
echo "  1. Go to new Supabase project → Authentication → Users"
echo "  2. Create admin user (or invite existing user)"
echo "  3. Copy the user UUID"
echo "  4. Go to Table Editor → admin_roles"
echo "  5. Insert row:"
echo "     - user_id: [paste UUID]"
echo "     - role: 'super_admin'"
echo "     - permissions: [\"manage_reservations\",\"manage_settings\",\"manage_admins\"]"
echo "  6. Update ../../.env with new credentials"
echo "  7. Test your application"
echo ""
echo "Migration summary saved to: MIGRATION_SUMMARY.txt"
echo ""
