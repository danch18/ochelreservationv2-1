import { supabase } from '@/lib/supabase';

export interface ClosedDate {
  id?: string;
  date: string;
  reason?: string;
  created_at?: string;
  updated_at?: string;
}

class DateAvailabilityService {
  // Check if a specific date is available for reservations
  async isDateAvailable(date: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('closed_dates')
        .select('date')
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking date availability:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return true; // Default to available on error
      }

      // If data exists, the date is closed
      return !data;
    } catch (error) {
      console.error('Error checking date availability:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return true; // Default to available on error
    }
  }

  // Get all closed dates
  async getClosedDates(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('closed_dates')
        .select('date')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching closed dates:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        // Return empty array if table doesn't exist or has permission issues
        return [];
      }

      return data?.map((item: { date: string }) => item.date) || [];
    } catch (error) {
      console.error('Error fetching closed dates:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return [];
    }
  }

  // Mark a date as closed or open
  async setDateClosed(date: string, isClosed: boolean, reason?: string): Promise<void> {
    try {
      if (isClosed) {
        // Add the date to closed dates
        const { error } = await supabase
          .from('closed_dates')
          .insert([{
            date,
            reason: reason || 'Restaurant closed'
          }]);

        if (error) {
          throw new Error(`Failed to mark date as closed: ${error.message}`);
        }
      } else {
        // Remove the date from closed dates
        const { error } = await supabase
          .from('closed_dates')
          .delete()
          .eq('date', date);

        if (error) {
          throw new Error(`Failed to reopen date: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error setting date availability:', error);
      throw error;
    }
  }

  // Get closed dates within a date range
  async getClosedDatesInRange(startDate: string, endDate: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('closed_dates')
        .select('date')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching closed dates in range:', error);
        return [];
      }

      return data?.map(item => item.date) || [];
    } catch (error) {
      console.error('Error fetching closed dates in range:', error);
      return [];
    }
  }

  // Bulk set multiple dates as closed
  async setMultipleDatesClosed(dates: string[], reason?: string): Promise<void> {
    try {
      const closedDatesData = dates.map(date => ({
        date,
        reason: reason || 'Restaurant closed'
      }));

      const { error } = await supabase
        .from('closed_dates')
        .insert(closedDatesData);

      if (error) {
        throw new Error(`Failed to mark dates as closed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error setting multiple dates as closed:', error);
      throw error;
    }
  }
}

export const dateAvailabilityService = new DateAvailabilityService();






