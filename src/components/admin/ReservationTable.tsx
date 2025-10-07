'use client';

import React, { useState } from 'react';
import { Button, Badge, LoadingSpinner } from '@/components/ui';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { formatDate } from '@/lib/utils';
import { reservationService } from '@/services';
import type { Reservation } from '@/types';

interface ReservationTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  onReservationsUpdate: () => void;
}

type SortField = 'created_at' | 'reservation_date' | 'guests';
type SortOrder = 'asc' | 'desc';

// Helper function to translate status to French
const translateStatus = (status: string | undefined) => {
  if (!status) return 'Confirmée';

  switch (status) {
    case 'confirmed':
      return 'Confirmée';
    case 'pending':
      return 'En attente';
    case 'cancelled':
      return 'Annulée';
    case 'completed':
      return 'Terminée';
    default:
      return status;
  }
};

export function ReservationTable({ reservations, isLoading, onReservationsUpdate }: ReservationTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reservationToConfirm, setReservationToConfirm] = useState<Reservation | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const itemsPerPage = 8;

  const handleCancelClick = (reservation: Reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!reservationToCancel?.id) return;

    const reservationId = reservationToCancel.id;
    setCancellingId(reservationId);
    setShowCancelModal(false);
    setReservationToCancel(null);

    try {
      await reservationService.updateReservationStatus(reservationId, 'cancelled');
      await onReservationsUpdate();
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      alert('Échec de l\'annulation de la réservation. Veuillez réessayer.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  const handleConfirmClick = (reservation: Reservation) => {
    setReservationToConfirm(reservation);
    setShowConfirmModal(true);
  };

  const handleConfirmConfirm = async () => {
    if (!reservationToConfirm?.id) return;

    const reservationId = reservationToConfirm.id;
    setConfirmingId(reservationId);
    setShowConfirmModal(false);
    setReservationToConfirm(null);

    try {
      await reservationService.updateReservationStatus(reservationId, 'confirmed');
      await onReservationsUpdate();
    } catch (error) {
      console.error('Failed to confirm reservation:', error);
      alert('Échec de la confirmation de la réservation. Veuillez réessayer.');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
    setReservationToConfirm(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Sort reservations
  const sortedReservations = React.useMemo(() => {
    const sorted = [...reservations].sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'created_at') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        compareValue = dateA - dateB;
      } else if (sortField === 'reservation_date') {
        const dateA = new Date(`${a.reservation_date} ${a.reservation_time}`).getTime();
        const dateB = new Date(`${b.reservation_date} ${b.reservation_time}`).getTime();
        compareValue = dateA - dateB;
      } else if (sortField === 'guests') {
        compareValue = a.guests - b.guests;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }, [reservations, sortField, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = sortedReservations.slice(startIndex, endIndex);

  // Reset to first page when reservations or sort changes
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [sortedReservations.length, currentPage, totalPages]);

  // Reset to first page when sort field or order changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortField, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucune réservation trouvée.</p>
      </div>
    );
  }

  return (
    <div className="font-forum">
      {/* Sort Controls */}
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="sort-field" className="text-sm font-medium text-gray-700">
          Trier par:
        </label>
        <select
          id="sort-field"
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="px-3 py-2 border border-[#F6F1F0] rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent"
        >
          <option value="created_at">Date de création</option>
          <option value="reservation_date">Date de réservation</option>
          <option value="guests">Nombre d&apos;invités</option>
        </select>

        <button
          onClick={toggleSortOrder}
          className="px-3 py-2 border border-[#F6F1F0] rounded-lg text-sm hover:bg-[#F34A23]/5 hover:border-[#F34A23] transition-colors flex items-center gap-2 cursor-pointer"
          title={sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
        >
          <span className="text-gray-700">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
          <span className="text-gray-600">
            {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
          </span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl !border !border-[#F6F1F0] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F34A23]/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date et heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Invités
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Demandes spéciales
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F1F0]">
              {paginatedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-[#F34A23]/5">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-black">
                        {reservation.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reservation.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reservation.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-black">
                      {formatDate(reservation.reservation_date)}
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {reservation.reservation_time}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {reservation.guests}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-fit">
                      <Badge variant={reservation.status === 'confirmed' ? 'success' : reservation.status === 'pending' ? 'warning' : 'destructive'}>
                        {translateStatus(reservation.status)}
                      </Badge>
                      {reservation.requires_confirmation && reservation.status === 'confirmed' && (
                        <span className="text-xs text-gray-500">Confirmée par admin</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-black max-w-xs truncate">
                      {reservation.special_requests || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {reservation.status === 'pending' && reservation.requires_confirmation && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleConfirmClick(reservation)}
                        loading={confirmingId === reservation.id}
                        disabled={confirmingId === reservation.id}
                      >
                        Confirmer
                      </Button>
                    )}
                    {reservation.status === 'confirmed' && !reservation.requires_confirmation && (
                      <span className="text-xs text-green-600 font-medium">Auto-Confirmée</span>
                    )}
                    {reservation.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelClick(reservation)}
                        loading={cancellingId === reservation.id}
                        disabled={cancellingId === reservation.id}
                        className="!border-red-600 !text-red-600 hover:!bg-red-50 hover:!border-red-700 hover:!text-red-700"
                      >
                        Annuler
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {paginatedReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white rounded-xl border border-[#F6F1F0] p-4 shadow-sm">
            {/* Header with name and status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-black mb-1">{reservation.name}</h3>
                <p className="text-sm text-gray-600">{reservation.email}</p>
                <p className="text-sm text-gray-600">{reservation.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={reservation.status === 'confirmed' ? 'success' : reservation.status === 'pending' ? 'warning' : 'destructive'}>
                  {translateStatus(reservation.status)}
                </Badge>
                {reservation.requires_confirmation && reservation.status === 'confirmed' && (
                  <span className="text-xs text-gray-500">Admin Confirmée</span>
                )}
                {reservation.status === 'confirmed' && !reservation.requires_confirmation && (
                  <span className="text-xs text-green-600 font-medium">Auto-Confirmée</span>
                )}
              </div>
            </div>

            {/* Date, Time and Guests */}
            <div className="flex items-center justify-between mb-3 text-sm">
              <div>
                <p className="text-black font-medium">{formatDate(reservation.reservation_date)}</p>
                <p className="text-gray-700 font-medium">{reservation.reservation_time}</p>
              </div>
              <div className="text-right">
                <p className="text-black font-medium">{reservation.guests} invités</p>
              </div>
            </div>

            {/* Special Requests */}
            {reservation.special_requests && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Demandes spéciales</p>
                <p className="text-sm text-black">{reservation.special_requests}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              {reservation.status === 'pending' && reservation.requires_confirmation && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleConfirmClick(reservation)}
                  loading={confirmingId === reservation.id}
                  disabled={confirmingId === reservation.id}
                  className="flex-1"
                >
                  Confirmer
                </Button>
              )}
              {reservation.status !== 'cancelled' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelClick(reservation)}
                  loading={cancellingId === reservation.id}
                  disabled={cancellingId === reservation.id}
                  className={`!border-red-600 !text-red-600 hover:!bg-red-50 hover:!border-red-700 hover:!text-red-700 ${
                    reservation.status === 'pending' && reservation.requires_confirmation ? 'flex-1' : ''
                  }`}
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop Pagination Controls */}
      {totalPages > 1 && (
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-t !border-[#F6F1F0]">
          <div className="text-sm text-gray-600">
            Affichage de {startIndex + 1}-{Math.min(endIndex, sortedReservations.length)} sur {sortedReservations.length} réservations
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="!border-[#F6F1F0] hover:!border-[#F34A23]"
            >
              Précédent
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                const showEllipsis = (page === currentPage - 3 && currentPage > 4) || (page === currentPage + 3 && currentPage < totalPages - 3);
                
                if (showEllipsis) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                
                if (!showPage) return null;
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page 
                      ? "" 
                      : "!border-[#F6F1F0] hover:!border-[#F34A23] text-gray-600 hover:text-[#F34A23]"
                    }
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="!border-[#F6F1F0] hover:!border-[#F34A23]"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Pagination Controls */}
      {totalPages > 1 && (
        <div className="block md:hidden">
          {/* Mobile pagination info */}
          <div className="text-center text-sm text-gray-600 mb-4">
            Page {currentPage} sur {totalPages} ({sortedReservations.length} réservations)
          </div>
          
          {/* Mobile pagination buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="!border-[#F6F1F0] hover:!border-[#F34A23] flex-1 max-w-[100px]"
            >
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                
                if (!showPage) return null;
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page 
                      ? "w-10 h-10 p-0" 
                      : "w-10 h-10 p-0 !border-[#F6F1F0] hover:!border-[#F34A23] text-gray-600 hover:text-[#F34A23]"
                    }
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="!border-[#F6F1F0] hover:!border-[#F34A23] flex-1 max-w-[100px]"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        title="Confirmer l'annulation"
        message={`Êtes-vous sûr de vouloir annuler la réservation pour ${reservationToCancel?.name || 'ce client'} ?`}
        confirmText="Annuler la réservation"
        cancelText="Retour"
        variant="danger"
        isLoading={cancellingId === reservationToCancel?.id}
      />

      {/* Confirm Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirmConfirm}
        title="Confirmer la réservation"
        message={`Êtes-vous sûr de vouloir confirmer la réservation pour ${reservationToConfirm?.name || 'ce client'} ?`}
        confirmText="Confirmer la réservation"
        cancelText="Retour"
        variant="default"
        isLoading={confirmingId === reservationToConfirm?.id}
      />
    </div>
  );
}