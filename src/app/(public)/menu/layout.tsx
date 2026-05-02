import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Menu - Magnifiko | Restaurant Italien Halal",
  description: "Découvrez le menu de Magnifiko : pizzas napolitaines, pâtes artisanales importées d'Italie, desserts traditionnels. Cuisine italienne 100% halal certifiée Achahada à Ivry-sur-Seine.",
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
