'use client';

import { useReservationForm } from '@/hooks';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui';
import { TIME_SLOTS, GUEST_OPTIONS } from '@/lib/constants';
import { getTodayDate } from '@/lib/utils';
import type { Reservation } from '@/types';


interface ReservationFormProps {
  onSuccess?: (reservation: Reservation) => void;
  onBack?: () => void;
}

export function ReservationForm({ onSuccess, onBack }: ReservationFormProps) {
  const {
    form: { register, handleSubmit, formState: { errors } },
    isSubmitting,
    submitError,
    onSubmit
  } = useReservationForm();

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      const reservation = await onSubmit(data);
      onSuccess?.(reservation);
    } catch {
      // Error is already handled by the hook
    }
  });

  return (
    <div className="bg-popover rounded-2xl p-2 flex flex-col h-full max-h-[90vh]">
      <div className="flex items-center justify-between mb-6">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            ← Retour
          </button>
        ) : (
          <div />
        )}
        <h3 className="text-2xl font-bold text-popover-foreground text-end w-full" suppressHydrationWarning>
          Réservez votre table
        </h3>
        <div className="w-16" />
      </div>

      {submitError && (
        <Alert variant="destructive" className="mb-6">
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-2 pb-4">
          <div className="grid md:grid-cols-1 gap-4">
            <Input
              label="Nom complet"
              placeholder="Jean Dupont"
              error={errors.name?.message}
              {...register('name')}
            />
            
            <Input
              type="email"
              label="Email"
              placeholder="jean@exemple.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Input
            type="tel"
            label="Numéro de téléphone"
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="grid md:grid-cols-1 gap-4">
            <Input
              type="date"
              label="Date"
              min={getTodayDate()}
              error={errors.date?.message}
              {...register('date')}
            />
            
            <Select
              label="Heure"
              placeholder="Sélectionnez l'heure"
              error={errors.time?.message}
              {...register('time')}
            >
              {TIME_SLOTS.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </div>

          <Select
            label="Nombre d'invités"
            error={errors.guests?.message}
            {...register('guests')}
          >
            {GUEST_OPTIONS.map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Invité' : 'Invités'}
              </option>
            ))}
          </Select>

          <Textarea
            label="Demandes spéciales (Optionnel)"
            placeholder="Allergies, célébration, préférences de siège..."
            rows={3}
            error={errors.specialRequests?.message}
            {...register('specialRequests')}
          />
        </div>

        {/* Fixed bottom section */}
        <div className="bg-muted/50 -mx-2 -mb-2 px-4 py-4 rounded-b-2xl border-t border-border/20">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full mb-2"
            size="md"
          >
            {isSubmitting ? 'Création de la réservation...' : 'Réserver une table'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            propulsé par Ochel
          </p>
        </div>
      </form>
    </div>
  );
}