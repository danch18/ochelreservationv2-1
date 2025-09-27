import { ReservationPopup } from '@/components/reservation';
import { ErrorBoundary } from '../ErrorBoundary';
import {NavBar} from "@/components/layout"

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ 
  children
}: PageLayoutProps) {
  return (
    <ErrorBoundary>
      <div className='relative overflow-hidden dark bg-[var(--background)]'>
        <div className='min-h-screen'>
          <NavBar
            className="fixed pt-5 md:top-8 relative z-30"
           />
          {children}
        </div>
        <ReservationPopup />
      </div>
    </ErrorBoundary>
  );
}