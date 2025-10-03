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
      <div className="min-h-screen bg-black flex items-center justify-center font-forum">
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
    <div className="min-h-screen bg-[#EFE7D2] flex items-center justify-center p-4 font-forum">
      <div className="w-full max-w-md">
        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#F6F1F0] overflow-hidden">
          {/* Header */}
          <div className="bg-[#F34A23] text-white p-6 text-center">
            <div className="mb-2">
              <span className="text-xl font-bold">Magnifiko</span>
            </div>
            <p className="text-white/90 text-sm">Administration</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Connexion Administrateur
              </h1>
              <p className="text-gray-600">
                Connectez-vous pour accéder au panneau d'administration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email ou nom d'utilisateur
                </label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@restaurant.com"
                  className="w-full px-4 py-3 border border-[#F6F1F0] rounded-2xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-[#F34A23] focus:ring-2 focus:ring-[#F34A23]/20 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-[#F6F1F0] rounded-2xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-[#F34A23] focus:ring-2 focus:ring-[#F34A23]/20 transition-all"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">⚠️</span>
                    <span>{error}</span>
                  </div>
                </Alert>
              )}

              {successMessage && (
                <Alert className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span>{successMessage}</span>
                  </div>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F34A23] hover:bg-[#F34A23]/90 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#F6F1F0] text-center">
              <p className="text-sm text-gray-500">
                © 2024 Magnifiko - Panneau d'administration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
