import { Header } from './Header';
import { Footer } from './Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function AdminLayout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = 'min-h-screen bg-gradient-to-br from-amber-50 to-orange-100'
}: AdminLayoutProps) {
  return (
    <div className={className}>
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}