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
import CommandCenter from "@/components/CommandCenter";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: {
    default: "Warlock Publishing",
    template: "%s | Warlock Publishing"
  },
  description: "Premium Digital Products, PLR Assets & Marketing Intelligence for Creators.",
  keywords: ["PLR", "Digital Products", "Publishing", "Ebooks", "Marketing"],
  authors: [{ name: "Warlock Publishing" }],
  creator: "Warlock Publishing",
  publisher: "Warlock Publishing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Warlock Publishing",
    description: "Premium Digital Products & PLR",
    url: "https://warlockpublishing.com",
    siteName: "Warlock Publishing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warlock Publishing",
    description: "Premium Digital Products & PLR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable} ${inter.variable} ${playfair.variable} ${spaceGrotesk.variable}`}>
        <head>
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
