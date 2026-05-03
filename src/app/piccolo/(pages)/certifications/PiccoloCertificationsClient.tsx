'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import CertificationsHalalPage from '@/components/CertificationsHalalPage';
import Image from 'next/image';
import { useTranslation } from '@/contexts/LanguageContext';

export default function PiccoloCertificationsClient() {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
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

      <CertificationsHalalPage restaurantId="piccolo" />
    </ErrorBoundary>
  );
}
