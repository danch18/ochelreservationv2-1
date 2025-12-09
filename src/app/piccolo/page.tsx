'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import HomePage from '@/components/HomePage';

/**
 * Piccolo Restaurant Homepage
 * Uses the same HomePage component as Magnifiko but with Piccolo-specific content
 * Content will be determined by the restaurant context (based on URL path)
 */
export default function PiccoloHome() {
  return (
    <ErrorBoundary>
      <HomePage restaurantId="piccolo" />
    </ErrorBoundary>
  );
}
