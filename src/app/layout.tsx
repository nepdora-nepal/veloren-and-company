import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartSheet } from "@/components/cart/CartSheet";
import { Providers } from "./providers";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GLOW",
  description: "Glow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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

