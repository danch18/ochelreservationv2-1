'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, StatusBadge } from '@/components/ui';
import { formatDate, formatTime, getShortId } from '@/lib/utils';
import { reservationService } from '@/services';
import type { Reservation, ReservationStatus } from '@/types';

interface ReservationTableProps {
  reservations: Reservation[];
  selectedDate: string;
  onReservationUpdate: () => void;
}

export function ReservationTable({ 
  reservations, 
  selectedDate,
  onReservationUpdate 
}: ReservationTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: ReservationStatus) => {
    setUpdatingId(id);
    
    try {
      await reservationService.updateReservationStatus(id, status);
      onReservationUpdate();
    } catch (error) {
      console.error('Error updating reservation:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <h3 className="text-lg font-semibold text-card-foreground">
          Reservations for {formatDate(selectedDate)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {reservations.length} reservation(s) found
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {reservations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No reservations found for the selected criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reservations.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={updatingId === reservation.id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ReservationRowProps {
  reservation: Reservation;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
  isUpdating: boolean;
}

function ReservationRow({ reservation, onStatusUpdate, isUpdating }: ReservationRowProps) {
  const canModify = (reservation.status || 'confirmed') === 'confirmed';

  return (
    <div className="p-6 hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h4 className="text-lg font-semibold text-card-foreground">
              {reservation.name}
            </h4>
            <p className="text-muted-foreground">
              {formatTime(reservation.reservation_time)} • {reservation.guests} guests
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <StatusBadge status={reservation.status} />
          
          {canModify && (
            <div className="flex space-x-2">
              <Button
                onClick={() => onStatusUpdate(reservation.id!, 'completed')}
                loading={isUpdating}
                disabled={isUpdating}
                size="sm"
                variant="secondary"
              >
                Complete
              </Button>
              <Button
                onClick={() => onStatusUpdate(reservation.id!, 'cancelled')}
                loading={isUpdating}
                disabled={isUpdating}
                size="sm"
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <div>
          <p><strong>Email:</strong> {reservation.email}</p>
          <p><strong>Phone:</strong> {reservation.phone}</p>
        </div>
        <div>
          <p><strong>Created:</strong> {new Date(reservation.created_at || '').toLocaleDateString()}</p>
          <p><strong>ID:</strong> {getShortId(reservation.id || '')}</p>
        </div>
        {reservation.special_requests && (
          <div>
            <p><strong>Special Requests:</strong></p>
            <p className="italic">{reservation.special_requests}</p>
          </div>
        )}
      </div>
    </div>
  );
}