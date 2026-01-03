'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '@/components/layout';
import { PublicFooter } from '@/components/common/PublicFooter';
import TestimonialCard from '@/components/TestimonialCard';
import MenuCard from '@/components/MenuCard';
import SectionHeader from '@/components/SectionHeader';
import content from '@/data/content.json';
import { useTranslation } from '@/contexts/LanguageContext';
import { getRestaurantConfig, RestaurantId } from '@/config/restaurants';
import { LocationSelectionPopup } from '@/components/LocationSelectionPopup';

interface HomePageProps {
  restaurantId?: RestaurantId;
}

export default function HomePage({ restaurantId = 'magnifiko' }: HomePageProps) {
  const { t } = useTranslation();
  const restaurantConfig = getRestaurantConfig(restaurantId);

  // Custom navigation items for piccolo
  const primaryItems = restaurantId === 'piccolo'
    ? [{ label: 'nav.certifications', href: '/piccolo/certifications' }]
    : [{ label: 'nav.certifications', href: '/Certifications-halal' }];

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
      {/* Location Selection Popup - Only show on main Magnifiko page */}
      {restaurantId === 'magnifiko' && <LocationSelectionPopup />}

      {/* Navigation */}
      <Navigation
        logo={restaurantConfig.logo}
        logoLink={restaurantId === 'piccolo' ? '/piccolo' : '/'}
        primaryItems={primaryItems}
        desktopItems={desktopItems}
      />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
        {/* Image Background (Alternative to Video) */}
        <Image
          src={restaurantId === 'piccolo' ? '/images/piccolo/Home/Piccolo Home Hero.jpeg' : '/images/HeroLatestImage.jpeg'}
          alt="Restaurant hero"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />

        {/* Video Background - COMMENTED OUT FOR EASY RESTORATION
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={content.hero.videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        */}

        {/* Dark Overlay over entire background */}
        <div className="absolute" style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          top: 0,
          left: 0
        }}></div>

        <div className="relative z-10 text-center">
          <h1 className="font-eb-garamond text-4xl md:text-4xl lg:text-6xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-8 px-4 whitespace-pre-line" suppressHydrationWarning>
            {restaurantId === 'piccolo' ? 'BIENVENUE CHEZ\nPICCOLO MAGNIFIKO' : t('home.hero.title')}
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
                {t('home.experience.subtitle')}
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
                {restaurantId === 'piccolo' ? "Une expérience unique au cœur de Paris" : t('home.experience.title')}
              </h2>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                {t('home.experience.description')}
              </p>
            </div>

            {/* Center Column - Restaurant Interior */}
            <div className="relative w-full" style={{ aspectRatio: '348/447' }}>
              <Image
                src={restaurantId === 'piccolo' ? '/images/piccolo/Home/Piccolo Entrance.jpeg' : content.experience.images.interior}
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
                  src={restaurantId === 'piccolo' ? '/images/piccolo/Home/Piccolo Interior.jpeg' : content.experience.images.pasta}
                  alt="Pasta dish"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section id="menu" className="py-5 bg-[#000000] w-full overflow-hidden">
        <div className="px-5">
          <SectionHeader
            subtitle={t('home.menu.subtitle')}
            title={t('home.menu.title')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            <MenuCard
              title={t('home.menu.pasta.title')}
              description={t('home.menu.pasta.description')}
              note={t('home.menu.pasta.note')}
              image={content.menu.items[0].image}
            />
            <MenuCard
              title={t('home.menu.pizza.title')}
              description={t('home.menu.pizza.description')}
              note=""
              image={content.menu.items[1].image}
            />
            <MenuCard
              title={t('home.menu.desserts.title')}
              description={t('home.menu.desserts.description')}
              note=""
              image={content.menu.items[2].image}
            />
          </div>

          {/* View Menu Button */}
          <div className="flex justify-center mt-6">
            <Link href={restaurantId === 'piccolo' ? '/piccolo/menu' : '/menu'}>
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
                {restaurantId === 'piccolo' ? "Découvrez le menu piccolo" : t('home.menu.button')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Opening Hours Section */}
      <section id="hours" className="relative py-32 w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={restaurantId === 'piccolo' ? '/images/piccolo/Home/Piccolo Interior.jpeg' : content.hours.backgroundImage}
            alt="Restaurant interior evening"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
        </div>

        <div className="relative z-10 text-center">
          <p style={{
            color: '#EAEAEA',
            textAlign: 'center',
            fontFamily: 'Forum',
            fontSize: '1rem',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '1.40625rem',
            textTransform: 'uppercase'
          }} className="mb-4">{t('home.hours.subtitle')}</p>
          <h2 style={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'EB Garamond',
            fontSize: '3rem',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '3rem',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }} suppressHydrationWarning>
            {t('home.hours.title')}
          </h2>
          <h3 style={{
            color: '#d4af37',
            textAlign: 'center',
            fontFamily: 'EB Garamond',
            fontSize: '3rem',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '3rem',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }} suppressHydrationWarning>
            {restaurantId === 'piccolo' ? "11H-23H" : t('home.hours.hours')}
          </h3>
          <p style={{
            color: '#EAEAEA',
            textAlign: 'center',
            fontFamily: 'Forum',
            fontSize: '1rem',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '1.40625rem'
          }}>
            {restaurantId === 'piccolo' ? "(Sauf Vendredi 14h-Minuit et Samedi 11h-Minuit)" : t('home.hours.note')}
          </p>
        </div>
      </section>

      {/* Fifth Section - Similar to Experience Section */}
      <section className="py-5 w-full overflow-hidden">
        <div className="px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
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
                {t('home.secrets.subtitle')}
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
                {t('home.secrets.title')}
              </h2>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                {t('home.secrets.paragraph1')}
              </p>
              <p style={{
                color: 'rgba(234, 234, 234, 0.70)',
                fontFamily: 'Forum',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '1.40625rem'
              }}>
                {t('home.secrets.paragraph2')}
              </p>
            </div>

            {/* Right Column - Image */}
            <div className="relative w-full" style={{ aspectRatio: '348/447' }}>
              <Image
                src={content.secrets.image}
                alt={content.secrets.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-5 bg-[#000000] w-full overflow-hidden">
        <div className="px-6">
          <SectionHeader
            subtitle={t('home.testimonials.subtitle')}
            title={t('home.testimonials.title')}
          />

          <div className="grid md:grid-cols-3 gap-4">
            {content.testimonials.items.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                rating={testimonial.rating}
                title={testimonial.title}
                description={testimonial.description}
                author={testimonial.author}
                link={testimonial.link}
                fillHeight={index < 2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter restaurantId={restaurantId} />
    </div>
  );
}
