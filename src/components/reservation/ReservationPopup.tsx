'use client';

import { useState, useCallback, useMemo } from 'react';
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
  const [formKey, setFormKey] = useState(0);

  const { reservations, refetch } = useReservationsByEmail(lookupEmail);

  const handleReservationSuccess = useCallback((reservation: Reservation) => {
    // Use requestAnimationFrame to prevent DOM conflicts during rapid state changes
    requestAnimationFrame(() => {
      setSubmittedReservation(reservation);
      setCurrentView('success');
    });
  }, []);

  const handleMakeAnother = useCallback(() => {
    requestAnimationFrame(() => {
      setSubmittedReservation(null);
      setCurrentView('form');
      setCurrentFormStep(1);
      setFormKey(prev => prev + 1); // Force form remount
    });
  }, []);

  const handleViewReservations = useCallback(() => {
    if (submittedReservation?.email) {
      requestAnimationFrame(() => {
        setLookupEmail(submittedReservation.email);
        setCurrentView('reservations');
      });
    }
  }, [submittedReservation?.email]);

  const handleLookupReservations = useCallback((email: string) => {
    requestAnimationFrame(() => {
      setLookupEmail(email);
      setCurrentView('reservations');
    });
  }, []);

  const handleBackToForm = useCallback(() => {
    requestAnimationFrame(() => {
      setCurrentView('form');
      setLookupEmail('');
      setCurrentFormStep(1); // Reset to step 1 when going back to form
      setFormKey(prev => prev + 1); // Force form remount
    });
  }, []);

  const handleStepChange = useCallback((step: 1 | 2) => {
    setCurrentFormStep(step);
  }, []);


  const renderContent = useMemo(() => {
    switch (currentView) {
      case 'success':
        if (submittedReservation) {
          return (
            <ReservationSuccess
              key="success-view"
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
              key="reservations-view"
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
          <div key="lookup-view" className="font-forum">
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
          <div key={`form-view-${formKey}`} className="w-full">
            <ErrorBoundary
              key={`error-boundary-${formKey}`}
              fallback={
                <div className="w-full p-4 text-center font-forum">
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
              <ReservationForm
                onSuccess={handleReservationSuccess}
                onStepChange={handleStepChange}
                key={`reservation-form-${formKey}`}
              />
            </ErrorBoundary>
          </div>
        );
    }
  }, [
    currentView,
    submittedReservation,
    lookupEmail,
    reservations,
    formKey,
    handleMakeAnother,
    handleViewReservations,
    handleBackToForm,
    handleLookupReservations,
    handleReservationSuccess,
    handleStepChange,
    refetch
  ]);

  return (
    <FloatingActionButton currentStep={currentView === 'form' ? currentFormStep : 1}>
      {renderContent}
    </FloatingActionButton>
  );
}