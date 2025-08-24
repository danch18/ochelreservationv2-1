'use client';

export function AdminHeader() {

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
            <span className="text-sm text-white/70">
              Restaurant Management
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}