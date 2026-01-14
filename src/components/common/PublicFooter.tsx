'use client';

import { Footer } from '@/components/layout';
import { useTranslation } from '@/contexts/LanguageContext';
import { RestaurantId } from '@/config/restaurants';

interface PublicFooterProps {
  restaurantId?: RestaurantId;
}

export function PublicFooter({ restaurantId = 'magnifiko' }: PublicFooterProps) {
  const { t } = useTranslation();

  const isPiccolo = restaurantId === 'piccolo';

  return (
    <div id="contact">
      <Footer
        logo={{
          src: isPiccolo ? "/images/piccolo/PICCOLO MAGNIFKO LOGO.svg" : "/icons/MagnifikoLogo.png",
          alt: isPiccolo ? "Piccolo Magnifiko" : "Magnifiko Restaurant",
          width: isPiccolo ? 100 : 100,
          height: isPiccolo ? 100 : 34
        }}
        brandInfo={{
          name: isPiccolo ? "Piccolo Magnifiko" : "Magnifiko",
          description: isPiccolo
            ? "Restaurant gastronomique situé au cœur de Paris, proposant une cuisine d'exception dans un cadre élégant et raffiné"
            : t('footer.description')
        }}
        backgroundColor="bg-black"
        sections={[
          {
            title: t('footer.quickLinks'),
            items: isPiccolo ? [
              { label: t('footer.home'), href: '/piccolo' },
              { label: t('footer.menu'), href: '/piccolo/menu' },
              { label: t('footer.about'), href: '#about' },
              { label: t('footer.contact'), href: '#contact' },
            ] : [
              { label: t('footer.home'), href: '/' },
              { label: t('footer.menu'), href: '/menu' },
              { label: t('footer.about'), href: '#about' },
              { label: t('footer.contact'), href: '#contact' },
            ],
          },
          {
            title: t('footer.information'),
            items: isPiccolo ? [
              { icon: "/icons/footer/location.svg", label: '60 Rue Jean-Baptiste Pigalle, 75009 Paris', text: '60 Rue Jean-Baptiste Pigalle, 75009 Paris' },
              { icon: "/icons/footer/phone.svg", label: '09 78 80 77 91', text: '09 78 80 77 91' },
              { icon: "/icons/footer/envelop.svg", label: 'compte.magnifiko@gmail.com', text: 'compte.magnifiko@gmail.com' },
            ] : [
              { icon: "/icons/footer/location.svg", label: '63 Bd Paul Vaillant Couturier,', text: '63 Bd Paul Vaillant Couturier, 94200 Ivry-sur-Seine, France' },
              { icon: "/icons/footer/phone.svg", label: '01 49 59 00 94', text: '01 49 59 00 94' },
              { icon: "/icons/footer/envelop.svg", label: 'compte.magnifiko@gmail.com', text: 'compte.magnifiko@gmail.com' },
            ],
          },
          {
            title: t('footer.hours'),
            items: isPiccolo ? [
              { label: t('piccolo.hours.monThu'), text: t('piccolo.hours.monThu') },
              { label: t('piccolo.hours.fri'), text: t('piccolo.hours.fri') },
              { label: t('piccolo.hours.sat'), text: t('piccolo.hours.sat') },
              { label: t('piccolo.hours.sun'), text: t('piccolo.hours.sun') },
            ] : [
              { label: t('footer.openDaily'), text: t('footer.openDaily') },
              { label: t('footer.hours1'), text: t('footer.hours1') },
              { label: t('footer.friday'), text: t('footer.friday') },
              { label: t('footer.hours2'), text: t('footer.hours2') },
            ],
          },
        ]}
        socialLinks={isPiccolo ? [
          { label: 'Instagram', href: 'https://www.instagram.com/magnifiko_piccolo/', icon: 'instagram' },
          { label: 'TikTok', href: 'https://www.tiktok.com/@magnifiko.piccolo?_r=1&_t=ZN-928DKVHgHpO', icon: 'tiktok' },
        ] : [
          { label: 'Instagram', href: '#', icon: 'instagram' },
          { label: 'Facebook', href: '#', icon: 'facebook' },
          { label: 'TikTok', href: '#', icon: 'tiktok' },
        ]}
        copyright={t('footer.copyright')}
      />
    </div>
  );
}
