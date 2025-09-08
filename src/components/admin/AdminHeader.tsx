'use client';

import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';

export function AdminHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <header className="bg-[#F34A23] !border-b !border-[#F6F1F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-white">Magnifiko Réservez</h1>
              <p className="text-sm text-white/80">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{user.username}</p>
                  <p className="text-xs text-white/80">{user.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-2xl"
                >
                  Déconnexion
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}