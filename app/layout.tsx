import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import TrafficTracker from "@/components/TrafficTracker";

import { LayoutShell } from "@/components/layout-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Warlock Publishing",
  description: "Premium Digital Products & PLR",
};

export const dynamic = 'force-dynamic';

import CommandCenter from "@/components/CommandCenter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable} ${inter.variable} ${playfair.variable} ${spaceGrotesk.variable}`}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={`${outfit.className} antialiased bg-background text-foreground`} suppressHydrationWarning>
          <TrafficTracker />
          <CommandCenter />
          <LayoutShell
            navbar={
              <Suspense fallback={<div className="h-20 border-b bg-background/95 backdrop-blur-md" />}>
                <Navbar />
              </Suspense>
            }
            footer={<Footer />}
          >
            {children}
          </LayoutShell>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

