-- Migration: Add time slot fields to closed_dates table
-- This migration adds support for custom opening hours and split service times
-- Run this in Supabase SQL Editor if your table already exists

-- Add new columns if they don't exist
DO $$
BEGIN
  -- Add is_closed column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='is_closed') THEN
    ALTER TABLE closed_dates ADD COLUMN is_closed BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added column: is_closed';
  END IF;

  -- Add opening_time column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='opening_time') THEN
    ALTER TABLE closed_dates ADD COLUMN opening_time TIME DEFAULT '10:00';
    RAISE NOTICE 'Added column: opening_time';
  END IF;

  -- Add closing_time column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='closing_time') THEN
    ALTER TABLE closed_dates ADD COLUMN closing_time TIME DEFAULT '20:00';
    RAISE NOTICE 'Added column: closing_time';
  END IF;

  -- Add morning_opening column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='morning_opening') THEN
    ALTER TABLE closed_dates ADD COLUMN morning_opening TIME;
    RAISE NOTICE 'Added column: morning_opening';
  END IF;

  -- Add morning_closing column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='morning_closing') THEN
    ALTER TABLE closed_dates ADD COLUMN morning_closing TIME;
    RAISE NOTICE 'Added column: morning_closing';
  END IF;

  -- Add afternoon_opening column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='afternoon_opening') THEN
    ALTER TABLE closed_dates ADD COLUMN afternoon_opening TIME;
    RAISE NOTICE 'Added column: afternoon_opening';
  END IF;

  -- Add afternoon_closing column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='afternoon_closing') THEN
    ALTER TABLE closed_dates ADD COLUMN afternoon_closing TIME;
    RAISE NOTICE 'Added column: afternoon_closing';
  END IF;

  -- Add use_split_hours column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='closed_dates' AND column_name='use_split_hours') THEN
    ALTER TABLE closed_dates ADD COLUMN use_split_hours BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added column: use_split_hours';
  END IF;
END $$;

-- Update existing records to set is_closed = true if they have a reason (backwards compatibility)
UPDATE closed_dates
SET is_closed = true
WHERE reason IS NOT NULL AND reason != '' AND is_closed IS NULL;

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_closed_dates_is_closed ON closed_dates(is_closed);
CREATE INDEX IF NOT EXISTS idx_closed_dates_date_range ON closed_dates(date, is_closed);

-- Add column comments for documentation
COMMENT ON COLUMN closed_dates.is_closed IS 'True if restaurant is closed on this date, false if open with custom hours';
COMMENT ON COLUMN closed_dates.reason IS 'Reason for closure or custom hours (e.g., "Christmas Day", "Special Event")';
COMMENT ON COLUMN closed_dates.opening_time IS 'Opening time for continuous service (used when use_split_hours = false)';
COMMENT ON COLUMN closed_dates.closing_time IS 'Closing time for continuous service (used when use_split_hours = false)';
COMMENT ON COLUMN closed_dates.morning_opening IS 'Morning service opening time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.morning_closing IS 'Morning service closing time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.afternoon_opening IS 'Afternoon/evening service opening time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.afternoon_closing IS 'Afternoon/evening service closing time (used when use_split_hours = true)';
COMMENT ON COLUMN closed_dates.use_split_hours IS 'True for split service (lunch/dinner), false for continuous service';

-- Verify the migration
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'closed_dates'
ORDER BY ordinal_position;
