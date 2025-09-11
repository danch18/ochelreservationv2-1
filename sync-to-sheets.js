#!/usr/bin/env node

/**
 * Restaurant Database to Google Sheets Sync Script
 * 
 * This script automatically exports data from your Supabase database 
 * to Google Sheets for backup and analysis.
 * 
 * Setup Instructions:
 * 1. npm install googleapis dotenv @supabase/supabase-js
 * 2. Create Google Cloud Project and enable Sheets API
 * 3. Create service account and download credentials JSON
 * 4. Share your Google Sheet with the service account email
 * 5. Set environment variables (see below)
 */

require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const CONFIG = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  
  // Google Sheets
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID, // Get this from your Google Sheet URL
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json',
  
  // Sheet names
  sheets: {
    reservations: 'Reservations',
    settings: 'Restaurant Settings', 
    closedDates: 'Closed Dates',
    summary: 'Summary'
  }
};

// Initialize clients
const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

async function initializeGoogleSheets() {
  try {
    const credentials = require(CONFIG.credentialsPath);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error.message);
    console.log('📝 Setup instructions:');
    console.log('1. Create Google Cloud Project: https://console.cloud.google.com');
    console.log('2. Enable Google Sheets API');
    console.log('3. Create Service Account and download JSON credentials');
    console.log('4. Save credentials as google-credentials.json');
    console.log('5. Share your Google Sheet with the service account email');
    process.exit(1);
  }
}

async function fetchReservations() {
  console.log('📊 Fetching reservations...');
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Convert to array format for Google Sheets
  const headers = [
    'ID', 'Name', 'Email', 'Phone', 'Reservation Date', 'Reservation Time',
    'Guests', 'Special Requests', 'Status', 'Requires Confirmation',
    'Created At', 'Updated At', 'Confirmed At'
  ];
  
  const rows = data.map(row => [
    row.id,
    row.name,
    row.email,
    row.phone,
    row.reservation_date,
    row.reservation_time,
    row.guests,
    row.special_requests || '',
    row.status,
    row.requires_confirmation,
    row.created_at,
    row.updated_at,
    row.confirmed_at || ''
  ]);
  
  return [headers, ...rows];
}

async function fetchRestaurantSettings() {
  console.log('⚙️ Fetching restaurant settings...');
  const { data, error } = await supabase
    .from('restaurant_settings')
    .select('*')
    .order('setting_key');
    
  if (error) throw error;
  
  const headers = ['ID', 'Setting Key', 'Setting Value', 'Description', 'Created At', 'Updated At'];
  const rows = data.map(row => [
    row.id,
    row.setting_key,
    row.setting_value,
    row.description || '',
    row.created_at,
    row.updated_at
  ]);
  
  return [headers, ...rows];
}

async function fetchClosedDates() {
  console.log('📅 Fetching closed dates...');
  const { data, error } = await supabase
    .from('closed_dates')
    .select('*')
    .order('date');
    
  if (error) throw error;
  
  const headers = [
    'ID', 'Date', 'Opening Time', 'Closing Time', 'Is Closed', 
    'Reason', 'Created At', 'Updated At'
  ];
  const rows = data.map(row => [
    row.id,
    row.date,
    row.opening_time,
    row.closing_time,
    row.is_closed,
    row.reason || '',
    row.created_at,
    row.updated_at
  ]);
  
  return [headers, ...rows];
}

async function generateSummary() {
  console.log('📈 Generating summary...');
  
  // Get reservation stats
  const { data: reservations } = await supabase
    .from('reservations')
    .select('status, guests, created_at');
    
  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    totalGuests: reservations.reduce((sum, r) => sum + r.guests, 0),
    avgGuests: (reservations.reduce((sum, r) => sum + r.guests, 0) / reservations.length).toFixed(1)
  };
  
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const recentReservations = reservations.filter(r => r.created_at >= thisWeek);
  
  return [
    ['Metric', 'Value', 'Last Updated'],
    ['Total Reservations', stats.total, today],
    ['Confirmed Reservations', stats.confirmed, today],
    ['Pending Reservations', stats.pending, today],
    ['Cancelled Reservations', stats.cancelled, today],
    ['Total Guests', stats.totalGuests, today],
    ['Average Guests per Reservation', stats.avgGuests, today],
    ['Reservations This Week', recentReservations.length, today],
    ['', '', ''],
    ['Last Sync', new Date().toLocaleString(), today]
  ];
}

async function updateSheet(sheets, sheetName, data) {
  console.log(`📝 Updating ${sheetName} sheet...`);
  
  try {
    // Clear existing data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: CONFIG.spreadsheetId,
      range: `${sheetName}!A:Z`
    });
    
    // Add new data
    await sheets.spreadsheets.values.update({
      spreadsheetId: CONFIG.spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: data
      }
    });
    
    console.log(`✅ ${sheetName} updated successfully (${data.length} rows)`);
  } catch (error) {
    if (error.code === 400) {
      console.log(`📄 Creating new sheet: ${sheetName}`);
      // Create the sheet first
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: CONFIG.spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }]
        }
      });
      
      // Try updating again
      await updateSheet(sheets, sheetName, data);
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log('🚀 Starting database sync to Google Sheets...\n');
  
  try {
    // Initialize Google Sheets
    const sheets = await initializeGoogleSheets();
    
    // Fetch all data
    const [reservationsData, settingsData, closedDatesData, summaryData] = await Promise.all([
      fetchReservations(),
      fetchRestaurantSettings(), 
      fetchClosedDates(),
      generateSummary()
    ]);
    
    // Update all sheets
    await Promise.all([
      updateSheet(sheets, CONFIG.sheets.reservations, reservationsData),
      updateSheet(sheets, CONFIG.sheets.settings, settingsData),
      updateSheet(sheets, CONFIG.sheets.closedDates, closedDatesData),
      updateSheet(sheets, CONFIG.sheets.summary, summaryData)
    ]);
    
    console.log('\n🎉 Sync completed successfully!');
    console.log(`📊 View your data: https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}`);
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };

