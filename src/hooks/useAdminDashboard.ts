import { useState, useMemo } from 'react';
import { useReservations, useFilteredReservations } from './useReservations';
import { getTodayDate } from '@/lib/utils';
import type { FilterOptions, ReservationStats } from '@/types';

export function useAdminDashboard() {
  const [filters, setFilters] = useState<FilterOptions>({
    date: getTodayDate(),
    status: 'all',
    searchTerm: ''
  });

  const { reservations, loading, error, refetch } = useReservations();
  const filteredReservations = useFilteredReservations(reservations, filters);

  // Calculate statistics
  const stats: ReservationStats = useMemo(() => {
    const total = filteredReservations.length;
    const pending = filteredReservations.filter(r => r.status === 'pending').length;
    const confirmed = filteredReservations.filter(r => r.status === 'confirmed').length;
    const cancelled = filteredReservations.filter(r => r.status === 'cancelled').length;
    const completed = filteredReservations.filter(r => r.status === 'completed').length;

    return { total, pending, confirmed, cancelled, completed };
  }, [filteredReservations]);

  // Calculate total guests for confirmed reservations
  const totalGuests = useMemo(() => {
    return filteredReservations
      .filter(r => (r.status || 'confirmed') === 'confirmed')
      .reduce((total, r) => total + r.guests, 0);
  }, [filteredReservations]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return {
    reservations: filteredReservations,
    stats,
    totalGuests,
    filters,
    loading,
    error,
    onFiltersChange: handleFiltersChange,
    refetch
  };
}