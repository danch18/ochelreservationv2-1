'use client';

import { useState } from 'react';
import { Button, StatusBadge, Alert } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { reservationService } from '@/services';
import type { Reservation } from '@/types';

interface ReservationListProps {
  reservations: Reservation[];
  email: string;
  onBack: () => void;
  onReservationsUpdate?: () => void;
}

export function ReservationList({ 
  reservations, 
  email, 
  onBack,
  onReservationsUpdate 
}: ReservationListProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    setError(null);

    try {
      await reservationService.cancelReservation(id);
      onReservationsUpdate?.();
    } catch {
      setError('Échec de l\'annulation de la réservation. Veuillez réessayer.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#EFE7D2] rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mes réservations</h2>
            <Button onClick={onBack} variant="secondary">
              Retour à la réservation
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune réservation trouvée pour {email}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancel}
                  isCancelling={cancellingId === reservation.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}

function ReservationCard({ reservation, onCancel, isCancelling }: ReservationCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{reservation.name}</h3>
          <p className="text-gray-600">
            {formatDate(reservation.reservation_date)} at {reservation.reservation_time}
          </p>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div>
          <p><strong>Invités :</strong> {reservation.guests}</p>
          <p><strong>Téléphone :</strong> {reservation.phone}</p>
        </div>
        <div>
          <p><strong>Email :</strong> {reservation.email}</p>
          <p><strong>Créée :</strong> {new Date(reservation.created_at || '').toLocaleDateString()}</p>
        </div>
      </div>

      {reservation.special_requests && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Demandes spéciales :</p>
          <p className="text-sm text-gray-600">{reservation.special_requests}</p>
        </div>
      )}

      {reservation.status === 'confirmed' && (
        <div className="flex justify-end">
          <Button
            onClick={() => onCancel(reservation.id!)}
            variant="destructive"
            size="sm"
            loading={isCancelling}
            disabled={isCancelling}
          >
            {isCancelling ? 'Annulation...' : 'Annuler la réservation'}
          </Button>
        </div>
      )}
    </div>
  );
}