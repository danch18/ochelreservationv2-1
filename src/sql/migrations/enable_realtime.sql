-- Enable Realtime for Restaurant Reservation System
-- Run this in Supabase SQL Editor to enable real-time subscriptions

-- Enable Realtime on reservations table
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;

-- Enable Realtime on restaurant_settings table (for weekly schedule)
ALTER PUBLICATION supabase_realtime ADD TABLE restaurant_settings;

-- Enable Realtime on closed_dates table (for calendar overrides)
ALTER PUBLICATION supabase_realtime ADD TABLE closed_dates;

-- Verify that tables are enabled for realtime
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
