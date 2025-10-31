'use client';

import { usePathname } from 'next/navigation';
import { ReservationPopup } from '@/components/reservation';

export function GlobalReservationButton() {
  const pathname = usePathname();

  // Hide reservation button on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  // TEMPORARILY HIDDEN - Uncomment below to restore the reservation button
  return null;

  // Original return statement (commented out for easy restoration)
  /* return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <ReservationPopup />
    </div>
  ); */
}