'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReservationPopup } from '@/components/reservation';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="w-full h-full bg-transparent relative">
        {/* Reservation Popup */}
        <ReservationPopup />
      </div>
    </ErrorBoundary>
  );
}