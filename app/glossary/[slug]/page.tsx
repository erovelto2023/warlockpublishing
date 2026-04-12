import React from 'react';
import { getGlossaryTermBySlug, getRelatedGlossaryTerms, trackGlossaryView } from '@/lib/actions/glossary';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  History, Globe, BookOpen, CheckCircle2, AlertTriangle, Zap, DollarSign, 
  ArrowRight, Copy, ChevronDown, ShoppingBag, Star, ExternalLink, 
  FileText, Users, Monitor, TrendingUp, Rocket, Compass,
  MessageSquareQuote, Youtube, Layout, Clock, Hash, Tag, Share2, 
  ListChecks, PieChart, UserCheck, ChevronRight, BookDashed
} from 'lucide-react';
import StructuredData from '@/components/glossary/StructuredData';
import CopyPromptButton from '@/components/glossary/CopyPromptButton';
import PrintButton from '@/components/glossary/PrintButton';

export default async function RegistryDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const term = await getGlossaryTermBySlug(params.slug);
    if (!term) return notFound();

    const relatedTerms = await getRelatedGlossaryTerms(term.category || 'General', term.slug);

    // Fire-and-forget view tracking (non-blocking)
    void trackGlossaryView(params.slug);

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

            <div className="max-w-[1440px] mx-auto px-4 py-8 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                
                {/*  MAIN CONTENT AREA  */}
                <div className="lg:col-span-8 space-y-12">
                    
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Category / Genre</span>
                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Tag size={14} className="text-indigo-500" /> {term.category || 'General'}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Subcategory / Trope</span>
                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Compass size={14} className="text-emerald-500" /> {term.subcategory || 'Strategy'}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Publishing Context</span>
                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Layout size={14} className="text-blue-500" /> {term.publishingContext || 'Cross-Platform'}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*  2. CONTEXTUAL MEANING SECTION  */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 px-2">
                            <History className="text-indigo-600" size={24} /> Contextual Meaning
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Historical Context & Original Usage</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {term.origin || "Intelligence on historical origins is currently being indexed for this terminology node."}
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Current Usage</h4>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {term.modernUsage || "In a modern publishing framework, this concept defines the high-level boundary of commercial engagement."}
                                </p>
                            </div>
                        </div>
                        <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                           <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><MessageSquareQuote size={120} /></div>
                           <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">Expanded Definition</h4>
                           <p className="text-xl font-light leading-relaxed text-slate-200">
                                {term.expandedExplanation || term.definition}
                           </p>
                        </div>
                    </section>

                    {/*  3. PUBLIC KNOWLEDGE BASE  */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 px-2">
                            <BookOpen className="text-indigo-600" size={24} /> Public Knowledge Base
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-3xl space-y-3">
                                <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">Simple Definition</h4>
                                <p className="text-sm text-slate-600 italic leading-relaxed font-medium">"{term.shortDefinition || "A foundational summary of the concept intended for broad understanding."}"</p>
                            </div>
                            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Technical Definition</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{term.definition || "Formalized implementation details and structural constraints within the publishing ecosystem."}</p>
                            </div>
                        </div>
                    </section>

                    {/*  4. GETTING STARTED CHECKLIST  */}
                    <section className="p-10 md:p-14 bg-white border border-slate-200 shadow-sm rounded-[3rem] relative overflow-hidden flex flex-col justify-center">
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
                    <section className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Strategic FAQ</h2>
                            {/* <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100 hover:bg-indigo-100 transition-all">+ Add FAQ Entry</button> */}
                        </div>
                        <div className="space-y-4">
                            {(term.faqs && term.faqs.length > 0 ? term.faqs : [
                                { question: "How does this drive commercial authority?", answer: "By establishing terminology dominance, you position your brand as the primary reference point in the niche." },
                                { question: "Is this scalable for small creators?", answer: "Exceedingly so. Small creators can leverage this clarity to out-maneuver larger, slower competitors." }
                            ]).map((faq: any, i: number) => (
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
                    <section className="space-y-8">
                         <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 px-2">
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
                                    {(term.targetAudience && term.targetAudience.length > 0 ? term.targetAudience : [
                                        { title: "Educators", benefit: "Curriculum tools and classroom modeling." },
                                        { title: "Publishers", benefit: "Data on high-demand tropes for new acquisitions." },
                                        { title: "Authors", benefit: "Strategic cues for writing character interactions." }
                                    ]).map((aud: any, i: number) => (
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
                                     <h4 className="text-lg font-extrabold text-slate-900 italic leading-tight">"{ref.name}"</h4>
                                     <a href={ref.url || '#'} className="mt-auto text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1">
                                        View Reference <ArrowRight size={10} />
                                     </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/*  8. 10 PRODUCT IDEAS PIPELINE  */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200 pb-6 italic">10 Product Ideas Pipeline</h2>
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

                    {/*  EXTRA SECTIONS: Amazon Curated Products (Kept to ensure all areas are there)  */}
                    {term.amazonProducts && term.amazonProducts.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200 pb-6 italic">Curated Prime Assets</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {term.amazonProducts.map((p: any, i: number) => (
                                    <Link key={i} href={p.url || '#'} target="_blank" className="flex items-center gap-6 p-6 bg-white border border-slate-200 shadow-sm rounded-3xl hover:shadow-lg hover:border-slate-300 transition-all group">
                                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors shrink-0">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-tight">{p.name}</h5>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Verified Amazon</span>
                                                <div className="flex items-center gap-0.5 text-amber-500">
                                                    {[1,2,3,4,5].map(s => <Star key={s} size={8} className="fill-current" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/*  9. COMMON PITFALLS  */}
                    <section className="p-10 md:p-14 bg-rose-50/50 border border-rose-100 rounded-[3rem] shadow-sm">
                        <div className="flex items-center gap-4 mb-10 text-rose-600">
                            <AlertTriangle size={24} strokeWidth={2.5} />
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Common Pitfalls</h2>
                        </div>
                        <div className="space-y-4">
                            {(term.commonPitfalls && term.commonPitfalls.length > 0 ? term.commonPitfalls : [
                                { pitfall: "Strategic Narrowing", whyItHappens: "Focusing too closely on one component.", howToAvoid: "Maintain structural breadth." }
                            ]).map((p: any, i: number) => (
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
                                              src={term.videoUrl.replace('watch?v=', 'embed/')} 
                                              title="YouTube video player"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                              allowFullScreen
                                          ></iframe>
                                          <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay"></div>
                                      </div>
                                 </div>
                                 <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
                                      <h4 className="text-lg font-extrabold text-slate-900 leading-tight">Expert Analysis Overview</h4>
                                      <p className="text-xs text-slate-500 italic">Auto-search Query: "{term.term} Strategies"</p>
                                      <a href={term.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100 flex items-center gap-2 hover:bg-indigo-100 transition-colors w-fit break-all">
                                          {term.videoUrl.substring(0, 30)}... <ExternalLink size={10} className="shrink-0" />
                                      </a>
                                 </div>
                            </div>
                        </section>
                    )}

                    {/*  11. BLOG / ARTICLE SECTION  */}
                    {term.blogArticle?.content && (
                        <section className="p-16 bg-white border border-slate-200 shadow-sm rounded-[4rem] relative overflow-hidden print-break">
                            <div className="absolute top-0 right-0 p-8 opacity-5"><FileText size={160}/></div>
                            <div className="mb-12 border-b border-slate-100 pb-8 relative z-10">
                                <div className="flex items-center gap-3 text-indigo-600 mb-6">
                                    <Layout size={20}/>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Blog & Editorial Center</h3>
                                </div>
                                <h2 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter leading-tight italic mb-8">
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
                                          <li key={i}>"{h}"</li>
                                      ))}
                                  </ul>
                             </div>
                             <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-4">Blog / Pin Angles</h4>
                                  <ul className="space-y-3 text-[11px] font-bold text-indigo-600">
                                      {(term.headlines && term.headlines.length > 0 ? term.headlines : term.marketingHooks?.blogTitles || [`How to implement ${term.term}`]).map((h: string, i: number) => (
                                          <li key={i}>"{h}"</li>
                                      ))}
                                  </ul>
                             </div>
                        </div>
                    </section>

                    {/*  13. RELATED KEYWORDS  */}
                    <section className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                         <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Related Keywords</h3>
                         <div className="flex flex-wrap gap-3">
                             {(term.relatedKeywords && term.relatedKeywords.length > 0 ? term.relatedKeywords : []).map((k: any, i: number) => (
                                 <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-3 hover: border-indigo-300 transition-all cursor-default">
                                      <span className="text-[11px] font-bold text-slate-600">{typeof k === 'string' ? k : k.keyword}</span>
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
                    <section className="p-10 md:p-14 bg-slate-900 text-white rounded-[3rem] relative overflow-hidden border border-slate-800">
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent -z-10"></div>
                         <div className="flex items-center gap-3 mb-12">
                             <Zap className="text-amber-400" size={24} />
                             <h2 className="text-2xl font-bold uppercase tracking-widest italic">AI Command Center</h2>
                         </div>
                         <div className="space-y-6">
                              {[
                                  { label: "Product Idea Prompt", text: term.productIdeaPrompt || term.aiPromptCommandCenter?.productIdeaPrompt || `Brainstorm 5 product ideas for '${term.term}' including target audience...` },
                                  { label: "AI Image Prompt", text: term.aiImagePrompt || term.aiPromptCommandCenter?.aiImagePrompt || `3D render abstraction of ${term.term}, octane render, vibrant, 8k --v 6.0` },
                                  { label: "Content Strategy Prompt", text: term.contentStrategyPrompt || term.aiPromptCommandCenter?.contentStrategyPrompt || `Create a 7-day social media content plan regarding ${term.term} and its applications...` }
                              ].map((p, i) => (
                                  <div key={i} className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-3 group">
                                      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-3">
                                           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{p.label}</span>
                                           <div className="shrink-0">
                                               <CopyPromptButton prompt={p.text} className="!w-auto !px-3 !py-1 !text-[9px]" />
                                           </div>
                                      </div>
                                      <p className="text-sm text-slate-400 italic font-mono bg-black/20 p-4 rounded-lg leading-relaxed">"{p.text}"</p>
                                  </div>
                              ))}
                         </div>
                    </section>

                </div>

                {/*  SIDEBAR ELEMENTS  */}
                <aside className="lg:col-span-4 space-y-10 no-print">
                    



                    {/*  Related Terms Cloud  */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic underline decoration-indigo-200 underline-offset-4">
                             Related Mastery Nodes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {relatedTerms.map((rt: any, i: number) => (
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
                             ]).map((plat: any, i: number) => (
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
                        <h4 className="text-lg font-black text-white uppercase tracking-tight italic leading-tight">Accelerate Your Strategy</h4>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">Access the complete {term.category} Mastery Hub.</p>
                        <Link href="/products" className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-50 hover:text-indigo-900 transition-all flex items-center justify-center gap-2">
                            Access Hub <ArrowRight size={14} />
                        </Link>
                    </div>

                </aside>

            </div>



        </div>
    );
}
