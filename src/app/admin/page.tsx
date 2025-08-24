'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoadingSpinner, Alert } from '@/components/ui';
import { AdminHeader, AdminTabs, TabPanel, OverviewTab, SettingsTab } from '@/components/admin';
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
      <div className="min-h-screen bg-gradient-to-br from-[#021b09] to-black text-popover-foreground">
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

          <AdminTabs defaultTab="overview">
            <TabPanel id="overview">
              <OverviewTab
                stats={stats}
                totalGuests={totalGuests}
                reservations={reservations}
                filters={filters}
                loading={loading}
                onFiltersChange={onFiltersChange}
                onRefresh={refetch}
              />
            </TabPanel>
            
            <TabPanel id="settings">
              <SettingsTab />
            </TabPanel>
          </AdminTabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}

