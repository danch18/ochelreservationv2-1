'use client';

import { StatsCards, AdminFilters, ReservationTable } from '@/components/admin';
import type { ReservationStats, FilterOptions } from '@/types';

interface OverviewTabProps {
  stats: ReservationStats;
  totalGuests: number;
  reservations: any[];
  filters: FilterOptions;
  loading: boolean;
  onFiltersChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
}

export function OverviewTab({
  stats,
  totalGuests,
  reservations,
  filters,
  loading,
  onFiltersChange,
  onRefresh
}: OverviewTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-card-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Monitor your restaurant's reservations and performance metrics.
        </p>
      </div>

      <StatsCards stats={stats} totalGuests={totalGuests} />

      <AdminFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        onRefresh={onRefresh}
        isLoading={loading}
      />

      <ReservationTable
        reservations={reservations}
        selectedDate={filters.date || ''}
        onReservationUpdate={onRefresh}
      />
    </div>
  );
}
