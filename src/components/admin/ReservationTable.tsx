'use client';

import React, { useState } from 'react';
import { Button, Badge, LoadingSpinner } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { reservationService } from '@/services';
import type { Reservation } from '@/types';

interface ReservationTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  onReservationsUpdate: () => void;
}

export function ReservationTable({ reservations, isLoading, onReservationsUpdate }: ReservationTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleCancelReservation = async (reservation: Reservation) => {
    if (!reservation.id) return;
    
    const confirmed = confirm(`Êtes-vous sûr de vouloir annuler la réservation pour ${reservation.name} ?`);
    if (!confirmed) return;

    setCancellingId(reservation.id);
    try {
      await reservationService.updateReservationStatus(reservation.id, 'cancelled');
      onReservationsUpdate();
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      alert('Échec de l\'annulation de la réservation. Veuillez réessayer.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleConfirmReservation = async (reservation: Reservation) => {
    if (!reservation.id) return;
    
    setConfirmingId(reservation.id);
    try {
      await reservationService.updateReservationStatus(reservation.id, 'confirmed');
      onReservationsUpdate();
    } catch (error) {
      console.error('Failed to confirm reservation:', error);
      alert('Échec de la confirmation de la réservation. Veuillez réessayer.');
    } finally {
      setConfirmingId(null);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = reservations.slice(startIndex, endIndex);

  // Reset to first page when reservations change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [reservations.length, currentPage, totalPages]);

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
    <>
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
                        {reservation.status}
                      </Badge>
                      {reservation.requires_confirmation && reservation.status === 'confirmed' && (
                        <span className="text-xs text-gray-500">Confirmé par admin</span>
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
                        onClick={() => handleConfirmReservation(reservation)}
                        loading={confirmingId === reservation.id}
                        disabled={confirmingId === reservation.id}
                      >
                        Confirmer
                      </Button>
                    )}
                    {reservation.status === 'confirmed' && !reservation.requires_confirmation && (
                      <span className="text-xs text-green-600 font-medium">Auto-confirmé</span>
                    )}
                    {reservation.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelReservation(reservation)}
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
                  {reservation.status}
                </Badge>
                {reservation.requires_confirmation && reservation.status === 'confirmed' && (
                  <span className="text-xs text-gray-500">Admin confirmé</span>
                )}
                {reservation.status === 'confirmed' && !reservation.requires_confirmation && (
                  <span className="text-xs text-green-600 font-medium">Auto-confirmé</span>
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
                  onClick={() => handleConfirmReservation(reservation)}
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
                  onClick={() => handleCancelReservation(reservation)}
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
            Affichage de {startIndex + 1}-{Math.min(endIndex, reservations.length)} sur {reservations.length} réservations
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
            Page {currentPage} sur {totalPages} ({reservations.length} réservations)
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
    </>
  );
}