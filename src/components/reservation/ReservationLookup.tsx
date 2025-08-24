'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailLookupSchema, type EmailLookupInput } from '@/lib/validations';
import { Input, Button, Alert } from '@/components/ui';
import { getErrorMessage } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReservationLookupProps {
  onLookup: (email: string) => void;
  onBack?: () => void;
}

export function ReservationLookup({ onLookup, onBack }: ReservationLookupProps) {
  const { t } = useLanguage();
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailLookupInput>({
    resolver: zodResolver(emailLookupSchema)
  });

  const onSubmit = async (data: EmailLookupInput) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      // This will trigger the reservations fetch
      onLookup(data.email);
    } catch (error) {
      setSearchError(getErrorMessage(error));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4">
      {onBack && (
        <div className="flex justify-start mb-4">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            ← {t('back')}
          </button>
        </div>
      )}
      <h3 className="text-lg font-semibold text-card-foreground mb-3">
        {t('yourReservations')}
      </h3>

      {searchError && (
        <Alert variant="destructive" className="mb-4">
          {searchError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <Input
          type="email"
          placeholder={t('enterYourEmail')}
          error={errors.email?.message}
          className="flex-1"
          {...register('email')}
        />
        
        <Button
          type="submit"
          loading={isSearching}
          disabled={isSearching}
        >
          {isSearching ? 'Loading...' : t('lookupReservations')}
        </Button>
      </form>
    </div>
  );
}