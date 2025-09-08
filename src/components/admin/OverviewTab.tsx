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
  const [statsFilter, setStatsFilter] = useState<'today' | 'next7days' | 'all'>('today');

  // Get date ranges for stats filtering
  const getStatsReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysStr = next7Days.toISOString().split('T')[0];

    switch (statsFilter) {
      case 'today':
        return reservations.filter(r => r.reservation_date === today);
      case 'next7days':
        return reservations.filter(r => r.reservation_date >= today && r.reservation_date <= next7DaysStr);
      case 'all':
      default:
        return reservations;
    }
  };

  const statsReservations = getStatsReservations();

  // Calculate stats from filtered reservations
  const stats = {
    total: statsReservations.length,
    confirmed: statsReservations.filter(r => r.status === 'confirmed').length,
    cancelled: statsReservations.filter(r => r.status === 'cancelled').length,
    completed: statsReservations.filter(r => r.status === 'completed').length,
    pending: statsReservations.filter(r => r.status === 'pending').length,
  };

  // Calculate total guests
  const totalGuests = statsReservations
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
      {/* Stats Filter Buttons */}
      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'today' as const, label: "Aujourd'hui" },
            { key: 'next7days' as const, label: '7 prochains jours' },
            { key: 'all' as const, label: 'Tout' }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setStatsFilter(option.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statsFilter === option.key
                  ? 'bg-white text-[#F34A23] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

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