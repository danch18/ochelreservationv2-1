-- Restaurant Settings Table Schema
-- This table stores various restaurant configuration settings including weekly schedule

-- Create restaurant_settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_restaurant_settings_key ON restaurant_settings(setting_key);

-- Create trigger for updated_at column
DROP TRIGGER IF EXISTS update_restaurant_settings_updated_at ON restaurant_settings;
CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to read all settings (needed for reservation popup)
DROP POLICY IF EXISTS "Public can read restaurant settings" ON restaurant_settings;
CREATE POLICY "Public can read restaurant settings" ON restaurant_settings
  FOR SELECT USING (true);

-- RLS Policy: Only authenticated users can insert/update settings (admin)
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON restaurant_settings;
CREATE POLICY "Authenticated users can insert settings" ON restaurant_settings
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update settings" ON restaurant_settings;
CREATE POLICY "Authenticated users can update settings" ON restaurant_settings
  FOR UPDATE TO authenticated USING (true);

-- Grant necessary permissions
GRANT SELECT ON restaurant_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON restaurant_settings TO authenticated;

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE restaurant_settings;

-- Comments for documentation
COMMENT ON TABLE restaurant_settings IS 'Stores restaurant configuration settings including weekly schedules';
COMMENT ON COLUMN restaurant_settings.setting_key IS 'Unique key for the setting (e.g., weekly_schedule_0 for Sunday)';
COMMENT ON COLUMN restaurant_settings.setting_value IS 'JSON string containing the setting configuration';
COMMENT ON COLUMN restaurant_settings.description IS 'Human-readable description of what this setting controls';
