'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  children: React.ReactNode;
  className?: string;
}

function FloatingActionButtonContent({ children, className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Send message to parent window about popup state change
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'popupResize',
        isOpen: newIsOpen,
        width: newIsOpen ? 414 : 220,  // Base width (widget adds margins)
        height: newIsOpen ? 688 : 80   // Base height (widget adds margins)
      }, '*');
    }
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
        
        // Send message to parent window about popup closing
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'popupResize',
            isOpen: false,
            width: 220,
            height: 80
          }, '*');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Clickable zones - only these areas capture pointer events */}
      
      {/* FAB Button Zone */}
      <div 
        className="fixed bottom-2 right-2 z-[9999] pointer-events-auto flex items-end justify-end"
        style={{ width: '216px', height: '76px' }}
      >
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className={cn(
            'w-auto px-4 py-3 rounded-full',
            'flex items-center justify-center text-[#EFE7D2] text-base font-medium',
            'transform hover:scale-105 active:scale-95 transition-all duration-300',
            'whitespace-nowrap bg-[#191919] hover:bg-[#191919]/90',
            className
          )}
        >
          <span className="mr-2">🍽️</span>
          {isOpen ? 'Fermer' : 'Réserver une table'}
        </button>
      </div>

      {/* Popup Zone - only visible when open */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-2 z-[9998] pointer-events-auto"
          style={{ width: '414px', height: '600px' }}
        />
      )}

      {/* Popup Container - Zoom from FAB Animation */}
      <div
        ref={popupRef}
        className={cn(
          'fixed bottom-20 right-2 w-[414px] h-[600px] bg-black rounded-lg shadow-2xl z-[9999]',
          'transform transition-all duration-300 ease-out pointer-events-auto',
          'overflow-hidden border border-border',
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-0 opacity-0 pointer-events-none',
        )}
        style={{
          transformOrigin: 'bottom right',
        }}
      >
        {/* Header */}
        <div className="bg-[#191919] text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🍽️</span>
            <span className="font-semibold">ochel</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 rounded-full hover:bg-primary/90 
                       flex items-center justify-center text-primary-foreground
                       transition-colors duration-200"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div 
          className="overflow-y-auto p-4 bg-black text-[#EFE7D2] scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500" 
          style={{ height: '536px' }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export function FloatingActionButton({ children, className }: FloatingActionButtonProps) {
  return (
    <FloatingActionButtonContent className={className}>
      {children}
    </FloatingActionButtonContent>
  );
}