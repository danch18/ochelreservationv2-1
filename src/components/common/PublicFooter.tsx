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
            title: 'Quick Links',
            items: [
              { label: 'Home', href: '/' },
              { label: 'Menu', href: '/menu' },
              { label: 'About', href: '#about' },
              { label: 'Contact', href: '#contact' },
            ],
          },
          {
            title: 'Information',
            items: [
              { label: '63 Bd Paul Vaillant Couturier,', text: '63 Bd Paul Vaillant Couturier,' },
              { label: '94200 Ivry-sur-Seine, France', text: '94200 Ivry-sur-Seine, France' },
              { label: '01 49 59 00 94', text: '01 49 59 00 94' },
              { label: 'compte.magnifiko@gmail.com', text: 'compte.magnifiko@gmail.com' },
            ],
          },
          {
            title: 'Hours',
            items: [
              { label: 'Open every day', text: 'Open every day' },
              { label: '11am - Midnight', text: '11am - Midnight' },
              { label: 'Friday', text: 'Friday' },
              { label: '2pm - Midnight', text: '2pm - Midnight' },
            ],
          },
        ]}
        socialLinks={[
          { label: 'Instagram', href: '#', icon: 'instagram' },
          { label: 'Facebook', href: '#', icon: 'facebook' },
          { label: 'Twitter', href: '#', icon: 'twitter' },
        ]}
        copyright="© 2025 Magnifiko. All rights reserved"
      />
    </div>
  );
}
