#!/usr/bin/env tsx

/**
 * COMPLETE SCHEMA EXTRACTION
 * Extracts exact schema from OLD database including all constraints
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load OLD database credentials from .env
const envFile = fs.readFileSync(path.join(__dirname, '../../../.env'), 'utf-8');
const envLines = envFile.split('\n');

const getEnvValue = (key: string): string => {
  const line = envLines.find(l => l.startsWith(`${key}=`));
  if (!line) throw new Error(`${key} not found in .env`);
  return line.split('=')[1].replace(/['"]/g, '').trim();
};

const OLD_URL = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const OLD_SERVICE_KEY = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(OLD_URL, OLD_SERVICE_KEY);

console.log('=======================================================');
console.log('EXTRACTING COMPLETE SCHEMA FROM OLD DATABASE');
console.log('=======================================================');
console.log(`Source: ${OLD_URL}`);
console.log('');

async function executeQuery(query: string): Promise<any> {
  const response = await fetch(`${OLD_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': OLD_SERVICE_KEY,
      'Authorization': `Bearer ${OLD_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    // Fallback: try direct SQL query via PostgREST
    const directResponse = await fetch(`${OLD_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': OLD_SERVICE_KEY,
        'Authorization': `Bearer ${OLD_SERVICE_KEY}`,
        'Content-Type': 'application/sql',
        'Accept': 'application/json'
      },
      body: query
    });

    if (!directResponse.ok) {
      throw new Error(`Query failed: ${await directResponse.text()}`);
    }

    return directResponse.json();
  }

  return response.json();
}

const EXTRACTION_QUERY = `
-- Extract complete schema as JSON
WITH
-- 1. Tables with ALL column details
table_schemas AS (
  SELECT jsonb_build_object(
    'tables', jsonb_agg(
      jsonb_build_object(
        'table_name', table_name,
        'columns', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'column_name', column_name,
              'data_type', data_type,
              'udt_name', udt_name,
              'character_maximum_length', character_maximum_length,
              'numeric_precision', numeric_precision,
              'is_nullable', is_nullable,
              'column_default', column_default,
              'ordinal_position', ordinal_position
            ) ORDER BY ordinal_position
          )
          FROM information_schema.columns c
          WHERE c.table_schema = 'public'
            AND c.table_name = t.table_name
        )
      ) ORDER BY table_name
    )
  ) AS data
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
),

-- 2. ALL Constraints (PK, FK, CHECK, UNIQUE)
constraints AS (
  SELECT jsonb_build_object(
    'constraints', jsonb_agg(
      jsonb_build_object(
        'table_name', tc.table_name,
        'constraint_name', tc.constraint_name,
        'constraint_type', tc.constraint_type,
        'column_name', kcu.column_name,
        'foreign_table', ccu.table_name,
        'foreign_column', ccu.column_name,
        'delete_rule', rc.delete_rule,
        'update_rule', rc.update_rule,
        'check_clause', cc.check_clause
      ) ORDER BY tc.table_name, tc.constraint_type
    )
  ) AS data
  FROM information_schema.table_constraints tc
  LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  LEFT JOIN information_schema.referential_constraints rc
    ON rc.constraint_name = tc.constraint_name
    AND rc.constraint_schema = tc.table_schema
  LEFT JOIN information_schema.check_constraints cc
    ON cc.constraint_name = tc.constraint_name
    AND cc.constraint_schema = tc.table_schema
  WHERE tc.table_schema = 'public'
),

-- 3. Indexes
indexes AS (
  SELECT jsonb_build_object(
    'indexes', jsonb_agg(
      jsonb_build_object(
        'table_name', tablename,
        'index_name', indexname,
        'definition', indexdef
      ) ORDER BY tablename, indexname
    )
  ) AS data
  FROM pg_indexes
  WHERE schemaname = 'public'
),

-- 4. Functions
functions AS (
  SELECT jsonb_build_object(
    'functions', jsonb_agg(
      jsonb_build_object(
        'function_name', p.proname,
        'definition', pg_get_functiondef(p.oid)
      ) ORDER BY p.proname
    )
  ) AS data
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
),

-- 5. Triggers
triggers AS (
  SELECT jsonb_build_object(
    'triggers', jsonb_agg(
      jsonb_build_object(
        'table_name', event_object_table,
        'trigger_name', trigger_name,
        'timing', action_timing,
        'event', event_manipulation,
        'statement', action_statement
      ) ORDER BY event_object_table, trigger_name
    )
  ) AS data
  FROM information_schema.triggers
  WHERE trigger_schema = 'public'
),

-- 6. RLS Status
rls_status AS (
  SELECT jsonb_build_object(
    'rls_enabled', jsonb_agg(
      jsonb_build_object(
        'table_name', tablename,
        'rls_enabled', rowsecurity
      ) ORDER BY tablename
    )
  ) AS data
  FROM pg_tables
  WHERE schemaname = 'public'
),

-- 7. RLS Policies
rls_policies AS (
  SELECT jsonb_build_object(
    'rls_policies', jsonb_agg(
      jsonb_build_object(
        'table_name', pc.relname,
        'policy_name', pol.polname,
        'command', CASE pol.polcmd
          WHEN 'r' THEN 'SELECT'
          WHEN 'a' THEN 'INSERT'
          WHEN 'w' THEN 'UPDATE'
          WHEN 'd' THEN 'DELETE'
          WHEN '*' THEN 'ALL'
        END,
        'roles', (
          SELECT array_agg(r.rolname)
          FROM pg_roles r
          WHERE r.oid = ANY(pol.polroles)
        ),
        'using_expr', pg_get_expr(pol.polqual, pol.polrelid),
        'with_check_expr', pg_get_expr(pol.polwithcheck, pol.polrelid)
      ) ORDER BY pc.relname, pol.polname
    )
  ) AS data
  FROM pg_policy pol
  JOIN pg_class pc ON pol.polrelid = pc.oid
  JOIN pg_namespace pn ON pc.relnamespace = pn.oid
  WHERE pn.nspname = 'public'
),

-- 8. Storage Buckets
storage_buckets AS (
  SELECT jsonb_build_object(
    'storage_buckets', jsonb_agg(
      jsonb_build_object(
        'id', id,
        'name', name,
        'public', public,
        'file_size_limit', file_size_limit,
        'allowed_mime_types', allowed_mime_types
      ) ORDER BY id
    )
  ) AS data
  FROM storage.buckets
),

-- 9. Storage Policies
storage_policies AS (
  SELECT jsonb_build_object(
    'storage_policies', jsonb_agg(
      jsonb_build_object(
        'policy_name', pol.polname,
        'command', CASE pol.polcmd
          WHEN 'r' THEN 'SELECT'
          WHEN 'a' THEN 'INSERT'
          WHEN 'w' THEN 'UPDATE'
          WHEN 'd' THEN 'DELETE'
          WHEN '*' THEN 'ALL'
        END,
        'roles', (
          SELECT array_agg(r.rolname)
          FROM pg_roles r
          WHERE r.oid = ANY(pol.polroles)
        ),
        'using_expr', pg_get_expr(pol.polqual, pol.polrelid),
        'with_check_expr', pg_get_expr(pol.polwithcheck, pol.polrelid)
      ) ORDER BY pol.polname
    )
  ) AS data
  FROM pg_policy pol
  WHERE pol.polrelid = 'storage.objects'::regclass
),

-- 10. Realtime Publications
realtime_pubs AS (
  SELECT jsonb_build_object(
    'realtime_publications', jsonb_agg(
      jsonb_build_object(
        'table_name', tablename
      ) ORDER BY tablename
    )
  ) AS data
  FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
)

-- Combine everything
SELECT jsonb_pretty(
  (SELECT data FROM table_schemas) ||
  (SELECT data FROM constraints) ||
  (SELECT data FROM indexes) ||
  (SELECT data FROM functions) ||
  (SELECT data FROM triggers) ||
  (SELECT data FROM rls_status) ||
  (SELECT data FROM rls_policies) ||
  (SELECT data FROM storage_buckets) ||
  (SELECT data FROM storage_policies) ||
  (SELECT data FROM realtime_pubs)
) AS complete_schema;
`;

async function main() {
  try {
    console.log('Executing schema extraction query...');

    // Use direct psql-style query
    const { data, error } = await supabase.rpc('exec_sql' as any, {
      query: EXTRACTION_QUERY
    }).single();

    if (error) {
      console.log('RPC failed, trying alternative method...');

      // Try direct REST API call
      const response = await fetch(`${OLD_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'apikey': OLD_SERVICE_KEY,
          'Authorization': `Bearer ${OLD_SERVICE_KEY}`,
          'Content-Type': 'application/sql',
          'Accept': 'application/json',
          'Prefer': 'return=representation'
        },
        body: EXTRACTION_QUERY
      });

      if (!response.ok) {
        throw new Error(`Failed: ${await response.text()}`);
      }

      const result = await response.json();
      const schemaJson = result[0]?.complete_schema || result;

      // Save schema
      const outputPath = path.join(__dirname, 'extracted_schema.json');
      fs.writeFileSync(outputPath, JSON.stringify(schemaJson, null, 2));

      console.log('✅ Schema extracted successfully!');
      console.log(`   Saved to: ${outputPath}`);
      return;
    }

    // Save result
    const outputPath = path.join(__dirname, 'extracted_schema.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log('✅ Schema extracted successfully!');
    console.log(`   Saved to: ${outputPath}`);

  } catch (error: any) {
    console.error('❌ Schema extraction failed:', error.message);

    console.log('\n⚠️  Falling back to manual extraction via exported JSON...');

    // Use the already extracted schema from previous session
    const fallbackPath = path.join(__dirname, '../export/extracted.json');
    if (fs.existsSync(fallbackPath)) {
      const extracted = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
      const schema = JSON.parse(extracted[0].complete_schema_export);

      const outputPath = path.join(__dirname, 'extracted_schema.json');
      fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

      console.log('✅ Used existing schema export!');
      console.log(`   Saved to: ${outputPath}`);
    } else {
      console.error('❌ No fallback schema found!');
      process.exit(1);
    }
  }
}

main();
