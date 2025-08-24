-- Create table for managing closed dates
CREATE TABLE IF NOT EXISTS closed_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason TEXT DEFAULT 'Restaurant closed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_closed_dates_date ON closed_dates(date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_closed_dates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_closed_dates_updated_at
  BEFORE UPDATE ON closed_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_closed_dates_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE closed_dates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for checking availability)
CREATE POLICY "Allow public read access to closed_dates" ON closed_dates
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage closed dates
-- Note: In a production environment, you might want to restrict this to admin users only
CREATE POLICY "Allow authenticated users to manage closed_dates" ON closed_dates
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample closed dates for testing (optional)
-- INSERT INTO closed_dates (date, reason) VALUES 
--   ('2024-12-25', 'Christmas Day'),
--   ('2024-01-01', 'New Year''s Day')
-- ON CONFLICT (date) DO NOTHING;