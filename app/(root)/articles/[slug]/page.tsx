import { getAdvertorialBySlug, trackAdvertorialView } from "@/lib/actions/advertorial";
import { notFound } from "next/navigation";
import { 
    CheckCircle2, ArrowRight, ShieldCheck, 
    Star, HelpCircle, Clock, Users as UsersIcon
} from "lucide-react";

export default async function AdvertorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const advertorial = await getAdvertorialBySlug(slug);

    if (!advertorial) notFound();

    // Increment view count
    await trackAdvertorialView(advertorial._id);

    // Safe data access
    const summaryBox = advertorial.summaryBox || { title: "Executive Summary", bulletPoints: [], ctaText: "Claim Offer" };
    const narrative = advertorial.narrative || { frictionReveal: "", editorialPivot: "" };
    const valueProof = advertorial.valueReinforcement || { priceAnchoring: "", steps: [] };

    // Resolve Target URL (Prioritize Catalog Offer if available)
    let targetUrl = advertorial.affiliateOfferId?.affiliateLink || advertorial.customTargetUrl || summaryBox.targetUrl || "#";

    // Clean URL: Handle relative-looking absolute URLs and markdown remnants
    if (targetUrl !== "#") {
        // Remove markdown [text](url) if AI included it
        const mdMatch = String(targetUrl).match(/\[.*\]\((.*)\)/);
        if (mdMatch) targetUrl = mdMatch[1];

        // Ensure protocol
        if (!String(targetUrl).startsWith('http') && !String(targetUrl).startsWith('//')) {
            targetUrl = `https://${targetUrl}`;
        }
        
        // Fix common typo: https:/ instead of https://
        targetUrl = String(targetUrl).replace(/^https?:\/([^\/])/, 'https://$1');
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-slate-200 pb-20 pt-10">
            <div className="bg-white text-black">
                {/* Header Section */}
                <header className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-black pb-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                                <ShieldCheck size={14} /> Verified Editorial Report
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase text-black">
                                {advertorial.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-widest text-black">Last Updated</div>
                                <div className="text-[10px] font-bold uppercase">{new Date(advertorial.updatedAt || Date.now()).toLocaleDateString()}</div>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-100"></div>
                            <div className="text-center">
                                <div className="text-[10px] font-black uppercase tracking-widest text-black">Reading Time</div>
                                <div className="text-[10px] font-bold uppercase">4 Mins</div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Box (At a Glance) */}
                    <div className="bg-white border-2 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black">
                            <Star size={16} fill="currentColor" /> Executive Summary
                        </div>
                        <p className="text-xl md:text-2xl font-bold leading-tight italic text-black">
                            "{summaryBox.title}"
                        </p>
                        <div className="grid md:grid-cols-2 gap-8 pt-4">
                            <ul className="space-y-3">
                                {summaryBox.bulletPoints?.map((point: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                                        <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col justify-center">
                                <a 
                                    href={targetUrl}
                                    target="_blank"
                                    className="w-full bg-black text-white text-center py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg"
                                >
                                    {summaryBox.ctaText} <ArrowRight size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Narrative Sections */}
                <article className="max-w-4xl mx-auto px-6 space-y-24 bg-white">
                    {/* Section 01: The Friction */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-black">01</span>
                            <div className="h-[2px] flex-grow bg-slate-100"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Problem</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-800 first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-black">
                            {narrative.frictionReveal}
                        </div>
                    </section>

                    {/* Section 02: The Pivot */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-black">02</span>
                            <div className="h-[2px] flex-grow bg-slate-100"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Discovery</span>
                        </div>
                        <div className="p-10 md:p-16 border-l-8 border-black bg-slate-50 text-2xl md:text-3xl font-medium leading-relaxed italic text-black">
                            {narrative.editorialPivot}
                        </div>
                    </section>

                    {/* Section 03: The Value */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-black">03</span>
                            <div className="h-[2px] flex-grow bg-slate-100"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Proof</span>
                        </div>
                        <div className="space-y-10">
                            <div className="bg-indigo-600 text-white p-10 shadow-xl">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-indigo-200">The Reality Check</h3>
                                <p className="text-2xl md:text-3xl font-bold leading-tight">
                                    {valueProof.priceAnchoring}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {valueProof.steps?.map((step: any, i: number) => (
                                    <div key={i} className="space-y-4 p-8 border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-4xl font-black text-slate-100">0{i+1}</div>
                                        <h4 className="text-lg font-black uppercase tracking-tight text-black">{step.title}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                    {/* Final CTA */}
                    <section className="py-20 border-t-4 border-black text-center space-y-10 bg-white">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black">Ready to make the switch?</h2>
                            <p className="text-xl text-slate-500 font-medium">Join 5,000+ others who optimized their workflow this month.</p>
                        </div>
                        <div className="flex flex-col items-center gap-6">
                            <a 
                                href={targetUrl}
                                target="_blank"
                                className="inline-flex bg-black text-white px-12 py-6 text-lg font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all gap-4 shadow-2xl"
                            >
                                Secure Your Access <ArrowRight size={24} />
                            </a>
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-black" /> ENCRYPTED LINK</span>
                                <span className="flex items-center gap-1.5"><UsersIcon size={14} className="text-black" /> 42 VIEWING NOW</span>
                                <span className="flex items-center gap-1.5"><Star size={14} className="text-black" /> TRUSTED BRAND</span>
                            </div>
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
}
