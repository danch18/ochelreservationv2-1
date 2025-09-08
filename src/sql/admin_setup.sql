-- Admin roles table for authentication
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_roles_user_unique ON admin_roles(user_id);

-- Enable Row Level Security
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read their own admin role
CREATE POLICY "Users can read their own admin role" ON admin_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT ON admin_roles TO authenticated;

-- Insert default admin user (you'll need to replace with your actual user ID)
-- First, you need to create a user in Supabase Auth with email: admin@restaurant.com
-- Then get the user ID and insert it here, or do it manually in Supabase dashboard

-- Example insert (replace 'your-user-id-here' with the actual UUID):
-- INSERT INTO admin_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'super_admin')
-- ON CONFLICT (user_id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE admin_roles IS 'Stores admin role assignments for users';
COMMENT ON COLUMN admin_roles.role IS 'Admin role: admin or super_admin';