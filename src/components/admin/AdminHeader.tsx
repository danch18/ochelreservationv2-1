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
    <header className="bg-[#191919] border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">🍽️</span>
            <div>
              <h1 className="text-xl font-semibold text-white">ochel</h1>
              <p className="text-sm text-white/70">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{user.username}</p>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
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