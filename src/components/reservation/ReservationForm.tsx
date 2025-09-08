'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReservationForm } from '@/hooks';
import { useRestaurantAvailability } from '@/hooks/useRestaurantAvailability';
import { Input, Select, Textarea, Button, Alert } from '@/components/ui';
import { TIME_SLOTS, GUEST_OPTIONS } from '@/lib/constants';
import { getTodayDate } from '@/lib/utils';
import type { Reservation } from '@/types';


interface ReservationFormProps {
  onSuccess?: (reservation: Reservation) => void;
  onBack?: () => void;
}

// Custom Guests Input Component
interface GuestsInputProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

function GuestsInput({ value, onChange, error }: GuestsInputProps) {
  const [selectedShortcut, setSelectedShortcut] = useState<number | null>(null);
  const shortcuts = [5, 10, 15, 20];

  useEffect(() => {
    if (value && shortcuts.includes(parseInt(value))) {
      setSelectedShortcut(parseInt(value));
    } else {
      setSelectedShortcut(null);
    }
  }, [value]);

  const handleShortcutClick = (num: number) => {
    onChange(num.toString());
    setSelectedShortcut(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    // Update selected shortcut if input matches a shortcut
    const numValue = parseInt(inputValue);
    if (shortcuts.includes(numValue)) {
      setSelectedShortcut(numValue);
    } else {
      setSelectedShortcut(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Nombre d'invités
        <span className="text-destructive ml-1">*</span>
      </label>
      
      <Input
        type="number"
        min="1"
        max="50"
        value={value || ''}
        onChange={handleInputChange}
        placeholder="Entrez le nombre d'invités"
        error={error}
      />
      
      <div className="flex gap-2 mt-3">
        {shortcuts.map(num => (
          <button
            key={num}
            type="button"
            onClick={() => handleShortcutClick(num)}
            className={`
              px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200
              border-2 min-w-[70px]
              ${selectedShortcut === num 
                ? '!border-[#FF7043] bg-[#FF7043] text-white' 
                : '!border-[#F6F1F0] bg-black/[0.03] text-black hover:!border-[#FF7043] hover:bg-[#FF7043]/5'
              }
            `}
          >
            <span>{num}</span>
            <span className="text-xs"> invités</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReservationForm({ onSuccess, onBack }: ReservationFormProps) {
  const {
    form: { register, handleSubmit, formState: { errors }, setValue, watch },
    isSubmitting,
    submitError,
    onSubmit
  } = useReservationForm();

  const { isDateClosed, getTimeSlots, loading: availabilityLoading, error: availabilityError } = useRestaurantAvailability();
  
  const guestsValue = watch('guests');
  const selectedDate = watch('date');
  
  // Get available time slots - fallback to default if service fails
  const availableTimeSlots = selectedDate && !availabilityError ? getTimeSlots(selectedDate) : TIME_SLOTS;
  const isSelectedDateClosed = selectedDate && !availabilityError ? isDateClosed(selectedDate) : false;

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
        <h3 className="text-2xl font-bold text-black text-left w-full" suppressHydrationWarning>
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
            <div>
              <Input
                type="date"
                label="Date"
                min={getTodayDate()}
                error={errors.date?.message || (isSelectedDateClosed ? 'Le restaurant est fermé à cette date' : undefined)}
                {...register('date')}
                className={isSelectedDateClosed ? '!border-red-500' : ''}
              />
              {isSelectedDateClosed && (
                <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <span>🚫</span>
                  <span>Restaurant fermé - Veuillez choisir une autre date</span>
                </div>
              )}
            </div>
            
            <Select
              label="Heure"
              placeholder={
                isSelectedDateClosed 
                  ? "Date fermée" 
                  : availableTimeSlots.length === 0 
                    ? "Aucun créneau disponible"
                    : "Sélectionnez l'heure"
              }
              error={errors.time?.message}
              disabled={isSelectedDateClosed || availableTimeSlots.length === 0}
              {...register('time')}
            >
              {availableTimeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </div>

          <GuestsInput
            value={guestsValue}
            onChange={(value) => setValue('guests', value)}
            error={errors.guests?.message}
          />

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
            disabled={isSubmitting || isSelectedDateClosed}
            className="w-full mb-2"
            size="md"
          >
            {isSubmitting 
              ? 'Création de la réservation...' 
              : isSelectedDateClosed 
                ? 'Restaurant fermé'
                : 'Réserver une table'
            }
          </Button>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <span>propulsé par</span>
            <a 
              href="https://www.ochel.fr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
            >
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={30}
                height={12}
                className="h-3 w-auto"
                style={{ objectFit: 'contain' }}
              />
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}