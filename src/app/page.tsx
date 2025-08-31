'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReservationPopup } from '@/components/reservation';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent">
        {/* Reservation Popup */}
        <ReservationPopup />
      </div>
    </ErrorBoundary>
  );
}