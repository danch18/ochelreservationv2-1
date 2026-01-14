
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    const sqlPath = path.join(__dirname, '../src/sql/migrations/fix_piccolo_translations.sql');
    try {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('Running migration from:', sqlPath);

        // Split by statement is not strictly necessary for exec_sql if it handles block, 
        // but `exec_sql` usually takes a single string. 
        // Postgres can execute multiple statements in one go separated by semicolons.

        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('Error executing migration:', error);
            // Fallback: If exec_sql fails because it doesn't like multiple statements or something,
            // we might need to split it. But usually it works.
            process.exit(1);
        } else {
            console.log('Migration executed successfully!');
        }
    } catch (err) {
        console.error('Failed to read or execute migration:', err);
        process.exit(1);
    }
}

runMigration();
