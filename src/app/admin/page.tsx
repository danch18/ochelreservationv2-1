'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoadingSpinner, Alert } from '@/components/ui';
import { AdminHeader, StatsCards, AdminFilters, ReservationTable } from '@/components/admin';
import { useAdminDashboard } from '@/hooks';

export default function AdminPage() {
  const {
    reservations,
    stats,
    totalGuests,
    filters,
    loading,
    error,
    onFiltersChange,
    refetch
  } = useAdminDashboard();

  if (loading && reservations.length === 0) {
    return <PageLoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <AdminHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert 
              variant="destructive" 
              className="mb-6"
              onClose={() => window.location.reload()}
            >
              {error}
            </Alert>
          )}

          <StatsCards stats={stats} totalGuests={totalGuests} />

          <AdminFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            onRefresh={refetch}
            isLoading={loading}
          />

          <ReservationTable
            reservations={reservations}
            selectedDate={filters.date || ''}
            onReservationUpdate={refetch}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

