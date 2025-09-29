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

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <ReservationPopup />
    </div>
  );
}