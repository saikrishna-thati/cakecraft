import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CakeCraft - Premium Cakes & Bakery | Order Online",
  description: "Handcrafted cakes for every celebration. Order premium birthday cakes, anniversary cakes, brownies, cupcakes, and more from CakeCraft bakery. Delivery across India.",
  keywords: ["cakes", "bakery", "online cake order", "birthday cake", "anniversary cake", "eggless cakes", "Indian bakery", "CakeCraft"],
  authors: [{ name: "CakeCraft Bakery" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "CakeCraft - Premium Cakes & Bakery",
    description: "Handcrafted cakes for every celebration. Order online for delivery across India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
