import { Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Reservation } from '@/types';

interface ReservationSuccessProps {
  reservation: Reservation;
  onMakeAnother: () => void;
  onBack?: () => void;
}

export function ReservationSuccess({
  reservation,
  onMakeAnother,
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
            ← Retour
          </button>
        </div>
      )}
      
      <div className="text-primary text-4xl mb-4">✓</div>
      
      <h3 className="text-lg font-bold text-card-foreground mb-3">
        Réservation confirmée !
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        Merci, {reservation.name} ! Votre table pour {reservation.guests} a été réservée 
        pour le {formatDate(reservation.reservation_date)} à {reservation.reservation_time}.
      </p>
      
      <div className="space-y-2">
        <Button onClick={onMakeAnother} className="w-full" size="sm">
          Faire une autre réservation
        </Button>
      </div>
    </div>
  );
}