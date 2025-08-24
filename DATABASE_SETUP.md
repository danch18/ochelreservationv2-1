# Database Setup - Missing closed_dates Table

The `closed_dates` table is missing from your Supabase database. Here are three ways to create it:

## Option 1: Run the Setup Script (Recommended)

```bash
npm run setup-db
```

## Option 2: Manual SQL Execution in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to **SQL Editor**
4. Copy and paste the contents of `src/sql/closed_dates.sql`
5. Click **Run**

## Option 3: Copy-Paste SQL Directly

Copy and paste this SQL into your Supabase SQL editor:

```sql
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
```

## Verification

After creating the table, the admin settings page should work without the console error. The `dateAvailabilityService.getClosedDates()` method will be able to fetch data from the table.

## What This Table Does

The `closed_dates` table allows you to:
- Mark specific dates as closed for reservations
- Store reasons for closure (holidays, maintenance, etc.)
- Automatically prevent customers from booking on closed dates
- Manage restaurant availability through the admin interface