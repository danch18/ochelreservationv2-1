#!/usr/bin/env tsx

/**
 * BUILD STORAGE BUCKET SQL FROM EXTRACTED SCHEMA
 */

import * as fs from 'fs';
import * as path from 'path';

const schemaPath = path.join(__dirname, 'extracted_schema.json');

if (!fs.existsSync(schemaPath)) {
  const fallbackPath = path.join(__dirname, '../export/extracted.json');
  if (fs.existsSync(fallbackPath)) {
    const extracted = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
    const schema = JSON.parse(extracted[0].complete_schema_export);
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  } else {
    console.error('❌ extracted_schema.json not found!');
    process.exit(1);
  }
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const sections = schema.database_schema_export.sections;

const storageBuckets = sections.find((s: any) => s.section === 'STORAGE_BUCKETS');
const storagePolicies = sections.find((s: any) => s.section === 'STORAGE_POLICIES');

console.log('=======================================================');
console.log('BUILDING STORAGE BUCKET SQL');
console.log('=======================================================');

let sql = `-- ============================================================================
-- STORAGE BUCKETS AND POLICIES
-- Generated: ${new Date().toISOString()}
-- ============================================================================

BEGIN;

`;

// Create buckets
storageBuckets.data.forEach((bucket: any) => {
  sql += `-- Bucket: ${bucket.id}\n`;
  sql += `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)\n`;
  sql += `VALUES (\n`;
  sql += `  '${bucket.id}',\n`;
  sql += `  '${bucket.name}',\n`;
  sql += `  ${bucket.public},\n`;
  sql += `  ${bucket.file_size_limit},\n`;
  sql += `  ARRAY[${bucket.allowed_mime_types.map((t: string) => `'${t}'`).join(', ')}]\n`;
  sql += `)\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET\n`;
  sql += `  public = ${bucket.public},\n`;
  sql += `  file_size_limit = ${bucket.file_size_limit},\n`;
  sql += `  allowed_mime_types = ARRAY[${bucket.allowed_mime_types.map((t: string) => `'${t}'`).join(', ')}];\n\n`;
});

// Create storage policies
sql += `-- Storage Policies\n`;
storagePolicies.data.forEach((pol: any) => {
  sql += `DROP POLICY IF EXISTS "${pol.policy_name}" ON storage.objects;\n`;
  sql += `CREATE POLICY "${pol.policy_name}"\n`;
  sql += `ON storage.objects FOR ${pol.command}\n`;

  if (pol.roles && pol.roles.length > 0 && !pol.roles.includes('public')) {
    sql += `TO ${pol.roles.join(', ')}\n`;
  }

  if (pol.using_expression && pol.using_expression !== 'true') {
    sql += `USING (${pol.using_expression})\n`;
  } else if (pol.using_expression === 'true') {
    sql += `USING (${pol.using_expression})\n`;
  }

  if (pol.with_check_expression) {
    sql += `WITH CHECK (${pol.with_check_expression})\n`;
  }

  sql += `;\n\n`;
});

sql += `COMMIT;

-- ============================================================================
-- STORAGE SETUP COMPLETE
-- ============================================================================
`;

const outputPath = path.join(__dirname, 'storage.sql');
fs.writeFileSync(outputPath, sql);

console.log('✅ Storage SQL generated!');
console.log(`   Output: ${outputPath}`);
console.log('');
console.log('Storage buckets:');
storageBuckets.data.forEach((b: any) => {
  console.log(`  ✓ ${b.id} (${b.public ? 'public' : 'private'})`);
});
console.log('');
console.log('Storage policies:');
storagePolicies.data.forEach((p: any) => {
  const roles = p.roles?.join(', ') || 'all';
  console.log(`  ✓ ${p.policy_name} (${p.command}, ${roles})`);
});
