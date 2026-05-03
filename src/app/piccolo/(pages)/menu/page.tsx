import type { Metadata } from 'next';
import { fetchMenuDataServer } from '@/services/fetchMenuDataServer';
import PiccoloMenuPageClient from '@/components/menu/PiccoloMenuPageClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Découvrez le menu de Piccolo Magnifiko à Paris 9e : pinsa, pâtes fraîches, brunch et desserts italiens halal.',
  openGraph: {
    url: 'https://www.magnifiko.fr/piccolo/menu',
  },
};

export default async function PiccoloMenuPage() {
  const initialData = await fetchMenuDataServer('piccolo');

  return <PiccoloMenuPageClient initialData={initialData} />;
}
