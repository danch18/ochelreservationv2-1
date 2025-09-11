'use client';

import { useState, useCallback } from 'react';
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
  // Filter state for reservation table (independent from stats filter)
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });
  
  // Stats filter state - controls time range for top statistics cards
  const [statsFilter, setStatsFilter] = useState<'today' | 'next7days' | 'all'>('today');

  // Export state for professional UX
  const [isExporting, setIsExporting] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  /**
   * Filters reservations based on selected stats time range
   * @returns Filtered array of reservations for statistics calculation
   */
  const getStatsReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysStr = next7Days.toISOString().split('T')[0];

    switch (statsFilter) {
      case 'today':
        // Only today's reservations
        return reservations.filter(r => r.reservation_date === today);
      case 'next7days':
        // Reservations from today to next 7 days
        return reservations.filter(r => r.reservation_date >= today && r.reservation_date <= next7DaysStr);
      case 'all':
      default:
        // All reservations without date filtering
        return reservations;
    }
  };

  // Get reservations for stats calculation based on selected time range
  const statsReservations = getStatsReservations();

  /**
   * Calculate statistics from filtered reservations
   * Includes all reservation statuses: confirmed, pending, cancelled, completed
   */
  const stats = {
    total: statsReservations.length,
    confirmed: statsReservations.filter(r => r.status === 'confirmed').length,
    cancelled: statsReservations.filter(r => r.status === 'cancelled').length,
    completed: statsReservations.filter(r => r.status === 'completed').length,
    pending: statsReservations.filter(r => r.status === 'pending').length,
  };

  /**
   * Calculate total expected guests from confirmed reservations only
   * Only confirmed reservations count towards guest totals
   */
  const totalGuests = statsReservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, reservation) => sum + reservation.guests, 0);

  /**
   * Filter reservations for table display based on user-applied filters
   * This is separate from stats filtering and applies to the reservation table
   */
  const filteredReservations = reservations.filter(reservation => {
    // Check if reservation matches status filter
    const matchesStatus = !filters.status || reservation.status === filters.status;
    
    // Check if reservation matches date filter
    const matchesDate = !filters.date || reservation.reservation_date === filters.date;
    
    // Check if reservation matches search filter (name, email, or phone)
    const matchesSearch = !filters.search || 
      reservation.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      reservation.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      reservation.phone.includes(filters.search);
    
    return matchesStatus && matchesDate && matchesSearch;
  }).sort((a, b) => {
    // Sort by date first, then by time (chronological order)
    // Ensures reservations are always displayed in chronological order by default
    if (a.reservation_date !== b.reservation_date) {
      return a.reservation_date.localeCompare(b.reservation_date);
    }
    return a.reservation_time.localeCompare(b.reservation_time);
  });

  /**
   * Export reservations to CSV format with professional UX
   * Creates a CSV file with all reservation data and downloads it
   */
  const exportToCSV = useCallback(async () => {
    // Check if there are reservations to export
    if (reservations.length === 0) {
      showToast('Aucune réservation à exporter.', 'warning');
      return;
    }

    // Check if already exporting to prevent double clicks
    if (isExporting) {
      return;
    }

    try {
      setIsExporting(true);

      // Small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      // Define CSV headers
      const headers = [
        'ID',
        'Nom',
        'Email',
        'Téléphone',
        'Date de réservation',
        'Heure',
        'Nombre d\'invités',
        'Statut',
        'Demandes spéciales',
        'Confirmé automatiquement',
        'Date de création',
        'Dernière mise à jour'
      ];

      // Helper function to escape CSV values
      const escapeCSVValue = (value: string | null | undefined): string => {
        if (!value) return '""';
        // Escape quotes by doubling them and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      };

      // Convert reservations to CSV rows
      const csvRows = [
        headers.join(','), // Header row
        ...reservations.map(reservation => [
          reservation.id,
          escapeCSVValue(reservation.name),
          escapeCSVValue(reservation.email),
          escapeCSVValue(reservation.phone),
          reservation.reservation_date,
          reservation.reservation_time,
          reservation.guests,
          reservation.status,
          escapeCSVValue(reservation.special_requests),
          reservation.requires_confirmation ? 'Non' : 'Oui',
          new Date(reservation.created_at).toLocaleString('fr-FR'),
          new Date(reservation.updated_at).toLocaleString('fr-FR')
        ].join(','))
      ];

      // Create CSV content with BOM for proper Excel encoding
      const csvContent = '\uFEFF' + csvRows.join('\n');

      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reservations_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
        // Show success feedback
        showToast(`${reservations.length} réservations exportées avec succès!`, 'success');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      showToast('Erreur lors de l\'export. Veuillez réessayer.', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [reservations, isExporting]);

  /**
   * Show elegant toast notification instead of browser alert
   */
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[10000] px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ease-out translate-x-full opacity-0 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-yellow-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });
    
    // Animate out and remove
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Stats Time Range Filter Buttons - Controls statistics cards only */}
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-out ${
                statsFilter === option.key
                  ? 'bg-white text-[#F34A23] shadow-sm transform scale-[1.02]'  // Active state: white background with restaurant color text and subtle scale
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'   // Inactive state: gray text with hover effect
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards - Display stats based on selected time range */}
      <StatsCards stats={stats} totalGuests={totalGuests} />
      
      {/* Reservation Table Filters */}
      <AdminFilters 
        filters={filters}
        onFiltersChange={setFilters}
        reservations={reservations}
        onExportCSV={exportToCSV}
        isExporting={isExporting}
      />
      
      {/* Show filtered results summary when table filters are applied */}
      {(filters.status || filters.date || filters.search) && (
        <div className="bg-blue-50 border !border-blue-200 rounded-2xl p-4 transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in">
          <p className="text-sm text-blue-800">
            <strong className="transition-all duration-200">{filteredReservations.length}</strong> réservation{filteredReservations.length !== 1 ? 's' : ''} trouvée{filteredReservations.length !== 1 ? 's' : ''} sur {reservations.length} au total
          </p>
        </div>
      )}
      
      {/* Reservation Table - Shows filtered reservations based on table filters */}
      <ReservationTable 
        reservations={filteredReservations}
        isLoading={isLoading}
        onReservationsUpdate={onReservationsUpdate}
      />
    </div>
  );
}