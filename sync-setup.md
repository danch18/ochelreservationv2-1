# Database to Google Sheets Sync Setup

## 🚀 Quick Start (Manual Import)

**Already Done!** Use these CSV files to import into Google Sheets:
- `reservations_export.csv` - All reservations (40 records)
- `restaurant_settings_export.csv` - Restaurant settings
- `closed_dates_export.csv` - Special dates and hours

### Import Steps:
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. File → Import → Upload → Select CSV file
4. Choose "Replace spreadsheet"

---

## 🔄 Automated Sync Setup

### 1. Install Dependencies
```bash
npm install googleapis dotenv @supabase/supabase-js
```

### 2. Google Cloud Setup
1. **Create Google Cloud Project**: https://console.cloud.google.com
2. **Enable Google Sheets API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create Service Account**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name it "restaurant-sync" 
   - Download the JSON credentials file

4. **Save Credentials**:
   - Rename downloaded file to `google-credentials.json`
   - Place it in your restaurant-app folder

### 3. Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Restaurant Database Backup"
4. Copy the Spreadsheet ID from URL: 
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 4. Share Spreadsheet
1. Open your Google Spreadsheet
2. Click "Share" button
3. Add the service account email (from credentials JSON)
4. Give "Editor" permissions

### 5. Environment Setup
Add to your `.env.local` file:
```env
# Google Sheets Sync
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CREDENTIALS_PATH=./google-credentials.json
```

### 6. Run Sync
```bash
# One-time sync
node sync-to-sheets.js

# Or add to package.json scripts
npm run sync-sheets
```

---

## 📋 Script Features

The automated sync will create/update these sheets:
- **Reservations** - All reservation data with filters
- **Restaurant Settings** - Configuration and schedules  
- **Closed Dates** - Special dates and custom hours
- **Summary** - Stats and metrics dashboard

### Auto-Generated Metrics:
- Total reservations
- Confirmed/Pending/Cancelled counts
- Total guests served
- Average party size
- Recent activity (last 7 days)
- Last sync timestamp

---

## 🔄 Schedule Regular Syncs

### Option A: Cron Job (Linux/Mac)
```bash
# Edit crontab
crontab -e

# Add line for daily sync at 6 AM
0 6 * * * cd /path/to/restaurant-app && node sync-to-sheets.js
```

### Option B: GitHub Actions (if using Git)
Create `.github/workflows/sync-sheets.yml`:
```yaml
name: Sync to Google Sheets
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM
  workflow_dispatch:     # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node sync-to-sheets.js
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          GOOGLE_SPREADSHEET_ID: ${{ secrets.GOOGLE_SPREADSHEET_ID }}
          GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
```

### Option C: Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily/weekly)
4. Action: Start program `node.exe`
5. Arguments: `sync-to-sheets.js`
6. Start in: Your restaurant-app folder

---

## 🛠 Troubleshooting

### Common Issues:

**"Failed to initialize Google Sheets"**
- Check credentials file path
- Verify service account has Sheets API access
- Ensure JSON file is valid

**"The caller does not have permission"** 
- Share spreadsheet with service account email
- Give "Editor" permissions

**"Spreadsheet not found"**
- Check GOOGLE_SPREADSHEET_ID in .env.local
- Verify spreadsheet exists and is accessible

**"Supabase connection failed"**
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Verify database is accessible

---

## 📊 Data Structure

### Reservations Sheet Columns:
- ID, Name, Email, Phone
- Reservation Date, Time, Guests
- Special Requests, Status
- Confirmation details and timestamps

### Settings Sheet Columns:
- Setting Key, Value, Description
- Created/Updated timestamps

### Closed Dates Sheet Columns:
- Date, Opening/Closing times
- Is Closed flag, Reason
- Created/Updated timestamps

### Summary Sheet:
- Key metrics and statistics
- Last sync timestamp
- Quick overview dashboard

---

## 🎯 Next Steps

1. **Start with Manual Import** - Use the CSV files now
2. **Set up Automated Sync** - Follow Google Cloud setup
3. **Schedule Regular Updates** - Choose your preferred method
4. **Customize Dashboard** - Add charts and filters in Google Sheets

Need help? Check the troubleshooting section or reach out!
