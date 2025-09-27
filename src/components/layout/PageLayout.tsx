import { ReservationPopup } from '@/components/reservation';
import { ErrorBoundary } from '../ErrorBoundary';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ 
  children
}: PageLayoutProps) {
  return (
    <ErrorBoundary>
      <div className='relative overflow-hidden dark bg-[var(--background)]'>
        <div className='min-h-screen w-screen '>
          {children}
        </div>
        <ReservationPopup />
      </div>
    </ErrorBoundary>
  );
}