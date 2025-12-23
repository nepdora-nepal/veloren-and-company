import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartSheet } from "@/components/cart/CartSheet";
import { Providers } from "./providers";
import { AuthProvider } from "@/contexts/auth-context";

/* -----------------------------
   Fonts (Geist – CORRECT USAGE)
------------------------------ */


/* -----------------------------
   Metadata
------------------------------ */
export const metadata: Metadata = {
  title: {
    default: "GLOW | Premium Skincare & Beauty Essentials",
    template: "%s | GLOW",
  },
  description:
    "Discover your natural radiance with GLOW. Shop our curated collection of luxury skincare, beauty products, and wellness essentials for every skin type.",
  keywords: [
    "skincare",
    "beauty products",
    "luxury skincare",
    "natural beauty",
    "glow",
    "skincare routine",
    "beauty essentials",
  ],
  authors: [{ name: "GLOW Team" }],
  creator: "GLOW",
  publisher: "GLOW",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://glow-luxury.vercel.app",
    siteName: "GLOW",
    title: "GLOW | Premium Skincare & Beauty Essentials",
    description:
      "Discover your natural radiance with GLOW. Shop our curated collection of luxury skincare and beauty products.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GLOW Luxury Skincare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLOW | Premium Skincare & Beauty Essentials",
    description:
      "Discover your natural radiance with GLOW. Shop our curated collection of luxury skincare and beauty products.",
    images: ["/og-image.jpg"],
    creator: "@glowbeauty",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* -----------------------------
   Root Layout
------------------------------ */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        <Providers>
          <AuthProvider>
            <Toaster />
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <CartSheet />
            {children}
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
