'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReservationPopup } from '@/components/reservation';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        {/* Background content - you can add any background design here */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4" suppressHydrationWarning>ochel</h1>
            <p className="text-xl text-gray-300">Fine Dining Experience</p>
          </div>
        </div>
        
        {/* Floating Action Button with Reservation Popup */}
        <ReservationPopup />
      </div>
    </ErrorBoundary>
  );
}