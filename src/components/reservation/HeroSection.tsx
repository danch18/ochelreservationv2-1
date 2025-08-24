import { RESTAURANT_CONFIG } from '@/lib/constants';
import { ReservationLookup } from './ReservationLookup';

interface HeroSectionProps {
  onLookupReservations: (email: string) => void;
  children: React.ReactNode;
}

export function HeroSection({ onLookupReservations, children }: HeroSectionProps) {
  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {RESTAURANT_CONFIG.description}
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              {RESTAURANT_CONFIG.tagline}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span>{RESTAURANT_CONFIG.rating}/5 Rating</span>
              </div>
              <div>📍 {RESTAURANT_CONFIG.location}</div>
              <div>🕒 {RESTAURANT_CONFIG.hours}</div>
            </div>

            <ReservationLookup onLookup={onLookupReservations} />
          </div>

          <div className="lg:pl-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}