import { Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Reservation } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';

interface ReservationSuccessProps {
  reservation: Reservation;
  onMakeAnother: () => void;
  onViewReservations?: () => void;
  onBack?: () => void;
}

export function ReservationSuccess({
  reservation,
  onMakeAnother,
  onViewReservations,
  onBack
}: ReservationSuccessProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center font-forum">
      <div className="text-primary text-4xl mb-4">✓</div>

      <h3 className="text-lg font-bold text-card-foreground mb-3">
        {reservation.status === 'confirmed' ? t('reservation.success.confirmed') : t('reservation.success.registered')}
      </h3>

      <p className="text-sm text-muted-foreground mb-4">
        {t('reservation.success.thankYou')
          .replace('{{name}}', reservation.name)
          .replace('{{guests}}', reservation.guests.toString())
          .replace('{{date}}', formatDate(reservation.reservation_date))
          .replace('{{time}}', reservation.reservation_time)}
        {reservation.status === 'pending' ? ' ' + t('reservation.success.pending') : ''}
      </p>

      <div className="space-y-2">
        <Button onClick={onMakeAnother} className="w-full" size="sm">
          {t('reservation.success.makeAnother')}
        </Button>
      </div>
    </div>
  );
}