import React from 'react';
import Image from 'next/image';
import { getGlossaryTermBySlug, getRelatedGlossaryTerms, trackGlossaryView, searchYouTubeForTerm } from '@/lib/actions/glossary';
import { formatAmazonLink } from '@/lib/utils';
import { getPublishedProducts } from '@/lib/actions/product.actions';
import { getPublishedSalesPages } from '@/lib/actions/sales-page.actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, Zap, TrendingUp, BookOpen, AlertTriangle, Star, Layout, Users, Activity, Palette, Rocket, ListChecks, CheckCircle2, ShoppingBag, ArrowRight, Target, FileText, Megaphone, Copy, ShieldCheck, Globe, DollarSign, ExternalLink, MessageSquareQuote, Youtube, Clock, Hash, Tag, Share2, PieChart, UserCheck, ChevronRight, BookDashed, Brain } from 'lucide-react';
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

export const dynamic = 'force-dynamic';

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
        const targetAsins = term.directoryCategories?.flatMap((cat: any) => cat.productIds || []) || [];
        const results = await Promise.all([
            getRelatedGlossaryTerms(term.category || 'General', term.slug),
            getPublishedProducts(),
            getPublishedSalesPages(),
            getAmazonProductsFromCsv(term.term || term.slug, 20, term.category, targetAsins)
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

    // YouTube Data fetch if missing
    let youtubeVideo = term.youtubeVideo;
    if (!youtubeVideo?.url && !term.videoUrl) {
        try {
            const foundVideo = await searchYouTubeForTerm(term.term, term.category);
            if (foundVideo) {
                youtubeVideo = {
                    url: foundVideo.url,
                    title: foundVideo.title,
                    channel: foundVideo.channel
                };
            }
        } catch (e) {
            console.error("YouTube automated fetch failed:", e);
        }
    }

    const videoUrl = youtubeVideo?.url || term.videoUrl;
    const videoId = videoUrl ? (videoUrl.match(/[?&]v=([^&#]+)/) || videoUrl.match(/youtu\.be\/([^?&#]+)/))?.[1] : null;

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
    
    // --- CATEGORY INTELLIGENCE ENGINE ---
    const isColoringBook = term.category.includes('Coloring') || term.niche?.includes('Coloring');
    
    const isFiction = [
        'Romance', 'Literature & Fiction', 'Mystery, Thriller & Suspense', 
        'Science Fiction & Fantasy', 'Teen & Young Adult', 'Comics & Graphic Novels', 'Trope', 'Genre'
    ].includes(term.category) && !isColoringBook;

    const isNonFiction = [
        'Biographies & Memoirs', 'Business & Money', 'Health, Fitness & Dieting', 
        'History', 'Politics & Social Sciences', 'Religion & Spirituality', 
        'Science & Math', 'Self-Help', 'Education & Teaching', 'Engineering & Transportation', 
        'Law', 'Medical Books', 'Parenting & Relationships', 'Reference', 'Sports & Outdoors', 'Writing', 'Publishing', 'Marketing'
    ].includes(term.category);

    const isPractical = [
        'Cookbooks, Food & Wine', 'Crafts, Hobbies & Home', 'Travel', 'Humor & Entertainment', 'Children\'s Books'
    ].includes(term.category) || isColoringBook;

    // Marketing/Production keyword detection logic (Fallback)
    const marketingKeywords = ['cover', 'video', 'checklist', 'marketing', 'sales', 'blurb', 'design', 'art', 'promo', 'ad', 'social', 'email', 'funnel'];
    const isMarketingFocus = marketingKeywords.some(k => term.term.toLowerCase().includes(k) || term.slug.includes(k)) || term.category === 'Marketing';
    
    // Dynamic Labels based on Meta-Category
    let writingLabel = "The Strategic Aspect";
    let masterclassTitle = "Authority Masterclass";
    let masterclassDesc = "The universal strategy designed to manage engagement and maximize ROI.";
    let structuralTitle = "Strategic Structure";
    let pacingTitle = "Strategic Beats";
    let archetypesTitle = "Character Archetypes";
    let archetypesDesc = "The specific roles readers of this keyword demand.";
    let snippetLabel = "Strategy Snippet";
    if (isFiction) {
        writingLabel = "The Writing Aspect";
        masterclassTitle = "Writers Masterclass";
        masterclassDesc = "The 3-Act Profit Structure designed to manage reader engagement and maximize ROI.";
        structuralTitle = "3-Act Profit Structure";
        pacingTitle = "Profit Beats (Pacing)";
        archetypesTitle = "Archetype Trio";
        archetypesDesc = "The specific roles readers of this keyword demand.";
        snippetLabel = "Story Snippet";
    } else if (isColoringBook) {
        writingLabel = "The Design Aspect";
        masterclassTitle = "Designer Masterclass";
        masterclassDesc = "The high-engagement design framework designed for relaxation and coloring satisfaction.";
        structuralTitle = "Thematic Structure";
        pacingTitle = "Engagement Flow";
        archetypesTitle = "User Profiles";
        archetypesDesc = "The specific hobbyist or practitioner profiles this asset is for.";
        snippetLabel = "Design Tip";
    } else if (isNonFiction) {
        writingLabel = "The Authority Angle";
        masterclassTitle = "Authority Masterclass";
        masterclassDesc = "The educational framework designed to establish EEAT and drive student transformation.";
        structuralTitle = "Authority Framework";
        pacingTitle = "Transformation Milestones";
        archetypesTitle = "Personas & Avatars";
        archetypesDesc = "The specific student or reader personas this content serves.";
        snippetLabel = "Authority Hook";
    } else if (isPractical) {
        writingLabel = "The Execution Logic";
        masterclassTitle = "Practical Masterclass";
        masterclassDesc = "The step-by-step implementation path designed for clarity and lifestyle results.";
        structuralTitle = "The Execution Path";
        pacingTitle = "Implementation Steps";
        archetypesTitle = "User Profiles";
        archetypesDesc = "The specific hobbyist or practitioner profiles this asset is for.";
        snippetLabel = "Execution Tip";
    }

    if (isMarketingFocus) {
        writingLabel = "The Marketing Angle";
        masterclassTitle = "Marketing Mastery";
        masterclassDesc = "The technical sales framework designed to maximize visibility and conversion.";
        structuralTitle = "Campaign Structure";
        pacingTitle = "Conversion Beats";
        archetypesTitle = "Target Personas";
        archetypesDesc = "The specific audience segments this asset is designed to convert.";
        snippetLabel = "Sales Copy Hook";
    }

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
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Phase I: SGE Authority Hook</span>
                                <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95 max-w-3xl">
                                    {term.definition || `Mastering ${term.term} is the key to unlocking consistent narrative engagement and commercial authority in the ${term.category} niche.`}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                                <div className="space-y-4 p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 text-indigo-600">
                                        <Brain size={20} />
                                        <h3 className="text-[11px] font-black uppercase tracking-widest">Phase II: Reader Psychology</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-xs text-slate-600 leading-relaxed font-bold">
                                            {term.readerPsychology?.whyWeCraveIt || (isFiction ? "Humans are hardwired for pattern recognition. This trope provides emotional safety and a predictable emotional payoff that readers demand for wish fulfillment." : "This concept provides a structural shortcut for achieving specific results with minimal friction.")}
                                        </p>
                                        <div className="pt-3 border-t border-indigo-100/50">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cognitive Shortcut</p>
                                            <p className="text-[10px] text-indigo-600 font-bold italic">"{term.readerPsychology?.cognitiveShortcut || "Bypasses conscious resistance for immediate immersion."}"</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 p-6 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xl">
                                    <div className="flex items-center justify-between text-indigo-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Activity size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">3-Factor Framework</span>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase">Market Status</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Demand</p>
                                            <p className="text-lg font-black text-white">{term.marketDemand?.demandScore || '9.2'}</p>
                                        </div>
                                        <div className="text-center border-x border-white/10">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Passion</p>
                                            <p className="text-lg font-black text-white">{term.marketDemand?.passionScore || '9.8'}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Saturate</p>
                                            <p className="text-lg font-black text-white">{term.marketDemand?.saturationScore || '1.5'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                         <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Trend Velocity</span>
                                            <span className="text-[9px] font-black text-emerald-400 uppercase">{term.marketDemand?.trendStatus || 'Rising'}</span>
                                         </div>
                                         <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[85%]"></div>
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

                    {/*  PHASE III: THE ANATOMY OF MASTERY (EEAT LAYER)  */}
                    <section className="space-y-10" id="anatomy">
                        <div className="flex items-center justify-between px-2">
                             <h2 id="anatomy" className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                III. Anatomy of <span className="text-indigo-600">Mastery</span>
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


                        {/* PHASE IV: SUB-GENRE BLENDING */}
                        {term.subGenreVariations && term.subGenreVariations.length > 0 && (
                            <div className="space-y-8 pt-10">
                                <div className="flex items-center gap-3">
                                    <Globe size={24} className="text-indigo-600" />
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Phase IV: Sub-Genre Blending</h3>
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {term.subGenreVariations.map((v: any, i: number) => (
                                        <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3">
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase rounded-full">{v.genre}</span>
                                            <p className="text-xs text-slate-600 font-bold leading-relaxed">{v.variation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* PHASE V: SHOPPABLE CURATION BY READER VIBE */}
                    {term.vibeCuration && term.vibeCuration.length > 0 && (
                        <section className="bg-slate-900 border border-slate-800 rounded-[3.5rem] shadow-2xl overflow-hidden" id="curation">
                            <div className="p-10 md:p-14 space-y-12">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                                        <ShoppingBag size={12} className="text-indigo-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Phase V: Shoppable Curation</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                                        Curation by <span className="text-indigo-500">Reader Vibe</span>
                                    </h2>
                                    <p className="text-slate-400 font-medium max-w-2xl">Modern readers shop by aesthetic. Explore these hand-picked recommendations based on your current reading mood.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12">
                                    {term.vibeCuration.map((vibeGroup: any, i: number) => (
                                        <div key={i} className="space-y-8">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                                                    vibeGroup.vibe === 'Yellow' ? 'bg-amber-400 text-amber-950' : 
                                                    vibeGroup.vibe === 'Blue' ? 'bg-blue-500 text-white' : 
                                                    'bg-indigo-600 text-white'
                                                }`}>
                                                    <Palette size={24} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">The {vibeGroup.vibe} Reader</h3>
                                                    <p className="text-xs text-slate-500 font-bold italic">{vibeGroup.vibeDescription}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {vibeGroup.books?.map((book: any, bi: number) => (
                                                    <div key={bi} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/book flex gap-6 items-center">
                                                        <div className="w-16 h-24 bg-white/10 rounded-xl shrink-0 overflow-hidden shadow-2xl">
                                                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-2">
                                                                <BookOpen size={24} className="text-white/20" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{book.title}</h4>
                                                                <span className="text-[10px] font-black text-indigo-400">{book.author}</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">&quot;{book.salesHook}&quot;</p>
                                                            <Link href={book.buyUrl || '#'} className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-500 transition-colors mt-2">
                                                                Buy Now <ArrowRight size={12} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/*  PHASE III: THE WRITERS MASTERCLASS (THE BLUEPRINT)  */}
                    <section className="bg-white border border-slate-200 rounded-[3.5rem] shadow-sm overflow-hidden" id="masterclass">
                        <div className="bg-indigo-600 p-10 md:p-14 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Palette size={180} /></div>
                            <div className="relative z-10 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100">
                                    <Sparkles size={12} /> Phase III
                                </div>
                                <h2 id="masterclass" className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                                    {isMarketingFocus ? 'III. Marketing ' : (isColoringBook ? 'III. Designer ' : (isFiction ? 'III. Writers ' : 'III. Authority '))}<span className="text-amber-400">Masterclass</span>
                                </h2>
                                <p className="text-lg md:text-xl font-medium opacity-90 max-w-3xl leading-relaxed">
                                    {masterclassDesc}
                                </p>
                            </div>
                        </div>

                        <div className="p-10 md:p-14 space-y-20">
                            {/* Module 1: The Foundation */}
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
                                            { act: isFiction ? "Act I: Setup & Trigger" : (isColoringBook ? "Phase I: Concept & Theme" : "Step I: Introduction"), range: isFiction ? "0–25%" : (isColoringBook ? "Start" : "Phase 1"), desc: term.masterclass?.threeActStructure?.act1 || (isColoringBook ? "Establishing the central visual theme and initial pattern complexity." : "Introduces the protagonist and the catalyst for action."), example: isColoringBook ? `This page features a bold ${term.term} center-piece to draw the eye.` : `She stared at the ${term.term}, her heart hammering.` },
                                            { act: isFiction ? "Act II: Conflict & Friction" : (isColoringBook ? "Phase II: Detail & Variety" : "Step II: Implementation"), range: isFiction ? "25–75%" : (isColoringBook ? "Mid" : "Phase 2"), desc: term.masterclass?.threeActStructure?.act2 || (isColoringBook ? "Developing secondary patterns and increasing intricate details for engagement." : "The core drama where stakes rise and lead takes control."), example: isColoringBook ? `The intricate ${term.term} patterns here encourage longer coloring sessions.` : `"You think a simple ${term.term} changes things?"` },
                                            { act: isFiction ? "Act III: Payoff & Resolution" : (isColoringBook ? "Phase III: Finish & Review" : "Step III: Outcome"), range: isFiction ? "75–100%" : (isColoringBook ? "End" : "Phase 3"), desc: term.masterclass?.threeActStructure?.act3 || (isColoringBook ? "Finalizing the collection and ensuring high-contrast production quality." : "The final push toward the Climax and HEA/HFN."), example: isColoringBook ? `A high-contrast ${term.term} finish ensures a professional look.` : `The truth of the ${term.term} was finally out.` }
                                        ].map((act, i) => (
                                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                                                            {act.act}
                                                        </h5>
                                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                            {act.range}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{act.desc}</p>
                                                </div>
                                                <div className="pt-3 border-t border-slate-200/50">
                                                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <Sparkles size={10} /> {snippetLabel}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
                                                        &quot;{act.example}&quot;
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
                                        {(term.masterclass?.profitBeats && term.masterclass.profitBeats.length > 0 ? term.masterclass.profitBeats : (
                                            isColoringBook ? [
                                                { title: "Visual Hook", timing: "Cover", description: "Establish immediate thematic appeal." },
                                                { title: "Pattern Variance", timing: "Pages 1-10", description: "Balance simple and complex designs." },
                                                { title: "Flow State", timing: "Pages 11-40", description: "Maintain meditative engagement levels." },
                                                { title: "Signature Page", timing: "Final Page", description: "Highest complexity for social sharing payoff." }
                                            ] : [
                                                { title: "The Hook", timing: "10%", description: "Establish protagonist empathy." },
                                                { title: "Pinch Points", timing: "35% & 60%", description: "Antagonist power reminder." },
                                                { title: "All is Lost", timing: "75%", description: "Emotional low point for payoff." },
                                                { title: "Grand Gesture", timing: "Climax", description: "Character growth proof." }
                                            ]
                                        )).map((beat: any, i: number) => (
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
                                                            &quot;{isColoringBook ? `The ${term.term} detail here is designed for maximum stress relief.` : `The moment of ${term.term} was a thunderclap.`}&quot;
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
                                    {(term.masterclass?.characterArchetypes && term.masterclass.characterArchetypes.length > 0 ? term.masterclass.characterArchetypes : (
                                        isColoringBook ? [
                                            { role: "The Stress-Relief Seeker", description: "Looking for repetitive, meditative patterns." },
                                            { role: "The Creative Explorer", description: "Demands intricate details and unique themes." },
                                            { role: "The Hobbyist Artist", description: "Wants high-contrast lines for professional results." }
                                        ] : [
                                            { role: "The Alpha / Specialist", description: "High-status lead (Billionaire, Elite)." },
                                            { role: "The Relatable Proxy", description: "The character the reader identifies with." },
                                            { role: "The Foil", description: "Highlights traits by stark contrast." }
                                        ]
                                    )).map((char: any, i: number) => (
                                        <div key={i} className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-6 flex flex-col h-full">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm">
                                                    {i + 1}
                                                </div>
                                                <span className="text-[8px] font-black text-indigo-600/50 uppercase tracking-[0.2em]">{isColoringBook ? 'User Profile' : 'Archetype'}</span>
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <h6 className="text-sm font-black text-slate-900 uppercase tracking-tight">{char.role}</h6>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{char.description}</p>
                                            </div>
                                            <div className="pt-4 border-t border-slate-200">
                                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{snippetLabel}</p>
                                                <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
                                                    &quot;{isColoringBook ? `A perfect gift for the ${char.role}.` : `She was the ultimate ${char.role}.`}&quot;
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
                                        <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">{isColoringBook ? 'The "Signature" Title' : 'The "Power" Title'}</h6>
                                        <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                            {term.masterclass?.technicalComponents?.powerTitle || (isColoringBook ? `${term.term} Relaxation: A Premium Adult Coloring Collection` : "Keyword-optimized strategic title idea.")}
                                        </p>
                                    </div>
                                    <div className="space-y-2 group/tech">
                                        <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">{isColoringBook ? 'Design Styles (Categories)' : 'Essential Tropes (Meta-Tags)'}</h6>
                                        <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                            {term.masterclass?.technicalComponents?.tropes?.join(', ') || (isColoringBook ? "Mandala, Stress-Relief, Thematic, High-Contrast" : "Algorithm categorization tags.")}
                                        </p>
                                    </div>
                                    <div className="space-y-3 group/tech">
                                        <h6 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover/tech:translate-x-2 transition-transform">{isColoringBook ? 'The High-Convert Description' : 'The High-Convert Hook (Blurb Line)'}</h6>
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-600 font-bold leading-relaxed border-l-2 border-slate-100 pl-4">
                                                {term.masterclass?.technicalComponents?.hook || (isColoringBook ? `Unlock meditative peace with our uniquely crafted ${term.term} illustrations.` : "Blurb's first line designed to convert.")}
                                            </p>
                                            <div className="ml-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{snippetLabel}</p>
                                                <p className="text-[9px] text-indigo-900/60 font-bold italic leading-tight">
                                                    &quot;{isColoringBook ? `Experience the soothing power of ${term.term} in every stroke.` : `In the heart of the city, a single ${term.term} could change everything.`}&quot;
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
                                        {(term.masterclass?.profitabilityChecklist && term.masterclass.profitabilityChecklist.length > 0 ? term.masterclass.profitabilityChecklist : (
                                            isColoringBook ? [
                                                "Does the line art have sufficient contrast?",
                                                "Is the pattern complexity appropriate for adults?",
                                                "Is the resolution market-compliant (300DPI+)?",
                                                "Is the bleed management correct?"
                                            ] : [
                                                "Does Chapter 1 end with an urgent question?",
                                                "Does every chapter drive toward the goal?",
                                                "Are the 'Top 3 Tropes' fully satisfied?",
                                                "Is the resolution market-compliant?"
                                            ]
                                        )).map((item: string, i: number) => (
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

                    {/* PHASE V: MULTIMEDIA MASTERY (YOUTUBE) */}
                    <section className="space-y-12" id="multimedia">
                        <div className="flex items-center justify-between px-2">
                             <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                    V. Multimedia <span className="text-rose-600">Mastery</span>
                                </h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Strategy & Video Insights</p>
                             </div>
                             <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8 opacity-50"></div>
                             <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full">
                                <Youtube size={12} className="text-rose-600" />
                                <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">LIVE INSIGHTS</span>
                             </div>
                        </div>

                        <div className="grid md:grid-cols-5 gap-8">
                            <div className="md:col-span-3">
                                {videoId ? (
                                    <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group relative">
                                        <iframe 
                                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                            title={youtubeVideo?.title || term.term}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full rounded-[3rem] bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 space-y-4">
                                        <Youtube size={48} className="text-slate-300" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No primary video content available</p>
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-2 space-y-6">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full flex flex-col justify-center space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Mastery Tip</p>
                                        <h4 className="text-lg font-black text-slate-900 leading-tight">
                                            {youtubeVideo?.title || `Analyzing ${term.term} dynamics via visual storytelling.`}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        {youtubeVideo?.channel ? `Curated from ${youtubeVideo.channel}. ` : ""}
                                        Watching how experts implement {term.term} in real-world scenarios is the fastest way to master its commercial application.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Link 
                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(term.term + " strategy")}`}
                                            target="_blank"
                                            className="flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-widest hover:translate-x-1 transition-transform"
                                        >
                                            Explore More on YouTube <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marketplace Sub-Section */}
                        <div className="pt-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} className="text-emerald-600" />
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Marketplace Insights</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {fullPool.slice(0, 4).map((item: any, i: number) => (
                                    <Link 
                                        key={i}
                                        href={item.link}
                                        className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col"
                                    >
                                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50 relative">
                                            <img src={item.imageUrl || '/images/placeholder-product.png'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                                {item.type}
                                            </div>
                                        </div>
                                        <h4 className="text-xs font-black text-slate-900 line-clamp-1 mb-2 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-sm font-black text-slate-900">${item.price}</span>
                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">View Asset</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/*  PHASE VI: PRODUCTION HUB & COMMUNITY (COMMAND CENTER)  */}
                    <section className="space-y-12" id="production">
                        <div className="flex items-center justify-between px-2">
                             <div className="space-y-1">
                                <h2 id="production" className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                    VI. Production <span className="text-indigo-600">Hub</span>
                                </h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Community & Creator Resources</p>
                             </div>
                             <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8 opacity-50"></div>
                             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full">
                                <Users size={12} className="text-indigo-600" />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">#BOOKTOK READY</span>
                             </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <AIPromptCard 
                                        title="Scene Generator"
                                        desc="Generate high-tension narrative beats or detailed pattern concepts."
                                        prompt={term.aiPromptCommandCenter?.sceneGeneratorPrompt || `Draft a scene where [Alpha] first sees [Proxy]'s secret involving ${term.term}.`}
                                        icon={<MessageSquareQuote size={20} className="text-indigo-600" />}
                                    />
                                    <AIPromptCard 
                                        title="Marketing Hooks"
                                        desc="High-CTR hooks for TikTok, Pinterest, and Instagram."
                                        prompt={term.aiPromptCommandCenter?.marketingHookPrompt || `Create 5 high-converting TikTok hooks for a ${term.term} reveal in a ${term.category} novel.`}
                                        icon={<Hash size={20} className="text-amber-500" />}
                                    />
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 flex flex-col group hover:border-indigo-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform"><Palette size={20} className="text-emerald-500" /></div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Visual Asset Prompt</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Cinematic book cover art or aesthetic moodboard prompts.</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-950 p-6 rounded-2xl relative overflow-hidden flex-1 min-h-[100px]">
                                        <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                                            {term.aiPromptCommandCenter?.aiImagePrompt || `Cinematic book cover art representing ${term.term} with high emotional contrast, professional lighting, 8k resolution.`}
                                        </p>
                                        <CopyPromptButton prompt={term.aiPromptCommandCenter?.aiImagePrompt || `Cinematic book cover art representing ${term.term} with high emotional contrast, professional lighting, 8k resolution.`} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                        <Hash size={16} className="text-indigo-600" /> Community Tags
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['booktok', 'bookstagram', 'lemon8bookclub', 'aestheticbooks', 'tropetalk', term.category.toLowerCase().replace(/\s+/g, '')].map((tag) => (
                                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Sparkles size={60} /></div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-indigo-200">Aesthetic Guide</h4>
                                    <p className="text-xs font-medium leading-relaxed opacity-90">This trope perfectly matches the <span className="font-black text-amber-400">Dark Academia</span> or <span className="font-black text-amber-400">Cozy Minimalist</span> aesthetic depending on execution.</p>
                                    <div className="flex gap-2 pt-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-950 border border-white/20"></div>
                                        <div className="w-6 h-6 rounded-full bg-indigo-900 border border-white/20"></div>
                                        <div className="w-6 h-6 rounded-full bg-amber-900 border border-white/20"></div>
                                    </div>
                                </div>
                            </div>
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
