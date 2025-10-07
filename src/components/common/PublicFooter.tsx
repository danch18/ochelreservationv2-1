import { Footer } from '@/components/layout';

export function PublicFooter() {
  return (
    <div id="contact">
      <Footer
        logo={{
          src: "/icons/MagnifikoLogo.png",
          alt: "Magnifiko Restaurant",
          width: 100,
          height: 34
        }}
        backgroundColor="bg-black"
        sections={[
          {
            title: 'Liens Rapides',
            items: [
              { label: 'Accueil', href: '/' },
              { label: 'Menu', href: '/menu' },
              { label: 'À Propos', href: '#about' },
              { label: 'Contact', href: '#contact' },
            ],
          },
          {
            title: 'Information',
            items: [
              { icon: "/icons/footer/location.svg", label: '63 Bd Paul Vaillant Couturier,', text: '63 Bd Paul Vaillant Couturier, 94200 Ivry-sur-Seine, France' },
              { icon: "/icons/footer/phone.svg", label: '01 49 59 00 94', text: '01 49 59 00 94' },
              { icon: "/icons/footer/envelop.svg", label: 'compte.magnifiko@gmail.com', text: 'compte.magnifiko@gmail.com' },
            ],
          },
          {
            title: 'Horaires',
            items: [
              { label: 'Ouvert tous les jours', text: 'Ouvert tous les jours' },
              { label: '11h - Minuit', text: '11h - Minuit' },
              { label: 'Vendredi', text: 'Vendredi' },
              { label: '14h - Minuit', text: '14h - Minuit' },
            ],
          },
        ]}
        socialLinks={[
          { label: 'Instagram', href: '#', icon: 'instagram' },
          { label: 'Facebook', href: '#', icon: 'facebook' },
          { label: 'TikTok', href: '#', icon: 'tiktok' },
        ]}
        copyright="© 2025 Magnifiko. Tous droits réservés"
      />
    </div>
  );
}
