#!/usr/bin/env tsx

/**
 * DOWNLOAD ALL STORAGE FILES FROM OLD DATABASE
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
const OLD_SERVICE_KEY = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(OLD_URL, OLD_SERVICE_KEY);

console.log('=======================================================');
console.log('DOWNLOADING STORAGE FILES FROM OLD DATABASE');
console.log('=======================================================');
console.log(`Source: ${OLD_URL}`);
console.log('');

const BUCKET_ID = 'menu-images';
const outputDir = path.join(__dirname, 'storage');

async function downloadFiles() {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Listing files in bucket: ${BUCKET_ID}...`);

  // List all files in bucket
  const { data: files, error: listError } = await supabase
    .storage
    .from(BUCKET_ID)
    .list('', {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (listError) {
    console.error('❌ Failed to list files:', listError.message);
    process.exit(1);
  }

  if (!files || files.length === 0) {
    console.log('⚠️  No files found in storage bucket');
    return;
  }

  console.log(`Found ${files.length} items`);
  console.log('');

  let downloaded = 0;
  const manifest: any[] = [];

  // Download files recursively
  async function downloadFolder(folderPath: string = '') {
    const { data: items, error } = await supabase
      .storage
      .from(BUCKET_ID)
      .list(folderPath, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error(`❌ Failed to list ${folderPath}:`, error.message);
      return;
    }

    for (const item of items || []) {
      const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name;

      // If it's a folder, recurse
      if (item.id === null) {
        await downloadFolder(itemPath);
        continue;
      }

      // Download file
      console.log(`📥 ${itemPath}`);

      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from(BUCKET_ID)
        .download(itemPath);

      if (downloadError) {
        console.error(`   ❌ Error: ${downloadError.message}`);
        continue;
      }

      // Save file
      const localPath = path.join(outputDir, itemPath);
      const localDir = path.dirname(localPath);

      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }

      const buffer = Buffer.from(await fileData!.arrayBuffer());
      fs.writeFileSync(localPath, buffer);

      manifest.push({
        path: itemPath,
        size: buffer.length,
        folder: folderPath
      });

      downloaded++;
      console.log(`   ✅ Saved (${buffer.length} bytes)`);
    }
  }

  await downloadFolder();

  // Save manifest
  const manifestPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('');
  console.log('=======================================================');
  console.log('✅ STORAGE DOWNLOAD COMPLETE');
  console.log('=======================================================');
  console.log(`Files downloaded: ${downloaded}`);
  console.log(`Saved to: ${outputDir}`);
  console.log(`Manifest: ${manifestPath}`);
}

downloadFiles();
