'use client';

import { useState } from 'react';
import { ReservationTable } from './ReservationTable';
import { StatsCards } from './StatsCards';
import { AdminFilters } from './AdminFilters';
import type { Reservation } from '@/types';

interface OverviewTabProps {
  reservations: Reservation[];
  isLoading: boolean;
  onReservationsUpdate: () => void;
}

export function OverviewTab({ reservations, isLoading, onReservationsUpdate }: OverviewTabProps) {
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });

  // Filter reservations based on current filters
  const filteredReservations = reservations.filter(reservation => {
    const matchesStatus = !filters.status || reservation.status === filters.status;
    const matchesDate = !filters.date || reservation.reservation_date === filters.date;
    const matchesSearch = !filters.search || 
      reservation.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      reservation.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      reservation.phone.includes(filters.search);
    
    return matchesStatus && matchesDate && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <StatsCards reservations={reservations} />
      
      <AdminFilters 
        filters={filters}
        onFiltersChange={setFilters}
        reservations={reservations}
      />
      
      <ReservationTable 
        reservations={filteredReservations}
        isLoading={isLoading}
        onReservationsUpdate={onReservationsUpdate}
      />
    </div>
  );
}