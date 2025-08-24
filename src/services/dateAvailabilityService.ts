import { supabase } from '@/lib/supabase';
import { API_ERRORS, ENV_CONFIG } from '@/lib/constants';

export interface DateAvailability {
  id?: string;
  date: string; // YYYY-MM-DD format
  is_available: boolean;
  reason?: string;
  created_at?: string;
  updated_at?: string;
}

class DateAvailabilityServiceClass {
  private tableName = 'date_availability';

  // Error handling wrapper
  private handleError(error: unknown, context: string): never {
    if (ENV_CONFIG.isDevelopment) {
      console.error(`${context}:`, error);
    }
    
    const message = error && typeof error === 'object' && 'message' in error && 
                    typeof error.message === 'string' ? error.message : API_ERRORS.GENERIC;
    throw new Error(message);
  }

  // Check if a specific date is available
  async isDateAvailable(date: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('is_available')
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        this.handleError(error, 'Error checking date availability');
      }

      // If no record exists, default to available
      return data?.is_available ?? true;
    } catch (error) {
      // On error, default to available
      return true;
    }
  }

  // Get all date availability records
  async getAllDateAvailability(): Promise<DateAvailability[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        this.handleError(error, 'Error fetching date availability');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Error fetching date availability');
    }
  }

  // Set date availability
  async setDateAvailability(date: string, isAvailable: boolean, reason?: string): Promise<DateAvailability> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .upsert({
          date,
          is_available: isAvailable,
          reason: reason || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'date'
        })
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Error setting date availability');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Error setting date availability');
    }
  }

  // Delete date availability record (revert to default available)
  async deleteDateAvailability(date: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('date', date);

      if (error) {
        this.handleError(error, 'Error deleting date availability');
      }
    } catch (error) {
      this.handleError(error, 'Error deleting date availability');
    }
  }

  // Get date availability for a date range
  async getDateAvailabilityRange(startDate: string, endDate: string): Promise<DateAvailability[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        this.handleError(error, 'Error fetching date range availability');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Error fetching date range availability');
    }
  }

  // Bulk set multiple dates
  async bulkSetDateAvailability(dates: { date: string; is_available: boolean; reason?: string }[]): Promise<DateAvailability[]> {
    try {
      const records = dates.map(({ date, is_available, reason }) => ({
        date,
        is_available,
        reason: reason || null,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from(this.tableName)
        .upsert(records, {
          onConflict: 'date'
        })
        .select();

      if (error) {
        this.handleError(error, 'Error bulk setting date availability');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Error bulk setting date availability');
    }
  }
}

// Export singleton instance
export const dateAvailabilityService = new DateAvailabilityServiceClass();
