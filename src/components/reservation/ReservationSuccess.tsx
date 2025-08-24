import { Button } from '@/components/ui';
import { formatDate, getShortId } from '@/lib/utils';
import type { Reservation } from '@/types';

interface ReservationSuccessProps {
  reservation: Reservation;
  onMakeAnother: () => void;
  onViewReservations: () => void;
  onBack?: () => void;
}

export function ReservationSuccess({
  reservation,
  onMakeAnother,
  onViewReservations,
  onBack
}: ReservationSuccessProps) {
  return (
    <div className="text-center">
      {onBack && (
        <div className="flex justify-start mb-4">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
        </div>
      )}
      
      <div className="text-primary text-4xl mb-4">✓</div>
      
      <h3 className="text-lg font-bold text-card-foreground mb-3">
        Reservation Confirmed!
      </h3>
      
      <p className="text-sm text-muted-foreground mb-3">
        Thank you, {reservation.name}! Your table for {reservation.guests} has been reserved 
        for {formatDate(reservation.reservation_date)} at {reservation.reservation_time}.
      </p>
      
      {reservation.id && (
        <p className="text-xs text-muted-foreground mb-4">
          Reservation ID: {getShortId(reservation.id)}
        </p>
      )}
      
      <div className="space-y-2">
        <Button onClick={onMakeAnother} className="w-full" size="sm">
          Make Another Reservation
        </Button>
        
        <Button onClick={onViewReservations} variant="secondary" className="w-full" size="sm">
          View My Reservations
        </Button>
      </div>
    </div>
  );
}