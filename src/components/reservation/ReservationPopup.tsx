'use client';

import { useState } from 'react';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { ReservationForm } from './ReservationForm';
import { ReservationSuccess } from './ReservationSuccess';
import { ReservationList } from './ReservationList';
import { ReservationLookup } from './ReservationLookup';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useReservationsByEmail } from '@/hooks';
import type { Reservation } from '@/types';

type PopupView = 'form' | 'success' | 'reservations' | 'lookup';

export function ReservationPopup() {
  const [currentView, setCurrentView] = useState<PopupView>('form');
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);
  const [lookupEmail, setLookupEmail] = useState('');
  const [currentFormStep, setCurrentFormStep] = useState<1 | 2>(1);

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
    setCurrentFormStep(1); // Reset to step 1 when going back to form
  };

  const handleStepChange = (step: 1 | 2) => {
    setCurrentFormStep(step);
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
              <h3 className="text-lg font-semibold text-popover-foreground mb-1">Trouvez vos réservations</h3>
              <p className="text-sm text-muted-foreground">Entrez votre email pour voir les réservations existantes</p>
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
          <ErrorBoundary
            fallback={
              <div className="w-full p-4 text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold mb-2">Erreur du formulaire</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Une erreur s'est produite lors du chargement du formulaire. 
                  Veuillez fermer et rouvrir le popup.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Recharger
                </button>
              </div>
            }
          >
            <div className="w-full">
              <ReservationForm 
                onSuccess={handleReservationSuccess} 
                onStepChange={handleStepChange}
                key="reservation-form" 
              />
            </div>
          </ErrorBoundary>
        );
    }
  };

  return (
    <FloatingActionButton currentStep={currentView === 'form' ? currentFormStep : 1}>
      {renderContent()}
    </FloatingActionButton>
  );
}