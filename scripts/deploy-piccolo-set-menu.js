const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

loadEnvFile(path.join(__dirname, '../.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sqlStatements = [
    // 1. Create Tables
    `CREATE TABLE IF NOT EXISTS piccolo_set_menus (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_it VARCHAR(255),
    title_es VARCHAR(255),
    description TEXT,
    description_en TEXT,
    description_it TEXT,
    description_es TEXT,
    price DECIMAL(10, 2) NOT NULL,
    availability_text TEXT,
    availability_text_en TEXT,
    availability_text_it TEXT,
    availability_text_es TEXT,
    footer_text TEXT,
    footer_text_en TEXT,
    footer_text_it TEXT,
    footer_text_es TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
    `CREATE TABLE IF NOT EXISTS piccolo_set_menu_groups (
    id SERIAL PRIMARY KEY,
    set_menu_id INTEGER NOT NULL REFERENCES piccolo_set_menus(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_it VARCHAR(255),
    title_es VARCHAR(255),
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
    `CREATE TABLE IF NOT EXISTS piccolo_set_menu_items (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES piccolo_set_menu_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_it VARCHAR(255),
    title_es VARCHAR(255),
    description TEXT,
    description_en TEXT,
    description_it TEXT,
    description_es TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
    // 2. Disable RLS
    `ALTER TABLE piccolo_set_menus DISABLE ROW LEVEL SECURITY`,
    `ALTER TABLE piccolo_set_menu_groups DISABLE ROW LEVEL SECURITY`,
    `ALTER TABLE piccolo_set_menu_items DISABLE ROW LEVEL SECURITY`,
    // 3. Seed Data (DO block)
    `DO $$
  DECLARE
    v_menu_id INTEGER;
    v_group_mains INTEGER;
    v_group_pinsa INTEGER;
    v_group_salads INTEGER;
    v_group_drinks INTEGER;
  BEGIN
    -- Only insert if empty to avoid duplicates on re-run
    IF NOT EXISTS (SELECT 1 FROM piccolo_set_menus WHERE title = 'Lunch Set Menu') THEN
      -- 1. Create the Set Menu
      INSERT INTO piccolo_set_menus (
        title, description, price, availability_text, footer_text, "order", status
      ) VALUES (
        'Lunch Set Menu',
        '1 main dish OR 1 salad OR 1 Roman pinsa + 1 drink of your choice',
        14.00,
        'Available Monday to Thursday from 11:30 AM to 3:00 PM',
        'Net prices, VAT included, service included.',
        1,
        'active'
      ) RETURNING id INTO v_menu_id;

      -- 2. Create Groups
      INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
      VALUES (v_menu_id, 'MAIN DISHES', 1) RETURNING id INTO v_group_mains;

      INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
      VALUES (v_menu_id, 'ROMAN PINSA', 2) RETURNING id INTO v_group_pinsa;

      INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
      VALUES (v_menu_id, 'SALADS', 3) RETURNING id INTO v_group_salads;

      INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
      VALUES (v_menu_id, 'DRINKS', 4) RETURNING id INTO v_group_drinks;


      -- 3. Create Items
      -- MAIN DISHES
      INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
      (v_group_mains, 'Penne all’Arrabbiata', 'Tomato sauce, cherry tomatoes, garlic, extra virgin olive oil, chili pepper, and parsley', 1),
      (v_group_mains, 'Penne 4 Cheeses', 'Gorgonzola, Asiago, Grana Padano, goat cheese, and fresh cream', 2),
      (v_group_mains, 'Tagliatelle Bolognese', 'Tagliatelle with Bolognese sauce', 3),
      (v_group_mains, 'Lemon Scaloppina', 'Chicken escalope, lemon cream sauce. Served with penne in lemon sauce', 4),
      (v_group_mains, '“Normande” Scaloppina', 'Chicken escalope, fresh cream, and mushrooms. Served with penne in Normande sauce', 5),
      (v_group_mains, 'Suprema di Pollo', 'Grilled chicken escalope. Served with penne in tomato sauce', 6),
      (v_group_mains, 'Side dish', 'Homemade sautéed potatoes OR sautéed vegetables OR mixed salad (indicated on plates)', 7);

      -- ROMAN PINSA
      INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
      (v_group_pinsa, 'Margherita', 'Tomato sauce, fior di latte mozzarella, oregano, and basil', 1),
      (v_group_pinsa, 'Goat Cheese & Honey', 'Fresh cream, fior di latte mozzarella, goat cheese, honey, arugula, and walnuts', 2),
      (v_group_pinsa, 'Regina', 'Tomato sauce, fior di latte mozzarella, turkey ham, mushrooms, oregano, and basil', 3),
      (v_group_pinsa, 'Tuna', 'Tomato sauce, fior di latte mozzarella, tuna, peppers, confit onions, olives, oregano, and basil', 4),
      (v_group_pinsa, 'Diavola', 'Tomato sauce, fior di latte mozzarella, beef pepperoni, oregano, and basil', 5),
      (v_group_pinsa, 'Vegetarian', 'Tomato sauce, fior di latte mozzarella, and seasonal vegetables', 6),
      (v_group_pinsa, '4 Cheeses (fresh cream base or tomato base)', 'Fior di latte mozzarella, gorgonzola, Grana Padano, and goat cheese', 7);

      -- SALADS
      INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
      (v_group_salads, 'Caesar Salad', 'Mixed salad, cherry tomatoes, croutons, Grana Padano shavings, grilled chicken, and balsamic cream', 1),
      (v_group_salads, 'Warm Goat Cheese Salad', 'Mixed salad, cherry tomatoes, walnuts, honey, warm baked goat cheese toasts', 2);

      -- DRINKS
      INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
      (v_group_drinks, '25 cl', 'San Pellegrino, Panna', 1),
      (v_group_drinks, '33 cl', 'Coca-Cola, Coca-Cola Zero, Fanta Orange, Sprite', 2);
    END IF;
  END $$;`
];

async function run() {
    console.log('Deploying Piccolo Set Menu...');

    for (let i = 0; i < sqlStatements.length; i++) {
        const sql = sqlStatements[i];
        console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`);
        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
            if (error) {
                console.error('Error executing statement:', error);
                // Continue? Maybe not.
                process.exit(1);
            }
        } catch (e) {
            console.error('Exception:', e);
            process.exit(1);
        }
    }

    console.log('Deployment successful!');
}

run();
