import { Button } from '@/components/ui';
import { formatDate, getShortId } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
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
      
      <h3 className="text-lg font-bold text-popover-foreground mb-3">
        {t('reservationConfirmed')}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {t('thankYouMessage', {
          name: reservation.name,
          guests: reservation.guests,
          date: formatDate(reservation.reservation_date),
          time: reservation.reservation_time
        })}
      </p>
      
      <div className="space-y-2">
        <Button onClick={onMakeAnother} className="w-full !text-black" size="sm">
          {t('makeAnotherReservation')}
        </Button>
      </div>
    </div>
  );
}