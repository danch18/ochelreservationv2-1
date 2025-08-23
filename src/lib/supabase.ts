import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhugrvpaizlzeemazuna.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodWdydnBhaXpsemVlbWF6dW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDYxMTIsImV4cCI6MjA3MTM4MjExMn0.hWT1kGHyZlMt079Uj8vW1v0kEKRnwrwTkOpd793eIdk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Since this is a public reservation system
  }
});

// Re-export types from the centralized types file
export type { Reservation, ReservationStatus, CreateReservationData } from '@/types';



