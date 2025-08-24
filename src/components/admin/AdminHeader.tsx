import Link from 'next/link';
import { RESTAURANT_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui';

export function AdminHeader() {
  return (
    <header className="bg-[#191919] backdrop-blur-sm shadow-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-popover-foreground">
                {RESTAURANT_CONFIG.name} Admin
              </h1>
              <p className="text-sm text-muted-foreground">Restaurant Management Dashboard</p>
            </div>
          </div>
          
          <Link href="/">
            <Button>Back to Website</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}