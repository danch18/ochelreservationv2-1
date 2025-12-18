-- ============================================================================
-- ADD RESTAURANT_ID TO MENU TABLES
-- Migration to support multiple restaurants (Magnifiko and Piccolo)
-- ============================================================================
-- This script adds restaurant_id column to all menu-related tables and
-- migrates existing data to have 'magnifiko' as their restaurant_id
-- Safe to run multiple times (idempotent)
-- ============================================================================

-- ============================================================================
-- STEP 1: Add restaurant_id column to categories table
-- ============================================================================

DO $$
BEGIN
  -- Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE categories
    ADD COLUMN restaurant_id VARCHAR(50) DEFAULT 'magnifiko' NOT NULL;

    RAISE NOTICE 'Added restaurant_id column to categories table';
  ELSE
    RAISE NOTICE 'restaurant_id column already exists in categories table';
  END IF;
END $$;

-- Update existing records to have 'magnifiko' restaurant_id
UPDATE categories
SET restaurant_id = 'magnifiko'
WHERE restaurant_id IS NULL OR restaurant_id = '';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON categories(restaurant_id);

-- Update unique constraint to include restaurant_id
DO $$
BEGIN
  -- Drop old unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'categories_title_key'
  ) THEN
    ALTER TABLE categories DROP CONSTRAINT categories_title_key;
    RAISE NOTICE 'Dropped old unique constraint on categories.title';
  END IF;

  -- Add new unique constraint including restaurant_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'categories_title_restaurant_id_key'
  ) THEN
    ALTER TABLE categories
    ADD CONSTRAINT categories_title_restaurant_id_key
    UNIQUE (title, restaurant_id);
    RAISE NOTICE 'Added unique constraint on categories (title, restaurant_id)';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Add restaurant_id column to subcategories table
-- ============================================================================

DO $$
BEGIN
  -- Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subcategories' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE subcategories
    ADD COLUMN restaurant_id VARCHAR(50) DEFAULT 'magnifiko' NOT NULL;

    RAISE NOTICE 'Added restaurant_id column to subcategories table';
  ELSE
    RAISE NOTICE 'restaurant_id column already exists in subcategories table';
  END IF;
END $$;

-- Update existing records to have 'magnifiko' restaurant_id
UPDATE subcategories
SET restaurant_id = 'magnifiko'
WHERE restaurant_id IS NULL OR restaurant_id = '';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_subcategories_restaurant_id ON subcategories(restaurant_id);

-- Update unique constraint to include restaurant_id
DO $$
BEGIN
  -- Drop old unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subcategories_title_key'
  ) THEN
    ALTER TABLE subcategories DROP CONSTRAINT subcategories_title_key;
    RAISE NOTICE 'Dropped old unique constraint on subcategories.title';
  END IF;

  -- Add new unique constraint including restaurant_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subcategories_title_restaurant_id_key'
  ) THEN
    ALTER TABLE subcategories
    ADD CONSTRAINT subcategories_title_restaurant_id_key
    UNIQUE (title, restaurant_id);
    RAISE NOTICE 'Added unique constraint on subcategories (title, restaurant_id)';
  END IF;
END $$;

-- ============================================================================
-- STEP 3: Add restaurant_id column to menu_items table
-- ============================================================================

DO $$
BEGIN
  -- Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE menu_items
    ADD COLUMN restaurant_id VARCHAR(50) DEFAULT 'magnifiko' NOT NULL;

    RAISE NOTICE 'Added restaurant_id column to menu_items table';
  ELSE
    RAISE NOTICE 'restaurant_id column already exists in menu_items table';
  END IF;
END $$;

-- Update existing records to have 'magnifiko' restaurant_id
UPDATE menu_items
SET restaurant_id = 'magnifiko'
WHERE restaurant_id IS NULL OR restaurant_id = '';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);

-- Update unique constraint to include restaurant_id
DO $$
BEGIN
  -- Drop old unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'menu_items_title_key'
  ) THEN
    ALTER TABLE menu_items DROP CONSTRAINT menu_items_title_key;
    RAISE NOTICE 'Dropped old unique constraint on menu_items.title';
  END IF;

  -- Add new unique constraint including restaurant_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'menu_items_title_restaurant_id_key'
  ) THEN
    ALTER TABLE menu_items
    ADD CONSTRAINT menu_items_title_restaurant_id_key
    UNIQUE (title, restaurant_id);
    RAISE NOTICE 'Added unique constraint on menu_items (title, restaurant_id)';
  END IF;
END $$;

-- ============================================================================
-- STEP 4: Add restaurant_id column to addons table
-- ============================================================================

DO $$
BEGIN
  -- Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'addons' AND column_name = 'restaurant_id'
  ) THEN
    ALTER TABLE addons
    ADD COLUMN restaurant_id VARCHAR(50) DEFAULT 'magnifiko' NOT NULL;

    RAISE NOTICE 'Added restaurant_id column to addons table';
  ELSE
    RAISE NOTICE 'restaurant_id column already exists in addons table';
  END IF;
END $$;

-- Update existing records to have 'magnifiko' restaurant_id
UPDATE addons
SET restaurant_id = 'magnifiko'
WHERE restaurant_id IS NULL OR restaurant_id = '';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_addons_restaurant_id ON addons(restaurant_id);

-- Update unique constraint to include restaurant_id
DO $$
BEGIN
  -- Drop old unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'addons_title_key'
  ) THEN
    ALTER TABLE addons DROP CONSTRAINT addons_title_key;
    RAISE NOTICE 'Dropped old unique constraint on addons.title';
  END IF;

  -- Add new unique constraint including restaurant_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'addons_title_restaurant_id_key'
  ) THEN
    ALTER TABLE addons
    ADD CONSTRAINT addons_title_restaurant_id_key
    UNIQUE (title, restaurant_id);
    RAISE NOTICE 'Added unique constraint on addons (title, restaurant_id)';
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Add comments for documentation
-- ============================================================================

COMMENT ON COLUMN categories.restaurant_id IS 'Restaurant identifier (magnifiko or piccolo-next)';
COMMENT ON COLUMN subcategories.restaurant_id IS 'Restaurant identifier (magnifiko or piccolo-next)';
COMMENT ON COLUMN menu_items.restaurant_id IS 'Restaurant identifier (magnifiko or piccolo-next)';
COMMENT ON COLUMN addons.restaurant_id IS 'Restaurant identifier (magnifiko or piccolo-next)';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '=======================================================';
  RAISE NOTICE '✓ RESTAURANT_ID MIGRATION COMPLETE';
  RAISE NOTICE '=======================================================';
  RAISE NOTICE 'Changes applied:';
  RAISE NOTICE '  1. Added restaurant_id column to categories';
  RAISE NOTICE '  2. Added restaurant_id column to subcategories';
  RAISE NOTICE '  3. Added restaurant_id column to menu_items';
  RAISE NOTICE '  4. Added restaurant_id column to addons';
  RAISE NOTICE '  5. Migrated existing data to restaurant_id = magnifiko';
  RAISE NOTICE '  6. Created indexes for performance';
  RAISE NOTICE '  7. Updated unique constraints';
  RAISE NOTICE '';
  RAISE NOTICE 'You can now create menu items for different restaurants!';
  RAISE NOTICE '=======================================================';
END $$;
