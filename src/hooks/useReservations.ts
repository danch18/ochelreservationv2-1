import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '@/services';
import { getErrorMessage, getTodayDate, getTomorrowDate, getDateRange } from '@/lib/utils';
import type { Reservation, AsyncState, FilterOptions } from '@/types';

export function useReservations() {
  const [state, setState] = useState<AsyncState<Reservation[]>>({
    data: null,
    loading: false,
    error: null
  });

  const loadReservations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await reservationService.getAllReservations();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    reservations: state.data || [],
    loading: state.loading,
    error: state.error,
    refetch: loadReservations
  };
}

export function useReservationsByEmail(email: string) {
  const [state, setState] = useState<AsyncState<Reservation[]>>({
    data: null,
    loading: false,
    error: null
  });

  const loadReservations = useCallback(async () => {
    if (!email) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await reservationService.getReservationsByEmail(email);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, [email]);

  return {
    reservations: state.data || [],
    loading: state.loading,
    error: state.error,
    refetch: loadReservations
  };
}

export function useFilteredReservations(reservations: Reservation[], filters: FilterOptions) {
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    let filtered = [...reservations];

    // Filter by date
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      switch (filters.dateFilter) {
        case 'today':
          filtered = filtered.filter(r => r.reservation_date === getTodayDate());
          break;
        case 'tomorrow':
          filtered = filtered.filter(r => r.reservation_date === getTomorrowDate());
          break;
        case 'next7days':
          const next7Days = getDateRange(7);
          filtered = filtered.filter(r => 
            r.reservation_date >= next7Days.start && r.reservation_date <= next7Days.end
          );
          break;
        case 'next30days':
          const next30Days = getDateRange(30);
          filtered = filtered.filter(r => 
            r.reservation_date >= next30Days.start && r.reservation_date <= next30Days.end
          );
          break;
        case 'custom':
          if (filters.date) {
            filtered = filtered.filter(r => r.reservation_date === filters.date);
          }
          break;
      }
    } else if (filters.date) {
      filtered = filtered.filter(r => r.reservation_date === filters.date);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(r => (r.status || 'confirmed') === filters.status);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.phone.includes(term)
      );
    }

    setFilteredReservations(filtered);
  }, [reservations, filters]);

  return filteredReservations;
}