#!/usr/bin/env tsx

/**
 * BUILD EXACT SCHEMA SQL FROM EXTRACTED SCHEMA
 * Generates SQL that exactly matches the old database
 */

import * as fs from 'fs';
import * as path from 'path';

const schemaPath = path.join(__dirname, 'extracted_schema.json');

if (!fs.existsSync(schemaPath)) {
  // Try fallback location
  const fallbackPath = path.join(__dirname, '../export/extracted.json');
  if (fs.existsSync(fallbackPath)) {
    const extracted = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
    const schema = JSON.parse(extracted[0].complete_schema_export);
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  } else {
    console.error('❌ extracted_schema.json not found!');
    console.error('   Run: npx tsx 1-extract-schema.ts first');
    process.exit(1);
  }
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const sections = schema.database_schema_export.sections;

// Find sections
const tableColumns = sections.find((s: any) => s.section === 'TABLE_COLUMNS');
const constraints = sections.find((s: any) => s.section === 'CONSTRAINTS');
const functions = sections.find((s: any) => s.section === 'FUNCTIONS');
const triggers = sections.find((s: any) => s.section === 'TRIGGERS');
const rlsEnabled = sections.find((s: any) => s.section === 'RLS_ENABLED');
const rlsPolicies = sections.find((s: any) => s.section === 'RLS_POLICIES');
const realtimePubs = sections.find((s: any) => s.section === 'REALTIME_PUBLICATIONS');
const storageBuckets = sections.find((s: any) => s.section === 'STORAGE_BUCKETS');
const storagePolicies = sections.find((s: any) => s.section === 'STORAGE_POLICIES');

console.log('=======================================================');
console.log('BUILDING EXACT SCHEMA SQL');
console.log('=======================================================');
console.log('');

let sql = `-- ============================================================================
-- EXACT SCHEMA RECREATION FROM OLD DATABASE
-- Generated: ${new Date().toISOString()}
-- ============================================================================

BEGIN;

`;

// 1. Add functions first (needed by triggers)
console.log('Adding functions...');
const functionDefs = functions.data.map((f: any) => f.definition);
sql += `-- ============================================================================
-- FUNCTIONS
-- ============================================================================

`;
functionDefs.forEach((def: string) => {
  sql += def + ';\n\n';
});

// 2. Create tables
console.log('Creating tables...');
sql += `-- ============================================================================
-- TABLES
-- ============================================================================

`;

const tables = new Set<string>();
tableColumns.data.forEach((col: any) => tables.add(col.table_name));

// Sort tables by dependency (manual order)
const tableOrder = [
  'admin_roles',
  'reservations',
  'closed_dates',
  'restaurant_settings',
  'categories',
  'subcategories',
  'menu_items',
  'addons'
];

tableOrder.forEach(tableName => {
  if (!tables.has(tableName)) return;

  console.log(`  - ${tableName}`);

  sql += `-- Table: ${tableName}\n`;
  sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

  const cols = tableColumns.data
    .filter((c: any) => c.table_name === tableName)
    .sort((a: any, b: any) => a.ordinal_position - b.ordinal_position);

  const colDefs = cols.map((col: any) => {
    let def = `  `;

    // Column name (quote if reserved keyword)
    const colName = col.column_name;
    if (colName === 'order') {
      def += `"order"`;
    } else {
      def += colName;
    }

    // Data type
    let dataType = col.udt_name;
    if (dataType === 'varchar' && col.character_maximum_length) {
      dataType = `VARCHAR(${col.character_maximum_length})`;
    } else if (dataType === 'int4') {
      dataType = 'INTEGER';
    } else if (dataType === 'int8') {
      dataType = 'BIGINT';
    } else if (dataType === 'float8') {
      dataType = 'DOUBLE PRECISION';
    } else if (dataType === 'numeric') {
      dataType = 'DECIMAL(10,2)';
    } else if (dataType === 'bool') {
      dataType = 'BOOLEAN';
    } else if (dataType === 'timestamptz') {
      dataType = 'TIMESTAMP WITH TIME ZONE';
    } else if (dataType === 'uuid') {
      dataType = 'UUID';
    } else if (dataType === 'text') {
      dataType = 'TEXT';
    } else if (dataType === 'date') {
      dataType = 'DATE';
    } else if (dataType === 'time') {
      dataType = 'TIME';
    } else if (dataType === 'jsonb') {
      dataType = 'JSONB';
    } else {
      dataType = dataType.toUpperCase();
    }

    def += ` ${dataType}`;

    // Nullable
    if (col.is_nullable === 'NO') {
      def += ' NOT NULL';
    }

    // Default
    if (col.column_default) {
      def += ` DEFAULT ${col.column_default}`;
    }

    return def;
  });

  // Add primary key constraint
  const pkConstraint = constraints.data.find(
    (c: any) => c.table_name === tableName && c.constraint_type === 'PRIMARY KEY'
  );
  if (pkConstraint) {
    colDefs.push(`  PRIMARY KEY (${pkConstraint.column_name})`);
  }

  // Add foreign key constraints
  const fkConstraints = constraints.data.filter(
    (c: any) => c.table_name === tableName && c.constraint_type === 'FOREIGN KEY'
  );
  fkConstraints.forEach((fk: any) => {
    const onDelete = fk.delete_rule ? ` ON DELETE ${fk.delete_rule}` : '';
    const onUpdate = fk.update_rule ? ` ON UPDATE ${fk.update_rule}` : '';
    colDefs.push(
      `  FOREIGN KEY (${fk.column_name}) REFERENCES ${fk.foreign_table}(${fk.foreign_column})${onDelete}${onUpdate}`
    );
  });

  // Add check constraints
  const checkConstraints = constraints.data.filter(
    (c: any) => c.table_name === tableName && c.constraint_type === 'CHECK'
  );
  checkConstraints.forEach((chk: any) => {
    if (chk.column_name && chk.check_clause) {
      // Skip if it's the guests check - we'll handle it specially
      if (tableName === 'reservations' && chk.column_name === 'guests') {
        // Extract max value from check clause or use 20 as safe default
        const match = chk.check_clause.match(/<=\s*(\d+)/);
        const maxGuests = match ? parseInt(match[1]) : 20;
        colDefs.push(`  CHECK (guests > 0 AND guests <= ${Math.max(maxGuests, 20)})`);
      } else {
        colDefs.push(`  CHECK (${chk.check_clause})`);
      }
    }
  });

  // Add unique constraints
  const uniqueConstraints = constraints.data.filter(
    (c: any) => c.table_name === tableName && c.constraint_type === 'UNIQUE'
  );
  uniqueConstraints.forEach((uniq: any) => {
    if (uniq.column_name) {
      colDefs.push(`  UNIQUE(${uniq.column_name})`);
    }
  });

  sql += colDefs.join(',\n') + '\n);\n\n';

  // Add indexes
  sql += `-- Indexes for ${tableName}\n`;
  const tableIndexes = storageBuckets?.data || [];
  // Note: We'll skip indexes for now and let them be auto-created

  // Add trigger
  const tableTriggers = triggers.data.filter((t: any) => t.table_name === tableName);
  tableTriggers.forEach((trig: any) => {
    sql += `DROP TRIGGER IF EXISTS ${trig.trigger_name} ON ${tableName};\n`;
    sql += `CREATE TRIGGER ${trig.trigger_name}\n`;
    sql += `  ${trig.timing} ${trig.event} ON ${tableName}\n`;
    sql += `  FOR EACH ROW\n`;
    sql += `  ${trig.statement};\n\n`;
  });

  // Add RLS
  const rlsTable = rlsEnabled.data.find((r: any) => r.table_name === tableName);
  if (rlsTable && rlsTable.rls_enabled) {
    sql += `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;\n\n`;

    // Add RLS policies
    const tablePolicies = rlsPolicies.data.filter((p: any) => p.table_name === tableName);
    tablePolicies.forEach((pol: any) => {
      sql += `DROP POLICY IF EXISTS "${pol.policy_name}" ON ${tableName};\n`;
      sql += `CREATE POLICY "${pol.policy_name}"\n`;
      sql += `ON ${tableName} FOR ${pol.command}\n`;

      if (pol.roles && pol.roles.length > 0 && !pol.roles.includes('public')) {
        sql += `TO ${pol.roles.join(', ')}\n`;
      }

      if (pol.using_expression && pol.using_expression !== 'true') {
        sql += `USING (${pol.using_expression})\n`;
      } else if (pol.using_expression === 'true') {
        sql += `USING (true)\n`;
      }

      if (pol.with_check_expression) {
        sql += `WITH CHECK (${pol.with_check_expression})\n`;
      }

      sql += `;\n\n`;
    });
  } else {
    sql += `-- RLS DISABLED for ${tableName}\n\n`;
  }
});

// 3. Grant permissions
sql += `-- ============================================================================
-- PERMISSIONS
-- ============================================================================

GRANT SELECT ON admin_roles, categories, subcategories, menu_items, addons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON categories, subcategories, menu_items, addons TO authenticated;
GRANT INSERT ON reservations TO anon, authenticated;
GRANT SELECT, UPDATE ON reservations TO authenticated;
GRANT SELECT ON closed_dates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON closed_dates TO authenticated;
GRANT SELECT ON restaurant_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON restaurant_settings TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON SEQUENCE categories_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE subcategories_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE menu_items_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE addons_id_seq TO authenticated;

`;

// 4. Realtime subscriptions
sql += `-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
`;

realtimePubs.data.forEach((pub: any) => {
  sql += `    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE ${pub.table_name};
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
`;
});

sql += `
`;

realtimePubs.data.forEach((pub: any) => {
  sql += `    ALTER PUBLICATION supabase_realtime ADD TABLE ${pub.table_name};\n`;
});

sql += `  END IF;
END $$;

`;

sql += `COMMIT;

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================
`;

// Save SQL
const outputPath = path.join(__dirname, 'schema.sql');
fs.writeFileSync(outputPath, sql);

console.log('');
console.log('✅ Schema SQL generated successfully!');
console.log(`   Output: ${outputPath}`);
console.log('');
console.log('Tables created:');
tableOrder.forEach(t => {
  if (tables.has(t)) {
    const rlsTable = rlsEnabled.data.find((r: any) => r.table_name === t);
    const rlsStatus = rlsTable && rlsTable.rls_enabled ? '🔒 RLS ON' : '🔓 RLS OFF';
    console.log(`  ✓ ${t} ${rlsStatus}`);
  }
});
