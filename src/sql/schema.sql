-- Restaurant Reservation System Database Schema
-- This file contains the SQL commands to set up the database structure
-- for a single restaurant reservation system

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 12),
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, reservation_time);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at column
CREATE TRIGGER update_reservations_updated_at 
  BEFORE UPDATE ON reservations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on reservations table
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to create reservations
CREATE POLICY "Public can create reservations" ON reservations
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Allow customers to view their own reservations by email
CREATE POLICY "Customers can view their own reservations" ON reservations
  FOR SELECT USING (
    email = current_setting('app.customer_email', true)
  );

-- Grant necessary permissions for public access
GRANT INSERT ON reservations TO anon, authenticated;
GRANT SELECT ON reservations TO authenticated;

-- Comments for documentation
COMMENT ON TABLE reservations IS 'Stores customer reservations for the restaurant';
COMMENT ON COLUMN reservations.guests IS 'Number of guests, limited between 1 and 12';
COMMENT ON COLUMN reservations.status IS 'Reservation status: confirmed, cancelled, or completed';
COMMENT ON COLUMN reservations.special_requests IS 'Optional special requests from the customer';