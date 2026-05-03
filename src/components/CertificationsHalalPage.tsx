'use client';

import Image from 'next/image';
import { Navigation } from '@/components/layout';
import { PublicFooter } from '@/components/common/PublicFooter';
import { useTranslation } from '@/contexts/LanguageContext';
import { getRestaurantConfig, RestaurantId } from '@/config/restaurants';

interface CertificationsHalalPageProps {
  restaurantId?: RestaurantId;
}

export default function CertificationsHalalPage({ restaurantId = 'magnifiko' }: CertificationsHalalPageProps) {
  const { t } = useTranslation();
  const restaurantConfig = getRestaurantConfig(restaurantId);

  // Custom navigation items for piccolo
  const primaryItems = restaurantId === 'piccolo'
    ? [{ label: 'nav.certifications', href: '/piccolo/certifications' }]
    : [{ label: 'nav.certifications', href: '/certifications-halal' }];

  const desktopItems = restaurantId === 'piccolo'
    ? [
      { label: 'nav.menu', href: '/piccolo/menu' },
      { label: 'nav.delivery', href: '#delivery', isDelivery: true },
    ]
    : [
      { label: 'nav.menu', href: '/menu' },
      { label: 'nav.delivery', href: '#delivery', isDelivery: true },
    ];

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden w-full max-w-full">
      {/* Navigation */}
      <Navigation
        logo={restaurantConfig.logo}
        logoLink={restaurantId === 'piccolo' ? '/piccolo' : '/'}
        primaryItems={primaryItems}
        desktopItems={desktopItems}
      />

      {/* Main Content Section */}
      <section className="pb-20 w-full overflow-hidden" style={{ paddingTop: '120px' }}>
        <div className="px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Left Column - Image */}
            <div className="relative w-full" style={{ aspectRatio: '348/297' }}>
              <Image
                src={restaurantId === 'piccolo' ? '/images/piccolo/certifications/Piccolo Halal Certificate.jpeg' : '/images/certificate.webp'}
                alt={restaurantId === 'piccolo' ? 'Achahada halal certification for Piccolo Magnifiko restaurant Paris 9e' : 'Achahada halal certification for Magnifiko restaurant Ivry-sur-Seine'}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Right Column - Content */}
            <div style={{
              display: 'flex',
              padding: '1rem',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.5625rem',
              alignSelf: 'stretch',
              borderRadius: '0.75rem',
              background: '#101010',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}>
              <div className="text-[#d4af37] font-forum text-sm tracking-[0.2em] uppercase">
                {t('certifications.subtitle')}
              </div>
              <h2 style={{
                color: '#FFF2CC',
                fontFamily: 'Forum',
                fontSize: '1.5rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.8rem',
                textTransform: 'uppercase'
              }} suppressHydrationWarning>
                {t('certifications.title')}
              </h2>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                {t(restaurantId === 'piccolo' ? 'certifications.description1_piccolo' : 'certifications.description1')}
              </p>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                {t('certifications.description2')}
              </p>

              {/* Button */}
              <button
                onClick={() => window.open(
                  restaurantId === 'piccolo'
                    ? 'https://achahada.com/les-restaurants/'
                    : 'https://www.instagram.com/reel/DJrLIVatQaS/?igsh=MWltdXNrajZkdmFqeA%3D%3D',
                  '_blank'
                )}
                style={{
                  display: 'flex',
                  height: '2.5rem',
                  padding: '0 3rem',
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
                  marginTop: '1rem'
                }}
              >
                {t('certifications.publication')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter restaurantId={restaurantId} />
    </div>
  );
}