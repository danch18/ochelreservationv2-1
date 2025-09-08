import { supabase } from '@/lib/supabase';
import { API_ERRORS, ENV_CONFIG } from '@/lib/constants';
import { emailService } from './emailService';
import type { 
  Reservation, 
  CreateReservationData, 
  ReservationStatus
} from '@/types';

class ReservationServiceClass {
  private tableName = 'reservations';

  // Error handling wrapper
  private handleError(error: unknown, context: string): never {
    // Enhanced logging for development
    if (ENV_CONFIG.isDevelopment) {
      console.error(`${context}:`, error);
      
      // Log additional error details to help with debugging
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: (error as Record<string, unknown>).message,
          code: (error as Record<string, unknown>).code,
          details: (error as Record<string, unknown>).details,
          hint: (error as Record<string, unknown>).hint,
          stack: (error as Record<string, unknown>).stack
        });
      }
    }
    
    // Map specific Supabase errors to user-friendly messages
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;
      
      // Supabase specific error codes
      if (err.code === 'PGRST116') {
        throw new Error(API_ERRORS.NOT_FOUND);
      }
      
      if (err.code === '23505') {
        throw new Error('A reservation with these details already exists.');
      }
      
      if (err.code === '23503') {
        throw new Error('Invalid data provided for reservation.');
      }
      
      // Network-related errors
      if (err.message && typeof err.message === 'string') {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          throw new Error(API_ERRORS.NETWORK);
        }
        
        if (err.message.includes('timeout')) {
          throw new Error('Request timed out. Please try again.');
        }
      }
      
      // Return the actual error message if it's user-friendly
      if (err.message && typeof err.message === 'string' && err.message.length < 200) {
        throw new Error(err.message);
      }
    }
    
    // Fallback to generic error
    throw new Error(API_ERRORS.GENERIC);
  }

  /**
   * Get the current guest limit setting for automatic confirmation
   * This determines when reservations require manual admin approval
   * @returns The maximum number of guests for automatic confirmation (default: 4)
   */
  async getGuestLimit(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('setting_value')
        .eq('setting_key', 'auto_confirm_guest_limit')
        .single();

      // Ignore "no rows" error (PGRST116) - means setting doesn't exist yet
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading guest limit:', error);
        return 4; // Default fallback
      }

      return data ? parseInt(data.setting_value) || 4 : 4;
    } catch (err) {
      console.error('Error loading guest limit:', err);
      return 4; // Default fallback
    }
  }

  /**
   * Create a new reservation with automatic confirmation logic
   * Small groups (≤ guest limit) are auto-confirmed, large groups require admin approval
   */
  async createReservation(reservation: CreateReservationData): Promise<Reservation> {
    try {
      // Get the current guest limit setting from database
      const guestLimit = await this.getGuestLimit();
      const guestCount = parseInt(reservation.guests.toString()) || 1;
      
      // Determine if this reservation requires admin confirmation based on party size
      const requiresConfirmation = guestCount > guestLimit;
      const initialStatus = requiresConfirmation ? 'pending' : 'confirmed';

      // Insert reservation with appropriate status and confirmation flag
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([{
          ...reservation,
          status: initialStatus,
          requires_confirmation: requiresConfirmation
        }])
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Error creating reservation');
      }

      // Send confirmation email only if reservation is automatically confirmed
      // Large groups will receive email after admin approval
      if (!requiresConfirmation) {
        try {
          await emailService.sendReservationConfirmation(data);
        } catch (emailError) {
          // Log email error but don't fail the reservation
          if (ENV_CONFIG.isDevelopment) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Error creating reservation');
    }
  }

  // Get all reservations
  async getAllReservations(): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      if (error) {
        this.handleError(error, 'Error fetching all reservations');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Error fetching all reservations');
    }
  }

  // Get reservations by email (for customer lookup)
  async getReservationsByEmail(email: string): Promise<Reservation[]> {
    try {
      if (!email?.trim()) {
        throw new Error('Email is required');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      if (error) {
        this.handleError(error, 'Error fetching reservations by email');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Error fetching reservations by email');
    }
  }

  // Update reservation status
  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    try {
      if (!id?.trim()) {
        throw new Error('Reservation ID is required');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Error updating reservation status');
      }

      // Send appropriate emails based on status change
      if (status === 'cancelled') {
        // Send cancellation email for all cancelled reservations
        try {
          await emailService.sendReservationCancellation(data);
        } catch (emailError) {
          if (ENV_CONFIG.isDevelopment) {
            console.error('Failed to send cancellation email:', emailError);
          }
        }
      } else if (status === 'confirmed' && data.requires_confirmation) {
        // Send confirmation email when admin confirms a pending reservation
        // This is for large groups that required manual approval
        try {
          await emailService.sendReservationConfirmation(data);
        } catch (emailError) {
          if (ENV_CONFIG.isDevelopment) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Error updating reservation status');
    }
  }

  // Cancel a reservation
  async cancelReservation(id: string): Promise<Reservation> {
    return this.updateReservationStatus(id, 'cancelled');
  }

  // Complete a reservation
  async completeReservation(id: string): Promise<Reservation> {
    return this.updateReservationStatus(id, 'completed');
  }

  // Get reservations for a specific date
  async getReservationsByDate(date: string): Promise<Reservation[]> {
    try {
      if (!date?.trim()) {
        throw new Error('Date is required');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('reservation_date', date)
        .order('reservation_time', { ascending: true });

      if (error) {
        this.handleError(error, 'Error fetching reservations by date');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Error fetching reservations by date');
    }
  }

  // Get reservation by ID
  async getReservationById(id: string): Promise<Reservation | null> {
    try {
      if (!id?.trim()) {
        throw new Error('Reservation ID is required');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        this.handleError(error, 'Error fetching reservation by ID');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Error fetching reservation by ID');
    }
  }

  // Delete a reservation (hard delete - use with caution)
  async deleteReservation(id: string): Promise<void> {
    try {
      if (!id?.trim()) {
        throw new Error('Reservation ID is required');
      }

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        this.handleError(error, 'Error deleting reservation');
      }
    } catch (error) {
      this.handleError(error, 'Error deleting reservation');
    }
  }

  // Get reservation statistics
  async getReservationStats(date?: string): Promise<{
    total: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  }> {
    try {
      let query = supabase.from(this.tableName).select('status');
      
      if (date) {
        query = query.eq('reservation_date', date);
      }

      const { data, error } = await query;

      if (error) {
        this.handleError(error, 'Error fetching reservation stats');
      }

      const stats = {
        total: data?.length || 0,
        confirmed: data?.filter(r => (r.status || 'confirmed') === 'confirmed').length || 0,
        cancelled: data?.filter(r => r.status === 'cancelled').length || 0,
        completed: data?.filter(r => r.status === 'completed').length || 0
      };

      return stats;
    } catch (error) {
      this.handleError(error, 'Error fetching reservation stats');
    }
  }

  // Get available time slots for a date
  async getAvailableTimeSlots(date: string): Promise<string[]> {
    try {
      const defaultSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
        '21:00', '21:30'
      ];

      // Get existing reservations for this date
      const existingReservations = await this.getReservationsByDate(date);
      const bookedSlots = existingReservations.map(r => r.reservation_time);

      // Filter out booked slots
      return defaultSlots.filter(slot => !bookedSlots.includes(slot));
    } catch (error) {
      this.handleError(error, 'Error fetching available time slots');
    }
  }

  // Check if a specific time slot is available
  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id')
        .eq('reservation_date', date)
        .eq('reservation_time', time)
        .neq('status', 'cancelled'); // Don't count cancelled reservations

      if (error) {
        this.handleError(error, 'Error checking time slot availability');
      }

      return data?.length === 0;
    } catch (error) {
      this.handleError(error, 'Error checking time slot availability');
    }
  }
}

// Export singleton instance
export const reservationService = new ReservationServiceClass();