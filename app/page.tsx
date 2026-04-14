import Link from "next/link";
import Image from "next/image";
import { getFeaturedItems } from "@/lib/actions/product.actions";
import { ArrowRight, Globe, Shield, Layers, Users } from 'lucide-react';
import { connectToDatabase } from "@/lib/db";
import GlobalSettings from "@/lib/models/GlobalSettings";
import SearchTrigger from "@/components/SearchTrigger";
import BrandValues from "@/components/home/BrandValues";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewsletterForm from "@/components/home/NewsletterForm";
import { parseData } from "@/lib/utils";
import { constructMetadata } from "@/lib/seo";

export async function generateMetadata() {
  await connectToDatabase();
  const rawSettings = await GlobalSettings.findOne().lean();
  const settings: any = rawSettings ? parseData(rawSettings) : { siteTitle: 'Warlock Publishing', siteDescription: 'Enter the vault of elite digital assets.' };
  
  return constructMetadata({
    title: settings.siteTitle || 'Warlock Publishing',
    description: settings.siteDescription || 'Enter the vault of elite digital assets.',
  });
}

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  let settings = {
    homeHeroImageUrl: '',
    siteTitle: 'Warlock Publishing',
    siteDescription: 'Enter the vault of elite digital assets and literary mastery. Built for creators who refuse to settle for the ordinary.',
    heroOverlayColor: '#0c0c0e',
    heroOpacity: 60
  };

  let featuredProducts: any[] = [];

  try {
    await connectToDatabase();
    
    // Fetch Settings
    const rawSettings = await GlobalSettings.findOne().lean();
    if (rawSettings) {
        settings = { ...settings, ...parseData(rawSettings) };
    }

    featuredProducts = await getFeaturedItems();

  } catch (err) {
    console.error('Failed to fetch home data', err);
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30 selection:text-white overflow-x-hidden pt-16 md:pt-20">

      {/* Hero Section - The Mastery Vault Entrance */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Optimized Background Image Layer */}
        {settings.homeHeroImageUrl && (
            <div className="absolute inset-0 z-0 scale-105 pointer-events-none">
                <Image 
                    src={settings.homeHeroImageUrl}
                    alt={settings.siteTitle}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                {/* Dynamic Colored Overlay for Contrast */}
                <div 
                  className="absolute inset-0 mix-blend-multiply transition-opacity duration-1000"
                  style={{ 
                    backgroundColor: settings.heroOverlayColor || '#0c0c0e',
                    opacity: (settings.heroOpacity || 60) / 100 
                  }}
                ></div>

                {/* Gradients for text protection */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40"></div>
            </div>
        )}

        {/* Cinematic Texture Overlay */}
        <div className="absolute inset-0 -z-10 bg-[url('/noise.svg')] opacity-[0.15] pointer-events-none"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_60%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-secondary animate-pulse"></span>
              The Premier Literary Frontier
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-[0.9] md:leading-[0.85] mb-8 md:mb-10 max-w-6xl">
              {settings.siteTitle.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i % 2 !== 0 ? "text-secondary italic" : "block sm:inline"}>
                      {word}{' '}
                  </span>
              ))}
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-slate-200 mb-10 md:mb-14 max-w-2xl leading-relaxed italic font-serif">
                "{settings.siteDescription}"
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 w-full max-w-4xl justify-center">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-secondary rounded-2xl blur-lg opacity-25 group-hover:opacity-60 transition duration-1000"></div>
                <Link href="/products" className="relative w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-secondary text-black rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                  Explore The Vault <ArrowRight size={16} strokeWidth={3} />
                </Link>
              </div>
              
              <div className="w-full sm:w-auto">
                <SearchTrigger />
              </div>
            </div>

            {/* Social Proof Bar - Optimized for Mobile */}
            <div className="mt-16 md:mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-neutral-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] opacity-80 md:opacity-60">
              <div className="flex items-center gap-2 md:gap-3 border-r border-white/10 pr-6 last:border-0 last:pr-0">
                <Globe size={14} className="text-secondary" /> <span>Global Network</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 border-r border-white/10 pr-6 last:border-0 last:pr-0">
                <Shield size={14} className="text-secondary" /> <span>Verified Quality</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 border-r border-white/10 pr-6 last:border-0 last:pr-0 hidden sm:flex">
                <Layers size={14} className="text-secondary" /> <span>15k+ Products</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 hidden sm:flex">
                <Users size={14} className="text-secondary" /> <span>50k+ Creators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Vision Section */}
      <BrandValues />

      {/* Featured Vault Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="bg-neutral-900/40 relative">
          <FeaturedProducts products={featuredProducts} />
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-neutral-900/20 to-neutral-950">
        <div className="absolute inset-0 bg-secondary/[0.01] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-secondary/5 rounded-full blur-[160px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-secondary text-[10px] md:text-sm font-black uppercase tracking-[0.3em] mb-4">Access the Inner Circle</h2>
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
            New Drops. <br /> <span className="text-secondary italic">First in Line.</span>
          </h3>
          <p className="text-neutral-400 mb-10 md:mb-14 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            Get instant notifications for every new release, limited drop, and exclusive launch. Unsubscribe anytime.
          </p>

          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
