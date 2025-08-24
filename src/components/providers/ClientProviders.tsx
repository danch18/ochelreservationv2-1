'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}

