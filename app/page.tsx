import Link from "next/link";
import { ShoppingBag, Star, Zap, Globe, Shield, ArrowRight, Play, Download, Layers, Cpu, BookOpen, PenTool, Puzzle, GraduationCap, Sparkles, Palette, Briefcase, FileText, Monitor, Book, ChevronRight } from 'lucide-react';
import { HeroAuthButtons } from "@/components/hero-auth-buttons";

import { connectToDatabase } from "@/lib/db";
import GlobalSettings from "@/lib/models/GlobalSettings";
import SearchTrigger from "@/components/SearchTrigger";

export default async function Home() {
  let settings = {
    homeHeroImageUrl: '',
    siteTitle: 'World Builders',
    siteDescription: 'Discover a curated universe of premium digital assets, literary masterpieces, and creative software.'
  };

  try {
    await connectToDatabase();
    const rawSettings = await GlobalSettings.findOne().lean();
    if (rawSettings) {
        settings = JSON.parse(JSON.stringify(rawSettings));
    }
  } catch (err) {
    console.error('Failed to fetch settings, using defaults', err);
  }

  const categories = [
    { name: "Fiction Books", icon: <BookOpen className="w-6 h-6 text-cyan-400" />, count: "1,240+" },
    { name: "Non-Fiction", icon: <Book className="w-6 h-6 text-indigo-400" />, count: "850+" },
    { name: "Coloring Books", icon: <Palette className="w-6 h-6 text-pink-400" />, count: "420+" },
    { name: "Children’s", icon: <Sparkles className="w-6 h-6 text-yellow-400" />, count: "310+" },
    { name: "Puzzles & Games", icon: <Puzzle className="w-6 h-6 text-emerald-400" />, count: "180+" },
    { name: "Journals & Planners", icon: <PenTool className="w-6 h-6 text-orange-400" />, count: "640+" },
    { name: "Academic", icon: <GraduationCap className="w-6 h-6 text-blue-400" />, count: "520+" },
    { name: "Spirituality", icon: <Zap className="w-6 h-6 text-amber-400" />, count: "290+" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden pt-20">

      {/* Hero Section - Upgraded with Dynamic Image and Premium Visuals */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden border-b border-white/5">
        
        {/* Dynamic Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl px-4 pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Global Settings Hero Graphic Layer */}
        {settings.homeHeroImageUrl && (
            <div className="absolute inset-0 -z-20 opacity-40">
                <img 
                    src={settings.homeHeroImageUrl} 
                    alt="Hero Visual" 
                    className="w-full h-full object-cover grayscale brightness-50 contrast-125 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
            </div>
        )}

        {/* Premium Grid Pattern Overlay */}
        <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              Live Broadcast: {settings.siteTitle}
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {settings.siteTitle.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i % 2 !== 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-gradient" : ""}>
                      {word}{' '}
                  </span>
              ))}
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {settings.siteDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-3xl justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Link href="/products" className="relative w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                  Explore Library <ArrowRight size={18} strokeWidth={3} />
                </Link>
              </div>
              
              <SearchTrigger />
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-slate-500 text-xs font-bold tracking-widest uppercase opacity-50">
              <div className="flex items-center gap-3">
                <Globe size={16} /> <span>Global Network</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={16} /> <span>Verified Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Layers size={16} /> <span>15k+ Products</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Inspired by Image 1 & 3 */}
      <section id="categories" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Catalog</h2>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                BROWSE BY <br /> <span className="text-slate-500">CATEGORY</span>
              </h3>
            </div>
            <Link href="/products" className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                View full directory <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link href={`/products?category=${encodeURIComponent(category.name)}`} key={index} className="group relative bg-[#0f172a] p-8 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 flex flex-col items-start overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                    {category.icon}
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors border border-white/5 group-hover:border-primary/20">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">{category.name}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{category.count} items</p>
                
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight size={12} strokeWidth={3} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature / Why Us - Inspired by Image 2 */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                <Zap className="w-7 h-7 text-primary" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">INSTANT ACCESS</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Direct infrastructure for immediate delivery. Access your premium assets the millisecond your purchase is confirmed.
              </p>
              <div className="h-1 w-12 bg-primary/50 rounded-full"></div>
            </div>

            <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20">
                <Shield className="w-7 h-7 text-indigo-400" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">SECURE RIGHTS</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Commercial-first licensing models. Every asset comes with clear, legally-vetted usage rights for your projects.
              </p>
              <div className="h-1 w-12 bg-indigo-500/50 rounded-full"></div>
            </div>

            <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-8 border border-pink-500/20">
                <ShoppingBag className="w-7 h-7 text-pink-400" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">CURATED QUALITY</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Manually vetted ecosystems. We reject 90% of submissions to ensure only the highest caliber assets reach your hands.
              </p>
              <div className="h-1 w-12 bg-pink-500/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Newsletter - Inspired by Image 3 */}
      <section className="py-32 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-primary/[0.02]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
            READY FOR THE <br /> <span className="text-primary">NEXT FRONTIER?</span>
          </h2>
          <p className="text-slate-400 mb-12 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Join the inner circle of 50,000+ elite creators. Get premium insights and early access to drops every week.
          </p>

          <div className="relative max-w-lg mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-all"></div>
            <div className="relative flex flex-col sm:flex-row gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <input
                type="email"
                placeholder="Enter your transmission address"
                className="flex-1 bg-transparent text-white px-6 py-4 rounded-xl focus:outline-none text-sm font-medium placeholder-slate-600"
                />
                <button className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all">
                Access Now
                </button>
            </div>
          </div>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mt-8">
            Transmission secure <span className="mx-2">|</span> Zero latency <span className="mx-2">|</span> No spam
          </p>
        </div>
      </section>
    </div>
  );
}
