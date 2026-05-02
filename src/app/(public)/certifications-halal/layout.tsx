import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Certifications Halal - Magnifiko | Restaurant Italien Certifié",
  description: "Magnifiko est certifié par Achahada, garantissant une cuisine italienne 100% halal. Découvrez nos certifications et notre engagement envers les standards halal les plus stricts.",
};

export default function CertificationsHalalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
