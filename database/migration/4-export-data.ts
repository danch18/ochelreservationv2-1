#!/usr/bin/env tsx

/**
 * EXPORT ALL DATA FROM OLD DATABASE
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load OLD credentials from .env
const envFile = fs.readFileSync(path.join(__dirname, '../../../.env'), 'utf-8');
const envLines = envFile.split('\n');

const getEnvValue = (key: string): string => {
  const line = envLines.find(l => l.startsWith(`${key}=`));
  if (!line) throw new Error(`${key} not found`);
  return line.split('=')[1].replace(/['"]/g, '').trim();
};

const OLD_URL = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const OLD_ANON_KEY = getEnvValue('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const OLD_SERVICE_KEY = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(OLD_URL, OLD_SERVICE_KEY);

console.log('=======================================================');
console.log('EXPORTING DATA FROM OLD DATABASE');
console.log('=======================================================');
console.log(`Source: ${OLD_URL}`);
console.log('');

const TABLES = [
  'admin_roles',
  'reservations',
  'closed_dates',
  'restaurant_settings',
  'categories',
  'subcategories',
  'menu_items',
  'addons'
];

const outputDir = path.join(__dirname, 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function exportTable(tableName: string): Promise<number> {
  console.log(`📥 ${tableName}...`);

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }

  const rowCount = data?.length || 0;

  if (rowCount > 0) {
    // Save JSON
    const jsonPath = path.join(outputDir, `${tableName}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`   ✅ ${rowCount} rows exported`);
  } else {
    console.log(`   ⚠️  No data`);
  }

  return rowCount;
}

async function main() {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const table of TABLES) {
    try {
      const count = await exportTable(table);
      counts[table] = count;
      total += count;
    } catch (error: any) {
      console.error(`❌ Failed to export ${table}:`, error.message);
      process.exit(1);
    }
  }

  console.log('');
  console.log('=======================================================');
  console.log('✅ DATA EXPORT COMPLETE');
  console.log('=======================================================');
  console.log(`Total rows: ${total}`);
  console.log('');
  console.log('Summary:');
  Object.entries(counts).forEach(([table, count]) => {
    console.log(`  ${table}: ${count} rows`);
  });
  console.log('');
  console.log(`Data saved to: ${outputDir}`);
}

main();
