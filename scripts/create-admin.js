#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

async function createAdminUser() {
  // Get Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhugrvpaizlzeemazuna.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    console.log('Please set your service role key in the environment or .env.local file');
    process.exit(1);
  }

  // Create admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    console.log('Creating admin user...');

    // Default admin credentials
    const adminEmail = 'admin@restaurant.com';
    const adminPassword = 'AdminPass2024!';

    // Check if admin user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(user => user.email === adminEmail);

    if (userExists) {
      console.log('❌ Admin user already exists with email:', adminEmail);
      console.log('Use the password reset feature if you need to change the password.');
      return;
    }

    // Create the admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        username: 'admin',
        role: 'super_admin'
      }
    });

    if (authError) {
      console.error('❌ Error creating admin user:', authError.message);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', authData.user.id);

    // Add admin role to the database
    const { error: roleError } = await supabase
      .from('admin_roles')
      .insert({
        user_id: authData.user.id,
        role: 'super_admin',
        permissions: ['manage_reservations', 'manage_settings', 'manage_admins']
      });

    if (roleError) {
      console.error('❌ Error creating admin role:', roleError.message);
      console.log('Cleaning up user...');
      await supabase.auth.admin.deleteUser(authData.user.id);
      return;
    }

    console.log('✅ Admin role assigned successfully!');
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('');
    console.log('⚠️  Please change the password after first login for security!');
    console.log('You can access the admin panel at: /admin');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createAdminUser();


