'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageLayout } from '@/components/layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <PageLayout showHeader={false} showFooter={false}>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-muted-foreground">Vérification de l'authentification...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect to login
  }

  return <>{children}</>;
}


