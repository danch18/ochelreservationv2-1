'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Footer } from '@/components/layout';
export default function HomePage() {
  
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

      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/heroBackground.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay - Temporarily removed to test video */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-10"></div> */}
        
        <div className="relative z-10 text-center">
          <h1 className="font-eb-garamond text-4xl md:text-4xl lg:text-6xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-8 px-4" suppressHydrationWarning>
            BIENVENUE CHEZ
          </h1>
        </div>
      </section>

      {/* Experience Section */}
      <section id="about" className="py-5 w-full overflow-hidden">
        <div className="px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* Left Column - Text Content */}
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
                Notre Histoire
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
                UNE EXPÉRIENCE UNIQUE AU CŒUR D'IVRY-SUR-SEINE
              </h2>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                Magnifiko est né d'un rêve : créer un lieu où l'authenticité de l'Italie rencontre le respect des règles halal, dans un cadre moderne, familial et chaleureux. Nous sommes bien plus qu'un restaurant : nous sommes une référence de la cuisine italienne halal en Île-de-France, un espace de partage pour les amateurs de pâtes à l'italienne, de pizzas artisanales Napolitaine, de desserts traditionnels et de produits 100% halal et certifiés.
              </p>
            </div>

            {/* Center Column - Restaurant Interior */}
            <div className="relative w-full" style={{ aspectRatio: '348/447' }}>
              <Image
                src="/images/Interior.webp"
                alt="Restaurant interior"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Right Column - Pasta Image and Badge */}
            <div className="flex flex-col h-full" style={{ gap: '16px' }}>
              <div className="relative flex-1" style={{ minHeight: '370px' }}>
                <Image
                  src="/images/Pasta.webp"
                  alt="Pasta dish"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* DEPUIS 2020 Badge */}
              <div style={{
                display: 'flex',
                padding: '0.9375rem 1rem 1rem 1rem',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.625rem',
                alignSelf: 'stretch',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                background: '#101010'
              }}>
                <p style={{
                  color: '#FFF2CC',
                  fontFamily: 'Forum',
                  fontSize: '1.375rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.8rem',
                  textTransform: 'uppercase'
                }}>DEPUIS 2020</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section id="menu" className="py-5 bg-[#000000] w-full overflow-hidden">
        <div className="px-5">
          {/* Title Section */}
          <div className="mb-4 text-center">
            <div className="text-[#d4af37] font-forum text-sm tracking-[0.2em] uppercase mb-2">
              Notre Menu
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
              LUNCH
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* NOS PASTA */}
            <div className="flex flex-col h-full" style={{ gap: '16px' }}>
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src="/images/Nos Pasta.webp"
                  alt="Pasta dish"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div style={{
                display: 'flex',
                padding: '1rem',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5625rem',
                alignSelf: 'stretch',
                borderRadius: '0.75rem',
                background: '#101010',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                flex: '1'
              }}>
                <h3 style={{
                  color: '#FFF2CC',
                  fontFamily: 'Forum',
                  fontSize: '1.25rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.5rem',
                  textTransform: 'uppercase'
                }}>NOS PASTA</h3>
                <p style={{
                  color: 'rgba(234, 234, 234, 0.70)',
                  fontFamily: 'Forum',
                  fontSize: '0.875rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.25rem'
                }}>
                  Nos pâtes importées d'Italie sont sublimées par les sauces maison préparées par notre chef.
                </p>
                <div className="text-[#d4af37] text-sm">✓ Sans gluten disponible avec toutes nos pâtes</div>
              </div>
            </div>

            {/* PIZZAS NAPOLITAINES */}
            <div className="flex flex-col h-full" style={{ gap: '16px' }}>
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src="/images/Pizzas Napolitaines.webp"
                  alt="Pizza napolitaine"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div style={{
                display: 'flex',
                padding: '1rem',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5625rem',
                alignSelf: 'stretch',
                borderRadius: '0.75rem',
                background: '#101010',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                flex: '1'
              }}>
                <h3 style={{
                  color: '#FFF2CC',
                  fontFamily: 'Forum',
                  fontSize: '1.25rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.5rem',
                  textTransform: 'uppercase'
                }}>PIZZAS NAPOLITAINES</h3>
                <p style={{
                  color: 'rgba(234, 234, 234, 0.70)',
                  fontFamily: 'Forum',
                  fontSize: '0.875rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.25rem'
                }}>
                  Pizzas napolitaines cuites à la pierre, avec des farines italiennes de qualité supérieure et notre mozzarella fior di latte.
                </p>
              </div>
            </div>

            {/* DESSERTS ITALIENS */}
            <div className="flex flex-col h-full" style={{ gap: '16px' }}>
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src="/images/Deserts Italiens.webp"
                  alt="Desserts italiens"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div style={{
                display: 'flex',
                padding: '1rem',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5625rem',
                alignSelf: 'stretch',
                borderRadius: '0.75rem',
                background: '#101010',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                flex: '1'
              }}>
                <h3 style={{
                  color: '#FFF2CC',
                  fontFamily: 'Forum',
                  fontSize: '1.25rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.5rem',
                  textTransform: 'uppercase'
                }}>DESSERTS ITALIENS</h3>
                <p style={{
                  color: 'rgba(234, 234, 234, 0.70)',
                  fontFamily: 'Forum',
                  fontSize: '0.875rem',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '1.25rem'
                }}>
                  Découvrez nos desserts traditionnels italiens, des fraises à la crème aux panna cotta artisanales, préparés avec amour.
                </p>
              </div>
            </div>
          </div>

          {/* View Menu Button */}
          <div className="flex justify-center mt-6">
            <button style={{
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
              cursor: 'pointer'
            }}>
              Voir notre menu complet
            </button>
          </div>
        </div>
      </section>

      {/* Opening Hours Section */}
      <section id="hours" className="relative py-32 w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/api/placeholder/1920/800"
            alt="Restaurant interior evening"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#000000] bg-opacity-70"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <p className="font-forum text-lg tracking-[0.2em] mb-4 text-[#d4af37]">NOTRE CHEF CUISINÉ</p>
          <h2 className="font-eb-garamond text-3xl md:text-5xl lg:text-7xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-8" suppressHydrationWarning>
            TOUS LES JOURS
          </h2>
          <h3 className="font-eb-garamond text-2xl md:text-4xl lg:text-6xl font-light tracking-[0.1em] md:tracking-[0.2em] text-[#d4af37]" suppressHydrationWarning>
            11H - MINUIT
          </h3>
          <div className="mt-12">
            <button className="border border-white px-8 py-3 font-eb-garamond tracking-wider hover:bg-white hover:text-black transition-all duration-300">
              RÉSERVER UNE TABLE
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-[#000000] w-full overflow-hidden">
        <div className="px-6">
          <div className="text-center mb-16">
            <h2 className="font-eb-garamond text-4xl md:text-5xl font-light mb-4" suppressHydrationWarning>CE QU'DISENT NOS CLIENTS</h2>
            <div className="w-24 h-px bg-white mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Testimonial 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#d4af37] text-xl">★</span>
                ))}
              </div>
              <h3 className="font-eb-garamond text-xl mb-2 tracking-wider" suppressHydrationWarning>UN COUP DE CŒUR</h3>
              <p className="font-forum text-[#c9b99b] mb-6 italic leading-relaxed">
                "Une expérience culinaire exceptionnelle ! Le service est impeccable et chaque plat est une œuvre d'art. Un restaurant que je recommande vivement."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-[#4a3f35] rounded-full mr-3"></div>
                <div>
                  <p className="font-eb-garamond text-sm tracking-wider">Marie-Claire Dupont</p>
                  <p className="font-forum text-[#8a7a68] text-xs">Critique gastronomique</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#d4af37] text-xl">★</span>
                ))}
              </div>
              <h3 className="font-eb-garamond text-xl mb-2 tracking-wider" suppressHydrationWarning>"REFINED, MODERN CUISINE"</h3>
              <p className="font-forum text-[#c9b99b] mb-6 italic leading-relaxed">
                "Le cadre est magnifique et l'atmosphère très chaleureuse. Les pizzas napolitaines sont authentiques et délicieuses. Une adresse à retenir !"
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-[#4a3f35] rounded-full mr-3"></div>
                <div>
                  <p className="font-eb-garamond text-sm tracking-wider">Jean-Michel Bernard</p>
                  <p className="font-forum text-[#8a7a68] text-xs">Chef étoilé</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#d4af37] text-xl">★</span>
                ))}
              </div>
              <h3 className="font-eb-garamond text-xl mb-2 tracking-wider" suppressHydrationWarning>"EXQUISITE FRENCH CUISINE"</h3>
              <p className="font-forum text-[#c9b99b] mb-6 italic leading-relaxed">
                "Un service attentionné et une cuisine d'exception. Chaque détail est soigné, de l'amuse-bouche au dessert. Une expérience inoubliable."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-[#4a3f35] rounded-full mr-3"></div>
                <div>
                  <p className="font-eb-garamond text-sm tracking-wider">Sophie Martin</p>
                  <p className="font-forum text-[#8a7a68] text-xs">Blogueuse gastronomique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
