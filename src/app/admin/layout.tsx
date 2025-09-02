import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - ochel Restaurant",
  description: "Restaurant administration dashboard for managing reservations and settings.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

