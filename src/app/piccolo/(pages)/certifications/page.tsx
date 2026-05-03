import type { Metadata } from 'next';
import PiccoloCertificationsClient from './PiccoloCertificationsClient';

export const metadata: Metadata = {
  title: 'Certifications Halal',
  description:
    'Certifications halal de Piccolo Magnifiko à Paris 9e. Restaurant italien halal certifié Achahada.',
  openGraph: {
    url: 'https://www.magnifiko.fr/piccolo/certifications',
  },
};

export default function PiccoloCertificationsPage() {
  return <PiccoloCertificationsClient />;
}
