'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Footer } from '@/components/layout';
export default function HomePage() {
  
  return (
    <div className="min-h-screen bg-[#1a1612] text-white overflow-x-hidden w-full max-w-full">
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
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/HeroImage.png)' }}
        >
          <div className="absolute inset-0 bg-[#1a1612] bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <h1 className="font-eb-garamond text-4xl md:text-6xl lg:text-8xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-8 px-4" suppressHydrationWarning>
            BIENVENUE CHEZ
          </h1>
          <div className="w-24 h-px bg-white mx-auto mb-8"></div>
          <p className="font-forum text-lg md:text-xl tracking-wide md:tracking-widest opacity-90 px-4">
            UNE EXPÉRIENCE CULINAIRE EXCEPTIONNELLE
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section id="about" className="py-24 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-eb-garamond text-4xl md:text-5xl font-light mb-8 leading-tight" suppressHydrationWarning>
                UNE EXPÉRIENCE UNIQUE AU CŒUR D'IVRY-SUR-SEINE
              </h2>
                <p className="font-forum text-[#c9b99b] leading-relaxed mb-6 text-lg">
                  Installé dans un cadre élégant et raffiné, notre restaurant vous propose une cuisine d'exception qui allie tradition et modernité. Chaque plat est préparé avec passion par notre chef et son équipe, utilisant uniquement des ingrédients de première qualité.
                </p>
                <p className="font-forum text-[#c9b99b] leading-relaxed mb-8 text-lg">
                  Découvrez nos spécialités dans une atmosphère chaleureuse et intimiste, parfaite pour vos dîners en amoureux, repas d'affaires ou célébrations entre amis.
                </p>
              <button className="border border-white px-8 py-3 font-eb-garamond tracking-wider hover:bg-white hover:text-black transition-all duration-300">
                DÉCOUVRIR NOTRE CARTE
              </button>
            </div>
            <div className="relative">
              <Image
                src="/api/placeholder/600/700"
                alt="Restaurant interior"
                width={600}
                height={700}
                className="object-cover"
              />
                <div className="absolute top-4 right-4 bg-[#1a1612] bg-opacity-70 px-4 py-2">
                  <p className="font-eb-garamond text-sm tracking-wider">DEPUIS 2020</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section id="menu" className="py-24 bg-[#2c2520] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-eb-garamond text-4xl md:text-5xl font-light mb-4" suppressHydrationWarning>NOS SPÉCIALITÉS</h2>
            <div className="w-24 h-px bg-white mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Plats */}
            <div className="text-center group cursor-pointer">
              <div className="relative mb-6 overflow-hidden">
                <Image
                  src="/api/placeholder/400/300"
                  alt="Plats signature"
                  width={400}
                  height={300}
                  className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-eb-garamond text-2xl mb-4 tracking-wider" suppressHydrationWarning>NOS PLATS</h3>
                <p className="font-forum text-[#c9b99b] leading-relaxed mb-6">
                  Une sélection raffinée de plats signature préparés avec des ingrédients d'exception et un savoir-faire artisanal.
                </p>
                <button className="text-[#d4af37] font-eb-garamond tracking-wider hover:text-white transition-colors">
                VOIR LA CARTE →
              </button>
            </div>

            {/* Pizzas */}
            <div className="text-center group cursor-pointer">
              <div className="relative mb-6 overflow-hidden">
                <Image
                  src="/api/placeholder/400/300"
                  alt="Pizza napolitaine"
                  width={400}
                  height={300}
                  className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-eb-garamond text-2xl mb-4 tracking-wider" suppressHydrationWarning>PIZZAS NAPOLITAINES</h3>
                <p className="font-forum text-[#c9b99b] leading-relaxed mb-6">
                  Authentiques pizzas napolitaines cuites au feu de bois, respectant la tradition italienne avec des ingrédients importés.
                </p>
                <button className="text-[#d4af37] font-eb-garamond tracking-wider hover:text-white transition-colors">
                VOIR LA CARTE →
              </button>
            </div>

            {/* Desserts */}
            <div className="text-center group cursor-pointer">
              <div className="relative mb-6 overflow-hidden">
                <Image
                  src="/api/placeholder/400/300"
                  alt="Desserts maison"
                  width={400}
                  height={300}
                  className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-eb-garamond text-2xl mb-4 tracking-wider" suppressHydrationWarning>DESSERTS HAUTEURS</h3>
                <p className="font-forum text-[#c9b99b] leading-relaxed mb-6">
                  Créations sucrées élaborées par notre chef pâtissier, alliant technique française et créativité contemporaine.
                </p>
                <button className="text-[#d4af37] font-eb-garamond tracking-wider hover:text-white transition-colors">
                VOIR LA CARTE →
              </button>
            </div>
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
          <div className="absolute inset-0 bg-[#1a1612] bg-opacity-70"></div>
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
      <section id="testimonials" className="py-24 bg-[#2c2520] w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
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
