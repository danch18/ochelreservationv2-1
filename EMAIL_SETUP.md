# Email Confirmation Setup Guide

Your reservation system now sends automatic confirmation emails to customers! Follow this guide to set up email functionality.

## 📦 Install Required Dependencies

First, install the nodemailer package:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## 🔧 Email Provider Setup

Choose one of the following email providers:

### Option 1: Gmail (Easy Setup)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Add to .env.local**:
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=noreply@ochel.com
```

### Option 2: Resend (Recommended for Production)

1. **Sign up at [resend.com](https://resend.com)**
2. **Get your API key** from the dashboard
3. **Add to .env.local**:
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@ochel.com
```

### Option 3: Custom SMTP

For other email providers (Mailgun, SendGrid, etc.):
```env
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@ochel.com
```

## 🧪 Testing

### Development Mode
In development, emails are logged to the console instead of being sent. You'll see the email content in your terminal.

### Production Testing
1. Make a test reservation
2. Check the customer's email inbox
3. Verify the email looks correct and contains all reservation details

## ✨ Features Included

### ✅ Confirmation Email
**Sent when**: Customer makes a new reservation
**Contains**:
- Reservation details (date, time, guests, special requests)
- Restaurant contact information
- Confirmation ID
- Beautiful HTML template with ochel branding

### ✅ Cancellation Email
**Sent when**: Admin cancels a reservation
**Contains**:
- Cancelled reservation details
- Contact information for rebooking

## 🎨 Email Templates

### Confirmation Email Features:
- **Professional Design**: ochel branding with restaurant colors
- **Responsive Layout**: Works on mobile and desktop
- **Complete Details**: All reservation information clearly displayed
- **Contact Info**: Easy access to restaurant phone/email
- **Special Requests**: Highlighted if provided by customer

### Cancellation Email Features:
- **Clear Communication**: Confirms the cancellation
- **Rebooking Information**: Encourages customers to make a new reservation

## 🔄 Email Flow

1. **Customer makes reservation** → Confirmation email sent immediately
2. **Admin cancels reservation** → Cancellation email sent to customer
3. **Email fails?** → Reservation still succeeds (emails won't block bookings)

## 🛠️ Troubleshooting

### Emails Not Sending?
1. Check your environment variables
2. Verify email provider credentials
3. Look for errors in the console
4. Test with different email addresses

### Gmail Issues?
- Make sure 2FA is enabled
- Use app password, not your regular password
- Check "Less secure app access" settings

### Development Testing?
- Emails are logged to console in development mode
- Check your terminal output for email content
- Switch to production mode to test real sending

## 🚀 Ready to Go!

Your email system is now configured! Customers will automatically receive:
- **Beautiful confirmation emails** with all their reservation details
- **Professional branding** that matches your restaurant
- **All necessary information** to prepare for their visit

The email system is designed to be reliable - if emails fail, reservations will still be saved successfully.