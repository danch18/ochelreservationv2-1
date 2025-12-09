'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import HomePage from '@/components/HomePage';

/**
 * Piccolo Restaurant Homepage (Development Version)
 * This is the new full restaurant site at /piccolo-next
 * Once ready, this will replace the PDF page at /piccolo
 * Uses the same HomePage component as Magnifiko but with Piccolo-specific content
 */
export default function PiccoloNextHome() {
  return (
    <ErrorBoundary>
      <HomePage restaurantId="piccolo-next" />
    </ErrorBoundary>
  );
}
