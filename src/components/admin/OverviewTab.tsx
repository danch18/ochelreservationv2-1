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
      
      {/* Show filtered results summary */}
      {(filters.status || filters.date || filters.search) && (
        <div className="bg-blue-50 border !border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-800">
            <strong>{filteredReservations.length}</strong> réservation{filteredReservations.length !== 1 ? 's' : ''} trouvée{filteredReservations.length !== 1 ? 's' : ''} sur {reservations.length} au total
          </p>
        </div>
      )}
      
      <ReservationTable 
        reservations={filteredReservations}
        isLoading={isLoading}
        onReservationsUpdate={onReservationsUpdate}
      />
    </div>
  );
}