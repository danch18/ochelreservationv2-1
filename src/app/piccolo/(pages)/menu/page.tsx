'use client';

import { useEffect } from 'react';
import { cn } from '@/lib';
import MenuDisplay from '@/components/menu/MenuDisplay';
import { Navigation } from '@/components/layout';
import { PublicFooter } from '@/components/common/PublicFooter';
import { useTranslation } from '@/contexts/LanguageContext';
import { getRestaurantConfig } from '@/config/restaurants';
import Image from 'next/image';

/**
 * Piccolo Menu Page (Development Version)
 * This is at /piccolo/menu
 * Displays Piccolo restaurant menu items
 */
export default function PiccoloNextMenuPage() {
  const { t } = useTranslation();
  const restaurantConfig = getRestaurantConfig('piccolo');

  // Custom navigation items for piccolo
  const primaryItems = [
    { label: 'nav.certifications', href: '/piccolo/certifications' },
  ];

  const desktopItems = [
    { label: 'nav.menu', href: '/piccolo/menu' },
    { label: 'nav.delivery', href: '#delivery', isDelivery: true },
  ];

  useEffect(() => {
    // Ensure proper scrolling context for sticky positioning
    document.body.style.setProperty('overflow-x', 'hidden', 'important');
    document.body.style.setProperty('overflow-y', 'auto', 'important');
    document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
    document.documentElement.style.setProperty('overflow-y', 'auto', 'important');

    // Ensure body width is constrained
    document.body.style.setProperty('max-width', '100vw', 'important');
    document.documentElement.style.setProperty('max-width', '100vw', 'important');

    return () => {
      // Restore on unmount
      document.body.style.removeProperty('overflow-x');
      document.body.style.removeProperty('overflow-y');
      document.documentElement.style.removeProperty('overflow-x');
      document.documentElement.style.removeProperty('overflow-y');
      document.body.style.removeProperty('max-width');
      document.documentElement.style.removeProperty('max-width');
    };
  }, []);

  return (
    <>
      {/* Fixed Reservation Button */}
      <div className="fixed bottom-2 right-2 z-[9999] pointer-events-auto flex items-end justify-end">
        <a
          href="https://widget.thefork.com/fr/46f7a53e-30fb-4d0b-a4f3-9242e1455b71?step=date"
          target="_blank"
          rel="noopener noreferrer"
          className="w-auto px-4 py-3 rounded-full flex items-center justify-center text-[#FFF2CC] text-base font-semibold transform hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap hover:opacity-90 font-forum"
          style={{ backgroundColor: '#F34A23' }}
        >
          <Image
            src="/icons/Logo Black White.png"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
          <div className="w-px h-6 bg-[#FFF2CC] mx-3"></div>
          {t('piccolo.reservation.button')}
        </a>
      </div>

      {/* Navigation */}
      <Navigation
        logo={restaurantConfig.logo}
        logoLink="/piccolo"
        primaryItems={primaryItems}
        desktopItems={desktopItems}
      />

      {/* Main Layout - Two Equal Sections */}
      <div className="bg-[#000000] text-white font-forum">
        <div className="flex flex-col lg:flex-row relative">
          {/* Image Section - Left on desktop, Top on mobile/tablet */}
          <div className='w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex-shrink-0'>
            <div
              className={cn(
                "relative flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat h-[250px] md:h-[300px] lg:h-screen w-full"
              )}
              style={{ backgroundImage: 'url("/images/piccolo/Home/Tartare de saumon.jpg")' }}>
              {/* Dark overlay */}
              <div className="absolute" style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                top: 0,
                left: 0
              }}></div>

              {/* NOTRE MENU text in the middle */}
              <div className="text-center px-4 pt-16 lg:pt-0 relative z-10">
                <h1 className="text-[2.5rem] md:text-[3rem] font-normal tracking-normal text-white" suppressHydrationWarning>
                  {t('menuPage.title')}
                </h1>
              </div>
            </div>
          </div>

          {/* Content Section - Right on desktop, Bottom on mobile/tablet */}
          <div className="w-full lg:w-1/2 bg-[#000000] pt-[100px] min-h-screen">
            <MenuDisplay restaurantId="piccolo" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <PublicFooter restaurantId="piccolo" />
    </>
  );
}
