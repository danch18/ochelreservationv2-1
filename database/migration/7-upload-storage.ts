#!/usr/bin/env tsx

/**
 * UPLOAD STORAGE FILES TO NEW DATABASE
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

const supabase = createClient(NEW_URL, NEW_SERVICE_KEY);

console.log('=======================================================');
console.log('UPLOADING STORAGE FILES TO NEW DATABASE');
console.log('=======================================================');
console.log(`Target: ${NEW_URL}`);
console.log('');

const BUCKET_ID = 'menu-images';
const storageDir = path.join(__dirname, 'storage');
const manifestPath = path.join(storageDir, 'manifest.json');

async function uploadFiles() {
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found!');
    console.error('   Run: npx tsx 5-download-storage.ts first');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  console.log(`Found ${manifest.length} files to upload`);
  console.log('');

  let uploaded = 0;
  let failed = 0;

  for (const file of manifest) {
    const localPath = path.join(storageDir, file.path);

    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  ${file.path}: File not found locally`);
      failed++;
      continue;
    }

    console.log(`📤 ${file.path}`);

    const fileBuffer = fs.readFileSync(localPath);
    const fileExt = path.extname(file.path).toLowerCase();

    // Determine content type
    let contentType = 'application/octet-stream';
    if (fileExt === '.jpg' || fileExt === '.jpeg') contentType = 'image/jpeg';
    else if (fileExt === '.png') contentType = 'image/png';
    else if (fileExt === '.gif') contentType = 'image/gif';
    else if (fileExt === '.webp') contentType = 'image/webp';

    const { error } = await supabase.storage
      .from(BUCKET_ID)
      .upload(file.path, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failed++;
    } else {
      console.log(`   ✅ Uploaded`);
      uploaded++;
    }
  }

  console.log('');
  console.log('=======================================================');
  if (failed === 0) {
    console.log('✅ STORAGE UPLOAD COMPLETE');
    console.log('=======================================================');
    console.log(`Files uploaded: ${uploaded}`);
    console.log('');
    console.log('✅ MIGRATION COMPLETE!');
    console.log('');
    console.log('Final steps:');
    console.log('  1. Create admin user in new Supabase Auth dashboard');
    console.log('  2. Insert admin_roles row with new user UUID');
    console.log('  3. Update .env file with new credentials');
    console.log('  4. Test your application');
  } else {
    console.log('⚠️  STORAGE UPLOAD COMPLETED WITH ERRORS');
    console.log('=======================================================');
    console.log(`Uploaded: ${uploaded}`);
    console.log(`Failed: ${failed}`);
  }
}

uploadFiles();
