import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Piccolo Magnifiko Paris',
    default: 'Piccolo Magnifiko · Restaurant italien halal Paris 9e',
  },
  description:
    'Halal Italian restaurant in Pigalle (Paris 9e). Pinsa, pasta, brunch.',
  openGraph: {
    url: 'https://www.magnifiko.fr/piccolo',
  },
};

export default function PiccoloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
