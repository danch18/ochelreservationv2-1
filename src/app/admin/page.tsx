'use client';

import { useState } from 'react';
import { useReservations } from '@/hooks';
import { PageLayout } from '@/components/layout';
import { AdminTabs, AdminHeader, OverviewTab, SettingsTab } from '@/components/admin';
import { ProtectedRoute } from '@/components/auth';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { reservations, loading, error, refetch } = useReservations();

  if (error) {
    return (
      <ProtectedRoute>
        <PageLayout showHeader={false} showFooter={false}>
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Admin Panel</h1>
              <p className="text-muted-foreground">{error}</p>
              <button 
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout showHeader={false} showFooter={false}>
        <div className="min-h-screen bg-black">
          <AdminHeader />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="mt-8">
              {activeTab === 'overview' && (
                <OverviewTab 
                  reservations={reservations}
                  isLoading={loading}
                  onReservationsUpdate={refetch}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsTab />
              )}
              
              {/* Add other tab content here as needed */}
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}