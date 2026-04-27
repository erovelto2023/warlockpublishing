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
  ListChecks, PieChart, UserCheck, ChevronRight, BookDashed, Sparkles
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
    
    let csvProducts = [];
    
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
                            <Link href="/glossary" className="hover:text-indigo-600 transition-colors">Glossary</Link>
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
                <div className="flex-1 max-w-4xl space-y-24 pb-32">
                    
                    {/*  1. IDENTITY & TAXONOMY SECTION  */}
                    <section className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -mr-24 -mt-24 opacity-60"></div>
                        <div className="relative z-10">
                            <div className="flex flex-wrap gap-3 mb-8">
                                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">{term.category || 'Taxonomy'}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                                {term.term}
                            </h1>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Primary Niche</span>
                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Tag size={14} className="text-indigo-500" /> {term.category || 'General'}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Market Status</span>
                                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-2"><TrendingUp size={14} /> Evergreen</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Entry Difficulty</span>
                                    <span className="text-sm font-bold text-amber-500 flex items-center gap-2"><ShieldCheck size={14} /> {term.skillRequired || 'Intermediate'}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Profit Potential</span>
                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><DollarSign size={14} className="text-emerald-500" /> High Margin</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*  ENTITY VITAL SIGNS (DYNAMIC ANALYTICS)  */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6" id="vitals">
                         {[
                             { label: "Search Velocity", value: "88/100", trend: "+12%", color: "text-indigo-600", bg: "bg-indigo-50", icon: <TrendingUp size={20}/> },
                             { label: "Affiliate Strength", value: "Tier 1", trend: "Stable", color: "text-emerald-600", bg: "bg-emerald-50", icon: <DollarSign size={20}/> },
                             { label: "Content Longevity", value: "Evergreen", trend: "Infinite", color: "text-amber-600", bg: "bg-amber-50", icon: <Clock size={20}/> }
                         ].map((stat, i) => (
                             <div key={i} className={`${stat.bg} p-8 rounded-[2rem] border border-white/50 shadow-sm flex flex-col justify-between h-40 group hover:shadow-xl transition-all`}>
                                 <div className="flex items-center justify-between">
                                     <div className={`${stat.color} p-3 bg-white rounded-2xl shadow-sm`}>{stat.icon}</div>
                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                                 </div>
                                 <div className="flex items-end justify-between">
                                     <span className={`text-3xl font-black ${stat.color} tracking-tighter italic`}>{stat.value}</span>
                                     <span className="text-[10px] font-bold bg-white/50 px-2 py-1 rounded-md text-slate-500">{stat.trend}</span>
                                 </div>
                             </div>
                         ))}
                    </section>
                    
                    {/*  AI QUICK SUMMARY (GEO OPTIMIZATION)  */}
                    <section className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-20"><Zap size={40} className="text-indigo-600" /></div>
                        <div className="relative z-10">
                            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Sparkles size={14} /> AI Quick Summary
                            </h2>
                            <p className="text-lg md:text-xl font-bold text-slate-900 leading-snug mb-4">
                                {term.shortDefinition || `What is ${term.term}?`}
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                                {term.definition?.split('.')[0]}. {term.definition?.split('.')[1] || ''}. This concept is critical for creators focusing on {term.category} and {term.niche || 'digital publishing'}.
                            </p>
                        </div>
                    </section>

                    {/*  2. CONTEXTUAL MEANING SECTION  */}
                    <section className="space-y-10" id="context">
                        <h2 id="context" className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 px-2">
                            <HistoryIcon className="text-indigo-600" size={24} /> Semantic Connectivity
                        </h2>
                        
                        <TermTabs 
                            origin={term.origin} 
                            modernUsage={term.modernUsage} 
                            expandedExplanation={term.expandedExplanation} 
                        />

                        <ConnectivityHub 
                            synonyms={term.synonyms} 
                            antonyms={term.antonyms} 
                        />
                    </section>
                    
                    {/*  IN-CONTENT SOLUTION CTA (CONVERSION FOCUSED)  */}
                    {featuredPoolItem && (
                        <section className="bg-white border-2 border-indigo-600 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><ShoppingBag size={120} /></div>
                            
                            {/* Problem/Solution Bridge */}
                            <div className="mb-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    Struggling with {term.targetAudience?.painPoints?.[0] || term.term + " implementation"}?
                                </h3>
                                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                                    Understanding the definition is only the first step. To truly dominate this niche, you need the right tools to bridge the gap between concept and profit.
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row items-stretch gap-10 relative z-10 bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                                {featuredPoolItem.imageUrl && (
                                    <div className="w-full md:w-60 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white flex-shrink-0 relative">
                                        <img src={featuredPoolItem.imageUrl} alt={featuredPoolItem.title} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-4 left-4 right-4 py-2 bg-indigo-600/90 backdrop-blur text-white text-center rounded-xl text-[9px] font-black uppercase tracking-widest">
                                            Recommended Solution
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                                        {featuredPoolItem.title}
                                    </h4>
                                    
                                    {/* Benefit List */}
                                    <div className="space-y-4 mb-8">
                                        {(term.targetAudience?.desiredOutcomes?.slice(0, 3) || ["Scale your creative output", "Increase commercial authority", "Automate implementation"]).map((outcome: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="mt-1 p-0.5 bg-emerald-100 text-emerald-600 rounded-full"><CheckCircle2 size={14} /></div>
                                                <span className="text-sm font-bold text-slate-700">{outcome}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 mt-auto">
                                        <Link 
                                            href={productLink}
                                            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-100 flex items-center gap-3 group/btn"
                                        >
                                            Solve My {term.term} Challenges <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today&apos;s Price</span>
                                            <span className="text-2xl font-black text-slate-900">
                                                {featuredPoolItem.price ? `$${featuredPoolItem.price}` : 'Free Access'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/*  3. PUBLIC KNOWLEDGE BASE  */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 px-2">
                            <BookOpen className="text-indigo-600" size={24} /> Public Knowledge Base
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-3xl space-y-3">
                                <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">Simple Definition</h4>
                                <p className="text-sm text-slate-600 italic leading-relaxed font-medium">&quot;{term.shortDefinition || "A foundational summary of the concept intended for broad understanding."}&quot;</p>
                            </div>
                            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Technical Definition</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{term.definition || "Formalized implementation details and structural constraints within the publishing ecosystem."}</p>
                            </div>
                        </div>
                    </section>

                    {/*  4. GETTING STARTED CHECKLIST  */}
                    <section className="p-10 md:p-14 bg-white border border-slate-200 shadow-sm rounded-[3rem] relative overflow-hidden flex flex-col justify-center" id="checklist">
                        <h2 id="checklist" className="sr-only">Checklist</h2>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -z-10 opacity-40"></div>
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter leading-none">Getting Started Checklist</h2>
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner"><ListChecks size={24} /></div>
                        </div>
                        <div className="space-y-3">
                            {(term.checklist && term.checklist.length > 0 ? term.checklist : [
                                "Define Core Objective for implementation.", 
                                "Analyze Competitor Gaps in the landscape.", 
                                "Synthesize Content Blueprint.", 
                                "Execute Deployment Protocol."
                            ]).map((step: string, i: number) => (
                                <div key={i} className="flex items-center gap-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl group cursor-pointer hover:bg-white hover:border-indigo-200 transition-all">
                                    <div className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all bg-white font-mono shrink-0">{i+1}</div>
                                    <span className="text-md font-semibold text-slate-700 group-hover:text-slate-900 leading-snug">{step}</span>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={18} className="text-indigo-500" /></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/*  5. FAQ ACCORDION BUILDER  */}
                    <section className="space-y-8" id="faq">
                        <div className="flex items-center justify-between px-2">
                            <h2 id="faq" className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Strategic FAQ</h2>
                            {/* <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100 hover:bg-indigo-100 transition-all">+ Add FAQ Entry</button> */}
                        </div>
                        <div className="space-y-4">
                            {(term.faqs && term.faqs.length > 0 ? term.faqs : [
                                { question: "How does this drive commercial authority?", answer: "By establishing terminology dominance, you position your brand as the primary reference point in the niche." },
                                { question: "Is this scalable for small creators?", answer: "Exceedingly so. Small creators can leverage this clarity to out-maneuver larger, slower competitors." }
                            ]).map((faq, i) => (
                                <details key={i} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all">
                                    <summary className="flex items-center justify-between p-10 cursor-pointer list-none hover:bg-slate-50 transition-all font-black text-slate-800 uppercase text-sm tracking-wide">
                                        {faq.question}
                                        <div className="p-2 bg-slate-100 rounded-lg group-open:rotate-180 transition-transform"><ChevronDown size={14}/></div>
                                    </summary>
                                    <div className="p-10 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-4 bg-white">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/*  6. PROFIT & CREATION BLUEPRINT + TARGET AUDIENCE  */}
                    <section className="space-y-8" id="monetization">
                         <h2 id="monetization" className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 px-2">
                            <PieChart className="text-indigo-600" size={24} /> Profit & Creation Blueprint
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-4">Revenue & Pricing</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Revenue Streams</span><span className="text-xs font-bold text-slate-900 uppercase">POD, Ebooks, Consulting</span></div>
                                    <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Scale Potential</span><span className="text-xs font-bold text-emerald-600">High Margin</span></div>
                                    <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Startup Cost</span><span className="text-xs font-bold text-slate-900">{term.startupCost || '$0'}</span></div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-4">Complexity Metrics</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Skill Level</span><span className="text-xs font-bold text-amber-500 uppercase tracking-wide">{term.skillRequired || 'Intermediate'}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Time Estimate</span><span className="text-xs font-bold text-slate-900">{term.timeToCreate || '1-3 Days'}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-500">Market Trend</span><span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">High Growth</span></div>
                                </div>
                            </div>
                        </div>

                        {/*  Target Audience Expansion  */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 space-y-8 shadow-sm">
                             <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                                 <UserCheck className="text-indigo-600" size={24} />
                                 <div>
                                     <h3 className="text-xl font-bold uppercase tracking-tight">Primary Target Audience</h3>
                                     <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Whom this keyword serves</p>
                                 </div>
                             </div>
                             <div className="grid md:grid-cols-3 gap-6">
                                     {(Array.isArray(term.targetAudience) && term.targetAudience.length > 0 ? term.targetAudience : [
                                        { title: "Educators", benefit: "Curriculum tools and classroom modeling." },
                                        { title: "Publishers", benefit: "Data on high-demand tropes for new acquisitions." },
                                        { title: "Authors", benefit: "Strategic cues for writing character interactions." }
                                    ]).map((aud: { title: string; benefit?: string; description?: string }, i: number) => (
                                        <div key={i} className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                             <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{aud.title}</h4>
                                             <p className="text-[11px] text-slate-500 leading-relaxed">{aud.benefit || aud.description}</p>
                                        </div>
                                    ))}
                             </div>
                        </div>
                    </section>

                    {/*  7. TOP 3 COMPETITOR/REFERENCE TITLES  */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                             <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight italic">Top 3 Reference Titles</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {(term.competitorReferences && term.competitorReferences.length > 0 ? term.competitorReferences : [
                                { name: "Reference Asset A", type: "Amazon Book", url: "#" },
                                { name: "Reference Asset B", type: "Affiliate Product", url: "#" },
                                { name: "Reference Asset C", type: "Digital Guide", url: "#" }
                            ]).map((ref: any, i: number) => (
                                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 flex flex-col gap-4 group hover:border-indigo-300 transition-all shadow-sm">
                                     <div className="flex justify-between items-start">
                                         <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{ref.type || "Resource"}</span>
                                         <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-500" />
                                     </div>
                                      <h4 className="text-lg font-extrabold text-slate-900 italic leading-tight">&quot;{ref.title || ref.name}&quot;</h4>
                                     <a href={ref.url || '#'} className="mt-auto text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1">
                                        View Reference <ArrowRight size={10} />
                                     </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/*  8. 10 PRODUCT IDEAS PIPELINE  */}
                    <section className="space-y-8" id="ideas">
                        <h2 id="ideas" className="text-2xl font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200 pb-6 italic">10 Product Ideas Pipeline</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {(term.productIdeas && term.productIdeas.length > 0 ? term.productIdeas : [
                                { title: "Blueprint Masterclass", type: "Course", pricePoint: "$147.00", description: "A comprehensive guide on deploying these strategies." },
                                { title: "Niche Authority Kit", type: "Template", pricePoint: "$29.00", description: "Printable frameworks to prompt discussion." }
                            ]).map((item: any, i: number) => (
                                <div key={i} className="p-8 bg-white border border-slate-200 rounded-[2rem] space-y-4 group hover:border-indigo-300 hover:shadow-lg transition-all shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-slate-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"><Rocket size={20} /></div>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">{item.pricePoint || item.price || "$19.00"}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{item.title}</h4>
                                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest border-l-2 border-slate-200 pl-3">{item.type}</p>
                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description || item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/*  EXTRA SECTIONS: Amazon Prime Reference Library (Dynamic CSV Integration)  */}
                    <AmazonLibrarySection 
                        products={csvProducts} 
                        title={`Prime Reference: ${term.term}`}
                        subtitle="Curated Industry Assets & Reference Titles"
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
