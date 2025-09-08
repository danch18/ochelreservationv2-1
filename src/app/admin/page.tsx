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
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Admin Panel</h1>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => refetch()}
                className="mt-4 px-6 py-3 bg-[#F34A23] text-white rounded-2xl hover:bg-[#F34A23]/90 transition-all duration-200 font-medium"
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
        <div className="min-h-screen bg-white">
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
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}