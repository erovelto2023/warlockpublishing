import React from 'react';
import Image from 'next/image';
import { getGlossaryTermBySlug, getRelatedGlossaryTerms, trackGlossaryView, searchYouTubeForTerm } from '@/lib/actions/glossary';
import { formatAmazonLink } from '@/lib/utils';
import { getPublishedProducts } from '@/lib/actions/product.actions';
import { getPublishedSalesPages } from '@/lib/actions/sales-page.actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  History as HistoryIcon, Globe, BookOpen, CheckCircle2, AlertTriangle, Zap, DollarSign, 
  ArrowRight, Copy, ChevronDown, ShoppingBag, Star, ExternalLink, 
  FileText, Users, Monitor, TrendingUp, Rocket, Compass, ShieldCheck,
  MessageSquareQuote, Youtube, Layout, Clock, Hash, Tag, Share2, 
  ListChecks, PieChart, UserCheck, ChevronRight, BookDashed, Sparkles,
  Target, Activity, Megaphone, Palette
} from 'lucide-react';
import StructuredData from '@/components/glossary/StructuredData';
import CopyPromptButton from '@/components/glossary/CopyPromptButton';
import PrintButton from '@/components/glossary/PrintButton';
import { constructMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { GlossaryTerm, Product, SalesPage } from '@/lib/types';
import TermTabs from '@/components/glossary/TermTabs';
import TableOfContents from '@/components/glossary/TableOfContents';
import ConnectivityHub from '@/components/glossary/ConnectivityHub';
import AmazonLibrarySection from '@/components/glossary/AmazonLibrarySection';
import { getAmazonProductsFromCsv } from '@/lib/actions/glossary';
import { AmazonProduct } from '@/lib/csv-parser';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await props.params;
    try {
        const term = await getGlossaryTermBySlug(slug) as GlossaryTerm | null;
        if (!term) return constructMetadata({ 
            title: 'Term Not Found', 
            description: 'The requested glossary term could not be located in our strategy database.' 
        });

        return constructMetadata({
            title: `${term.term} | Premium Strategy & Definition`,
            description: term.blogArticle?.metaDescription || term.shortDefinition || `Deep dive into ${term.term} for publishers and creators.`
        });
    } catch (err) {
        console.error("Metadata generation failed:", err);
        return constructMetadata({ 
            title: 'Glossary Strategy Node', 
            description: 'Explore premium publishing strategies and industry definitions.' 
        });
    }
}

export default async function RegistryDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    let term;
    try {
        term = await getGlossaryTermBySlug(params.slug) as GlossaryTerm | null;
    } catch (err) {
        console.error("Database fetch failed:", err);
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
                    <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase">System Maintenance</h1>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        We are currently optimizing our neural engine. This resource will be back online shortly. Please try refreshing the page.
                    </p>
                    <a 
                        href={`/glossary/${params.slug}`}
                        className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all text-center"
                    >
                        Retry Connection
                    </a>
                </div>
            </div>
        );
    }
    
    if (!term) return notFound();

    // Data orchestration for connected entities
    let relatedTerms: GlossaryTerm[] = [];
    let products: Product[] = [];
    let offers: SalesPage[] = [];
    
    let csvProducts: AmazonProduct[] = [];
    
    try {
        const results = await Promise.all([
            getRelatedGlossaryTerms(term.category || 'General', term.slug),
            getPublishedProducts(),
            getPublishedSalesPages(),
            getAmazonProductsFromCsv(term.term || term.slug)
        ]);
        relatedTerms = (results[0] || []) as GlossaryTerm[];
        products = (results[1] || []) as Product[];
        offers = (results[2] || []) as SalesPage[];
        csvProducts = results[3] || [];
    } catch (err) {
        console.error("Secondary data fetch failed:", err);
    };

    // Normalize both products and offers into a single rotation pool
    const normalizedProducts = (products || []).map((p: any) => ({
        id: p._id?.toString() || p.id || Math.random().toString(),
        title: p.title || 'Product Asset',
        price: p.price || '0.00',
        imageUrl: p.imageUrl || '',
        category: p.category || '',
        niche: p.niche || '',
        link: p.externalUrl || `/products/${p.slug || p._id || ''}`,
        isExternal: !!p.externalUrl,
        isFeaturedInRotation: p.isFeaturedInRotation !== false,
        type: 'product'
    }));

    const normalizedOffers = (offers || []).map((o: any) => ({
        id: o._id?.toString() || o.id || Math.random().toString(),
        title: o.title || 'Special Offer',
        price: o.price || '0.00',
        imageUrl: o.marketplaceImage || o.ogImage || '',
        category: o.category || '',
        niche: o.niche || '',
        link: o.externalUrl || `/offers/${o.slug || ''}`,
        isExternal: !!o.externalUrl,
        isFeaturedInRotation: o.isFeaturedInRotation !== false,
        type: 'offer'
    }));

    const fullPool = [...normalizedProducts, ...normalizedOffers];
    
    // Intelligent Contextual Matching
    // Prioritize items that match the term's category or niche
    const contextualMatches = fullPool.filter(item => 
        (item.category && (item.category === term.category || item.category === term.niche)) ||
        (item.niche && (item.niche === term.category || item.niche === term.niche))
    );

    const rotationPool = contextualMatches.length > 0 
        ? contextualMatches.filter(item => item.isFeaturedInRotation)
        : fullPool.filter(item => item.isFeaturedInRotation);

    // Choose a random item from the pool for rotation, or the pinned one
    const seed = term.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = seed % (rotationPool.length || 1);
    
    // The "Featured Resource" - pinned or best contextual match
    const featuredPoolItem = fullPool.find(item => item.id === term.marketplaceProduct?.productId) 
        || (rotationPool.length > 0 ? rotationPool[randomIndex] : fullPool[0]);

    // Related Products Gallery (bottom of page) - Up to 4 items from the same category/niche
    const relatedProducts = contextualMatches
        .filter(item => item.id !== featuredPoolItem?.id)
        .slice(0, 4);

    // Handle external vs internal linking (used in the UI)
    // Heuristic: If video is missing, try to find one
    let finalVideoUrl = term.videoUrl;
    try {
        if (!finalVideoUrl || finalVideoUrl.includes('example.com')) {
            const found = await searchYouTubeForTerm(term.term, term.category || '');
            if (found) finalVideoUrl = found.url;
        }
    } catch (err) {
        console.error("Auto-heal failed:", err);
    }
    
    // Robust YouTube Embed Formatter
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        try {
            let id = '';
            if (url.includes('v=')) id = url.split('v=')[1].split('&')[0];
            else if (url.includes('be/')) id = url.split('be/')[1].split('?')[0];
            else if (url.includes('shorts/')) id = url.split('shorts/')[1].split('?')[0];
            return id ? `https://www.youtube.com/embed/${id}` : url;
        } catch (e) {
            return url;
        }
    };
    
    const embedUrl = getEmbedUrl(finalVideoUrl || '');

    // Fire-and-forget view tracking (non-blocking)
    try {
        void trackGlossaryView(params.slug);
    } catch (err) {}

    const productLink = featuredPoolItem?.link || "/products";

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            <StructuredData term={term} />
            
            {/* SEO & Print Optimization Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .print-break { page-break-after: always; }
                    .card-content { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; margin-bottom: 20px !important; }
                }
            `}} />

            {/* Premium Header / Breadcrumb */}
            <div className="bg-[#F8FAFC]/80 border-b border-slate-200 sticky top-0 z-[50] backdrop-blur-xl no-print">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-16">
                        <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            <Link href="/" className="hover:text-indigo-600 transition-colors">Hub</Link>
                            <ChevronRight size={10} className="text-slate-400" />
                            <Link href="/glossary" className="hover:text-indigo-600 transition-colors">Directory</Link>
                            <ChevronRight size={10} className="text-slate-400" />
                            <span className="text-indigo-600">{term.term}</span>
                        </nav>
                        <div className="flex items-center gap-6">
                            <PrintButton />
                            <button className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest group">
                                <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 py-8 md:px-8 flex flex-col lg:flex-row justify-center gap-16 mt-4 relative">
                
                {/*  LEFT SIDEBAR: Table of Contents (Sticky)  */}
                <aside className="hidden xl:block w-64 flex-shrink-0">
                    <TableOfContents />
                </aside>
                
                {/*  MAIN CONTENT AREA  */}
                <div className="flex-1 max-w-4xl space-y-20 pb-32">
                    
                    {/*  PHASE 4.1: THE FEATURED SNIPPET BLOCK (SEO/SGE HOOK)  */}
                    <section className="bg-indigo-600 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Zap size={120} /></div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <Sparkles size={14} className="text-amber-400" /> AI Quick Guide
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase italic">
                                Everything you need to know about <span className="text-amber-400">{term.term}</span> in 30 seconds
                            </h2>
                            <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90 max-w-3xl border-l-4 border-white/30 pl-6">
                                {term.featuredSnippet || term.shortDefinition || `Mastering ${term.term} is the key to unlocking consistent narrative engagement and commercial authority in the ${term.category} niche.`}
                            </p>
                        </div>
                    </section>

                    {/*  PHASE 1: THE TOP-OF-FUNNEL GLOSSARY (SEO HOOK)  */}
                    <section className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden" id="definition">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -mr-24 -mt-24 opacity-60"></div>
                        <div className="relative z-10 space-y-12">
                            <div className="space-y-4">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">{term.category || 'Taxonomy'}</span>
                                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                                    {term.term}
                                </h1>
                                <p className="text-xl text-slate-600 leading-relaxed max-w-3xl font-medium">
                                    {term.definition}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 pt-10">
                                {/* Writing Aspect */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-indigo-600">
                                        <BookOpen size={20} />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Writing Aspect</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {term.writingAspect || `In a narrative context, ${term.term} functions as a structural catalyst, driving character development and pacing through established genre tropes.`}
                                    </p>
                                </div>
                                {/* Geo-Tagging */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-emerald-600">
                                        <Globe size={20} />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Geo-Tagging & Trends</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {term.geoTagging || `${term.term} is currently trending in North American and UK-based digital markets, particularly within the ${term.niche || 'publishing'} sector.`}
                                    </p>
                                </div>
                            </div>

                            {/* Common Myths */}
                            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 space-y-6">
                                <div className="flex items-center gap-3 text-rose-600">
                                    <AlertTriangle size={20} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Common Myths & Misconceptions</h3>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {(term.commonMyths && term.commonMyths.length > 0 ? term.commonMyths : [
                                        { myth: "It is too expensive for beginners.", fact: "You can start with $0 using organic reach." },
                                        { myth: "Only large publishers succeed.", fact: "Niche authority allows small creators to dominate." }
                                    ]).map((myth: any, i: number) => (
                                        <div key={i} className="space-y-3 p-4 bg-white rounded-2xl border border-rose-100 shadow-sm group hover:shadow-md transition-all">
                                            <div className="flex gap-4 items-start">
                                                <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-[10px]">✕</div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight line-through opacity-60">Myth: {myth.myth}</p>
                                            </div>
                                            <div className="flex gap-4 items-start pl-9">
                                                <div className="mt-0.5 shrink-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                <p className="text-xs font-black text-slate-900">{myth.fact}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*  PHASE 2: MIDDLE-OF-FUNNEL FRAMEWORK (EDUCATIONAL AUTHORITY)  */}
                    <section className="space-y-10" id="anatomy">
                        <div className="flex items-center justify-between px-2">
                             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                The Anatomy of <span className="text-indigo-600">{term.term}</span>
                             </h2>
                             <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8 opacity-50"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Structural Breakdown</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-20"></div>
                                <div className="flex items-center gap-4 text-indigo-600 mb-2">
                                    <Layout size={24} />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Structural Breakdown</h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {term.anatomy?.structuralBreakdown || `Every ${term.term} implementation relies on three core components: structural integrity, audience alignment, and commercial scalability. For books, this manifests as plot beats and character archetypes.`}
                                </p>
                            </div>
                            <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform text-white"><Star size={60} /></div>
                                <div className="flex items-center gap-4 text-indigo-400 mb-2">
                                    <Users size={24} />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-200">The Specialist&apos;s Perspective</h4>
                                </div>
                                <p className="text-sm text-indigo-100/70 leading-relaxed font-medium">
                                    {term.anatomy?.specialistPerspective || `From an expert lens, ${term.term} is not just a definition—it is an EEAT signal. Authors who master this nuance can command higher royalty rates and increased reader loyalty through authenticity.`}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/*  WRITERS MASTERCLASS: ARCHITECTURAL BLUEPRINT (NEW SECTION)  */}
                    <section className="bg-white border border-slate-200 rounded-[3.5rem] shadow-sm overflow-hidden" id="masterclass">
                        <div className="bg-indigo-600 p-10 md:p-14 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Palette size={180} /></div>
                            <div className="relative z-10 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100">
                                    <Sparkles size={12} /> Elite Education
                                </div>
                                <h2 id="masterclass" className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                                    Writers <span className="text-amber-400">Masterclass</span>
                                </h2>
                                <p className="text-lg md:text-xl font-medium opacity-90 max-w-3xl leading-relaxed">
                                    Learn to structure and write a book for <span className="font-black italic underline decoration-amber-400 decoration-2">{term.term}</span> that is both narratively satisfying and commercially profitable.
                                </p>
                            </div>
                        </div>

                        <div className="p-10 md:p-14 space-y-20">
                            {/* Intro Quote */}
                            <div className="max-w-4xl border-l-4 border-indigo-600 pl-10">
                                <p className="text-xl text-slate-600 font-medium leading-relaxed italic">
                                    &quot;In high-profit genres, success is rarely accidental; it follows a precise architectural blueprint. You must balance creative storytelling with the structural expectations of your target audience.&quot;
                                </p>
                            </div>

                            {/* Module 1: The Three-Act Foundation */}
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                            <span className="text-indigo-600 text-sm font-black border-2 border-indigo-600 rounded-lg w-8 h-8 flex items-center justify-center">1</span>
                                            The Global Structure
                                        </h3>
                                        <p className="text-sm text-slate-500 font-bold">The Three-Act Foundation is your protocol for managing reader engagement and &quot;time-on-page&quot; metrics.</p>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { act: "Act I: The Hook & Setup", range: "0–25%", desc: term.masterclass?.threeActStructure?.act1 || "Introduces the protagonist, their 'Ordinary World,' and the Inciting Incident that forces them into action." },
                                            { act: "Act II: The Confrontation", range: "25–75%", desc: term.masterclass?.threeActStructure?.act2 || "The 'meat' of the book where stakes rise. Protagonist stops reacting and starts taking control at the Midpoint." },
                                            { act: "Act III: Resolution", range: "75–100%", desc: term.masterclass?.threeActStructure?.act3 || "The final push toward the Climax and the eventual 'Happily Ever After' (HEA) or 'Happy For Now' (HFN)." }
                                        ].map((act, i) => (
                                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{act.act}</h5>
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{act.range}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{act.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Activity size={100} /></div>
                                    <h4 className="text-lg font-black uppercase tracking-tight text-indigo-400">The Profit Beats</h4>
                                    <div className="space-y-6">
                                        {(term.masterclass?.profitBeats && term.masterclass.profitBeats.length > 0 ? term.masterclass.profitBeats : [
                                            { title: "Save the Cat", timing: "Early Stage", description: "An early scene that makes readers like the protagonist instantly." },
                                            { title: "Pinch Points", timing: "35% & 60%", description: "The antagonist 'pinches' the protagonist, reminding readers of the stakes." },
                                            { title: "All is Lost", timing: "75%", description: "The emotional low point critical for creating a 5-star review payoff." },
                                            { title: "Grand Gesture", timing: "Climax", description: "The moment of maximum effort where the protagonist proves their growth." }
                                        ]).map((beat: any, i: number) => (
                                            <div key={i} className="flex gap-4 group/beat">
                                                <div className="shrink-0 w-1 bg-indigo-500/30 rounded-full group-hover/beat:bg-indigo-500 transition-colors"></div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black uppercase tracking-tight">{beat.title}</span>
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{beat.timing}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{beat.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Module 3 & 4: Archetypes & Technicals */}
                            <div className="grid md:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                            <Users size={24} className="text-indigo-600" /> Character Archetypes
                                        </h3>
                                        <p className="text-sm text-slate-500 font-bold">Profitability is driven by these three foundational character roles that readers search for.</p>
                                    </div>
                                    <div className="grid gap-6">
                                        {(term.masterclass?.characterArchetypes && term.masterclass.characterArchetypes.length > 0 ? term.masterclass.characterArchetypes : [
                                            { role: "The Alpha / Specialist", description: "At the top of their field (e.g., Billionaire, Elite Soldier, Master Detective)." },
                                            { role: "The Relatable Proxy", description: "The character the reader identifies with, usually starting from a place of disadvantage." },
                                            { role: "The Foil", description: "Highlights the protagonist's traits by being their stark opposite." }
                                        ]).map((char: any, i: number) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                                <div className="space-y-1">
                                                    <h6 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{char.role}</h6>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{char.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                            <Rocket size={24} className="text-indigo-600" /> Technical Components
                                        </h3>
                                        <p className="text-sm text-slate-500 font-bold">SEO & Discoverability components must be optimized before the writing begins.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2 group/tech">
                                            <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">The &quot;Power&quot; Title</h6>
                                            <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                                {term.masterclass?.technicalComponents?.powerTitle || "Must contain the primary keyword while remaining catchy."}
                                            </p>
                                        </div>
                                        <div className="space-y-2 group/tech">
                                            <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">The Tropes (Meta-Tags)</h6>
                                            <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                                {term.masterclass?.technicalComponents?.tropes?.join(', ') || "Using established tropes allows the algorithm to categorize your book correctly."}
                                            </p>
                                        </div>
                                        <div className="space-y-2 group/tech">
                                            <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">The Hook (Blurb Line)</h6>
                                            <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                                {term.masterclass?.technicalComponents?.hook || "The 'meta-description' that must present a conflict solvable only by reading."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-[3rem] p-10 md:p-14 space-y-12">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                            <Globe size={24} className="text-indigo-600" /> Geo-Optimization
                                        </h4>
                                        <div className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-indigo-100 shadow-sm">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Cultural Anchoring</span>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                {term.geoTagging || `Ground your book in a specific, searchable location (e.g., "Chicago Mafia" or "London Tech Startup"). This helps capture "Long-tail" search traffic and creates higher immersion.`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                            <Zap size={24} className="text-amber-500" /> AI Content Strategy
                                        </h4>
                                        <div className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-indigo-100 shadow-sm">
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">AI-Friendly Prose</span>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                Favor &quot;High-Readability&quot; scores (Grade 6–8 level). This ensures accessibility for a global audience and makes the content easily parsed by AI recommendation engines.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* The Profitability Checklist */}
                            <section className="bg-slate-900 text-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12"><ListChecks size={200} /></div>
                                <div className="relative z-10 space-y-12">
                                    <div className="space-y-4 text-center">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">The Profitability <span className="text-indigo-400">Checklist</span></h3>
                                        <p className="text-slate-400 font-medium">Verify these metrics before final export.</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                        {(term.masterclass?.profitabilityChecklist && term.masterclass.profitabilityChecklist.length > 0 ? term.masterclass.profitabilityChecklist : [
                                            "Does the first chapter end with a question that must be answered?",
                                            "Does every chapter move the protagonist closer to or further from their goal?",
                                            "Does the book satisfy the 'Top 3 Tropes' of its category?",
                                            "Is the ending satisfying enough to make the reader click 'Follow' or 'Buy Next'?"
                                        ]).map((item: string, i: number) => (
                                            <div key={i} className="flex gap-6 items-start p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                                                <div className="shrink-0 w-8 h-8 rounded-xl border-2 border-indigo-500 flex items-center justify-center text-indigo-500">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Verification {i + 1}</span>
                                                    <p className="text-sm font-medium text-slate-200">{item}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>

                    {/*  PHASE 3: BOTTOM-OF-FUNNEL DIRECTORY (THE SALES ENGINE)  */}
                    <section className="space-y-12" id="directory">
                        <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                                        <ShoppingBag size={14} /> The Sales Engine
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                        Curated <span className="text-indigo-600">Solutions</span> & Directory
                                    </h2>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="text-right">
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opportunity Score</p>
                                         <p className="text-2xl font-black text-emerald-600">{term.opportunityScore || '92'}/100</p>
                                     </div>
                                </div>
                            </div>

                            {/* Integrated Category Results */}
                            <div className="space-y-20">
                                {(term.directoryCategories && term.directoryCategories.length > 0 ? term.directoryCategories : [
                                    { name: "Top Recommended Assets", description: "Vetted books and digital products for this niche." }
                                ]).map((cat: any, idx: number) => {
                                    // Match internal products to this sub-category
                                    const internalCatMatches = fullPool.filter(item => 
                                        item.category?.toLowerCase() === cat.name?.toLowerCase() ||
                                        item.title?.toLowerCase().includes(term.term.toLowerCase())
                                    );

                                    // Match CSV products (by ASIN if provided, otherwise relevance)
                                    const csvMatches = cat.productIds?.length > 0 
                                        ? csvProducts.filter(p => cat.productIds.includes(p.asin))
                                        : (idx === 0 ? csvProducts.slice(0, 6) : []);

                                    // Interleave: Internal first, then CSV
                                    const combinedCategoryPool = [...internalCatMatches, ...csvMatches.map(p => ({
                                        id: p.asin,
                                        title: p.title,
                                        price: p.price || '9.99',
                                        imageUrl: p.imageUrl,
                                        link: formatAmazonLink(p.fullUrl || `https://www.amazon.com/dp/${p.asin}`),
                                        isExternal: true,
                                        type: 'amazon',
                                        rating: p.rating || '4.8'
                                    }))];

                                    if (combinedCategoryPool.length === 0) return null;

                                    return (
                                        <div key={idx} className="space-y-10">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-1 bg-indigo-600 rounded-full"></div>
                                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                                        {cat.name}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-slate-500 font-bold ml-16 max-w-2xl">{cat.description}</p>
                                            </div>

                                            {/* Dynamic Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {combinedCategoryPool.slice(0, 6).map((item: any, pIdx: number) => (
                                                    <Link 
                                                        key={pIdx}
                                                        href={item.link}
                                                        target={item.isExternal ? "_blank" : "_self"}
                                                        className="group bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 hover:bg-white hover:shadow-2xl hover:border-indigo-200 transition-all flex flex-col h-full relative"
                                                    >
                                                        {item.type !== 'amazon' && (
                                                            <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg z-10 border-2 border-white">
                                                                Internal Asset
                                                            </div>
                                                        )}
                                                        <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-8 shadow-xl relative bg-white">
                                                            <img 
                                                                src={item.imageUrl || '/images/placeholder-product.png'} 
                                                                alt={item.title} 
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        </div>
                                                        <h4 className="text-base font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                                            {item.title}
                                                        </h4>
                                                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
                                                            <span className="text-xl font-black text-slate-900">${item.price}</span>
                                                            <div className="flex items-center gap-2">
                                                                {item.rating && (
                                                                    <div className="flex items-center gap-1 text-amber-400 mr-2">
                                                                        <Star size={12} className="fill-current" />
                                                                        <span className="text-[11px] font-black text-slate-900">{item.rating}</span>
                                                                    </div>
                                                                )}
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                    Access
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Comparison/List View for this Category */}
                                            <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-200">
                                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Title</th>
                                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Type</th>
                                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {combinedCategoryPool.slice(0, 8).map((item: any, pIdx: number) => (
                                                            <tr key={pIdx} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors group/row">
                                                                <td className="px-8 py-5 font-bold text-slate-900 text-sm">{item.title.split(':')[0]}</td>
                                                                <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">
                                                                    {item.type === 'amazon' ? 'Amazon Reference' : 'Direct Access'}
                                                                </td>
                                                                <td className="px-8 py-5">
                                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.type === 'amazon' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                                        {item.type === 'amazon' ? 'Affiliate' : 'Warlock Verified'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-5">
                                                                    <Link 
                                                                        href={item.link}
                                                                        target={item.isExternal ? "_blank" : "_self"}
                                                                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2 group-hover/row:translate-x-1 transition-transform"
                                                                    >
                                                                        Explore <ArrowRight size={12} />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/*  PHASE 4: AI & SEARCH OPTIMIZATION (THE TECHNICAL LAYER)  */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Regional Trends */}
                        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <TrendingUp size={24} />
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Regional Trends</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                {term.regionalTrends || `Demand for ${term.term} is currently peaking in North America (High Interest) and the UK (Emerging Growth). European markets are showing significant interest in localized translations and adaptations.`}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-md border border-emerald-100">Expanding</span>
                            </div>
                        </section>

                        {/* Buyer's Checklist */}
                        <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-6">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <CheckCircle2 size={24} />
                                <h3 className="text-xl font-black uppercase tracking-tight text-white">The Buyer&apos;s Checklist</h3>
                            </div>
                            <div className="space-y-3">
                                {(term.buyersChecklist && term.buyersChecklist.length > 0 ? term.buyersChecklist : [
                                    "Verify author credentials or product materials.",
                                    "Check for compatibility with current tech stacks.",
                                    "Evaluate long-term scalability potential.",
                                    "Review community feedback and rating trends.",
                                    "Confirm affiliate eligibility for bonuses."
                                ]).map((item, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        <span className="text-sm font-medium text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/*  STRATEGIC PATH FORWARD (FINAL CALL TO ACTION)  */}
                    <section className="space-y-12 py-12" id="roadmap">
                        <div className="bg-slate-950 text-white rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl border border-white/5">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent)] pointer-events-none"></div>
                            
                            <div className="relative z-10 space-y-16">
                                <div className="text-center space-y-6 max-w-4xl mx-auto">
                                    <div className="inline-block px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">
                                        Strategic Path Forward
                                    </div>
                                    <h2 id="roadmap" className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                                        Turn Knowledge <br />
                                        Into <span className="text-indigo-500">Commercial Profit</span>
                                    </h2>
                                    <p className="text-lg md:text-xl font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                        Stop consuming. Start creating. Our vetted implementation tools are the difference between a &quot;hobbyist&quot; and a dominant market authority.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                        { title: "Eliminate Guesswork", desc: "Proven implementation protocols", icon: <Target size={24} /> },
                                        { title: "Strategic Blueprints", desc: "Expert-grade execution docs", icon: <FileText size={24} /> },
                                        { title: "Accelerated Revenue", desc: "Shorten your monetization path", icon: <TrendingUp size={24} /> }
                                    ].map((feature, i) => (
                                        <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 hover:bg-white/[0.08] transition-all">
                                            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-2">
                                                {feature.icon}
                                            </div>
                                            <h4 className="text-lg font-black uppercase tracking-tight">{feature.title}</h4>
                                            <p className="text-sm text-slate-400 font-medium">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col items-center gap-10 pt-8">
                                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                                        <Link 
                                            href={productLink}
                                            className="w-full md:w-auto px-12 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-4 group"
                                        >
                                            Claim Mastery Resource <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                        <Link 
                                            href="/glossary"
                                            className="w-full md:w-auto px-12 py-8 bg-white/5 text-white border border-white/10 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-4"
                                        >
                                            Browse Full Vault <ShoppingBag size={20} />
                                        </Link>
                                    </div>

                                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                            <ShieldCheck size={16} /> 100% Secure Access
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                            <Zap size={16} /> Instant Digital Delivery
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={16} /> Expert Vetted
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*  SIDEBAR CONTENT / VITAL SIGNS (Integrated as a section)  */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                             {/* Best Marketing Platforms */}
                             <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Megaphone size={24} /></div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Best Marketing Platforms</h3>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { rank: 1, platform: "Pinterest", priority: "High Priority Focus", color: "text-rose-600 bg-rose-50 border-rose-100" },
                                        { rank: 2, platform: "Instagram", priority: "High Priority Focus", color: "text-purple-600 bg-purple-50 border-purple-100" },
                                        { rank: 3, platform: "YouTube", priority: "Medium Priority Focus", color: "text-red-600 bg-red-50 border-red-100" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                                            <div className="flex items-center gap-6">
                                                <span className="text-2xl font-black text-slate-300 group-hover:text-indigo-600 transition-colors">{item.rank}</span>
                                                <span className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.platform}</span>
                                            </div>
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${item.color}`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                             </section>

                             {/* Content Catalog CTA */}
                             <section className="bg-indigo-600 text-white p-10 md:p-16 rounded-[3.5rem] shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><BookOpen size={120} /></div>
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">Visit our Content Catalog</h3>
                                    <p className="text-indigo-100 font-medium max-w-md leading-relaxed">
                                        Explore the full Warlock Digital Library. Get access to premium strategies, blueprints, and implementation tools.
                                    </p>
                                    <Link 
                                        href="/marketplace"
                                        className="inline-flex items-center gap-4 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all shadow-xl"
                                    >
                                        Enter Library <ArrowRight size={16} />
                                    </Link>
                                </div>
                             </section>
                        </div>

                        {/* Vital Signs Sidebar */}
                        <div className="space-y-8">
                            <section className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                                <div className="flex items-center gap-3 text-emerald-600">
                                    <Activity size={24} />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Entity Vital Signs</h3>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { label: "Market Status", value: term.marketDemand?.trendStatus || "Rising", color: "text-emerald-600 bg-emerald-50" },
                                        { label: "Potential", value: term.marketDemand?.monetizationPotential || "High", color: "text-blue-600 bg-blue-50" },
                                        { label: "Authority", value: "Verified", color: "text-indigo-600 bg-indigo-50" },
                                        { label: "Risk Level", value: "Low", color: "text-rose-600 bg-rose-50" }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex justify-between items-center pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${stat.color}`}>
                                                {stat.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Related Mastery Nodes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(term.relatedKeywords || [
                                        { keyword: "Monetization" }, { keyword: "Scaling" }, { keyword: "Authority" }
                                    ]).slice(0, 6).map((kw: any, i: number) => (
                                        <Link 
                                            key={i}
                                            href={`/glossary?search=${kw.keyword}`}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                                        >
                                            {kw.keyword}
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Offer Snapshot */}
                            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 text-rose-600">
                                    <ShoppingBag size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active Offer</span>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Claimed By My Boss</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-indigo-600">$2.99</span>
                                        <Link href={productLink} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                                            Visit Offer
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  EXTRA SECTIONS: Amazon Prime Reference Library (Dynamic CSV Integration)  */}
                    <AmazonLibrarySection 
                        term={term.term} 
                        category={term.category || 'General'} 
                        products={csvProducts}
                    />

                    {/*  9. COMMON PITFALLS  */}
                    <section className="p-10 md:p-14 bg-rose-50/50 border border-rose-100 rounded-[3rem] shadow-sm" id="pitfalls">
                        <div className="flex items-center gap-4 mb-10 text-rose-600">
                            <h2 id="pitfalls" className="text-2xl font-bold uppercase tracking-tight">Common Pitfalls</h2>
                        </div>
                        <div className="space-y-4">
                            {(term.commonPitfalls && term.commonPitfalls.length > 0 ? term.commonPitfalls : [
                                { pitfall: "Strategic Narrowing", whyItHappens: "Focusing too closely on one component.", howToAvoid: "Maintain structural breadth." }
                            ]).map((p: { pitfall?: string; risk?: string; whyItHappens?: string; logic?: string; howToAvoid?: string; protocol?: string }, i: number) => (
                                <div key={i} className="grid md:grid-cols-3 gap-6 p-8 bg-white border border-rose-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Challenge</span>
                                        <h5 className="text-[13px] font-bold text-slate-900 uppercase leading-tight">{p.pitfall || p.risk}</h5>
                                    </div>
                                    <div className="space-y-1 md:border-l border-slate-100 md:pl-6">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Solution</span>
                                        <p className="text-xs text-slate-600 leading-relaxed">{p.whyItHappens || p.logic}</p>
                                    </div>
                                    <div className="space-y-1 md:border-l border-slate-100 md:pl-6">
                                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Best Practice</span>
                                        <p className="text-xs text-slate-800 leading-relaxed font-semibold italic">{p.howToAvoid || p.protocol}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/*  10. YOUTUBE VIDEO INTEGRATION  */}
                    {term.videoUrl && (
                        <section className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-rose-600">
                                    <Youtube size={24} strokeWidth={2.5} />
                                    <h3 className="text-xl font-bold uppercase tracking-tight">Video Asset Integration</h3>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] px-3 py-1 bg-slate-50 border border-slate-100 rounded-md">Live Validation: Passed</span>
                            </div>
                            <div className="grid md:grid-cols-5 gap-8">
                                 <div className="md:col-span-3">
                                      <div className="w-full aspect-video bg-slate-900 rounded-2xl flex items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden group">
                                          <iframe 
                                              className="absolute inset-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
                                              src={embedUrl} 
                                              title="YouTube video player"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                              allowFullScreen
                                          ></iframe>
                                          <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay"></div>
                                      </div>
                                 </div>
                                 <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
                                      <h4 className="text-lg font-extrabold text-slate-900 leading-tight">Expert Analysis Overview</h4>
                                      <p className="text-xs text-slate-500 italic">Auto-search Query: &quot;{term.term} Strategies&quot;</p>
                                      <a href={term.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 flex items-center gap-2 hover:bg-indigo-100 transition-colors w-fit break-all">
                                          {term.videoUrl.substring(0, 30)}... <ExternalLink size={10} className="shrink-0" />
                                      </a>
                                 </div>
                            </div>
                        </section>
                    )}

                    {/*  11. BLOG / ARTICLE SECTION  */}
                    {term.blogArticle?.content && (
                        <section className="p-16 bg-white border border-slate-200 shadow-sm rounded-[4rem] relative overflow-hidden print-break" id="article">
                            <div className="absolute top-0 right-0 p-8 opacity-5"><FileText size={160}/></div>
                            <div className="mb-12 border-b border-slate-100 pb-8 relative z-10">
                                <div className="flex items-center gap-3 text-indigo-600 mb-6">
                                    <Layout size={20}/>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Blog & Editorial Center</h3>
                                </div>
                                <h2 id="article" className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter leading-tight italic mb-8">
                                    {term.blogArticle.title || `Mastering ${term.term}`}
                                </h2>
                                
                                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block border-b pb-1">Meta Description</span>
                                            <p className="text-[11px] text-slate-600 leading-normal italic">
                                            {term.blogArticle.metaDescription || "Optimized strategic content for publishers."}
                                            </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block border-b pb-1">Primary Keyword</span>
                                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
                                            {term.blogArticle.focusKeyword || term.term}
                                        </p>
                                    </div>
                                </div>

                                <div 
                                    className="prose prose-slate max-w-none relative z-10 text-slate-700 leading-relaxed font-serif text-[15px] prose-headings:font-sans prose-headings:uppercase"
                                    dangerouslySetInnerHTML={{ __html: term.blogArticle.content.replace(/\n\n/g, '<br/><br/>') }}
                                />
                                
                                {term.blogArticle.sources && term.blogArticle.sources.length > 0 && (
                                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-4 relative z-10">
                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">Sources & References</h5>
                                        <div className="flex flex-col gap-2">
                                            {term.blogArticle.sources.map((source: string, i: number) => (
                                                <span key={i} className="text-[11px] text-indigo-600 font-bold underline cursor-pointer">{source}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/*  12. MARKETING HOOK EXAMPLES  */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 px-2">
                            <Zap className="text-amber-500" size={24} /> Marketing Hook Examples
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                             <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-4">Video Hooks</h4>
                                  <ul className="space-y-3 text-[11px] font-medium text-slate-600 italic">
                                      {(term.youtubeTitles && term.youtubeTitles.length > 0 ? term.youtubeTitles : term.marketingHooks?.videoHooks || [`Stop Ignoring ${term.term}`]).map((h: string, i: number) => (
                                          <li key={i}>&quot;{h}&quot;</li>
                                      ))}
                                  </ul>
                             </div>
                             <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-4">Blog / Pin Angles</h4>
                                  <ul className="space-y-3 text-[11px] font-bold text-indigo-600">
                                      {(term.headlines && term.headlines.length > 0 ? term.headlines : term.marketingHooks?.blogTitles || [`How to implement ${term.term}`]).map((h: string, i: number) => (
                                          <li key={i}>&quot;{h}&quot;</li>
                                      ))}
                                  </ul>
                             </div>
                        </div>
                    </section>

                    {/*  13. RELATED KEYWORDS  */}
                    <section className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                         <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Related Keywords</h3>
                         <div className="flex flex-wrap gap-3">
                             {(term.relatedKeywords && term.relatedKeywords.length > 0 ? term.relatedKeywords : []).map((k, i) => (
                                 <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-3 hover: border-indigo-300 transition-all cursor-default">
                                      <span className="text-[11px] font-bold text-slate-600">{typeof k === 'string' ? k : (k as any).keyword || 'N/A'}</span>
                                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
                                 </div>
                             ))}
                             {(!term.relatedKeywords || term.relatedKeywords.length === 0) && (
                                <span className="text-sm text-slate-400 italic">No advanced keywords tracked.</span>
                             )}
                         </div>
                    </section>

                    {/*  14. 5 KEY TAKEAWAYS  */}
                    <section className="p-10 md:p-14 bg-indigo-600 text-white rounded-[3rem] shadow-xl relative overflow-hidden print-break">
                         <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><CheckCircle2 size={160} /></div>
                         <div className="relative z-10">
                              <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-10">Core Takeaways</h2>
                              <div className="grid gap-6">
                                  {(term.keyTakeaways && term.keyTakeaways.length > 0 ? term.keyTakeaways : [
                                      `${term.term} is a foundational strategic node.`,
                                      "Leverage the implementation checklist to secure immediate ROI.",
                                      "Monetize via specific, targeted product curation.",
                                      "Ensure your content maps to the primary audience.",
                                      "Consistency in deployment creates market authority."
                                  ]).slice(0, 5).map((t: string, i: number) => (
                                      <div key={i} className="flex items-start gap-4">
                                          <div className="mt-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px] shrink-0">{i+1}</div>
                                          <p className="text-lg font-light leading-snug">{t}</p>
                                      </div>
                                  ))}
                              </div>
                         </div>
                    </section>

                    {/*  15. AI PROMPT COMMAND CENTER  */}
                    <section className="p-10 md:p-14 bg-slate-900 text-white rounded-[3rem] relative overflow-hidden border border-slate-800" id="ai">
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent -z-10"></div>
                         <div className="flex items-center gap-3 mb-12">
                             <Zap className="text-amber-400" size={24} />
                             <h2 id="ai" className="text-2xl font-bold uppercase tracking-widest italic">AI Command Center</h2>
                         </div>
                         <div className="space-y-6">
                              {[
                                  { label: "Product Idea Pipeline", prompt: term.aiPromptCommandCenter?.productIdeaPrompt },
                                  { label: "Content Strategy Protocol", prompt: term.aiPromptCommandCenter?.contentStrategyPrompt },
                                  { label: "Visual Asset Synthesis", prompt: term.aiPromptCommandCenter?.aiImagePrompt }
                              ].filter(p => p.prompt).map((p, i) => (
                                  <div key={i} className="space-y-3">
                                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{p.label}</h4>
                                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-mono text-slate-400 relative group/prompt">
                                          <code className="block leading-relaxed">{p.prompt}</code>
                                          <div className="absolute top-3 right-3 opacity-0 group-hover/prompt:opacity-100 transition-opacity">
                                              <CopyPromptButton prompt={p.prompt as string} className="!p-2 !rounded-lg !bg-indigo-600 !text-white" />
                                          </div>
                                      </div>
                                  </div>
                              ))}
                         </div>
                    </section>

                    {/*  16. THE SOLUTION ROADMAP (ULTRA-PREMIUM REDESIGN)  */}
                    <section className="bg-slate-900 text-white rounded-[4rem] p-12 md:p-24 lg:p-32 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(49,46,129,0.5)] border border-slate-800" id="roadmap">
                        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600 rounded-full blur-[250px] opacity-20 -mr-96 -mt-96 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-emerald-600 rounded-full blur-[250px] opacity-10 -ml-96 -mb-96"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                        
                        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-24">
                            <div className="space-y-10">
                                <div className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-indigo-300 text-[11px] font-black uppercase tracking-[0.6em] rounded-full mx-auto backdrop-blur-xl shadow-2xl">
                                    <Sparkles size={16} className="text-amber-400" /> Strategic Path Forward
                                </div>
                                <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] italic uppercase">
                                    Turn Knowledge <br/> Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-emerald-400">Commercial Profit</span>
                                </h2>
                                <p className="text-2xl md:text-3xl text-slate-400 leading-relaxed font-light max-w-3xl mx-auto italic">
                                    Stop consuming. Start creating. Our vetted implementation tools are the difference between a &quot;hobbyist&quot; and a dominant market authority.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-10">
                                {[
                                    { title: "Eliminate Guesswork", desc: "Proven implementation protocols", icon: <Zap size={24}/> },
                                    { title: "Strategic Blueprints", desc: "Expert-grade execution docs", icon: <CheckCircle2 size={24}/> },
                                    { title: "Accelerated Revenue", desc: "Shorten your monetization path", icon: <TrendingUp size={24}/> }
                                ].map((benefit, i) => (
                                    <div key={i} className="bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] space-y-8 hover:bg-white/[0.07] transition-all group backdrop-blur-md relative overflow-hidden text-left">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all border border-white/5">
                                            {benefit.icon}
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-xl font-black uppercase tracking-tight text-white">{benefit.title}</h4>
                                            <p className="text-sm text-slate-500 font-bold leading-relaxed">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-16 pt-16 border-t border-white/10">
                                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                                    <Link 
                                        href={productLink}
                                        className="w-full md:w-auto px-20 py-10 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-xs hover:bg-slate-100 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center gap-6 group"
                                    >
                                        Claim Mastery Resource <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                    <Link 
                                        href="/products"
                                        className="w-full md:w-auto px-20 py-10 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-xs hover:bg-indigo-600/40 transition-all flex items-center justify-center gap-6 backdrop-blur-xl"
                                    >
                                        Browse Full Vault <ShoppingBag size={20} />
                                    </Link>
                                </div>
                                <div className="flex flex-wrap justify-center gap-12 opacity-30">
                                    <div className="flex items-center gap-3"><ShieldCheck size={16} /> <span className="text-[10px] font-black uppercase tracking-[0.5em]">100% Secure Access</span></div>
                                    <div className="flex items-center gap-3"><Clock size={16} /> <span className="text-[10px] font-black uppercase tracking-[0.5em]">Instant Digital Delivery</span></div>
                                    <div className="flex items-center gap-3"><UserCheck size={16} /> <span className="text-[10px] font-black uppercase tracking-[0.5em]">Expert Vetted</span></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*  17. RELATED PRODUCTS GALLERY  */}
                    {relatedProducts.length > 0 && (
                        <section className="space-y-8 no-print">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                                    <ShoppingBag className="text-indigo-600" size={24} /> Resource Library
                                </h2>
                                <Link href="/products" className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">View All Assets</Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {relatedProducts.map((item) => (
                                    <Link 
                                        key={item.id}
                                        href={item.link}
                                        className="group bg-white rounded-3xl border border-slate-200 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100 relative">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><BookDashed size={40} /></div>
                                            )}
                                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                Best Seller
                                            </div>
                                        </div>
                                        <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight mb-2">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                                            <span className="text-xs font-black text-indigo-600">${item.price || '0'}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                </div>

                {/*  SIDEBAR ELEMENTS  */}
                <aside className="lg:col-span-4 space-y-10 no-print">
                    
                    {/*  TOP RIGHT SIDEBAR: Marketplace Product Feature  */}
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group border border-indigo-400">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-full aspect-square bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 relative overflow-hidden">
                                 {featuredPoolItem?.imageUrl ? (
                                    <Image 
                                        src={featuredPoolItem.imageUrl} 
                                        alt={featuredPoolItem.title || 'Product'} 
                                        fill 
                                        className="object-cover rounded-3xl" 
                                    />
                                 ) : (
                                    <ShieldCheck size={80} className="text-indigo-200" />
                                 )}
                                 {featuredPoolItem?.type === 'offer' && (
                                     <div className="absolute top-4 left-4 px-3 py-1 bg-white text-indigo-700 text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Special Offer</div>
                                 )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-extrabold leading-tight">{featuredPoolItem?.title || "Premium Strategy Resource"}</h3>
                                <div className="flex items-center gap-2 font-bold"><span className="text-lg font-black">${featuredPoolItem?.price || "0.00"}</span></div>
                            </div>
                            <Link 
                                href={productLink} 
                                target={featuredPoolItem?.isExternal ? "_blank" : "_self"}
                                className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                            >
                                 {featuredPoolItem?.isExternal ? 'Visit Resource' : 'Visit Offer'} <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                    

                    {/*  Entity Vital Signs (New)  */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={60} /></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic underline decoration-emerald-200 underline-offset-4">
                             Entity Vital Signs
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Market Status</span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded w-fit block">
                                    {term.marketDemand?.trendStatus || 'Stable'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Potential</span>
                                <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded w-fit block">
                                    {term.marketDemand?.monetizationPotential || 'High'}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Authority</span>
                                <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded w-fit block">
                                    Verified
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Risk Level</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-50 px-2 py-1 rounded w-fit block">
                                    Low
                                </span>
                            </div>
                        </div>
                    </div>
                    {/*  Related Terms Cloud  */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic underline decoration-indigo-200 underline-offset-4">
                             Related Mastery Nodes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {relatedTerms.map((rt: { slug: string; term: string }, i: number) => (
                                <Link href={`/glossary/${rt.slug}`} key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all">
                                    {rt.term}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/*  Best Marketing Platforms  */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic border-b pb-4 lg:pb-0 border-slate-100">
                             Best Marketing Platforms
                        </h3>
                        <div className="space-y-6">
                             {(term.bestMarketingPlatforms && term.bestMarketingPlatforms.length > 0 ? term.bestMarketingPlatforms : [
                                 { platform: "Pinterest", priority: "High" },
                                 { platform: "Instagram", priority: "High" },
                                 { platform: "YouTube", priority: "Medium" }
                             ]).map((plat, i) => (
                                 <div key={i} className="flex items-center gap-4 group">
                                      <div className={`w-8 h-8 rounded-lg ${
                                        plat.priority === 'High' ? 'bg-indigo-500' : 'bg-slate-500'
                                      } text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>{i+1}</div>
                                      <div className="min-w-0">
                                          <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest truncate">{plat.platform}</div>
                                          <p className="text-[10px] text-slate-500 italic leading-tight">{plat.priority} Priority Focus</p>
                                      </div>
                                 </div>
                             ))}
                        </div>
                    </div>

                    {/*  Access Hub Sticky footer  */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center space-y-6 shadow-xl border border-slate-800">
                        <h4 className="text-lg font-black text-white uppercase tracking-tight italic leading-tight">Visit our Content Catalog</h4>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">Explore the full Warlock Digital Library.</p>
                        <Link href="/products" className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-50 hover:text-indigo-900 transition-all flex items-center justify-center gap-2">
                            Enter Library <ArrowRight size={14} />
                        </Link>
                    </div>

                </aside>

                <div className="lg:hidden h-20" /> {/* Mobile Spacer */}
            </div>

            <div className="h-32" /> {/* Bottom Page Buffer */}
        </div>
    );
}
