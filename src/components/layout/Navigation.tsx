'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
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
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
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
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 ${className}`}>
        <div className="border border-[#4a3f35] shadow-lg" style={{ display: 'flex', padding: '0.375rem', justifyContent: 'center', alignItems: 'center', gap: '1rem', borderRadius: '3.75rem', background: '#1F1F1F', backdropFilter: 'blur(5px)' }}>
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
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 50}
                  height={logo.height || 17}
                  className="object-contain"
                />
              ) : (
                <div className="font-eb-garamond text-2xl font-bold tracking-wider text-white">
                  {brandText}
                </div>
              )}
            </div>

            {/* Main Navigation Items - Desktop */}
            <div className="hidden md:flex">
              <div className="px-6 py-2" style={{ borderRadius: '3.75rem', background: '#101010', border: '1px solid rgba(255, 255, 255, 0.10)', display: 'flex', gap: '0' }}>
                {primaryItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', padding: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
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
                  </div>
                ))}
              </div>
            </div>
        </div>
      </nav>

      {/* Expandable Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={toggleMenu}
        />
        
        {/* Menu Content */}
        <div
          className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] px-4 transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-[#1a1612] bg-opacity-95 backdrop-blur-sm rounded-2xl p-8 border border-[#4a3f35] shadow-xl">
            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Navigation */}
              <div className="space-y-4">
                <h3 className="font-eb-garamond text-lg text-[#d4af37] tracking-wider mb-4" suppressHydrationWarning>
                  NAVIGATION
                </h3>
                {primaryItems.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href} 
                    className="block font-eb-garamond text-white hover:text-[#d4af37] transition-colors text-lg tracking-wide"
                    onClick={handleLinkClick}
                    {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Secondary Navigation */}
              <div className="space-y-4">
                <h3 className="font-eb-garamond text-lg text-[#d4af37] tracking-wider mb-4" suppressHydrationWarning>
                  DISCOVER
                </h3>
                {secondaryItems.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href} 
                    className="block font-eb-garamond text-white hover:text-[#d4af37] transition-colors text-lg tracking-wide"
                    onClick={handleLinkClick}
                    {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            {contactInfo && (
              <div className="mt-8 pt-6 border-t border-[#4a3f35]">
                <div className="text-center">
                  {contactInfo.address.map((line, index) => (
                    <p key={index} className="font-forum text-[#c9b99b] text-sm mb-2">
                      {line}
                    </p>
                  ))}
                  <p className="font-forum text-[#c9b99b] text-sm mb-2">
                    Tél: {contactInfo.phone}
                  </p>
                  <p className="font-forum text-[#d4af37] text-sm">
                    {contactInfo.hours}
                  </p>
                </div>
              </div>
            )}

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex justify-center space-x-6 mt-6">
                {socialLinks.map((social, index) => (
                  <Link 
                    key={index}
                    href={social.href} 
                    className="text-[#8a7a68] hover:text-white transition-colors"
                    {...(social.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span className="sr-only">{social.label}</span>
                    {social.label === 'Facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                      </svg>
                    )}
                    {social.label === 'Instagram' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.896 11.906a.5.5 0 01-.5.5h-1.793a.5.5 0 01-.5-.5V8.094a.5.5 0 01.5-.5h1.793a.5.5 0 01.5.5v3.812z" clipRule="evenodd" />
                      </svg>
                    )}
                    {social.label === 'Twitter' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}