'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function LocationSelectionPopup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Show popup on mount (only once - first time ever)
  useEffect(() => {
    // Check if user has already seen the popup (stored in localStorage)
    const hasSeenPopup = localStorage.getItem('locationPopupSeen');

    if (!hasSeenPopup) {
      setIsVisible(true);
      setIsOpen(true); // Open immediately without animation delay
      localStorage.setItem('locationPopupSeen', 'true');
    }
  }, []);

  // Prevent scrolling on main page when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Handle close animation
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setIsVisible(false), 300); // Wait for animation to complete
  };

  // Handle Magnifiko selection
  const handleMagnifiko = () => {
    handleClose();
    router.push('/');
  };

  // Handle Piccolo Magnifiko selection
  const handlePiccoloMagnifiko = () => {
    handleClose();
    router.push('/piccolo');
  };

  // Removed close on click outside and Escape key functionality
  // User must select a location to proceed

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background overlay with blur */}
      <div
        className="absolute inset-0 backdrop-blur-xl transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      />

      {/* Popup content */}
      <div
        ref={popupRef}
        className={`transition-all duration-300 ease-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          display: 'flex',
          padding: '2rem',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1.5rem',
          borderRadius: '0.75rem',
          background: '#101010',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          minWidth: '400px',
          maxWidth: '500px',
          position: 'relative',
          transformOrigin: 'center'
        }}
      >
        {/* Title */}
        <h2 style={{
          color: '#FFF2CC',
          fontFamily: 'Forum',
          fontSize: '1.5rem',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '1.8rem',
          textTransform: 'uppercase'
        }}>
          Je souhaite visiter:
        </h2>

        {/* Location options */}
        <div className="flex flex-col gap-4 w-full">
          {/* Magnifiko option */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <p style={{
              color: 'rgba(234, 234, 234, 0.90)',
              fontFamily: 'Forum',
              fontSize: '1rem',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '1.40625rem'
            }}>
              <strong style={{ color: '#FFF2CC' }}>Magnifiko,</strong><br />
              63 Bd Paul Vaillant Couturier, 94200 Ivry-Sur-Seine
            </p>
            <button
              onClick={handleMagnifiko}
              style={{
                display: 'flex',
                height: '2.5rem',
                padding: '0 2rem',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '0.625rem',
                background: '#FFF2CC',
                color: '#000',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontWeight: 400,
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4af37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFF2CC';
              }}
            >
              Magnifiko
            </button>
          </div>

          {/* Divider */}
          <div style={{
            width: '100%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.10)'
          }} />

          {/* Piccolo Magnifiko option */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <p style={{
              color: 'rgba(234, 234, 234, 0.90)',
              fontFamily: 'Forum',
              fontSize: '1rem',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '1.40625rem'
            }}>
              <strong style={{ color: '#FFF2CC' }}>Piccolo Magnifiko,</strong><br />
              60 rue Jean Baptiste Pigalle, 75009 Paris
            </p>
            <button
              onClick={handlePiccoloMagnifiko}
              style={{
                display: 'flex',
                height: '2.5rem',
                padding: '0 2rem',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '0.625rem',
                background: '#FFF2CC',
                color: '#000',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontWeight: 400,
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4af37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFF2CC';
              }}
            >
              Piccolo Magnifiko
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
