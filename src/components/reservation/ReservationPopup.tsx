'use client';

import { useState } from 'react';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { ReservationForm } from './ReservationForm';
import { ReservationSuccess } from './ReservationSuccess';
import { ReservationList } from './ReservationList';
import { ReservationLookup } from './ReservationLookup';
import { useReservationsByEmail } from '@/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Reservation } from '@/types';

type PopupView = 'form' | 'success' | 'reservations' | 'lookup';

export function ReservationPopup() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<PopupView>('form');
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);
  const [lookupEmail, setLookupEmail] = useState('');

  const { reservations, refetch } = useReservationsByEmail(lookupEmail);

  const handleReservationSuccess = (reservation: Reservation) => {
    setSubmittedReservation(reservation);
    setCurrentView('success');
  };

  const handleMakeAnother = () => {
    setSubmittedReservation(null);
    setCurrentView('form');
  };

  const handleViewReservations = () => {
    if (submittedReservation?.email) {
      setLookupEmail(submittedReservation.email);
      setCurrentView('reservations');
    }
  };

  const handleLookupReservations = (email: string) => {
    setLookupEmail(email);
    setCurrentView('reservations');
  };

  const handleBackToForm = () => {
    setCurrentView('form');
    setLookupEmail('');
  };


  const renderContent = () => {
    switch (currentView) {
      case 'success':
        if (submittedReservation) {
          return (
            <ReservationSuccess
              reservation={submittedReservation}
              onMakeAnother={handleMakeAnother}
              onViewReservations={handleViewReservations}
              onBack={handleBackToForm}
            />
          );
        }
        return null;

      case 'reservations':
        if (lookupEmail) {
          return (
            <ReservationList
              reservations={reservations}
              email={lookupEmail}
              onBack={handleBackToForm}
              onReservationsUpdate={refetch}
            />
          );
        }
        return null;

      case 'lookup':
        return (
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-popover-foreground mb-1">{t('findYourReservations')}</h3>
              <p className="text-sm text-muted-foreground">{t('enterEmailToView')}</p>
            </div>
            <ReservationLookup
              onLookup={handleLookupReservations}
              onBack={handleBackToForm}
            />
          </div>
        );

      case 'form':
      default:
        return (
          <div className="w-full">
            <ReservationForm onSuccess={handleReservationSuccess} />
          </div>
        );
    }
  };

  return (
    <FloatingActionButton>
      {renderContent()}
    </FloatingActionButton>
  );
}