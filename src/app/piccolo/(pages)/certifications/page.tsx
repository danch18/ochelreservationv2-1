'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import CertificationsHalalPage from '@/components/CertificationsHalalPage';

/**
 * Piccolo Certifications Page
 * Displays halal certifications for Piccolo restaurant
 */
export default function PiccoloCertificationsHalal() {
  return (
    <ErrorBoundary>
      <CertificationsHalalPage restaurantId="piccolo" />
    </ErrorBoundary>
  );
}
