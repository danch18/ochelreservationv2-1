'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import CertificationsHalalPage from '@/components/CertificationsHalalPage';

/**
 * Piccolo Certifications Page (Development Version)
 * This is at /piccolo-next/certifications
 * Displays halal certifications for Piccolo restaurant
 */
export default function PiccoloNextCertificationsHalal() {
  return (
    <ErrorBoundary>
      <CertificationsHalalPage restaurantId="piccolo-next" />
    </ErrorBoundary>
  );
}
