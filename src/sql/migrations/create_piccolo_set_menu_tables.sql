-- ============================================================================
-- CREATE PICCOLO SET MENU TABLES (FORMULES)
-- ============================================================================

-- 1. Main Set Menu Table (The Formula itself)
CREATE TABLE IF NOT EXISTS piccolo_set_menus (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  description TEXT, -- e.g., "1 main dish OR 1 salad..."
  description_en TEXT,
  description_it TEXT,
  description_es TEXT,
  price DECIMAL(10, 2) NOT NULL,
  availability_text TEXT, -- e.g., "Available Monday to Thursday..."
  availability_text_en TEXT,
  availability_text_it TEXT,
  availability_text_es TEXT,
  footer_text TEXT, -- e.g., "Net prices, VAT included..."
  footer_text_en TEXT,
  footer_text_it TEXT,
  footer_text_es TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Groups within a Set Menu (e.g., "Main Dishes", "Drinks")
CREATE TABLE IF NOT EXISTS piccolo_set_menu_groups (
  id SERIAL PRIMARY KEY,
  set_menu_id INTEGER NOT NULL REFERENCES piccolo_set_menus(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL, -- e.g., "MAIN DISHES"
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Items within a Group (e.g., "Penne all'Arrabbiata")
CREATE TABLE IF NOT EXISTS piccolo_set_menu_items (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES piccolo_set_menu_groups(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  description TEXT, -- e.g., "Tomato sauce, cherry tomatoes..."
  description_en TEXT,
  description_it TEXT,
  description_es TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS (Disable for now as requested for Piccolo tables)
ALTER TABLE piccolo_set_menus DISABLE ROW LEVEL SECURITY;
ALTER TABLE piccolo_set_menu_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE piccolo_set_menu_items DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SEED DATA: Lunch Set Menu
-- ============================================================================

DO $$
DECLARE
  v_menu_id INTEGER;
  v_group_mains INTEGER;
  v_group_pinsa INTEGER;
  v_group_salads INTEGER;
  v_group_drinks INTEGER;
BEGIN
  -- 1. Create the Set Menu
  INSERT INTO piccolo_set_menus (
    title, 
    description, 
    price, 
    availability_text, 
    footer_text, 
    "order", 
    status
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

  -- Group: MAIN DISHES
  INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
  VALUES (v_menu_id, 'MAIN DISHES', 1) RETURNING id INTO v_group_mains;

  -- Group: ROMAN PINSA
  INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
  VALUES (v_menu_id, 'ROMAN PINSA', 2) RETURNING id INTO v_group_pinsa;

  -- Group: SALADS
  INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
  VALUES (v_menu_id, 'SALADS', 3) RETURNING id INTO v_group_salads;

  -- Group: DRINKS
  INSERT INTO piccolo_set_menu_groups (set_menu_id, title, "order")
  VALUES (v_menu_id, 'DRINKS', 4) RETURNING id INTO v_group_drinks;


  -- 3. Create Items

  -- Items for MAIN DISHES
  INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
  (v_group_mains, 'Penne all’Arrabbiata', 'Tomato sauce, cherry tomatoes, garlic, extra virgin olive oil, chili pepper, and parsley', 1),
  (v_group_mains, 'Penne 4 Cheeses', 'Gorgonzola, Asiago, Grana Padano, goat cheese, and fresh cream', 2),
  (v_group_mains, 'Tagliatelle Bolognese', 'Tagliatelle with Bolognese sauce', 3),
  (v_group_mains, 'Lemon Scaloppina', 'Chicken escalope, lemon cream sauce. Served with penne in lemon sauce', 4),
  (v_group_mains, '“Normande” Scaloppina', 'Chicken escalope, fresh cream, and mushrooms. Served with penne in Normande sauce', 5),
  (v_group_mains, 'Suprema di Pollo', 'Grilled chicken escalope. Served with penne in tomato sauce', 6),
  (v_group_mains, 'Side dish', 'Homemade sautéed potatoes OR sautéed vegetables OR mixed salad (indicated on plates)', 7);

  -- Items for ROMAN PINSA
  INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
  (v_group_pinsa, 'Margherita', 'Tomato sauce, fior di latte mozzarella, oregano, and basil', 1),
  (v_group_pinsa, 'Goat Cheese & Honey', 'Fresh cream, fior di latte mozzarella, goat cheese, honey, arugula, and walnuts', 2),
  (v_group_pinsa, 'Regina', 'Tomato sauce, fior di latte mozzarella, turkey ham, mushrooms, oregano, and basil', 3),
  (v_group_pinsa, 'Tuna', 'Tomato sauce, fior di latte mozzarella, tuna, peppers, confit onions, olives, oregano, and basil', 4),
  (v_group_pinsa, 'Diavola', 'Tomato sauce, fior di latte mozzarella, beef pepperoni, oregano, and basil', 5),
  (v_group_pinsa, 'Vegetarian', 'Tomato sauce, fior di latte mozzarella, and seasonal vegetables', 6),
  (v_group_pinsa, '4 Cheeses (fresh cream base or tomato base)', 'Fior di latte mozzarella, gorgonzola, Grana Padano, and goat cheese', 7);

  -- Items for SALADS
  INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
  (v_group_salads, 'Caesar Salad', 'Mixed salad, cherry tomatoes, croutons, Grana Padano shavings, grilled chicken, and balsamic cream', 1),
  (v_group_salads, 'Warm Goat Cheese Salad', 'Mixed salad, cherry tomatoes, walnuts, honey, warm baked goat cheese toasts', 2);

  -- Items for DRINKS
  INSERT INTO piccolo_set_menu_items (group_id, title, description, "order") VALUES
  (v_group_drinks, '25 cl', 'San Pellegrino, Panna', 1),
  (v_group_drinks, '33 cl', 'Coca-Cola, Coca-Cola Zero, Fanta Orange, Sprite', 2);

END $$;
