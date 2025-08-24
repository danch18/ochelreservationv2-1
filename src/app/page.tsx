'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReservationPopup } from '@/components/reservation';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-6xl font-bold text-white mb-6" suppressHydrationWarning>
              ochel Restaurant
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Experience exceptional dining - Book your table for an unforgettable culinary journey
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Fine Dining</h3>
                <p className="text-gray-400">Exceptional cuisine crafted with the finest ingredients</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-white mb-2">Easy Reservations</h3>
                <p className="text-gray-400">Book your table instantly with our simple reservation system</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-white mb-2">Unforgettable Experience</h3>
                <p className="text-gray-400">Create lasting memories with our exceptional service</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reservation Popup */}
        <ReservationPopup />
      </div>
    </ErrorBoundary>
  );
}