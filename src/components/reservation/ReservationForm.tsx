'use client';

import { useState, useEffect } from 'react';
import { useReservationForm } from '@/hooks';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui';
import { TIME_SLOTS } from '@/lib/constants';
import { getTodayDate } from '@/lib/utils';
import { dateAvailabilityService } from '@/services';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Reservation } from '@/types';

interface ReservationFormProps {
  onSuccess?: (reservation: Reservation) => void;
  onBack?: () => void;
}

export function ReservationForm({ onSuccess, onBack }: ReservationFormProps) {
  const { t } = useLanguage();
  const {
    form: { register, handleSubmit, watch, formState: { errors } },
    isSubmitting,
    submitError,
    onSubmit
  } = useReservationForm();

  const [dateAvailable, setDateAvailable] = useState(true);
  const [checkingDate, setCheckingDate] = useState(false);
  const [selectedQuickGuests, setSelectedQuickGuests] = useState<number | null>(null);
  
  const selectedDate = watch('date');
  const guestsValue = watch('guests');

  // Check date availability when date changes
  useEffect(() => {
    if (selectedDate) {
      const checkDate = async () => {
        setCheckingDate(true);
        try {
          const available = await dateAvailabilityService.isDateAvailable(selectedDate);
          setDateAvailable(available);
        } catch (error) {
          setDateAvailable(true); // Default to available on error
        } finally {
          setCheckingDate(false);
        }
      };
      checkDate();
    } else {
      setDateAvailable(true);
    }
  }, [selectedDate]);

  // Track guests value changes to highlight selected quick button
  useEffect(() => {
    const quickOptions = [5, 10, 15, 20];
    const currentGuests = parseInt(guestsValue);
    if (quickOptions.includes(currentGuests)) {
      setSelectedQuickGuests(currentGuests);
    } else {
      setSelectedQuickGuests(null);
    }
  }, [guestsValue]);

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
            ← {t('back')}
          </button>
        ) : (
          <div />
        )}
        {/* <h3 className="text-2xl font-bold text-popover-foreground text-end w-full" suppressHydrationWarning>
          Reserve Your Table
        </h3> */}
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
              label={t('name')}
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />
            
            <Input
              type="email"
              label={t('email')}
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Input
            type="tel"
            label={t('phone')}
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="grid md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Input
                type="date"
                label={t('date')}
                min={getTodayDate()}
                error={errors.date?.message || (!dateAvailable && selectedDate ? 'This date is not available for reservations' : undefined)}
                {...register('date')}
              />
              {selectedDate && (
                <div className="text-sm">
                  {checkingDate ? (
                    <span className="text-muted-foreground">Checking availability...</span>
                  ) : dateAvailable ? (
                    <span className="text-primary">✓ Date is available</span>
                  ) : (
                    <span className="text-destructive">✗ Restaurant is closed on this date</span>
                  )}
                </div>
              )}
            </div>
            
            <Select
              label={t('time')}
              placeholder="Select Time"
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

          <div className="space-y-3">
            <Input
              type="number"
              label={t('guests')}
              placeholder="Enter number of guests"
              min="1"
              max="50"
              error={errors.guests?.message}
              {...register('guests')}
            />
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    const guestInput = document.querySelector('input[name="guests"]') as HTMLInputElement;
                    if (guestInput) {
                      guestInput.value = num.toString();
                      guestInput.dispatchEvent(new Event('input', { bubbles: true }));
                      setSelectedQuickGuests(num);
                    }
                  }}
                  className={`px-3 py-1 text-xs bg-muted/20 rounded-md transition-all duration-200 text-popover-foreground border ${
                    selectedQuickGuests === num
                      ? '!border-white/70'
                      : 'border-border/30 hover:!border-white/70'
                  }`}
                >
                  {num} {num === 1 ? t('guest') : t('guests')}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label={t('specialRequests')}
            placeholder={t('specialRequestsPlaceholder')}
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
            disabled={isSubmitting || (!dateAvailable && !!selectedDate)}
            className="w-full mb-2 !text-black"
            size="md"
          >
            {isSubmitting ? 'Creating Reservation...' : (!dateAvailable && selectedDate ? 'Date Not Available' : t('submitReservation'))}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            powered by <a href="https://www.ochel.fr/" target="_blank" rel="noopener noreferrer" className="underline hover:text-popover-foreground transition-colors">Ochel</a>
          </p>
        </div>
      </form>
    </div>
  );
}