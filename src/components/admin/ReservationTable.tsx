'use client';

import { useState } from 'react';
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
        <p className="text-[#EFE7D2]/70">Aucune réservation trouvée.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#191919] rounded-lg border border-[#EFE7D2]/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#EFE7D2]/70 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#EFE7D2]/70 uppercase tracking-wider">
                Date et heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#EFE7D2]/70 uppercase tracking-wider">
                Invités
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#EFE7D2]/70 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#EFE7D2]/70 uppercase tracking-wider">
                Demandes spéciales
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#EFE7D2]/70 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE7D2]/10">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-[#EFE7D2]/5">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-[#EFE7D2]">
                      {reservation.name}
                    </div>
                    <div className="text-sm text-[#EFE7D2]/70">
                      {reservation.email}
                    </div>
                    <div className="text-sm text-[#EFE7D2]/70">
                      {reservation.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#EFE7D2]">
                    {formatDate(reservation.reservation_date)}
                  </div>
                  <div className="text-sm text-[#EFE7D2]/70">
                    {reservation.reservation_time}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#EFE7D2]">
                  {reservation.guests}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={reservation.status === 'confirmed' ? 'default' : 'destructive'}>
                    {reservation.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#EFE7D2] max-w-xs truncate">
                    {reservation.special_requests || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {reservation.status !== 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfirmReservation(reservation)}
                      loading={confirmingId === reservation.id}
                      disabled={confirmingId === reservation.id}
                    >
                      Confirmer
                    </Button>
                  )}
                  {reservation.status !== 'cancelled' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancelReservation(reservation)}
                      loading={cancellingId === reservation.id}
                      disabled={cancellingId === reservation.id}
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
  );
}