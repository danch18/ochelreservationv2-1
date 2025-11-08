#!/usr/bin/env tsx

/**
 * IMPORT DATA TO NEW DATABASE
 * SKIPS admin_roles (user will insert manually)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load NEW credentials from .env.backup
const envFile = fs.readFileSync(path.join(__dirname, '../../../.env.backup'), 'utf-8');
const envLines = envFile.split('\n');

const getEnvValue = (key: string): string => {
  const line = envLines.find(l => l.startsWith(`${key}=`));
  if (!line) throw new Error(`${key} not found in .env.backup`);
  return line.split('=')[1].replace(/['"]/g, '').trim();
};

const NEW_URL = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const NEW_SERVICE_KEY = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(NEW_URL, NEW_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('=======================================================');
console.log('IMPORTING DATA TO NEW DATABASE');
console.log('=======================================================');
console.log(`Target: ${NEW_URL}`);
console.log('');

// Import order (respects foreign keys)
const IMPORT_ORDER = [
  // 'admin_roles', // SKIPPED - manual insert
  'reservations',
  'closed_dates',
  'restaurant_settings',
  'categories',
  'subcategories',
  'menu_items',
  'addons'
];

const dataDir = path.join(__dirname, 'data');

async function importTable(tableName: string): Promise<number> {
  const jsonPath = path.join(dataDir, `${tableName}.json`);

  if (!fs.existsSync(jsonPath)) {
    console.log(`⚠️  ${tableName}: No data file`);
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  if (data.length === 0) {
    console.log(`⚠️  ${tableName}: No rows`);
    return 0;
  }

  console.log(`📥 ${tableName}: Importing ${data.length} rows...`);

  // Import in batches
  const batchSize = 100;
  let imported = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const { error } = await supabase
      .from(tableName)
      .insert(batch);

    if (error) {
      console.error(`   ❌ Failed at row ${i}`);
      console.error(`   Error: ${error.message}`);
      console.error(`   Details:`, error.details);
      console.error(`   Hint:`, error.hint);
      throw error;
    }

    imported += batch.length;

    if (data.length > batchSize) {
      process.stdout.write(`   Progress: ${imported}/${data.length}\r`);
    }
  }

  console.log(`   ✅ ${imported} rows imported`);
  return imported;
}

async function verifyImport(tableName: string, expectedCount: number): Promise<boolean> {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error(`❌ Verification failed: ${error.message}`);
    return false;
  }

  const match = count === expectedCount;
  const status = match ? '✅' : '❌';
  console.log(`${status} ${tableName}: ${count}/${expectedCount} rows`);

  return match;
}

async function main() {
  let totalImported = 0;
  const importCounts: Record<string, number> = {};

  console.log('⚠️  NOTE: admin_roles table will be SKIPPED');
  console.log('   You must manually insert admin user data');
  console.log('');

  for (const tableName of IMPORT_ORDER) {
    try {
      const count = await importTable(tableName);
      importCounts[tableName] = count;
      totalImported += count;
    } catch (error: any) {
      console.error(`\n❌ Import failed for ${tableName}`);
      console.error(error);
      process.exit(1);
    }
  }

  console.log('');
  console.log('=======================================================');
  console.log('VERIFYING IMPORT');
  console.log('=======================================================');

  let allVerified = true;
  for (const tableName of IMPORT_ORDER) {
    const expectedCount = importCounts[tableName];
    if (expectedCount > 0) {
      const verified = await verifyImport(tableName, expectedCount);
      if (!verified) allVerified = false;
    }
  }

  console.log('');
  console.log('=======================================================');
  if (allVerified) {
    console.log('✅ DATA IMPORT SUCCESSFUL');
    console.log('=======================================================');
    console.log(`Total rows imported: ${totalImported}`);
    console.log('');
    console.log('⚠️  IMPORTANT: admin_roles table is EMPTY');
    console.log('   You MUST manually insert admin user:');
    console.log('   1. Create user in Supabase Auth dashboard');
    console.log('   2. Insert row in admin_roles table with user UUID');
    console.log('');
    console.log('Next step:');
    console.log('  Run: npx tsx 7-upload-storage.ts');
  } else {
    console.log('❌ IMPORT VERIFICATION FAILED');
    console.log('=======================================================');
    process.exit(1);
  }
}

main();
