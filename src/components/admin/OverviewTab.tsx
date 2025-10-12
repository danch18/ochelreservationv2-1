'use client';

import { useState, useCallback } from 'react';
import { ReservationTable } from './ReservationTable';
import { StatsCards } from './StatsCards';
import { AdminFilters } from './AdminFilters';
import { reservationService } from '@/services/reservationService';
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

  // Bulk delete state
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');

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
   * Delete all reservations for a specific email
   */
  const deleteReservationsByEmail = useCallback(async (email: string) => {
    if (!email?.trim()) {
      showToast('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    try {
      setIsDeleting(true);
      
      // Small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const deletedCount = await reservationService.deleteReservationsByEmail(email);
      
      if (deletedCount === 0) {
        showToast(`Aucune réservation trouvée pour l'email: ${email}`, 'warning');
      } else {
        showToast(`${deletedCount} réservation${deletedCount > 1 ? 's' : ''} supprimée${deletedCount > 1 ? 's' : ''} pour ${email}`, 'success');
        // Refresh the reservations list
        onReservationsUpdate();
      }
      
      // Close modal and reset form
      setShowDeleteModal(false);
      setDeleteEmail('');
      
    } catch (error) {
      console.error('Error deleting reservations:', error);
      showToast('Erreur lors de la suppression. Veuillez réessayer.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }, [onReservationsUpdate]);

  /**
   * Handle bulk delete button click
   */
  const handleBulkDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteEmail('');
  };

  /**
   * Handle bulk delete confirmation
   */
  const handleBulkDeleteConfirm = () => {
    deleteReservationsByEmail(deleteEmail);
  };

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
    <div className="space-y-6 font-forum">
      {/* Stats Time Range Filter Buttons - Controls statistics cards only */}
      <div className="flex justify-between items-center mb-4">
        {/* Bulk Delete Button */}
        <button
          onClick={handleBulkDeleteClick}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-all duration-200 ease-out flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Suppression...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer par email
            </>
          )}
        </button>

        {/* Stats Filter Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'today' as const, label: "Aujourd'hui" },
            { key: 'next7days' as const, label: '7 prochains jours' },
            { key: 'all' as const, label: 'Tout' }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setStatsFilter(option.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-out cursor-pointer ${
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

      {/* Bulk Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Supprimer les réservations</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Cette action supprimera définitivement toutes les réservations associées à l'adresse email spécifiée. Cette action ne peut pas être annulée.
            </p>
            
            <div className="mb-6">
              <label htmlFor="delete-email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="delete-email"
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder="Entrez l'adresse email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteEmail('');
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg font-medium transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                disabled={isDeleting || !deleteEmail.trim()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}