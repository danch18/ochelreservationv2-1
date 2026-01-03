
-- Add price column to piccolo_categories
ALTER TABLE piccolo_categories
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

COMMENT ON COLUMN piccolo_categories.price IS 'Optional price for the category (acting as a set menu group price)';
