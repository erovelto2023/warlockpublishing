import React from 'react';
import Image from 'next/image';
import { getGlossaryTermBySlug, getRelatedGlossaryTerms, trackGlossaryView, searchYouTubeForTerm } from '@/lib/actions/glossary';
import { formatAmazonLink } from '@/lib/utils';
import { getPublishedProducts } from '@/lib/actions/product.actions';
import { getPublishedSalesPages } from '@/lib/actions/sales-page.actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, Zap, TrendingUp, BookOpen, AlertTriangle, Star, Layout, Users, Activity, Palette, Rocket, ListChecks, CheckCircle2, ShoppingBag, ArrowRight, Target, FileText, Megaphone, Copy, ShieldCheck, Globe, DollarSign, ExternalLink, MessageSquareQuote, Youtube, Clock, Hash, Tag, Share2, PieChart, UserCheck, ChevronRight, BookDashed } from 'lucide-react';
import AIPromptCard from '@/components/glossary/AIPromptCard';
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
    
    // Marketing/Production keyword detection logic
    const marketingKeywords = ['cover', 'video', 'checklist', 'marketing', 'sales', 'blurb', 'design', 'art', 'promo', 'ad', 'social', 'email', 'funnel'];
    const isMarketingFocus = marketingKeywords.some(k => term.term.toLowerCase().includes(k) || term.slug.includes(k));
    
    const writingLabel = isMarketingFocus ? "The Marketing Angle" : "The Writing Aspect";
    const masterclassTitle = isMarketingFocus ? "Marketing Mastery" : "Writers Masterclass";
    const masterclassDesc = isMarketingFocus ? "The technical sales framework designed to maximize visibility and conversion." : "The 3-Act Profit Structure designed to manage reader engagement and maximize ROI.";
    const structuralTitle = isMarketingFocus ? "Campaign Structure" : "3-Act Profit Structure";
    const pacingTitle = isMarketingFocus ? "Conversion Beats" : "Profit Beats (Pacing)";
    const archetypesTitle = isMarketingFocus ? "Target Personas" : "Archetype Trio";
    const archetypesDesc = isMarketingFocus ? "The specific audience segments this asset is designed to convert." : "The specific roles readers of this keyword demand.";
    const snippetLabel = isMarketingFocus ? "Sales Copy Hook" : "Story Snippet";

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
                            {isMarketingFocus && (
                                <div className="ml-4 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                                    <Rocket size={10} /> Production Node
                                </div>
                            )}
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
                <div className="flex-1 max-w-5xl space-y-20 pb-32">
                    
                    {/*  PHASE I: THE AUTHORITY HOOK (SEO/SGE LAYER)  */}
                    <section className="bg-indigo-600 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group" id="definition">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Zap size={120} /></div>
                        <div className="relative z-10 space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    <Sparkles size={14} className="text-amber-400" /> Phase I: The Authority Hook
                                </div>
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <div className="space-y-1">
                                        <h2 id="definition" className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2">I. Authority Hook</h2>
                                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                                            {term.term}
                                        </h1>
                                    </div>
                                    <span className="px-3 py-1 bg-white/10 text-indigo-100 text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/20">
                                        {term.category || 'Taxonomy'} | {term.subCategory || 'General'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 border-l-4 border-amber-400 pl-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">SGE Quick Guide</span>
                                <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95 max-w-3xl">
                                    {term.featuredSnippet || term.shortDefinition || `Mastering ${term.term} is the key to unlocking consistent narrative engagement and commercial authority in the ${term.category} niche.`}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                                <div className="space-y-2 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-amber-400 mb-1">
                                        <Target size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{writingLabel}</span>
                                    </div>
                                    <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                                        {term.writingAspect || (isMarketingFocus 
                                            ? `From a conversion standpoint, ${term.term} acts as a high-intent signal, attracting users looking for specific production assets and implementation tools.`
                                            : `In a narrative context, ${term.term} functions as a structural catalyst, driving character development and pacing through established genre tropes.`)}
                                    </p>
                                </div>
                                <div className="space-y-2 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                        <TrendingUp size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Market Status</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                                            {term.geoTagging || `Trending in US/UK markets.`}
                                        </p>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-indigo-300 uppercase">Opportunity</p>
                                            <p className="text-lg font-black text-emerald-400 leading-none">{term.opportunityScore || '92'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {featuredPoolItem && (
                                    <Link 
                                        href={featuredPoolItem.link}
                                        className="flex items-start gap-4 p-4 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all group/featured"
                                    >
                                        <div className="shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-white shadow-lg">
                                            <img 
                                                src={featuredPoolItem.imageUrl || '/images/placeholder-product.png'} 
                                                alt={featuredPoolItem.title}
                                                className="w-full h-full object-cover group-hover/featured:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex items-center justify-between text-indigo-200 mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <ShoppingBag size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Featured Resource</span>
                                                </div>
                                                <ArrowRight size={12} className="group-hover/featured:translate-x-1 transition-transform" />
                                            </div>
                                            <h4 className="text-[11px] font-black uppercase tracking-tight text-white line-clamp-1 mb-1">{featuredPoolItem.title}</h4>
                                            <p className="text-[8px] text-indigo-200 font-bold uppercase tracking-tighter opacity-80">Recommended for {term.term}</p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                    {/*  PHASE II: THE ANATOMY OF MASTERY (EEAT LAYER)  */}
                    <section className="space-y-10" id="anatomy">
                        <div className="flex items-center justify-between px-2">
                             <h2 id="anatomy" className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                II. Anatomy of <span className="text-indigo-600">Mastery</span>
                             </h2>
                             <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8 opacity-50"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EEAT Signals</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-20"></div>
                                <div className="flex items-center gap-4 text-indigo-600 mb-2">
                                    <Layout size={24} />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Structural Breakdown</h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {term.anatomy?.structuralBreakdown || `Every ${term.term} implementation relies on three core components: structural integrity, audience alignment, and commercial scalability.`}
                                </p>
                            </div>
                            <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform text-white"><Star size={60} /></div>
                                <div className="flex items-center gap-4 text-indigo-400 mb-2">
                                    <Users size={24} />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-200">The Specialist&apos;s Perspective</h4>
                                </div>
                                <p className="text-sm text-indigo-100/70 leading-relaxed font-medium">
                                    {term.anatomy?.specialistPerspective || `From an expert lens, ${term.term} is not just a definition—it is an EEAT signal. Mastery of this nuance separates amateurs from bestsellers.`}
                                </p>
                            </div>
                        </div>

                        {/* Pitfalls vs Solutions */}
                        <div className="bg-rose-50 border border-rose-100 rounded-[3rem] p-10 space-y-8">
                            <div className="flex items-center gap-3 text-rose-600">
                                <AlertTriangle size={24} />
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 italic">Common Pitfalls & <span className="text-rose-600">Solutions</span></h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                {(term.commonPitfalls && term.commonPitfalls.length > 0 ? term.commonPitfalls : [
                                    { pitfall: "The Secrecy Trap", howToAvoid: "Establish valid, high-stakes reasons for silence." },
                                    { pitfall: "Passive Character Agency", howToAvoid: "Ensure the lead's choices drive the reveal." }
                                ]).map((item: any, i: number) => (
                                    <div key={i} className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-rose-100 shadow-sm">
                                        <div className="flex gap-4 items-start">
                                            <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-[10px]">✕</div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Writing Sin</p>
                                                <p className="text-xs font-black text-slate-900">{item.pitfall || item.challenge}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start pl-10 border-l-2 border-emerald-100 ml-3">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Expert Solution</p>
                                                <p className="text-xs font-medium text-slate-600 leading-relaxed">{item.howToAvoid || item.solution}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/*  PHASE III: THE WRITERS MASTERCLASS (THE BLUEPRINT)  */}
                    <section className="bg-white border border-slate-200 rounded-[3.5rem] shadow-sm overflow-hidden" id="masterclass">
                        <div className="bg-indigo-600 p-10 md:p-14 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Palette size={180} /></div>
                            <div className="relative z-10 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100">
                                    <Sparkles size={12} /> Phase III
                                </div>
                                <h2 id="masterclass" className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                                    {isMarketingFocus ? 'III. Marketing ' : 'III. Writers '}<span className="text-amber-400">Masterclass</span>
                                </h2>
                                <p className="text-lg md:text-xl font-medium opacity-90 max-w-3xl leading-relaxed">
                                    {masterclassDesc}
                                </p>
                            </div>
                        </div>

                        <div className="p-10 md:p-14 space-y-20">
                            {/* Module 1: The Three-Act Foundation */}
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                            <span className="text-indigo-600 text-sm font-black border-2 border-indigo-600 rounded-lg w-8 h-8 flex items-center justify-center">1</span>
                                            {structuralTitle}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-bold">Optimization metrics tailored specifically to <span className="text-indigo-600">{term.term}</span>.</p>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { act: "Act I: Setup & Trigger", range: "0–25%", desc: term.masterclass?.threeActStructure?.act1 || "Introduces the protagonist and the catalyst for action.", example: `She stared at the ${term.term}, her heart hammering. It was supposed to be a secret, but secrets have a way of screaming in the silence.` },
                                            { act: "Act II: Conflict & Friction", range: "25–75%", desc: term.masterclass?.threeActStructure?.act2 || "The core drama where stakes rise and lead takes control.", example: `"You think a simple ${term.term} changes things?" he growled, closing the distance. "In this world, it changes everything."` },
                                            { act: "Act III: Payoff & Resolution", range: "75–100%", desc: term.masterclass?.threeActStructure?.act3 || "The final push toward the Climax and HEA/HFN.", example: `The truth of the ${term.term} was finally out, but as their eyes met, she realized the cost was worth every shattered lie.` }
                                        ].map((act, i) => (
                                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{isMarketingFocus ? act.act.replace('Act', 'Phase') : act.act}</h5>
                                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{isMarketingFocus ? 'ROI' : act.range}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{act.desc}</p>
                                                </div>
                                                <div className="pt-3 border-t border-slate-200/50">
                                                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <Sparkles size={10} /> {snippetLabel}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
                                                        &quot;{isMarketingFocus ? `Check out this ${term.term} to supercharge your blurb conversion rate instantly.` : act.example}&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Activity size={100} /></div>
                                    <h4 className="text-lg font-black uppercase tracking-tight text-indigo-400">{pacingTitle}</h4>
                                    <div className="space-y-6">
                                        {(term.masterclass?.profitBeats && term.masterclass.profitBeats.length > 0 ? term.masterclass.profitBeats : [
                                            { title: "The Hook", timing: "10%", description: "Establish protagonist empathy." },
                                            { title: "Pinch Points", timing: "35% & 60%", description: "Antagonist power reminder." },
                                            { title: "All is Lost", timing: "75%", description: "Emotional low point for 5-star review payoff." },
                                            { title: "Grand Gesture", timing: "Climax", description: "Character growth proof." }
                                        ]).map((beat: any, i: number) => (
                                            <div key={i} className="flex gap-4 group/beat">
                                                <div className="shrink-0 w-1 bg-indigo-500/30 rounded-full group-hover/beat:bg-indigo-500 transition-colors"></div>
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-black uppercase tracking-tight">{beat.title}</span>
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{beat.timing}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-2">{beat.description}</p>
                                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover/beat:border-indigo-500/30 transition-all">
                                                        <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{snippetLabel}</p>
                                                        <p className="text-[9px] text-slate-300 font-bold italic leading-tight">
                                                            &quot;{isMarketingFocus ? `Our ${term.term} guide reduces CPA by 40% while doubling organic reach.` : `The moment of ${term.term} was a thunderclap in the quiet room.`}&quot;
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Module 3: Archetype Trio */}
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                        <Users size={24} className="text-indigo-600" /> {archetypesTitle}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-bold">{archetypesDesc}</p>
                                </div>
                                <div className="grid md:grid-cols-3 gap-8">
                                    {(term.masterclass?.characterArchetypes && term.masterclass.characterArchetypes.length > 0 ? term.masterclass.characterArchetypes : [
                                        { role: "The Alpha / Specialist", description: "High-status lead (Billionaire, Elite)." },
                                        { role: "The Relatable Proxy", description: "The character the reader identifies with." },
                                        { role: "The Foil", description: "Highlights traits by stark contrast." }
                                    ]).map((char: any, i: number) => (
                                        <div key={i} className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-6 flex flex-col h-full">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm">
                                                    {i + 1}
                                                </div>
                                                <span className="text-[8px] font-black text-indigo-600/50 uppercase tracking-[0.2em]">Archetype</span>
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <h6 className="text-sm font-black text-slate-900 uppercase tracking-tight">{isMarketingFocus ? char.role.replace('Alpha / Specialist', 'High-LTV Buyer').replace('Relatable Proxy', 'Newsletter Sub').replace('Foil', 'Window Shopper') : char.role}</h6>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{char.description}</p>
                                            </div>
                                            <div className="pt-4 border-t border-slate-200">
                                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{snippetLabel}</p>
                                                <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
                                                    &quot;{isMarketingFocus ? `This ${term.term} asset is the perfect lead magnet for this segment.` : char.example}&quot;
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*  PHASE IV: THE TECHNICAL SALES ENGINE (CONVERSION LAYER)  */}
                    <section className="space-y-12" id="technical">
                        <div className="flex items-center justify-between px-2">
                             <h2 id="technical" className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                IV. Technical <span className="text-indigo-600">Sales Engine</span>
                             </h2>
                             <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8 opacity-50"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discoverability</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                             {/* The Discovery Stack */}
                             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                        <Rocket size={24} className="text-indigo-600" /> The Discovery Stack
                                    </h4>
                                    <p className="text-sm text-slate-500 font-bold">Optimize these components before the first word is written.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2 group/tech">
                                        <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">The &quot;Power&quot; Title</h6>
                                        <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                            {term.masterclass?.technicalComponents?.powerTitle || "Keyword-optimized strategic title idea."}
                                        </p>
                                    </div>
                                    <div className="space-y-2 group/tech">
                                        <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">Essential Tropes (Meta-Tags)</h6>
                                        <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                            {term.masterclass?.technicalComponents?.tropes?.join(', ') || "Algorithm categorization tags."}
                                        </p>
                                    </div>
                                    <div className="space-y-3 group/tech">
                                        <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">The High-Convert Hook (Blurb Line)</h6>
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                                {term.masterclass?.technicalComponents?.hook || "Blurb's first line designed to convert browsers to buyers."}
                                            </p>
                                            <div className="ml-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Story Snippet</p>
                                                <p className="text-[9px] text-indigo-900/60 font-bold italic leading-tight">
                                                    &quot;In the heart of the city, a single ${term.term} could bring empires to their knees.&quot;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>

                             {/* Profitability Checklist */}
                             <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12"><ListChecks size={120} /></div>
                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black uppercase tracking-tight text-indigo-400 italic">Profitability <span className="text-white">Checklist</span></h4>
                                        <p className="text-slate-400 text-xs font-medium">Verify these metrics before final production.</p>
                                    </div>
                                    <div className="space-y-4">
                                        {(term.masterclass?.profitabilityChecklist && term.masterclass.profitabilityChecklist.length > 0 ? term.masterclass.profitabilityChecklist : [
                                            "Does Chapter 1 end with an urgent question?",
                                            "Does every chapter drive toward the goal?",
                                            "Are the 'Top 3 Tropes' fully satisfied?",
                                            "Is the resolution market-compliant?"
                                        ]).map((item: string, i: number) => (
                                            <div key={i} className="flex gap-4 items-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                                <p className="text-xs font-medium text-slate-200">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Live Market Directory */}
                        <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                                        <ShoppingBag size={14} /> Live Market Assets
                                    </div>
                                    <h2 id="directory" className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                        Market <span className="text-indigo-600">Directory</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="space-y-20">
                                {(term.directoryCategories && term.directoryCategories.length > 0 ? term.directoryCategories : [
                                    { name: "Mastery Examples", description: "Curated books that exemplify this keyword." }
                                ]).map((cat: any, idx: number) => {
                                    const internalCatMatches = fullPool.filter(item => 
                                        item.category?.toLowerCase() === cat.name?.toLowerCase() ||
                                        item.title?.toLowerCase().includes(term.term.toLowerCase())
                                    );
                                    const csvMatches = cat.productIds?.length > 0 
                                        ? csvProducts.filter(p => cat.productIds.includes(p.asin))
                                        : (idx === 0 ? csvProducts.slice(0, 6) : []);

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
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {combinedCategoryPool.slice(0, 6).map((item: any, pIdx: number) => (
                                                    <Link 
                                                        key={pIdx}
                                                        href={item.link}
                                                        target={item.isExternal ? "_blank" : "_self"}
                                                        className="group bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 hover:bg-white hover:shadow-2xl hover:border-indigo-200 transition-all flex flex-col h-full relative"
                                                    >
                                                        <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-8 shadow-xl relative bg-white">
                                                            <img 
                                                                src={item.imageUrl || '/images/placeholder-product.png'} 
                                                                alt={item.title} 
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                            />
                                                        </div>
                                                        <h4 className="text-base font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                                            {item.title}
                                                        </h4>
                                                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
                                                            <span className="text-xl font-black text-slate-900">${item.price}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                    Analyze
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/*  PHASE V: AI COMMAND CENTER (THE PRODUCTION LAYER)  */}
                    <section className="space-y-10" id="ai">
                        <div className="flex items-center justify-between px-2">
                             <h2 id="ai" className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                V. AI <span className="text-indigo-600">Command Center</span>
                             </h2>
                             <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8 opacity-50"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Production Prompts</span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <AIPromptCard 
                                title="Scene Generator" 
                                icon={<Activity className="text-indigo-600" />} 
                                desc="Generate high-tension scenes."
                                prompt={term.aiPromptCommandCenter?.productIdeaPrompt || `Draft a scene where [Alpha] first sees [Proxy]'s secret involving ${term.term}.`}
                            />
                            <AIPromptCard 
                                title="Blurb/Marketing" 
                                icon={<Megaphone className="text-amber-500" />} 
                                desc="High-CTR hooks & hooks."
                                prompt={term.aiPromptCommandCenter?.contentStrategyPrompt || `Create 5 high-converting TikTok hooks for a ${term.term} reveal.`}
                            />
                            <AIPromptCard 
                                title="Visual Asset" 
                                icon={<Palette className="text-emerald-500" />} 
                                desc="Thematic cover/Pinterest art."
                                prompt={term.aiPromptCommandCenter?.aiImagePrompt || `Cinematic book cover art representing ${term.term} with high emotional contrast.`}
                            />
                        </div>
                    </section>

                    {/*  EXTRA SECTIONS: Amazon Prime Reference Library (Dynamic CSV Integration)  */}
                    <AmazonLibrarySection 
                        term={term.term} 
                        category={term.category || 'General'} 
                        products={csvProducts}
                    />
                </div>

                <div className="lg:hidden h-20" /> {/* Mobile Spacer */}
            </div>

            <div className="h-32" /> {/* Bottom Page Buffer */}
        </div>
    );
}
