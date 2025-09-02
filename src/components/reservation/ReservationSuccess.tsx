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
      
      <div className="text-primary text-4xl mb-4">📋</div>
      
      <h3 className="text-lg font-bold text-card-foreground mb-3">
        Demande de réservation envoyée !
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        Merci, {reservation.name} ! Votre demande de réservation pour {reservation.guests} personne{reservation.guests > 1 ? 's' : ''} 
        le {formatDate(reservation.reservation_date)} à {reservation.reservation_time} a été transmise.
      </p>
      
      <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3 mb-4">
        <p className="text-xs text-secondary-foreground">
          <strong>📧 Prochaines étapes :</strong><br/>
          Vous recevrez un email de confirmation dès que notre équipe aura validé votre réservation. 
          Cela prend généralement quelques minutes pendant nos heures d'ouverture.
        </p>
      </div>
      
      <div className="space-y-2">
        <Button onClick={onMakeAnother} className="w-full" size="sm">
          Faire une autre réservation
        </Button>
      </div>
    </div>
  );
}