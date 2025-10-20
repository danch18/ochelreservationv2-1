'use client';

import { useState, useCallback } from 'react';
import { ReservationTable } from './ReservationTable';
import { StatsCards } from './StatsCards';
import { AdminFilters } from './AdminFilters';
import { reservationService } from '@/services/reservationService';
import { useTranslation } from '@/contexts/LanguageContext';
import type { Reservation } from '@/types';

interface OverviewTabProps {
  reservations: Reservation[];
  isLoading: boolean;
  onReservationsUpdate: () => void;
}

export function OverviewTab({ reservations, isLoading, onReservationsUpdate }: OverviewTabProps) {
  const { t } = useTranslation();
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

  // Bulk delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [deleteResult, setDeleteResult] = useState({ count: 0, email: '' });
  const [errorMessage, setErrorMessage] = useState('');

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
      showToast(t('admin.overview.export.noReservations'), 'warning');
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
        t('admin.overview.export.csvHeaders.id'),
        t('admin.overview.export.csvHeaders.name'),
        t('admin.overview.export.csvHeaders.email'),
        t('admin.overview.export.csvHeaders.phone'),
        t('admin.overview.export.csvHeaders.date'),
        t('admin.overview.export.csvHeaders.time'),
        t('admin.overview.export.csvHeaders.guests'),
        t('admin.overview.export.csvHeaders.status'),
        t('admin.overview.export.csvHeaders.requests'),
        t('admin.overview.export.csvHeaders.autoConfirmed'),
        t('admin.overview.export.csvHeaders.created'),
        t('admin.overview.export.csvHeaders.updated')
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
          reservation.created_at ? new Date(reservation.created_at).toLocaleString('fr-FR') : '',
          reservation.updated_at ? new Date(reservation.updated_at).toLocaleString('fr-FR') : ''
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
        showToast(`${reservations.length} ${t('admin.overview.export.success')}`, 'success');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      showToast(t('admin.overview.export.error'), 'error');
    } finally {
      setIsExporting(false);
    }
  }, [reservations, isExporting, t]);

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle email input change with validation
   */
  const handleEmailChange = (email: string) => {
    setDeleteEmail(email);
    if (email && !validateEmail(email)) {
      setEmailError(t('admin.overview.deleteModal.invalidEmail'));
    } else {
      setEmailError('');
    }
  };

  /**
   * Delete all reservations for a specific email
   */
  const deleteReservationsByEmail = useCallback(async (email: string) => {
    try {
      setIsDeleting(true);
      setShowConfirmModal(false);

      // Small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const deletedCount = await reservationService.deleteReservationsByEmail(email);

      if (deletedCount === 0) {
        setErrorMessage(`${t('admin.overview.toast.noReservationsFound')} ${email}`);
        setShowErrorModal(true);
      } else {
        setDeleteResult({ count: deletedCount, email });
        setShowSuccessModal(true);
        // Refresh the reservations list
        onReservationsUpdate();
      }

      // Close input modal and reset form
      setShowDeleteModal(false);
      setDeleteEmail('');
      setEmailError('');

    } catch (error) {
      console.error('Error deleting reservations:', error);
      setErrorMessage(t('admin.overview.toast.deleteError'));
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
    }
  }, [onReservationsUpdate, t]);

  /**
   * Handle bulk delete button click
   */
  const handleBulkDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteEmail('');
    setEmailError('');
  };

  /**
   * Handle proceeding to confirmation modal
   */
  const handleProceedToConfirm = () => {
    if (!deleteEmail.trim()) {
      setEmailError(t('admin.overview.deleteModal.emailRequired'));
      return;
    }

    if (!validateEmail(deleteEmail)) {
      setEmailError(t('admin.overview.deleteModal.invalidEmail'));
      return;
    }

    // Find how many reservations exist for this email
    const reservationsCount = reservations.filter(r => r.email === deleteEmail).length;

    if (reservationsCount === 0) {
      setErrorMessage(`${t('admin.overview.toast.noReservationsFound')} ${deleteEmail}`);
      setShowDeleteModal(false);
      setShowErrorModal(true);
      setDeleteEmail('');
      setEmailError('');
      return;
    }

    setShowDeleteModal(false);
    setShowConfirmModal(true);
  };

  /**
   * Handle bulk delete confirmation
   */
  const handleBulkDeleteConfirm = () => {
    deleteReservationsByEmail(deleteEmail);
  };

  /**
   * Close all modals and reset state
   */
  const closeAllModals = () => {
    setShowDeleteModal(false);
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setDeleteEmail('');
    setEmailError('');
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
              {t('admin.overview.bulkDeleting')}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t('admin.overview.bulkDelete')}
            </>
          )}
        </button>

        {/* Stats Filter Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'today' as const, label: t('admin.overview.today') },
            { key: 'next7days' as const, label: t('admin.overview.next7days') },
            { key: 'all' as const, label: t('admin.overview.all') }
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
            <strong className="transition-all duration-200">{filteredReservations.length}</strong> {t('admin.overview.resultsFound')} {reservations.length} {t('admin.overview.resultsTotal')}
          </p>
        </div>
      )}

      {/* Reservation Table - Shows filtered reservations based on table filters */}
      <ReservationTable
        reservations={filteredReservations}
        isLoading={isLoading}
        onReservationsUpdate={onReservationsUpdate}
      />

      {/* Email Input Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('admin.overview.deleteModal.title')}</h3>
            </div>

            <p className="text-gray-600 mb-4">
              {t('admin.overview.deleteModal.description')}
            </p>

            <div className="mb-6">
              <label htmlFor="delete-email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.overview.deleteModal.emailLabel')}
              </label>
              <input
                id="delete-email"
                type="email"
                value={deleteEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={t('admin.overview.deleteModal.emailPlaceholder')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 bg-white ${
                  emailError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
                autoFocus
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200"
              >
                {t('admin.overview.deleteModal.cancel')}
              </button>
              <button
                onClick={handleProceedToConfirm}
                disabled={!deleteEmail.trim() || !!emailError}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-medium transition-all duration-200"
              >
                {t('admin.overview.deleteModal.proceed')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('admin.overview.confirmModal.title')}</h3>
            </div>

            <p className="text-gray-600 mb-4">
              {t('admin.overview.confirmModal.description')} <strong className="text-gray-900">{deleteEmail}</strong>?
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                {t('admin.overview.confirmModal.warning')}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowDeleteModal(true);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg font-medium transition-all duration-200"
              >
                {t('admin.overview.confirmModal.back')}
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('admin.overview.confirmModal.deleting')}
                  </>
                ) : (
                  t('admin.overview.confirmModal.confirm')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('admin.overview.successModal.title')}</h3>
            </div>

            <p className="text-gray-600 mb-6">
              {t('admin.overview.successModal.description')} <strong className="text-gray-900">{deleteResult.count}</strong> {t('admin.overview.successModal.reservations')} <strong className="text-gray-900">{deleteResult.email}</strong>.
            </p>

            <div className="flex justify-end">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200"
              >
                {t('admin.overview.successModal.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('admin.overview.errorModal.title')}</h3>
            </div>

            <p className="text-gray-600 mb-6">
              {errorMessage}
            </p>

            <div className="flex justify-end">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
              >
                {t('admin.overview.errorModal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
