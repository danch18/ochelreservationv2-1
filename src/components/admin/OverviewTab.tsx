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

  // Calculate stats from reservations
  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    completed: reservations.filter(r => r.status === 'completed').length,
  };

  // Calculate total guests
  const totalGuests = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, reservation) => sum + reservation.guests, 0);

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
      <StatsCards stats={stats} totalGuests={totalGuests} />
      
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