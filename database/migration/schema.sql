-- ============================================================================
-- EXACT SCHEMA RECREATION FROM OLD DATABASE
-- Generated: 2025-11-08T04:23:01.931Z
-- ============================================================================

BEGIN;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.current_user_role()
 RETURNS character varying
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT role FROM public.admin_roles 
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid 
    AND role IN ('admin', 'super_admin')
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.setup_admin_role(user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert or update admin role
  INSERT INTO admin_roles (user_id, role, permissions)
  VALUES (
    target_user_id, 
    'super_admin', 
    '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'super_admin',
    permissions = '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb,
    updated_at = now();
    
  RAISE NOTICE 'Admin role setup complete for user: %', user_email;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_addons_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_categories_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_closed_dates_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $function$
;

CREATE OR REPLACE FUNCTION public.update_menu_items_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_subcategories_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

-- ============================================================================
-- TABLES
-- ============================================================================

-- -- Table: admin_roles
-- CREATE TABLE IF NOT EXISTS admin_roles (
--   id UUID NOT NULL DEFAULT gen_random_uuid(),
--   user_id UUID,
--   role VARCHAR(50) NOT NULL DEFAULT 'admin'::character varying,
--   permissions JSONB DEFAULT '[]'::jsonb,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   PRIMARY KEY (id),
--   FOREIGN KEY (user_id) REFERENCES null(null) ON DELETE CASCADE ON UPDATE NO ACTION,
--   UNIQUE(user_id)
-- );
-- 
-- -- Indexes for admin_roles
-- ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Admin roles are manageable by super admins" ON admin_roles;
-- CREATE POLICY "Admin roles are manageable by super admins"
-- ON admin_roles FOR ALL
-- USING ((EXISTS ( SELECT 1
--    FROM admin_roles ar
--   WHERE ((ar.user_id = auth.uid()) AND ((ar.role)::text = 'super_admin'::text)))))
-- ;
-- 
-- DROP POLICY IF EXISTS "Allow authenticated users to view admin roles" ON admin_roles;
-- CREATE POLICY "Allow authenticated users to view admin roles"
-- ON admin_roles FOR SELECT
-- USING ((auth.uid() IS NOT NULL))
-- ;
-- 
-- Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 20),
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending'::character varying CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID,
  requires_confirmation BOOLEAN DEFAULT false,
  arrival_status VARCHAR(20) CHECK (arrival_status IN ('arrived', 'no_show') OR arrival_status IS NULL),
  PRIMARY KEY (id)
);

-- Indexes for reservations
DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all reservations" ON reservations;
CREATE POLICY "Admins can manage all reservations"
ON reservations FOR ALL
USING (is_admin(auth.uid()))
;

DROP POLICY IF EXISTS "Enable all operations for reservations" ON reservations;
CREATE POLICY "Enable all operations for reservations"
ON reservations FOR ALL
USING (true)
WITH CHECK (true)
;

DROP POLICY IF EXISTS "Public can insert reservations" ON reservations;
CREATE POLICY "Public can insert reservations"
ON reservations FOR INSERT
WITH CHECK (true)
;

DROP POLICY IF EXISTS "Public can view their own reservations" ON reservations;
CREATE POLICY "Public can view their own reservations"
ON reservations FOR SELECT
USING ((((email)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)) OR is_admin(auth.uid())))
;

DROP POLICY IF EXISTS "Users can update their own reservations" ON reservations;
CREATE POLICY "Users can update their own reservations"
ON reservations FOR UPDATE
USING ((((email)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)) OR is_admin(auth.uid())))
;

-- Table: closed_dates
CREATE TABLE IF NOT EXISTS closed_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  reason TEXT DEFAULT 'Restaurant closed'::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  opening_time TIME DEFAULT '10:00:00'::time without time zone,
  closing_time TIME DEFAULT '20:00:00'::time without time zone,
  is_closed BOOLEAN NOT NULL DEFAULT true,
  morning_opening TIME,
  morning_closing TIME,
  afternoon_opening TIME,
  afternoon_closing TIME,
  use_split_hours BOOLEAN DEFAULT false,
  is_manual_override BOOLEAN DEFAULT false,
  PRIMARY KEY (id),
  UNIQUE(date)
);

-- Indexes for closed_dates
DROP TRIGGER IF EXISTS update_closed_dates_updated_at ON closed_dates;
CREATE TRIGGER update_closed_dates_updated_at
  BEFORE UPDATE ON closed_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_closed_dates_updated_at();

ALTER TABLE closed_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage closed dates" ON closed_dates;
CREATE POLICY "Admins can manage closed dates"
ON closed_dates FOR ALL
USING (is_admin(auth.uid()))
;

DROP POLICY IF EXISTS "Allow authenticated users to manage closed_dates" ON closed_dates;
CREATE POLICY "Allow authenticated users to manage closed_dates"
ON closed_dates FOR ALL
USING ((auth.role() = 'authenticated'::text))
;

DROP POLICY IF EXISTS "Allow public read access to closed_dates" ON closed_dates;
CREATE POLICY "Allow public read access to closed_dates"
ON closed_dates FOR SELECT
USING (true)
;

DROP POLICY IF EXISTS "Public can view closed dates" ON closed_dates;
CREATE POLICY "Public can view closed dates"
ON closed_dates FOR SELECT
USING (true)
;

-- Table: restaurant_settings
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  setting_value_en TEXT,
  setting_value_it TEXT,
  setting_value_es TEXT,
  PRIMARY KEY (id),
  UNIQUE(setting_key)
);

-- Indexes for restaurant_settings
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can delete restaurant settings" ON restaurant_settings;
CREATE POLICY "Authenticated users can delete restaurant settings"
ON restaurant_settings FOR DELETE
TO authenticated
USING (true)
;

DROP POLICY IF EXISTS "Authenticated users can insert restaurant settings" ON restaurant_settings;
CREATE POLICY "Authenticated users can insert restaurant settings"
ON restaurant_settings FOR INSERT
TO authenticated
WITH CHECK (true)
;

DROP POLICY IF EXISTS "Authenticated users can read restaurant settings" ON restaurant_settings;
CREATE POLICY "Authenticated users can read restaurant settings"
ON restaurant_settings FOR SELECT
TO authenticated
USING (true)
;

DROP POLICY IF EXISTS "Authenticated users can update restaurant settings" ON restaurant_settings;
CREATE POLICY "Authenticated users can update restaurant settings"
ON restaurant_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true)
;

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  text TEXT,
  status VARCHAR(20) DEFAULT 'active'::character varying CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by INTEGER,
  updated_by INTEGER,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  text_en TEXT,
  text_it TEXT,
  text_es TEXT,
  "order" INTEGER DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE(title)
);

-- Indexes for categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- RLS DISABLED for categories

-- Table: subcategories
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL,
  category_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  text TEXT,
  status VARCHAR(20) DEFAULT 'active'::character varying CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by INTEGER,
  updated_by INTEGER,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  text_en TEXT,
  text_it TEXT,
  text_es TEXT,
  "order" INTEGER DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  UNIQUE(title)
);

-- Indexes for subcategories
DROP TRIGGER IF EXISTS update_subcategories_updated_at ON subcategories;
CREATE TRIGGER update_subcategories_updated_at
  BEFORE UPDATE ON subcategories
  FOR EACH ROW
  EXECUTE FUNCTION update_subcategories_updated_at();

-- RLS DISABLED for subcategories

-- Table: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  text TEXT,
  description TEXT,
  image_path VARCHAR(500),
  model_3d_url TEXT,
  redirect_3d_url TEXT,
  additional_image_url TEXT,
  is_special BOOLEAN DEFAULT false,
  price DECIMAL(10,2) NOT NULL,
  subcategory_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active'::character varying CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by INTEGER,
  updated_by INTEGER,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  text_en TEXT,
  text_it TEXT,
  text_es TEXT,
  description_en TEXT,
  description_it TEXT,
  description_es TEXT,
  "order" INTEGER DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  UNIQUE(title)
);

-- Indexes for menu_items
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_items_updated_at();

-- RLS DISABLED for menu_items

-- Table: addons
CREATE TABLE IF NOT EXISTS addons (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_path VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER,
  subcategory_id INTEGER,
  status VARCHAR(20) DEFAULT 'active'::character varying CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by INTEGER,
  updated_by INTEGER,
  title_en VARCHAR(255),
  title_it VARCHAR(255),
  title_es VARCHAR(255),
  description_en TEXT,
  description_it TEXT,
  description_es TEXT,
  "order" INTEGER DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  UNIQUE(title)
);

-- Indexes for addons
DROP TRIGGER IF EXISTS update_addons_updated_at ON addons;
CREATE TRIGGER update_addons_updated_at
  BEFORE UPDATE ON addons
  FOR EACH ROW
  EXECUTE FUNCTION update_addons_updated_at();

-- RLS DISABLED for addons

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

GRANT SELECT ON categories, subcategories, menu_items, addons TO anon, authenticated;
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

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE addons;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE categories;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE closed_dates;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE menu_items;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE reservations;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE restaurant_settings;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      ALTER PUBLICATION supabase_realtime DROP TABLE subcategories;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    ALTER PUBLICATION supabase_realtime ADD TABLE addons;
    ALTER PUBLICATION supabase_realtime ADD TABLE categories;
    ALTER PUBLICATION supabase_realtime ADD TABLE closed_dates;
    ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
    ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
    ALTER PUBLICATION supabase_realtime ADD TABLE restaurant_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE subcategories;
  END IF;
END $$;

COMMIT;

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================
