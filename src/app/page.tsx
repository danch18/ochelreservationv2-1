'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReservationPopup } from '@/components/reservation';
import HomePage from '@/components/HomePage';

export default function Home() {
  return (
    <ErrorBoundary>
      <HomePage />
      {/* Reservation Popup - keeping this for functionality */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <ReservationPopup />
      </div>
    </ErrorBoundary>
  );
}