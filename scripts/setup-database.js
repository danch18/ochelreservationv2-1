#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple function to load environment variables from .env.local
function loadEnvFile(filePath) {
  try {
    const envFile = fs.readFileSync(filePath, 'utf8');
    const lines = envFile.split('\n');
    
    lines.forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.log('No .env.local file found, using existing environment variables');
  }
}

// Load environment variables
loadEnvFile(path.join(__dirname, '../.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check your .env.local file.');
  console.error('Required variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupClosedDatesTable() {
  console.log('Setting up closed_dates table...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../src/sql/closed_dates.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL by statements (basic splitting on semicolons)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`Executing statement ${i + 1}...`);
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // Try direct query if rpc fails
          const { error: directError } = await supabase.from('_').select('*').limit(0);
          if (directError) {
            console.warn(`Statement ${i + 1} failed, but this might be expected:`, error.message);
          }
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    // Test the table by trying to select from it
    console.log('Testing table creation...');
    const { data, error } = await supabase
      .from('closed_dates')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Table test failed:', error.message);
      console.log('\n📋 Manual Setup Required:');
      console.log('Please run the following SQL in your Supabase SQL editor:');
      console.log('\n' + sql);
    } else {
      console.log('✅ closed_dates table created successfully!');
      console.log('The dateAvailabilityService should now work properly.');
    }
    
  } catch (error) {
    console.error('Setup failed:', error.message);
    console.log('\n📋 Manual Setup Required:');
    console.log('Please copy and run the contents of src/sql/closed_dates.sql in your Supabase SQL editor.');
  }
}

async function main() {
  console.log('🚀 Setting up Restaurant Reservation Database...');
  console.log(`Connecting to: ${supabaseUrl}`);
  
  await setupClosedDatesTable();
}

if (require.main === module) {
  main().catch(console.error);
}