-- ============================================================================
-- CREATE PICCOLO MENU TABLES
-- Separate tables for Piccolo restaurant menu (no restaurant_id needed)
-- ============================================================================

-- ============================================================================
-- PICCOLO CATEGORIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS piccolo_categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  text TEXT,
  text_en TEXT,
  text_it TEXT,
  text_es TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_piccolo_categories_order ON piccolo_categories("order");

COMMENT ON TABLE piccolo_categories IS 'Menu categories for Piccolo restaurant';
COMMENT ON COLUMN piccolo_categories.title IS 'Category title in French (default language)';
COMMENT ON COLUMN piccolo_categories."order" IS 'Display order (lower numbers appear first)';

-- ============================================================================
-- PICCOLO SUBCATEGORIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS piccolo_subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES piccolo_categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  text TEXT,
  text_en TEXT,
  text_it TEXT,
  text_es TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  UNIQUE(title, category_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_piccolo_subcategories_category_id ON piccolo_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_piccolo_subcategories_order ON piccolo_subcategories("order");

COMMENT ON TABLE piccolo_subcategories IS 'Menu subcategories for Piccolo restaurant';
COMMENT ON COLUMN piccolo_subcategories.category_id IS 'Parent category reference';

-- ============================================================================
-- PICCOLO MENU ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS piccolo_menu_items (
  id SERIAL PRIMARY KEY,
  subcategory_id INTEGER NOT NULL REFERENCES piccolo_subcategories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL UNIQUE,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  text TEXT,
  text_en TEXT,
  text_it TEXT,
  text_es TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  description_it TEXT,
  description_es TEXT,
  image_path TEXT,
  model_3d_url TEXT,
  redirect_3d_url TEXT,
  additional_image_url TEXT,
  is_special BOOLEAN DEFAULT FALSE,
  price DECIMAL(10, 2) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_piccolo_menu_items_subcategory_id ON piccolo_menu_items(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_piccolo_menu_items_order ON piccolo_menu_items("order");
CREATE INDEX IF NOT EXISTS idx_piccolo_menu_items_is_special ON piccolo_menu_items(is_special);

COMMENT ON TABLE piccolo_menu_items IS 'Menu items for Piccolo restaurant';
COMMENT ON COLUMN piccolo_menu_items.subcategory_id IS 'Parent subcategory reference';
COMMENT ON COLUMN piccolo_menu_items.is_special IS 'Whether this is a special/featured item';

-- ============================================================================
-- PICCOLO ADDONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS piccolo_addons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  description TEXT,
  description_en TEXT,
  description_it TEXT,
  description_es TEXT,
  image_path TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER REFERENCES piccolo_categories(id) ON DELETE SET NULL,
  subcategory_id INTEGER REFERENCES piccolo_subcategories(id) ON DELETE SET NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_piccolo_addons_category_id ON piccolo_addons(category_id);
CREATE INDEX IF NOT EXISTS idx_piccolo_addons_subcategory_id ON piccolo_addons(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_piccolo_addons_order ON piccolo_addons("order");

COMMENT ON TABLE piccolo_addons IS 'Menu add-ons/supplements for Piccolo restaurant';
COMMENT ON COLUMN piccolo_addons.category_id IS 'Optional category association';
COMMENT ON COLUMN piccolo_addons.subcategory_id IS 'Optional subcategory association';

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (if needed)
-- ============================================================================

-- Uncomment if you need RLS
-- ALTER TABLE piccolo_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE piccolo_subcategories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE piccolo_menu_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE piccolo_addons ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '=======================================================';
  RAISE NOTICE '✓ PICCOLO MENU TABLES CREATED SUCCESSFULLY';
  RAISE NOTICE '=======================================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  1. piccolo_categories';
  RAISE NOTICE '  2. piccolo_subcategories';
  RAISE NOTICE '  3. piccolo_menu_items';
  RAISE NOTICE '  4. piccolo_addons';
  RAISE NOTICE '';
  RAISE NOTICE 'These tables are completely separate from Magnifiko.';
  RAISE NOTICE 'No restaurant_id column needed!';
  RAISE NOTICE '=======================================================';
END $$;
