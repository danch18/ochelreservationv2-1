-- Create table for managing closed dates and custom opening hours
-- This table stores both:
-- 1. Specific dates when the restaurant is closed (is_closed = true)
-- 2. Specific dates with custom opening hours (overrides weekly schedule)
CREATE TABLE IF NOT EXISTS closed_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  is_closed BOOLEAN DEFAULT false,
  reason TEXT,
  -- Continuous hours (used when use_split_hours = false)
  opening_time TIME DEFAULT '10:00',
  closing_time TIME DEFAULT '20:00',
  -- Split hours support (used when use_split_hours = true)
  morning_opening TIME,
  morning_closing TIME,
  afternoon_opening TIME,
  afternoon_closing TIME,
  use_split_hours BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_closed_dates_date ON closed_dates(date);
CREATE INDEX IF NOT EXISTS idx_closed_dates_is_closed ON closed_dates(is_closed);
CREATE INDEX IF NOT EXISTS idx_closed_dates_date_range ON closed_dates(date, is_closed);

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

-- Insert some sample closed dates and custom hours for testing (optional)
-- Example 1: Closed date
-- INSERT INTO closed_dates (date, is_closed, reason) VALUES
--   ('2024-12-25', true, 'Christmas Day'),
--   ('2024-01-01', true, 'New Year''s Day')
-- ON CONFLICT (date) DO NOTHING;

-- Example 2: Custom continuous hours for a specific date
-- INSERT INTO closed_dates (date, is_closed, opening_time, closing_time, use_split_hours) VALUES
--   ('2024-12-24', false, '11:00', '18:00', false)
-- ON CONFLICT (date) DO UPDATE SET
--   is_closed = EXCLUDED.is_closed,
--   opening_time = EXCLUDED.opening_time,
--   closing_time = EXCLUDED.closing_time,
--   use_split_hours = EXCLUDED.use_split_hours;

-- Example 3: Custom split hours (lunch and dinner service) for a specific date
-- INSERT INTO closed_dates (date, is_closed, morning_opening, morning_closing, afternoon_opening, afternoon_closing, use_split_hours) VALUES
--   ('2024-12-31', false, '12:00', '14:30', '19:00', '23:00', true)
-- ON CONFLICT (date) DO UPDATE SET
--   is_closed = EXCLUDED.is_closed,
--   morning_opening = EXCLUDED.morning_opening,
--   morning_closing = EXCLUDED.morning_closing,
--   afternoon_opening = EXCLUDED.afternoon_opening,
--   afternoon_closing = EXCLUDED.afternoon_closing,
--   use_split_hours = EXCLUDED.use_split_hours;

-- Table documentation
COMMENT ON TABLE closed_dates IS 'Manages restaurant closed dates and custom opening hours that override the weekly schedule';
COMMENT ON COLUMN closed_dates.is_closed IS 'True if restaurant is closed on this date, false if open with custom hours';
COMMENT ON COLUMN closed_dates.reason IS 'Reason for closure or custom hours (e.g., "Christmas Day", "Special Event")';
COMMENT ON COLUMN closed_dates.opening_time IS 'Opening time for continuous service (used when use_split_hours = false)';
COMMENT ON COLUMN closed_dates.closing_time IS 'Closing time for continuous service (used when use_split_hours = false)';
COMMENT ON COLUMN closed_dates.morning_opening IS 'Morning service opening time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.morning_closing IS 'Morning service closing time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.afternoon_opening IS 'Afternoon/evening service opening time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.afternoon_closing IS 'Afternoon/evening service closing time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.use_split_hours IS 'True for split service (lunch/dinner), false for continuous service';