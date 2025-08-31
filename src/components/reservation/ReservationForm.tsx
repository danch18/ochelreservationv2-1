'use client';

import { useState, useEffect } from 'react';
import { useReservationForm } from '@/hooks';
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
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              border bg-input text-foreground min-w-[70px]
              hover:border-[#EFE7D2]/70 hover:bg-[#EFE7D2]/5
              ${selectedShortcut === num 
                ? 'border-[#EFE7D2]/70 bg-[#EFE7D2]/10 text-[#EFE7D2]' 
                : 'border-input'
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

  const guestsValue = watch('guests');

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