# 🔐 Admin User Setup Guide

This guide explains how to create and manage admin users for the restaurant reservation system.

## 🚀 Quick Setup

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Navigate to your project: `jhugrvpaizlzeemazuna`

2. **Create Admin User**
   - Go to **Authentication** → **Users**
   - Click **"Add user"**
   - Enter details:
     - **Email**: `admin@restaurant.com`
     - **Password**: `AdminPass2024!` (change this after first login)
     - **Email Confirm**: ✅ (checked)
     - **Auto Confirm User**: ✅ (checked)

3. **Set Admin Role**
   - Go to **SQL Editor**
   - Run this command:
   ```sql
   SELECT setup_admin_role('admin@restaurant.com');
   ```
   
   **Alternative (Direct SQL):**
   ```sql
   INSERT INTO admin_roles (user_id, role, permissions)
   SELECT 
     au.id,
     'super_admin',
     '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb
   FROM auth.users au 
   WHERE au.email = 'admin@restaurant.com'
   ON CONFLICT (user_id) DO UPDATE SET
     role = 'super_admin',
     permissions = '["manage_reservations", "manage_settings", "manage_admins"]'::jsonb;
   ```

4. **Test Login**
   - Visit your app at `/admin/login`
   - Login with the credentials above
   - **Important**: Change the password immediately after first login!

### Method 2: Using the Script (If you have service role key)

1. **Set Environment Variable**
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   ```

2. **Run the Script**
   ```bash
   npm run create-admin
   ```

## 🔑 Default Admin Credentials

**Email**: `admin@restaurant.com`  
**Password**: `AdminPass2024!`

⚠️ **Security Warning**: Change this password immediately after first login!

## 🔄 Password Management

### For Users
- Use the **"Forgot Password"** link on the login page
- Enter your email to receive a reset link
- Follow the link to set a new password

### For Admins (via Supabase Dashboard)
- Go to **Authentication** → **Users**
- Find the user and click **"Send Password Reset"**
- Or click the user email → **"Reset Password"**

## 🛡️ Security Features

### ✅ What's Secure Now
- ✅ **No hardcoded credentials** in source code
- ✅ **Server-side authentication** via Supabase Auth
- ✅ **Encrypted password storage** with bcrypt
- ✅ **JWT token-based sessions** with auto-refresh
- ✅ **Role-based access control** with database policies
- ✅ **Row Level Security (RLS)** on all admin operations
- ✅ **Email-based password reset** functionality
- ✅ **Session management** with automatic expiration

### 🔐 Database Security
- **Admin Roles Table**: Only authenticated admins can access
- **RLS Policies**: Protect all sensitive data
- **Secure Functions**: Role checking with proper permissions
- **Audit Trail**: All auth events logged by Supabase

## 📝 Managing Additional Admins

To create additional admin users:

1. **Create User in Supabase Dashboard**
   - Follow steps 1-2 from Method 1 above
   - Use different email addresses

2. **Assign Admin Role**
   ```sql
   SELECT setup_admin_role('new-admin@restaurant.com');
   ```

## 🔧 Troubleshooting

### Login Issues
- **"Invalid credentials"**: Check email/password spelling
- **"Access denied"**: User may not have admin role assigned
- **Page redirects to login**: Session may have expired

### Password Reset Issues
- **No email received**: Check spam folder
- **Reset link expired**: Request a new reset
- **Reset not working**: Contact system administrator

### Admin Role Issues
- **Can't access admin panel**: Check if admin role is assigned
- **Database errors**: Verify RLS policies are properly set

## 🆘 Emergency Access

If you lose access to all admin accounts:

1. **Via Supabase Dashboard**
   - Go to Authentication → Users
   - Create new user with admin email
   - Run the `setup_admin_role()` function

2. **Via Database Direct Access**
   - Access Supabase SQL Editor
   - Create user and role manually
   - Follow security protocols

## 📊 Admin Roles

### Super Admin (`super_admin`)
- Full system access
- Can manage all reservations
- Can access settings
- Can manage other admins

### Regular Admin (`admin`)
- Can manage reservations
- Limited settings access
- Cannot manage other admins

---

## 🚨 Important Security Notes

1. **Change default password** immediately after setup
2. **Use strong passwords** (8+ characters, mixed case, numbers, symbols)
3. **Enable 2FA** when available
4. **Regular password updates** recommended
5. **Monitor admin access** through Supabase logs
6. **Limit admin accounts** to necessary personnel only

---

**Need Help?** Contact your system administrator or check the Supabase documentation.
