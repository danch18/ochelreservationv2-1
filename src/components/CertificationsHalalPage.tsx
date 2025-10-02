'use client';

import Image from 'next/image';
import { Navigation, Footer } from '@/components/layout';

export default function CertificationsHalalPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden w-full max-w-full">
      {/* Navigation */}
      <Navigation
        logo={{
          src: "/icons/MagnifikoLogo.png",
          alt: "Magnifiko Restaurant",
          width: 50,
          height: 17
        }}
      />

      {/* Main Content Section */}
      <section className="pb-20 w-full overflow-hidden" style={{ paddingTop: '120px' }}>
        <div className="px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Left Column - Image */}
            <div className="relative w-full" style={{ aspectRatio: '348/297' }}>
              <Image
                src="/images/certificate.webp"
                alt="Certifications Halal"
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
                Nos Certifications
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
                CERTIFICATIONS HALAL
              </h2>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                Chez Magnifiko, nous nous engageons à respecter les plus hauts standards de certification halal. Tous nos ingrédients sont soigneusement sélectionnés et certifiés par des organismes reconnus pour garantir leur conformité aux règles islamiques.
              </p>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                Notre restaurant est certifié par Achahada, l'un des organismes de certification halal les plus respectés en France. Cette certification couvre l'ensemble de notre chaîne d'approvisionnement, de la sélection des fournisseurs à la préparation des plats.
              </p>

              {/* Button */}
              <button
                onClick={() => window.open('https://www.instagram.com/reel/DJrLIVatQaS/?igsh=MWltdXNrajZkdmFqeA%3D%3D', '_blank')}
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
                Publication Achahada
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}