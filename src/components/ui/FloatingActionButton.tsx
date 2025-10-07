'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  children: React.ReactNode;
  className?: string;
  currentStep?: 1 | 2;
  onClose?: () => void;
}

function FloatingActionButtonContent({ children, className, currentStep = 1, onClose }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Dynamic popup dimensions based on step
  const popupWidth = currentStep === 2 ? 1035 : 414;  // 2.5x width for step 2 (414 * 2.5 = 1035)
  const popupHeight = currentStep === 2 ? 700 : 600; // Slightly taller for step 2

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);

    // Notify parent component that popup is closing
    if (onClose) {
      onClose();
    }

    // Send message to parent window about popup closing
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'popupResize',
        isOpen: false,
        width: 220,
        height: 80
      }, '*');
    }
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;

    if (!newIsOpen) {
      // Closing the popup
      handleClose();
      return;
    }

    setIsOpen(newIsOpen);
    
    // Send message to parent window about popup state change
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'popupResize',
        isOpen: newIsOpen,
        width: newIsOpen ? popupWidth : 220,  // Dynamic width based on step
        height: newIsOpen ? popupHeight + 88 : 80   // Dynamic height + margins
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
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle step changes and resize popup accordingly
  useEffect(() => {
    if (isOpen && window.parent !== window) {
      window.parent.postMessage({
        type: 'popupResize',
        isOpen: true,
        width: popupWidth,
        height: popupHeight + 88
      }, '*');
    }
  }, [currentStep, isOpen, popupWidth, popupHeight]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div>
      {/* FAB Button Zone */}
      <div
        className="fixed bottom-2 right-2 z-[9999] pointer-events-auto flex items-end justify-end"
        style={{ width: '216px', height: '76px' }}
      >
        <button
          ref={buttonRef}
          onClick={handleToggle}
          data-reservation-button
          className={cn(
            'w-auto px-4 py-3 rounded-full',
            'flex items-center justify-center text-black text-base font-medium',
            'transform hover:scale-105 active:scale-95 transition-all duration-300',
            'whitespace-nowrap hover:opacity-90 font-forum',
            className
          )}
          style={{ backgroundColor: '#FFF2CC' }}
        >
          {!isOpen && (
            <>
              <Image
                src="/icons/logo.png"
                alt="Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              <div className="w-px h-6 bg-black mx-3"></div>
            </>
          )}
          {isOpen ? 'Fermer' : 'Réserver une table'}
        </button>
      </div>

      {/* Popup Zone - only visible when open */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-2 z-[9998] pointer-events-auto"
          style={{ width: `${popupWidth}px`, height: `${popupHeight}px` }}
        />
      )}

      {/* Popup Container - Zoom from FAB Animation */}
      <div
        ref={popupRef}
        className={cn(
          'fixed bottom-20 right-2 rounded-xl shadow-2xl z-[9999]',
          'transform transition-all duration-300 ease-out pointer-events-auto',
          'overflow-hidden',
          // Mobile responsive styles
          'max-sm:!max-w-[320px] max-sm:!w-[320px]',
          isOpen
            ? 'scale-100 opacity-100'
            : 'scale-0 opacity-0 pointer-events-none',
        )}
        style={{
          transformOrigin: 'bottom right',
          width: `${popupWidth}px`,
          height: `${popupHeight}px`,
          maxWidth: currentStep === 2 ? `${popupWidth}px` : '414px',
          background: '#101010',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '0.75rem'
        }}
      >
        {/* Header */}
        <div className="bg-[#101010] text-white p-4 max-sm:p-3 flex items-center justify-between font-forum border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="font-semibold max-sm:text-sm text-[#FFF2CC]">Magnifiko</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-[#d4af37] transition-colors"
            style={{ fontSize: '1.75rem', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto p-4 max-sm:p-3 bg-[#101010] scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 font-forum reservation-popup-content"
          style={{ height: `${popupHeight - 64}px` }}
        >
          {children}
        </div>
      </div>

      {/* Global styles for reservation popup content */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .reservation-popup-content h1,
          .reservation-popup-content h2,
          .reservation-popup-content h3,
          .reservation-popup-content .font-semibold,
          .reservation-popup-content .text-lg,
          .reservation-popup-content label,
          .reservation-popup-content .font-medium {
            color: #FFF2CC !important;
          }
          .reservation-popup-content p,
          .reservation-popup-content .text-sm,
          .reservation-popup-content .text-gray-600,
          .reservation-popup-content .text-muted-foreground,
          .reservation-popup-content .text-gray-500 {
            color: rgba(234, 234, 234, 0.70) !important;
          }
          .reservation-popup-content {
            color: rgba(234, 234, 234, 0.70);
          }
          .reservation-popup-content button[type="submit"],
          .reservation-popup-content .reservation-button,
          .reservation-popup-content button:not(.close-button):not([aria-label]) {
            display: flex !important;
            height: 2.5rem !important;
            padding: 0 3rem !important;
            justify-content: center !important;
            align-items: center !important;
            border-radius: 0.625rem !important;
            background: #FFF2CC !important;
            color: #000 !important;
            font-family: 'Forum' !important;
            font-size: 1rem !important;
            font-weight: 400 !important;
            border: none !important;
            cursor: pointer !important;
          }
          .reservation-popup-content input,
          .reservation-popup-content textarea,
          .reservation-popup-content select {
            background: #000000 !important;
            color: #ffffff !important;
            border: 1px solid rgba(255, 255, 255, 0.10) !important;
            border-radius: 0.375rem !important;
          }
          .reservation-popup-content input::placeholder,
          .reservation-popup-content textarea::placeholder {
            color: rgba(234, 234, 234, 0.50) !important;
          }
          .reservation-popup-content .form-group,
          .reservation-popup-content .input-wrapper,
          .reservation-popup-content .field-wrapper,
          .reservation-popup-content div:has(input),
          .reservation-popup-content div:has(textarea),
          .reservation-popup-content div:has(select) {
            background: transparent !important;
          }
          .reservation-popup-content .bg-white,
          .reservation-popup-content .bg-gray-50,
          .reservation-popup-content .bg-gray-100,
          .reservation-popup-content .bg-gray-200,
          .reservation-popup-content .bg-slate-50,
          .reservation-popup-content .bg-slate-100 {
            background: transparent !important;
          }
          .reservation-popup-content div:not([style*="background"]):not(.reservation-popup-content) {
            background: transparent !important;
          }
          .reservation-popup-content .date-navigation,
          .reservation-popup-content .date-controls,
          .reservation-popup-content .calendar-navigation {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
          }
          .reservation-popup-content .date-nav-buttons,
          .reservation-popup-content .nav-buttons,
          .reservation-popup-content .calendar-nav-buttons {
            display: flex !important;
            gap: 0.5rem !important;
            width: fit-content !important;
          }
          .reservation-popup-content .date-prev,
          .reservation-popup-content .date-next,
          .reservation-popup-content [class*="prev"],
          .reservation-popup-content [class*="next"] {
            width: 40px !important;
            min-width: 40px !important;
            max-width: 40px !important;
            padding: 0.25rem !important;
            height: 40px !important;
            min-height: 40px !important;
            max-height: 40px !important;
            font-size: 0.875rem !important;
          }
          .reservation-popup-content button[class*="prev"],
          .reservation-popup-content button[class*="next"],
          .reservation-popup-content .rdp-nav_button,
          .reservation-popup-content .rdp-button_previous,
          .reservation-popup-content .rdp-button_next {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            max-width: 40px !important;
            min-height: 40px !important;
            max-height: 40px !important;
            padding: 0.25rem !important;
            font-size: 0.75rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .reservation-popup-content .rdp-nav,
          .reservation-popup-content .rdp-caption_label,
          .reservation-popup-content .calendar-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
          }
          .reservation-popup-content .rdp-caption_dropdowns,
          .reservation-popup-content .month-navigation {
            display: flex !important;
            gap: 0.5rem !important;
            width: fit-content !important;
          }
          .reservation-popup-content .flex.items-center.justify-between.mb-4.px-4 button {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            max-width: 40px !important;
            min-height: 40px !important;
            max-height: 40px !important;
            padding: 0.25rem !important;
            font-size: 0.75rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        `
      }} />
    </div>
  );
}

export function FloatingActionButton({ children, className, currentStep, onClose }: FloatingActionButtonProps) {
  return (
    <FloatingActionButtonContent className={className} currentStep={currentStep} onClose={onClose}>
      {children}
    </FloatingActionButtonContent>
  );
}