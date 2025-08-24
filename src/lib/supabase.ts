import { createClient } from '@supabase/supabase-js';

// Validate and get Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhugrvpaizlzeemazuna.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodWdydnBhaXpsemVlbWF6dW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDYxMTIsImV4cCI6MjA3MTM4MjExMn0.hWT1kGHyZlMt079Uj8vW1v0kEKRnwrwTkOpd793eIdk';

// Debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key length:', supabaseAnonKey?.length);
}

// Validate URL format
if (!supabaseUrl || typeof supabaseUrl !== 'string' || !supabaseUrl.startsWith('http')) {
  throw new Error(`Invalid Supabase URL: "${supabaseUrl}". Please check your NEXT_PUBLIC_SUPABASE_URL environment variable.`);
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.length < 10) {
  throw new Error(`Invalid Supabase anon key: "${supabaseAnonKey?.substring(0, 10)}...". Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.`);
}

// Create Supabase client with error handling
let supabase: ReturnType<typeof createClient>;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false // Since this is a public reservation system
    }
  });
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  throw new Error(`Failed to initialize Supabase client: ${errorMessage}. URL: "${supabaseUrl}"`);
}

export { supabase };

// Re-export types from the centralized types file
export type { Reservation, ReservationStatus, CreateReservationData } from '@/types';



