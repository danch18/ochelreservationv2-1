'use client';

import Link from 'next/link';

export interface FooterSection {
  title: string;
  items: Array<{
    label: string;
    href?: string;
    text?: string;
    external?: boolean;
    highlight?: boolean;
  }>;
}

export interface FooterProps {
  brandInfo?: {
    name: string;
    description: string;
  };
  sections?: FooterSection[];
  socialLinks?: Array<{
    label: string;
    href: string;
    icon: 'facebook' | 'instagram' | 'twitter';
  }>;
  copyright?: string;
  backgroundColor?: string;
  className?: string;
}

const defaultBrandInfo = {
  name: 'lm',
  description: 'Restaurant gastronomique situé au cœur d\'Ivry-sur-Seine, proposant une cuisine d\'exception dans un cadre élégant et raffiné.',
};

const defaultSections: FooterSection[] = [
  {
    title: 'NOUS SITUER',
    items: [
      { label: '123 Avenue de la République', text: '123 Avenue de la République' },
      { label: '94200 Ivry-sur-Seine', text: '94200 Ivry-sur-Seine' },
      { label: 'Tél: 01 23 45 67 89', text: 'Tél: 01 23 45 67 89' },
      { label: 'contact@restaurant-lm.com', text: 'contact@restaurant-lm.com' },
    ],
  },
  {
    title: 'HORAIRES',
    items: [
      { label: 'Lundi - Dimanche', text: 'Lundi - Dimanche' },
      { label: '11h00 - 00h00', text: '11h00 - 00h00' },
      { label: 'Service continu', text: 'Service continu', highlight: true },
    ],
  },
];

const defaultSocialLinks = [
  { label: 'Facebook', href: '#', icon: 'facebook' as const },
  { label: 'Instagram', href: '#', icon: 'instagram' as const },
  { label: 'Twitter', href: '#', icon: 'twitter' as const },
];

const SocialIcon = ({ icon }: { icon: 'facebook' | 'instagram' | 'twitter' }) => {
  switch (icon) {
    case 'facebook':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.896 11.906a.5.5 0 01-.5.5h-1.793a.5.5 0 01-.5-.5V8.094a.5.5 0 01.5-.5h1.793a.5.5 0 01.5.5v3.812z" clipRule="evenodd" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      );
  }
};

export default function Footer({
  brandInfo = defaultBrandInfo,
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  copyright = '© 2024 Restaurant LM. Tous droits réservés.',
  backgroundColor = 'bg-[#1a1612]',
  className = '',
}: FooterProps) {
  return (
    <footer className={`${backgroundColor} py-16 w-full overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          {brandInfo && (
            <div className="md:col-span-2">
              <div className="font-eb-garamond text-3xl font-bold tracking-wider mb-6">
                {brandInfo.name}
              </div>
              <p className="font-forum text-[#c9b99b] mb-6 leading-relaxed">
                {brandInfo.description}
              </p>
            </div>
          )}

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-eb-garamond text-xl mb-6 tracking-wider" suppressHydrationWarning>
                {section.title}
              </h3>
              <div className="space-y-3 text-[#c9b99b] font-forum">
                {section.items.map((item, itemIndex) => {
                  if (item.href) {
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="block hover:text-[#d4af37] transition-colors"
                        {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  
                  return (
                    <p 
                      key={itemIndex} 
                      className={item.highlight ? 'text-[#d4af37] mt-4' : ''}
                    >
                      {item.text || item.label}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#4a3f35] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-forum text-[#8a7a68] text-sm">
            {copyright}
          </p>
          
          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex space-x-6 mt-4 md:mt-0">
              {socialLinks.map((social, index) => (
                <Link 
                  key={index}
                  href={social.href} 
                  className="text-[#8a7a68] hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.label}</span>
                  <SocialIcon icon={social.icon} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

// Named export for convenience
export { default as RestaurantFooter };