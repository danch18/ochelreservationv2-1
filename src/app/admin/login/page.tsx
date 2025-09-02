'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Identifiants invalides. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Container - styled like the popup */}
        <div className="bg-black rounded-lg shadow-2xl border border-border overflow-hidden">
          {/* Header - same style as popup header */}
          <div className="bg-[#191919] text-primary-foreground p-4 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🍽️</span>
              <span className="font-semibold">Admin - ochel</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-black text-[#EFE7D2]">
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-popover-foreground mb-2">
                Connexion Administrateur
              </h1>
              <p className="text-sm text-muted-foreground">
                Connectez-vous pour accéder au panneau d'administration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-popover-foreground mb-1">
                  Email ou nom d'utilisateur
                </label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@restaurant.com"
                  className="w-full bg-input border-border text-popover-foreground placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-popover-foreground mb-1">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-input border-border text-popover-foreground placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive text-destructive">
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert className="bg-primary/10 border-primary text-primary">
                  {successMessage}
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
