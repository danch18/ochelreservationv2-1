'use client';

import { useState, useEffect } from 'react';
import { Button, Input, LoadingSpinner } from '@/components/ui';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { reservationService } from '@/services';
import type { Reservation, ArrivalStatus } from '@/types';

interface ManageReservationTabProps {
  reservations: Reservation[];
  isLoading: boolean;
  onReservationsUpdate: () => void;
}

type DateFilterType = 'prev7days' | 'prev3days' | 'today';
type StatusFilterType = 'all' | 'arrived' | 'no_show' | 'unmarked';

export function ManageReservationTab({ reservations, isLoading, onReservationsUpdate }: ManageReservationTabProps) {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState<{ type: ArrivalStatus; reservation: Reservation } | null>(null);
  const [updating, setUpdating] = useState(false);

  /**
   * Get date string in YYYY-MM-DD format
   */
  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  /**
   * Get date range based on filter
   */
  const getFilteredDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: string;
    let endDate: string = getDateString(today);

    switch (dateFilter) {
      case 'today':
        startDate = endDate;
        break;
      case 'prev3days':
        const prev3Days = new Date(today);
        prev3Days.setDate(today.getDate() - 3);
        startDate = getDateString(prev3Days);
        break;
      case 'prev7days':
        const prev7Days = new Date(today);
        prev7Days.setDate(today.getDate() - 7);
        startDate = getDateString(prev7Days);
        break;
      default:
        startDate = endDate;
    }

    return { startDate, endDate };
  };

  /**
   * Filter reservations
   */
  const getFilteredReservations = () => {
    const { startDate, endDate } = getFilteredDateRange();

    return reservations.filter(reservation => {
      // Only show confirmed reservations
      if (reservation.status !== 'confirmed') return false;

      // Date filter
      if (reservation.reservation_date < startDate || reservation.reservation_date > endDate) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'arrived' && reservation.arrival_status !== 'arrived') return false;
        if (statusFilter === 'no_show' && reservation.arrival_status !== 'no_show') return false;
        if (statusFilter === 'unmarked' && reservation.arrival_status != null) return false;
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          reservation.name.toLowerCase().includes(search) ||
          reservation.email.toLowerCase().includes(search) ||
          reservation.phone.toLowerCase().includes(search)
        );
      }

      return true;
    }).sort((a, b) => {
      // Sort by date first (descending), then by time
      if (a.reservation_date !== b.reservation_date) {
        return b.reservation_date.localeCompare(a.reservation_date);
      }
      return a.reservation_time.localeCompare(b.reservation_time);
    });
  };

  const filteredReservations = getFilteredReservations();

  /**
   * Calculate stats
   */
  const stats = {
    arrived: filteredReservations.filter(r => r.arrival_status === 'arrived').length,
    noShow: filteredReservations.filter(r => r.arrival_status === 'no_show').length,
    unmarked: filteredReservations.filter(r => !r.arrival_status).length,
  };

  /**
   * Pagination
   */
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, statusFilter, searchTerm]);

  /**
   * Handle mark arrival status
   */
  const handleMarkStatus = (type: ArrivalStatus, reservation: Reservation) => {
    setModalAction({ type, reservation });
    setShowConfirmModal(true);
  };

  const confirmMarkStatus = async () => {
    if (!modalAction) return;

    const { type, reservation } = modalAction;

    try {
      setUpdating(true);

      // Update arrival_status in database
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('reservations')
        .update({
          arrival_status: type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reservation.id);

      if (error) throw error;

      await onReservationsUpdate();
      setShowConfirmModal(false);
      setModalAction(null);
    } catch (error) {
      console.error('Failed to update arrival status:', error);
      alert('Échec de la mise à jour du statut. Veuillez réessayer.');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-forum">
      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-2">Arrivés</h3>
          <p className="text-3xl font-bold text-green-600">{stats.arrived}</p>
          <p className="text-sm text-gray-600">clients présents</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-2">No-show</h3>
          <p className="text-3xl font-bold text-red-600">{stats.noShow}</p>
          <p className="text-sm text-gray-600">absences</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-2">Non marqués</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.unmarked}</p>
          <p className="text-sm text-gray-600">à traiter</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Date Filter Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'prev7days' as const, label: '7 jours précédents' },
              { key: 'prev3days' as const, label: '3 jours précédents' },
              { key: 'today' as const, label: "Aujourd'hui" },
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setDateFilter(option.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  dateFilter === option.key
                    ? 'bg-white text-[#F34A23] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Status Filter and Search */}
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F34A23]"
            >
              <option value="all">Tous</option>
              <option value="arrived">Client arrivé</option>
              <option value="no_show">No-show</option>
              <option value="unmarked">Non marqués</option>
            </select>

            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64"
            />
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-black">
            Réservations confirmées ({filteredReservations.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          {paginatedReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune réservation trouvée</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invités
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(reservation.reservation_date + 'T00:00:00').toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">
                          {reservation.reservation_time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-black">
                          {reservation.name}
                        </div>
                        {reservation.special_requests && (
                          <div className="text-xs text-gray-500 mt-1">
                            Note: {reservation.special_requests}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{reservation.email}</div>
                        <div className="text-sm text-gray-700">{reservation.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {reservation.guests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reservation.arrival_status === 'arrived' ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Client arrivé
                          </span>
                        ) : reservation.arrival_status === 'no_show' ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            No-show
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Non marqué
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        {!reservation.arrival_status ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleMarkStatus('arrived', reservation)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Client arrivé
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkStatus('no_show', reservation)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              No-show
                            </Button>
                          </>
                        ) : (
                          <span className="text-gray-500 text-xs">
                            {reservation.arrival_status === 'arrived' ? 'Marqué comme arrivé' : 'Marqué comme absent'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Affichage de {startIndex + 1} à {Math.min(endIndex, filteredReservations.length)} sur {filteredReservations.length} réservations
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === page
                              ? 'bg-[#F34A23] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && modalAction && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setModalAction(null);
          }}
          onConfirm={confirmMarkStatus}
          title={modalAction.type === 'arrived' ? 'Confirmer l\'arrivée' : 'Confirmer l\'absence'}
          message={
            modalAction.type === 'arrived'
              ? `Voulez-vous marquer cette réservation comme "Client arrivé" ?\n\nClient: ${modalAction.reservation.name}\nDate: ${new Date(modalAction.reservation.reservation_date + 'T00:00:00').toLocaleDateString('fr-FR')}\nHeure: ${modalAction.reservation.reservation_time}`
              : `Voulez-vous marquer cette réservation comme "No-show" ?\n\nClient: ${modalAction.reservation.name}\nDate: ${new Date(modalAction.reservation.reservation_date + 'T00:00:00').toLocaleDateString('fr-FR')}\nHeure: ${modalAction.reservation.reservation_time}`
          }
          confirmText="Confirmer"
          cancelText="Annuler"
          isLoading={updating}
        />
      )}
    </div>
  );
}
