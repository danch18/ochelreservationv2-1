-- ============================================================================
-- MANUAL OVERRIDE TRACKING - Minimal Solution
-- ============================================================================
-- This migration adds tracking for manual overrides in the calendar.
-- When admin manually changes a date, it won't be affected by weekly schedule changes.
-- ============================================================================

-- Step 1: Add is_manual_override column
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'closed_dates'
    AND column_name = 'is_manual_override'
  ) THEN
    ALTER TABLE closed_dates ADD COLUMN is_manual_override BOOLEAN DEFAULT false;
    RAISE NOTICE '✓ Added is_manual_override column';
  ELSE
    RAISE NOTICE '✓ is_manual_override column already exists';
  END IF;
END $$;

-- Step 2: Add index for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_closed_dates_manual_override
ON closed_dates(is_manual_override);

-- Step 3: Mark existing entries as manual overrides (preserve existing data)
-- ============================================================================
UPDATE closed_dates
SET is_manual_override = true
WHERE is_manual_override = false;

-- Add column comment
COMMENT ON COLUMN closed_dates.is_manual_override IS
'True = manually set by admin (protected from weekly sync), False = auto-synced from weekly schedule';

-- ============================================================================
-- DONE - Now the application can:
-- 1. Mark new calendar changes as is_manual_override = true
-- 2. When weekly schedule changes, delete where is_manual_override = false
-- 3. Display "Fermé (hebdo)" vs "Fermé" in calendar (already implemented)
-- ============================================================================
