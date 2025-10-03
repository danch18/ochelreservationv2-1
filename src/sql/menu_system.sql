-- Restaurant Menu System Database Schema
-- This file contains the SQL commands to set up the menu management structure
-- for categories, subcategories, menu items, and addons

-- ============================================================================
-- TABLE: CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  text TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER,
  updated_by INTEGER
);

-- ============================================================================
-- TABLE: SUBCATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL UNIQUE,
  text TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER,
  updated_by INTEGER
);

-- Create index on category_id for subcategories
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);

-- ============================================================================
-- TABLE: MENU_ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  text TEXT,
  description TEXT NOT NULL,
  image_path VARCHAR(500),
  model_3d_url TEXT,
  redirect_3d_url TEXT,
  additional_image_url TEXT,
  is_special BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) NOT NULL,
  subcategory_id INTEGER NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER,
  updated_by INTEGER
);

-- Create index on subcategory_id for menu_items
CREATE INDEX IF NOT EXISTS idx_menu_items_subcategory_id ON menu_items(subcategory_id);

-- ============================================================================
-- TABLE: ADDONS
-- ============================================================================
-- NOTE: Addons can be associated with either a category OR a subcategory
-- At least one of category_id or subcategory_id must be set (enforced by CHECK constraint)
-- This allows addons to be applied at different levels of the menu hierarchy
CREATE TABLE IF NOT EXISTS addons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_path VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER,
  updated_by INTEGER,
  -- Ensure at least one of category_id or subcategory_id is set
  CHECK (category_id IS NOT NULL OR subcategory_id IS NOT NULL)
);

-- Create indexes on foreign keys for addons
CREATE INDEX IF NOT EXISTS idx_addons_category_id ON addons(category_id);
CREATE INDEX IF NOT EXISTS idx_addons_subcategory_id ON addons(subcategory_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create function to update updated_at timestamp for categories
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for categories
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Create function to update updated_at timestamp for subcategories
CREATE OR REPLACE FUNCTION update_subcategories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subcategories
CREATE TRIGGER update_subcategories_updated_at
  BEFORE UPDATE ON subcategories
  FOR EACH ROW
  EXECUTE FUNCTION update_subcategories_updated_at();

-- Create function to update updated_at timestamp for menu_items
CREATE OR REPLACE FUNCTION update_menu_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for menu_items
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_items_updated_at();

-- Create function to update updated_at timestamp for addons
CREATE OR REPLACE FUNCTION update_addons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for addons
CREATE TRIGGER update_addons_updated_at
  BEFORE UPDATE ON addons
  FOR EACH ROW
  EXECUTE FUNCTION update_addons_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all menu tables
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to subcategories" ON subcategories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to menu_items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to addons" ON addons
  FOR SELECT USING (true);

-- Allow authenticated users to manage all menu tables
CREATE POLICY "Allow authenticated users to manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage subcategories" ON subcategories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage menu_items" ON menu_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage addons" ON addons
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON categories, subcategories, menu_items, addons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON categories, subcategories, menu_items, addons TO authenticated;

-- ============================================================================
-- INSERT DEFAULT "GENERAL" SUBCATEGORY FOR EACH CATEGORY
-- ============================================================================
-- This section creates a "General" subcategory for each existing category
-- Uses INSERT ... ON CONFLICT DO NOTHING for idempotency

INSERT INTO subcategories (category_id, title, text, status, created_at, updated_at)
SELECT
  c.id,
  c.title || ' - General',
  'Default general subcategory for ' || c.title,
  'active',
  NOW(),
  NOW()
FROM categories c
WHERE NOT EXISTS (
  SELECT 1
  FROM subcategories s
  WHERE s.category_id = c.id
  AND s.title = c.title || ' - General'
);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE categories IS 'Main menu categories (e.g., Appetizers, Main Courses, Desserts)';
COMMENT ON TABLE subcategories IS 'Subcategories within each main category';
COMMENT ON TABLE menu_items IS 'Individual menu items with prices and details';
COMMENT ON TABLE addons IS 'Additional items that can be added to menu items';

COMMENT ON COLUMN menu_items.image_path IS 'Path to menu item image: public/images/menu/menu-item/filename.jpg';
COMMENT ON COLUMN menu_items.model_3d_url IS 'Direct link to 3D model file (.glb, .obj, etc.)';
COMMENT ON COLUMN menu_items.redirect_3d_url IS 'Link to external 3D viewer page (e.g., Sketchfab)';
COMMENT ON COLUMN addons.image_path IS 'Path to addon image: public/images/menu/add-ons/filename.jpg';
COMMENT ON COLUMN addons.category_id IS 'Optional: Link addon to entire category';
COMMENT ON COLUMN addons.subcategory_id IS 'Optional: Link addon to specific subcategory';
