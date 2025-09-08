export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      closed_dates: {
        Row: {
          id: string
          date: string
          is_closed: boolean
          reason: string | null
          opening_time: string
          closing_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          is_closed?: boolean
          reason?: string | null
          opening_time?: string
          closing_time?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          is_closed?: boolean
          reason?: string | null
          opening_time?: string
          closing_time?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          reservation_date: string
          reservation_time: string
          guests: number
          special_requests: string | null
          status: 'confirmed' | 'cancelled' | 'completed' | 'pending'
          requires_confirmation: boolean
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          reservation_date: string
          reservation_time: string
          guests: number
          special_requests?: string | null
          status?: 'confirmed' | 'cancelled' | 'completed' | 'pending'
          requires_confirmation?: boolean
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          reservation_date?: string
          reservation_time?: string
          guests?: number
          special_requests?: string | null
          status?: 'confirmed' | 'cancelled' | 'completed' | 'pending'
          requires_confirmation?: boolean
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
