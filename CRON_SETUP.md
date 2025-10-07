# Daily Reminder Email Cron Job Setup

This guide explains how to set up the daily reminder email system that sends notifications to customers at 9:00 AM for their reservations on the same day.

## 📧 Email System Overview

The system sends three types of emails:

1. **Submission Email** - Sent when guests > auto-confirm limit (pending reservations)
2. **Confirmation Email** - Sent when reservation is confirmed (auto-confirmed or admin-approved)
3. **Daily Reminder Email** - Sent at 9:00 AM to customers with reservations today

## 🔄 Cron Job Configuration

### Option 1: Vercel Cron (Recommended for Production)

#### Step 1: Create `vercel.json` in project root

```json
{
  "crons": [
    {
      "path": "/api/cron/send-daily-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Schedule format:** `0 9 * * *` means "At 9:00 AM every day"
- Minute: 0
- Hour: 9
- Day of month: * (every day)
- Month: * (every month)
- Day of week: * (every day of week)

#### Step 2: Add Environment Variable (Optional but Recommended)

Add to your `.env` file or Vercel environment variables:

```bash
CRON_SECRET=your-random-secret-key-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

#### Step 3: Deploy to Vercel

```bash
vercel --prod
```

The cron job will automatically be configured and run daily at 9:00 AM.

### Option 2: External Cron Service (e.g., cron-job.org, EasyCron)

#### Step 1: Get your API endpoint URL

```
https://your-domain.com/api/cron/send-daily-reminders
```

#### Step 2: Configure the external service

- **URL:** `https://your-domain.com/api/cron/send-daily-reminders`
- **Method:** POST
- **Schedule:** Daily at 9:00 AM
- **Headers:** (if using CRON_SECRET)
  ```
  Authorization: Bearer your-cron-secret
  ```

### Option 3: GitHub Actions (For GitHub hosted projects)

#### Create `.github/workflows/daily-reminders.yml`

```yaml
name: Send Daily Reminders

on:
  schedule:
    # Runs at 09:00 UTC daily
    - cron: '0 9 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Send Daily Reminder Emails
        run: |
          curl -X POST https://your-domain.com/api/cron/send-daily-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

**Note:** Set `CRON_SECRET` in GitHub repository secrets.

### Option 4: Linux Crontab (For Self-hosted servers)

#### Edit crontab

```bash
crontab -e
```

#### Add this line

```bash
0 9 * * * curl -X POST https://your-domain.com/api/cron/send-daily-reminders -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🧪 Testing the Cron Job

### Manual Trigger via Browser/Postman

**Without Auth:**
```
GET https://your-domain.com/api/cron/send-daily-reminders
```

**With Auth:**
```bash
curl -X POST https://your-domain.com/api/cron/send-daily-reminders \
  -H "Authorization: Bearer your-cron-secret"
```

### Test with Sample Data

1. Create a test reservation for today
2. Set status to 'confirmed'
3. Trigger the endpoint manually
4. Check email inbox for reminder

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Daily reminders sent successfully",
  "date": "2025-10-07",
  "total": 5,
  "sent": 5,
  "failed": 0,
  "details": [...]
}
```

**No Reservations:**
```json
{
  "success": true,
  "message": "No reservations for today",
  "count": 0,
  "date": "2025-10-07"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

## 🔐 Security Best Practices

1. **Always use CRON_SECRET in production**
   - Add to `.env`: `CRON_SECRET=random-secure-key`
   - Add to Vercel env vars via dashboard

2. **Rate Limiting** (Optional)
   - Implement rate limiting if endpoint is publicly accessible
   - Use Vercel's built-in protection

3. **Monitoring**
   - Check Vercel logs: `vercel logs`
   - Set up alerts for failed cron jobs
   - Monitor email delivery success rate

## 📊 Monitoring & Logs

### View Vercel Logs

```bash
vercel logs --follow
```

### Check Cron Execution

- Vercel Dashboard → Your Project → Cron
- View execution history, success/failure rates

### Email Service Logs

Check your email service provider (Nodemailer/Resend) for delivery stats:
- Open rates
- Bounce rates
- Failed deliveries

## 🛠️ Troubleshooting

### Cron job not triggering

1. **Check Vercel cron configuration**
   ```bash
   vercel inspect
   ```

2. **Verify `vercel.json` is deployed**
   ```bash
   git status
   git add vercel.json
   git commit -m "Add cron job config"
   git push
   vercel --prod
   ```

3. **Check timezone settings**
   - Vercel cron runs in UTC by default
   - Adjust schedule time accordingly

### Emails not sending

1. **Check email service configuration**
   - Verify `SMTP_*` or email provider credentials in `.env`
   - Test email service separately

2. **Check database query**
   - Ensure reservations exist for today
   - Check `status = 'confirmed'`
   - Verify date format matches YYYY-MM-DD

3. **Check API logs**
   ```bash
   vercel logs --follow
   ```

### Authorization errors

1. **Verify CRON_SECRET matches**
   - Check `.env` file
   - Check Vercel environment variables
   - Ensure no extra whitespace

2. **Update Authorization header**
   ```bash
   Authorization: Bearer YOUR_ACTUAL_SECRET
   ```

## 🌍 Timezone Considerations

### Adjust for Your Timezone

If you want reminders to go out at 9:00 AM **local time** (not UTC):

**Example: EST (UTC-5)**
```json
{
  "crons": [{
    "path": "/api/cron/send-daily-reminders",
    "schedule": "0 14 * * *"
  }]
}
```
- 9:00 AM EST = 14:00 UTC (2:00 PM UTC)

**Use this calculator:** https://crontab.guru/

## 📝 Email System Summary

### Email Flow

```
Customer Makes Reservation
         ↓
   Guest Count Check
         ↓
    ┌─────────────────┐
    │ Guests > Limit? │
    └─────────────────┘
         ↓
    ┌───────┴────────┐
    │ YES         NO │
    ↓               ↓
[Submission]  [Confirmation]
   Email          Email
    ↓               ↓
 (Pending)    (Confirmed)
    ↓               ↓
Admin Approves     Done
    ↓
[Confirmation
   Email]
    ↓
    ┌──────────────┐
    │ At 9:00 AM   │
    │ Day of Event │
    └──────────────┘
         ↓
    [Reminder
      Email]
```

### Email Template Locations

- **Submission Email:** `src/services/emailService.ts` → `generateSubmissionEmailHTML()`
- **Confirmation Email:** `src/services/emailService.ts` → `generateConfirmationEmailHTML()`
- **Reminder Email:** `src/services/emailService.ts` → `generateReminderEmailHTML()`

All templates are modular and customizable.

## 🚀 Quick Start Checklist

- [ ] Create `vercel.json` with cron configuration
- [ ] Set `CRON_SECRET` environment variable
- [ ] Configure email service (SMTP credentials)
- [ ] Deploy to Vercel
- [ ] Test manual trigger
- [ ] Verify first automated run (wait for 9:00 AM)
- [ ] Set up monitoring/alerts

## 📞 Support

For issues or questions:
- Check Vercel logs: `vercel logs`
- Review email service logs
- Check Supabase database queries
- Test API endpoint manually

---

**Last Updated:** 2025-10-07
