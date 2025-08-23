import { supabase } from '@/lib/supabase';
import { API_ERRORS, ENV_CONFIG } from '@/lib/constants';
import type { 
  Reservation, 
  CreateReservationData, 
  ReservationStatus
} from '@/types';

class ReservationServiceClass {
  private tableName = 'reservations';

  // Error handling wrapper
  private handleError(error: unknown, context: string): never {
    if (ENV_CONFIG.isDevelopment) {
      console.error(`${context}:`, error);
    }
    
    // Map specific errors to user-friendly messages
    if (error && typeof error === 'object' && 'code' in error && error.code === 'PGRST116') {
      throw new Error(API_ERRORS.NOT_FOUND);
    }
    
    if (error && typeof error === 'object' && 'message' in error && 
        typeof error.message === 'string' && error.message.includes('network')) {
      throw new Error(API_ERRORS.NETWORK);
    }
    
    const message = error && typeof error === 'object' && 'message' in error && 
                    typeof error.message === 'string' ? error.message : API_ERRORS.GENERIC;
    throw new Error(message);
  }

  // Create a new reservation
  async createReservation(reservation: CreateReservationData): Promise<Reservation> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([{
          ...reservation,
          status: 'confirmed' // Default status
        }])
        .select()
        .single();

      if (error) {
        this.handleError(error, 'Error creating reservation');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Error creating reservation');
    }
  }

  // Get all reservations (for admin view)
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
}

// Export singleton instance
export const reservationService = new ReservationServiceClass();