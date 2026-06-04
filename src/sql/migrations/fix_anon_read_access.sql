-- ============================================================================
-- EMERGENCY FIX: Restore anon read access
-- ============================================================================
-- Data is NOT deleted. RLS is now blocking anon reads because the tables
-- previously had RLS disabled, so the SELECT policies were never active.
-- This script ensures anon can read all menu/settings tables again.
-- ============================================================================

-- 1. Ensure GRANT SELECT exists for anon on all tables
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.subcategories TO anon;
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT ON public.addons TO anon;
GRANT SELECT ON public.piccolo_categories TO anon;
GRANT SELECT ON public.piccolo_subcategories TO anon;
GRANT SELECT ON public.piccolo_menu_items TO anon;
GRANT SELECT ON public.piccolo_addons TO anon;
GRANT SELECT ON public.piccolo_set_menus TO anon;
GRANT SELECT ON public.piccolo_set_menu_groups TO anon;
GRANT SELECT ON public.piccolo_set_menu_items TO anon;
GRANT SELECT ON public.restaurant_settings TO anon;
GRANT SELECT ON public.closed_dates TO anon;

-- 2. Re-create SELECT policies explicitly for anon role
-- (The FOR SELECT USING (true) should apply to all roles including anon,
--  but we'll be explicit to ensure it works)

-- categories
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories"
  ON public.categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- subcategories
DROP POLICY IF EXISTS "Allow public read access to subcategories" ON public.subcategories;
CREATE POLICY "Allow public read access to subcategories"
  ON public.subcategories
  FOR SELECT TO anon, authenticated
  USING (true);

-- menu_items
DROP POLICY IF EXISTS "Allow public read access to menu_items" ON public.menu_items;
CREATE POLICY "Allow public read access to menu_items"
  ON public.menu_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- addons
DROP POLICY IF EXISTS "Allow public read access to addons" ON public.addons;
CREATE POLICY "Allow public read access to addons"
  ON public.addons
  FOR SELECT TO anon, authenticated
  USING (true);

-- piccolo_categories
DROP POLICY IF EXISTS "Allow public read access to piccolo_categories" ON public.piccolo_categories;
CREATE POLICY "Allow public read access to piccolo_categories"
  ON public.piccolo_categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- piccolo_subcategories
DROP POLICY IF EXISTS "Allow public read access to piccolo_subcategories" ON public.piccolo_subcategories;
CREATE POLICY "Allow public read access to piccolo_subcategories"
  ON public.piccolo_subcategories
  FOR SELECT TO anon, authenticated
  USING (true);

-- piccolo_menu_items
DROP POLICY IF EXISTS "Allow public read access to piccolo_menu_items" ON public.piccolo_menu_items;
CREATE POLICY "Allow public read access to piccolo_menu_items"
  ON public.piccolo_menu_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- piccolo_addons
DROP POLICY IF EXISTS "Allow public read access to piccolo_addons" ON public.piccolo_addons;
CREATE POLICY "Allow public read access to piccolo_addons"
  ON public.piccolo_addons
  FOR SELECT TO anon, authenticated
  USING (true);

-- piccolo_set_menus
DROP POLICY IF EXISTS "Allow public read access to piccolo_set_menus" ON public.piccolo_set_menus;
CREATE POLICY "Allow public read access to piccolo_set_menus"
  ON public.piccolo_set_menus
  FOR SELECT TO anon, authenticated
  USING (true);

-- piccolo_set_menu_groups
DROP POLICY IF EXISTS "Allow public read access to piccolo_set_menu_groups" ON public.piccolo_set_menu_groups;
CREATE POLICY "Allow public read access to piccolo_set_menu_groups"
  ON public.piccolo_set_menu_groups
  FOR SELECT TO anon, authenticated
  USING (true);

-- piccolo_set_menu_items
DROP POLICY IF EXISTS "Allow public read access to piccolo_set_menu_items" ON public.piccolo_set_menu_items;
CREATE POLICY "Allow public read access to piccolo_set_menu_items"
  ON public.piccolo_set_menu_items
  FOR SELECT TO anon, authenticated
  USING (true);

-- restaurant_settings
DROP POLICY IF EXISTS "Public can read restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Public can read restaurant settings"
  ON public.restaurant_settings
  FOR SELECT TO anon, authenticated
  USING (true);

-- closed_dates
DROP POLICY IF EXISTS "Allow public read access to closed_dates" ON public.closed_dates;
CREATE POLICY "Allow public read access to closed_dates"
  ON public.closed_dates
  FOR SELECT TO anon, authenticated
  USING (true);

-- reservations (anon needs INSERT for reservation form)
GRANT INSERT ON public.reservations TO anon;

-- ============================================================================
-- DONE - Menu data should now be visible again on the public site
-- ============================================================================
