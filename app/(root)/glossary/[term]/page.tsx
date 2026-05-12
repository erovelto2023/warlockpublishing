import { getGlossaryTermBySlug, getGlossaryTerms, incrementGlossaryView, getGlossaryLinks } from "@/lib/actions/glossary";
import { extractYouTubeId } from "@/lib/utils";
import { GlossaryTerm } from "@/lib/types";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { currentUser } from '@clerk/nextjs/server';
import { 
    CheckCircle2, Play, Lightbulb, Target, TrendingUp, 
    MessageSquare, ArrowRight, BookOpen
} from "lucide-react";
import ChecklistSection from "@/components/glossary/ChecklistSection";
import ProductPipelineSection from "@/components/glossary/ProductPipelineSection";
import GlossarySignupSection from "@/components/glossary/GlossarySignupSection";
import SEOStrategySection from "@/components/glossary/SEOStrategySection";
import StructuredData from "@/components/glossary/StructuredData";
import AuthorityArticle from "@/components/glossary/AuthorityArticle";
import RandomProducts from "@/components/glossary/RandomProducts";
import { getFeaturedItems } from "@/lib/actions/product.actions";
import CallToActionBlock from "@/components/shared/CallToActionBlock";
import { getCallToActionById } from "@/lib/actions/cta.actions";
import ReaderPsychologySection from "@/components/glossary/ReaderPsychologySection";
import MasterclassSection from "@/components/glossary/MasterclassSection";
import AIPromptCommandCenter from "@/components/glossary/AIPromptCommandCenter";
import VibeCurationSection from "@/components/glossary/VibeCurationSection";
import SubGenreVariationsSection from "@/components/glossary/SubGenreVariationsSection";
import CommonPitfallsSection from "@/components/glossary/CommonPitfallsSection";
import MarketDemandSection from "@/components/glossary/MarketDemandSection";
import MarketingViralSection from "@/components/glossary/MarketingViralSection";
import AffiliateDisclaimer from "@/components/shared/AffiliateDisclaimer";
import BriefDownloadButton from "@/components/glossary/BriefDownloadButton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }) {
    const { term: slug } = await params;
    const term = await getGlossaryTermBySlug(slug);
    
    if (!term) return { title: 'Term Not Found' };

    return {
        title: `${term.term} | AI & SEO Glossary`,
        description: term.snapshot,
    };
}

export const dynamic = 'force-dynamic';

export default async function GlossaryEntryPage({ params }: { params: Promise<{ term: string }> }) {
    const { term: slug } = await params;
    console.log('GlossaryEntryPage executed for slug:', slug);
    const term = await getGlossaryTermBySlug(slug) as unknown as GlossaryTerm;
    
    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    if (!term) {
        notFound();
    }

    let cta = null;
    if (term.callToActionId) {
        cta = await getCallToActionById(term.callToActionId);
    }

    // Background increment view (no need to await)
    incrementGlossaryView(term._id);

    // Fetch random products for showcase
    const randomProducts = await getFeaturedItems();

    // Fetch all terms for internal linking
    const allLinks = await getGlossaryLinks();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <StructuredData term={term} />
            {/* Context Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <Link href="/glossary" className="hover:text-indigo-500 transition-colors">Glossary</Link>
                        <span>/</span>
                        <Link href="/glossary/directory" className="hover:text-indigo-500 transition-colors">{term.category}</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <BriefDownloadButton />
                        <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider">
                            <MessageSquare size={14} className="mr-2" /> Share
                        </Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-6">
                            Follow Term
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Hero / Definition */}
                        <section>
                            <div className="mb-8">
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight font-serif italic tracking-tight">
                                    {term.term}
                                </h1>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                                        {term.category}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        term.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        term.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                        {term.difficulty}
                                    </span>
                                </div>
                            </div>

                            <Card className="p-8 md:p-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <BookOpen size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-serif italic">Snapshot Intelligence</h2>
                                    <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-10 border-l-4 border-indigo-500 pl-6 italic">
                                        {term.snapshot}
                                    </p>
                                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-loose">
                                        {term.definition}
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Video Section (if exists) */}
                        {term.youtubeVideoId && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 font-serif italic">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white not-italic font-sans text-sm">2</div>
                                    Expert Video Deep-Dive
                                </h2>
                                <Card className="overflow-hidden bg-black aspect-video relative group border-none shadow-2xl">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(term.youtubeVideoId)}?rel=0&modestbranding=1`}
                                        title={term.term}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </Card>
                            </section>
                        )}

                        {/* Authority Article / Blog Content */}
                        {(term.articleContent || cta) && (
                            <div>
                                {term.articleContent && <AuthorityArticle content={term.articleContent} allTerms={allLinks} />}
                                {cta && (
                                    <div className="mt-8">
                                        <CallToActionBlock cta={cta} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Characteristics */}
                        {term.characteristics && term.characteristics.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 font-serif italic">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white not-italic font-sans text-sm">3</div>
                                    Key Attributes
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {term.characteristics.map((char: string, i: number) => (
                                        <Card key={i} className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-colors group">
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <CheckCircle2 size={18} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">
                                                    {char}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Reader Psychology */}
                        {term.readerPsychology && (
                            <ReaderPsychologySection psychology={term.readerPsychology} />
                        )}

                        {/* Implementation Checklist */}
                        {term.checklist && (
                            <ChecklistSection 
                                title={term.checklist.title}
                                description={term.checklist.description}
                                items={term.checklist.items}
                            />
                        )}

                        {/* FAQ Section */}
                        {term.faqItems && term.faqItems.length > 0 && (
                            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10 font-serif italic flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 not-italic font-sans text-sm">5</div>
                                    Strategic FAQ
                                </h2>
                                
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {term.faqItems.map((faq: { question: string, answer: string }, i: number) => (
                                        <AccordionItem key={i} value={`faq-${i}`} className="border border-slate-100 dark:border-slate-800 rounded-2xl px-6 bg-slate-50/30 dark:bg-slate-800/20">
                                            <AccordionTrigger className="text-left font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 py-6">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed pb-6 text-sm">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}

                        {/* Masterclass Section */}
                        {term.masterclass && (
                            <MasterclassSection masterclass={term.masterclass} />
                        )}

                        {/* Viral Hooks & Content Pillars */}
                        {term.marketingStrategy && (
                            <MarketingViralSection marketingStrategy={term.marketingStrategy} />
                        )}

                        {/* Sub-Genre Variations */}
                        {term.subGenreVariations && term.subGenreVariations.length > 0 && (
                            <SubGenreVariationsSection variations={term.subGenreVariations} />
                        )}

                        {/* Vibe Curation */}
                        {term.vibeCuration && term.vibeCuration.length > 0 && (
                            <VibeCurationSection curation={term.vibeCuration} />
                        )}

                        {/* Common Pitfalls */}
                        {term.commonPitfalls && term.commonPitfalls.length > 0 && (
                            <CommonPitfallsSection pitfalls={term.commonPitfalls} />
                        )}

                        {/* AI Prompt Command Center */}
                        {term.aiPromptCommandCenter && (
                            <AIPromptCommandCenter prompts={term.aiPromptCommandCenter} />
                        )}
                    </div>

                    {/* Sidebar / Authority Intelligence */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Market Demand Section */}
                        {term.marketDemand && <MarketDemandSection demand={term.marketDemand} />}

                        {/* SEO Strategy Section */}
                        {term.seoStrategy && <SEOStrategySection strategy={term.seoStrategy} />}

                        {/* Signup Section */}
                        <GlossarySignupSection 
                            term={term.term} 
                            image={term.monetizationIdeas?.digitalDownloads?.[0]?.imageUrl} 
                        />

                        {/* Product Pipeline Section */}
                        <ProductPipelineSection term={term.term} ideas={term.monetizationIdeas} />

                        {/* Related Terms / Quick Nav */}
                        <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">
                                Exploration Path
                            </h3>
                            <div className="space-y-4">
                                <Link href="/glossary/directory" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Back to Directory</span>
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                {isAdmin && (
                                    <Link href="/admin" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Term Editor</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Random Products Showcase */}
            <div className="mt-24">
                <RandomProducts products={randomProducts} />
            </div>

            {/* Affiliate Disclaimer */}
            <AffiliateDisclaimer />
        </div>
    );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    )
}


