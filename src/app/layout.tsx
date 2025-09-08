import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClientProviders } from "@/components/providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ochel Restaurant - Fine Dining & Reservations",
  description: "Experience exceptional dining at ochel. Book your table for an unforgettable culinary journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
