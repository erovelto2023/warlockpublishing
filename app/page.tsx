import Link from "next/link";
export const dynamic = "force-dynamic";
import { ArrowRight, Globe, Shield, Layers, Users, Zap, Search } from 'lucide-react';
import { connectToDatabase } from "@/lib/db";
import GlobalSettings from "@/lib/models/GlobalSettings";
import Product from "@/lib/models/Product";
import SearchTrigger from "@/components/SearchTrigger";
import BrandValues from "@/components/home/BrandValues";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewsletterForm from "@/components/home/NewsletterForm";

export default async function Home() {
  let settings = {
    homeHeroImageUrl: '',
    siteTitle: 'Warlock Publishing',
    siteDescription: 'Enter the vault of elite digital assets and literary mastery. Built for creators who refuse to settle for the ordinary.',
    heroOverlayColor: '#2D1B4E',
    heroOpacity: 40
  };

  let featuredProducts: any[] = [];

  try {
    await connectToDatabase();
    
    // Fetch Settings
    const rawSettings = await GlobalSettings.findOne().lean();
    if (rawSettings) {
        settings = JSON.parse(JSON.stringify(rawSettings));
    }

    const items = await getFeaturedItems();
    featuredProducts = items;

  } catch (err) {
    console.error('Failed to fetch home data', err);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30 selection:text-white overflow-x-hidden pt-20">

      {/* Hero Section - The Mastery Vault Entrance */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Background Image Layer */}
        {settings.homeHeroImageUrl && (
            <div 
                className="absolute inset-0 z-0 scale-105 pointer-events-none"
                style={{ 
                    backgroundImage: `url('${settings.homeHeroImageUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Dynamic Colored Overlay */}
                <div 
                  className="absolute inset-0 mix-blend-multiply"
                  style={{ 
                    backgroundColor: settings.heroOverlayColor || '#2D1B4E',
                    opacity: (settings.heroOpacity || 40) / 100 
                  }}
                ></div>

                {/* Vertical Gradients for contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80"></div>
            </div>
        )}

        {/* Cinematic Grid & Particles Overlay */}
        <div className="absolute inset-0 -z-10 bg-[url('/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_60%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              The Premier Literary Frontier
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-[0.85] mb-10 max-w-6xl">
              {settings.siteTitle.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i % 2 !== 0 ? "text-secondary italic" : "block md:inline"}>
                      {word}{' '}
                  </span>
              ))}
            </h1>
            
            <p className="text-lg lg:text-xl text-white mb-14 max-w-2xl leading-relaxed italic font-serif">
                "{settings.siteDescription}"
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 w-full max-w-4xl justify-center">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-secondary rounded-2xl blur-lg opacity-25 group-hover:opacity-60 transition duration-1000"></div>
                <Link href="/products" className="relative w-full sm:w-auto px-12 py-6 bg-secondary text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                  Explore The Vault <ArrowRight size={16} strokeWidth={3} />
                </Link>
              </div>
              
              <div className="w-full sm:w-auto">
                <SearchTrigger />
              </div>
            </div>

            {/* Social Proof Bar */}
            <div className="mt-20 flex flex-wrap items-center justify-center gap-12 text-neutral-500 text-[10px] font-black uppercase tracking-[0.25em] opacity-60">
              <div className="flex items-center gap-3 border-r border-white/10 pr-12 last:border-0 last:pr-0">
                <Globe size={14} className="text-secondary" /> <span>Global Network</span>
              </div>
              <div className="flex items-center gap-3 border-r border-white/10 pr-12 last:border-0 last:pr-0">
                <Shield size={14} className="text-secondary" /> <span>Verified Quality</span>
              </div>
              <div className="flex items-center gap-3 border-r border-white/10 pr-12 last:border-0 last:pr-0">
                <Layers size={14} className="text-secondary" /> <span>15k+ Products</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={14} className="text-secondary" /> <span>50k+ Creators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Vision Section (W.A.R.L.O.C.K. Acrostic) */}
      <BrandValues />

      {/* Featured Vault Section */}
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} />
      )}

      {/* CTA Section - The Final Frontier */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-neutral-900/20 to-neutral-950">
        <div className="absolute inset-0 bg-secondary/[0.01] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[160px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-secondary text-sm font-black uppercase tracking-[0.3em] mb-4">Access the Inner Circle</h2>
          <h3 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
            New Drops. <br /> <span className="text-secondary italic">First in Line.</span>
          </h3>
          <p className="text-neutral-400 mb-14 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            Get instant notifications for every new release, limited drop, and exclusive launch. Unsubscribe anytime.
          </p>

          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
