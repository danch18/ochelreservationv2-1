// Core types for the restaurant reservation system

export interface Reservation {
  id?: string;
  name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  special_requests?: string | null;
  status?: ReservationStatus;
  created_at?: string;
  updated_at?: string;
}

export type ReservationStatus = 'confirmed' | 'cancelled' | 'completed';

export type CreateReservationData = Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'status'>;

export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  specialRequests: string;
}

export interface ReservationStats {
  total: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface FilterOptions {
  date?: string;
  status?: string;
  searchTerm?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface SuccessResponse<T> extends ApiResponse<T> {
  data: T;
  success: true;
}

export interface ErrorResponse extends ApiResponse<never> {
  error: string;
  success: false;
}

// Common utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}