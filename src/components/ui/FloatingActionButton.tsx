'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

interface FloatingActionButtonProps {
  children: React.ReactNode;
  className?: string;
}

function FloatingActionButtonContent({ children, className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Fixed Reserve Table Button Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        {/* Reserve Table Button */}
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className={cn(
            'w-auto px-4 py-3 rounded-full shadow-lg hover:shadow-xl',
            'flex items-center justify-center text-white text-base font-medium',
            'transform hover:scale-105 active:scale-95 transition-all duration-300',
            'whitespace-nowrap',
            isOpen 
              ? 'bg-destructive hover:bg-destructive/90' 
              : 'bg-[#191919] hover:bg-[#191919]/90',
            className
          )}
        >
          <span className="mr-2">🍽️</span>
          {isOpen ? t('close') : t('reserveTable')}
        </button>
      </div>

      {/* Popup Container - Zoom from FAB Animation */}
      <div
        ref={popupRef}
        className={cn(
          'fixed bottom-28 right-6 w-[414px] max-w-[calc(100vw-3rem)] bg-black rounded-lg shadow-2xl z-[9999]',
          'transform transition-all duration-300 ease-out',
          'overflow-hidden border border-border',
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-0 opacity-0',
        )}
        style={{
          transformOrigin: 'bottom right',
          maxHeight: '70vh',
        }}
      >
        {/* Header */}
        <div className="bg-[#191919] text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🍽️</span>
            <span className="font-semibold">ochel</span>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
              className="bg-transparent border border-primary/20 rounded px-2 py-1 text-xs text-primary-foreground"
            >
              <option value="fr" style={{ backgroundColor: '#191919', color: '#ffffff' }}>FR</option>
              <option value="en" style={{ backgroundColor: '#191919', color: '#ffffff' }}>EN</option>
            </select>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-primary/90 
                         flex items-center justify-center text-primary-foreground
                         transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="overflow-y-auto p-4 bg-black text-white scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500" 
          style={{ maxHeight: 'calc(70vh - 4rem)' }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export function FloatingActionButton({ children, className }: FloatingActionButtonProps) {
  return (
    <LanguageProvider>
      <FloatingActionButtonContent className={className}>
        {children}
      </FloatingActionButtonContent>
    </LanguageProvider>
  );
}