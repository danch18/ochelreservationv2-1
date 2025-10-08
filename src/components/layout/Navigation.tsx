'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { openDeliveryPopup } from '@/components/DeliveryPopup';

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  isReservation?: boolean;
  isDelivery?: boolean;
}

export interface NavigationProps {
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  brandText?: string;
  primaryItems?: NavigationItem[];
  secondaryItems?: NavigationItem[];
  contactInfo?: {
    address: string[];
    phone: string;
    email: string;
    hours: string;
  };
  socialLinks?: NavigationItem[];
  className?: string;
}

const defaultPrimaryItems: NavigationItem[] = [
  { label: 'Certifications halal', href: '/Certifications-halal' },
];

const defaultDesktopItems: NavigationItem[] = [
  { label: 'Menu', href: '/menu' },
  { label: 'Reservation', href: '#reservation', isReservation: true },
  { label: 'Livraison', href: '#delivery', isDelivery: true },
];

const defaultSecondaryItems: NavigationItem[] = [
  { label: 'Our Specialties', href: '#menu' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Back to Top', href: '#hero' },
  { label: 'Location', href: '#contact' },
];

const defaultContactInfo = {
  address: ['123 Avenue de la République', '94200 Ivry-sur-Seine'],
  phone: '01 23 45 67 89',
  email: 'contact@restaurant-lm.com',
  hours: 'Ouvert tous les jours • 11h00 - 00h00',
};

const defaultSocialLinks: NavigationItem[] = [
  { label: 'Facebook', href: '#', external: true },
  { label: 'Instagram', href: '#', external: true },
  { label: 'Twitter', href: '#', external: true },
];

export default function Navigation({
  logo,
  brandText = 'lm.',
  primaryItems = defaultPrimaryItems,
  secondaryItems = defaultSecondaryItems,
  contactInfo = defaultContactInfo,
  socialLinks = defaultSocialLinks,
  className = '',
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-[356px] md:w-auto ${className}`}>
        <div className="border border-[#4a3f35] shadow-lg" style={{ display: 'flex', padding: '0.375rem', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderRadius: '3.75rem', background: '#1F1F1F', backdropFilter: 'blur(5px)' }}>
            {/* Left side wrapper: Hamburger + Logo */}
            <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <div className="rounded-full flex items-center justify-center" style={{ width: '56px', height: '56px', backgroundColor: '#101010' }}>
              <button
                onClick={toggleMenu}
                className="relative flex flex-col justify-center items-center focus:outline-none group"
                style={{ width: '48px', height: '48px' }}
                aria-label="Toggle navigation menu"
              >
              {/* Hamburger Lines with Animation */}
              <span
                className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${
                  isOpen
                    ? 'rotate-45 translate-y-0.5'
                    : 'group-hover:-translate-y-1 -translate-y-1.5'
                }`}
                style={{ backgroundColor: '#EFE6D2' }}
              />
              <span
                className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${
                  isOpen
                    ? 'opacity-0'
                    : 'group-hover:opacity-0 opacity-100'
                }`}
                style={{ backgroundColor: '#EFE6D2' }}
              />
              <span
                className={`block w-6 h-0.5 transition-all duration-300 ease-in-out ${
                  isOpen
                    ? '-rotate-45 -translate-y-0.5'
                    : 'group-hover:translate-y-1 translate-y-1.5'
                }`}
                style={{ backgroundColor: '#EFE6D2' }}
              />
            </button>
            </div>

            {/* Logo/Brand */}
            <div className="flex items-center">
              {logo ? (
                <Link href="/">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width || 50}
                    height={logo.height || 17}
                    className="object-contain cursor-pointer"
                  />
                </Link>
              ) : (
                <Link href="/">
                  <div className="font-eb-garamond text-2xl font-bold tracking-wider text-white cursor-pointer">
                    {brandText}
                  </div>
                </Link>
              )}
            </div>
            </div>

            {/* Main Navigation Items */}
            {/* Mobile: Only show Menu link */}
            <div className="md:hidden">
              <div className="px-6 py-2" style={{ borderRadius: '3.75rem', background: '#101010', border: '1px solid rgba(255, 255, 255, 0.10)', display: 'flex', gap: '0' }}>
                <div style={{ display: 'flex', padding: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                  <Link
                    href="/menu"
                    className="hover:text-[#d4af37] transition-colors"
                    style={{
                      color: '#FFF',
                      fontFamily: 'Forum',
                      fontSize: '0.875rem',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '1.4rem',
                      letterSpacing: '-0.0175rem'
                    }}
                  >
                    Menu
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop: Show all items */}
            <div className="hidden md:block">
              <div className="px-6 py-2" style={{ borderRadius: '3.75rem', background: '#101010', border: '1px solid rgba(255, 255, 255, 0.10)', display: 'flex', gap: '0' }}>
                  {defaultDesktopItems.map((item, index) => (
                    <div key={index} style={{ display: 'flex', padding: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                      {item.isReservation ? (
                        <button
                          onClick={() => {
                            // Trigger reservation popup by posting message
                            const reservationButton = document.querySelector('[data-reservation-button]') as HTMLButtonElement;
                            if (reservationButton) {
                              reservationButton.click();
                            }
                          }}
                          className="hover:text-[#d4af37] transition-colors cursor-pointer bg-transparent border-none p-0"
                          style={{
                            color: '#FFF',
                            fontFamily: 'Forum',
                            fontSize: '0.875rem',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '1.4rem',
                            letterSpacing: '-0.0175rem'
                          }}
                        >
                          {item.label}
                        </button>
                      ) : item.isDelivery ? (
                        <button
                          onClick={() => {
                            // Trigger delivery popup
                            console.log('Delivery button clicked'); // Debug log
                            openDeliveryPopup();
                          }}
                          className="hover:text-[#d4af37] transition-colors cursor-pointer bg-transparent border-none p-0"
                          style={{
                            color: '#FFF',
                            fontFamily: 'Forum',
                            fontSize: '0.875rem',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '1.4rem',
                            letterSpacing: '-0.0175rem'
                          }}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="hover:text-[#d4af37] transition-colors"
                          style={{
                            color: '#FFF',
                            fontFamily: 'Forum',
                            fontSize: '0.875rem',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '1.4rem',
                            letterSpacing: '-0.0175rem'
                          }}
                          {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
              </div>
            </div>
        </div>
      </nav>

      {/* Expandable Menu */}
      <div
        className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
        style={{ width: '356px' }}
      >
        <div className="border border-[#4a3f35] shadow-lg" style={{
          display: 'flex',
          padding: '1.5rem',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          borderRadius: '20px',
          background: '#1F1F1F',
          backdropFilter: 'blur(5px)'
        }}>
          {/* Navigation Links */}
          <div className="space-y-4 w-full text-center">
            {primaryItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block hover:text-[#d4af37] transition-colors"
                style={{
                  color: '#FFF2CC',
                  fontFamily: 'Forum',
                  fontSize: '1.5rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.8rem',
                  textTransform: 'uppercase'
                }}
                onClick={handleLinkClick}
                {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile only: Reservation and Livraison buttons */}
            <div className="md:hidden space-y-4">
              <button
                onClick={() => {
                  handleLinkClick();
                  const reservationButton = document.querySelector('[data-reservation-button]') as HTMLButtonElement;
                  if (reservationButton) {
                    reservationButton.click();
                  }
                }}
                className="block w-full hover:text-[#d4af37] transition-colors cursor-pointer bg-transparent border-none p-0"
                style={{
                  color: '#FFF2CC',
                  fontFamily: 'Forum',
                  fontSize: '1.5rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.8rem',
                  textTransform: 'uppercase'
                }}
              >
                Reservation
              </button>

              <button
                onClick={() => {
                  handleLinkClick();
                  openDeliveryPopup();
                }}
                className="block w-full hover:text-[#d4af37] transition-colors cursor-pointer bg-transparent border-none p-0"
                style={{
                  color: '#FFF2CC',
                  fontFamily: 'Forum',
                  fontSize: '1.5rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.8rem',
                  textTransform: 'uppercase'
                }}
              >
                Livraison
              </button>
            </div>
          </div>

          {/* Google Logo */}
          <div className="mt-2">
            <Link
              href="https://www.google.com"
              className="text-[#8a7a68] hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">Google</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}