import React from 'react';
import { 
    CheckCircle2, ArrowRight, ShieldCheck, 
    Star, HelpCircle, Clock, Users as UsersIcon
} from "lucide-react";

export default function MagazineTemplate({ advertorial }: { advertorial: any }) {
    // Safe data access
    const summaryBox = advertorial.summaryBox || { title: "The Feature", bulletPoints: [], ctaText: "Read More" };
    const narrative = advertorial.narrative || { frictionReveal: "", editorialPivot: "" };
    const valueProof = advertorial.valueReinforcement || { priceAnchoring: "", steps: [] };

    // Resolve Target URL
    let targetUrl = advertorial.affiliateOfferId?.affiliateLink || advertorial.customTargetUrl || summaryBox.targetUrl || "#";

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#222] font-serif selection:bg-amber-100 pb-32">
            <div className="max-w-5xl mx-auto px-6 pt-24 space-y-20">
                {/* Magazine Masthead */}
                <header className="border-b-2 border-[#222] pb-12 space-y-8">
                    <div className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Special Edition &bull; Warlock Editorial</div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-center leading-[0.85] uppercase">
                        {advertorial.title}
                    </h1>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-6 border-t border-slate-200">
                        <span>Reported by W.P. Staff</span>
                        <span>{new Date(advertorial.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <span>London / New York</span>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <p className="text-2xl md:text-3xl leading-snug first-letter:text-8xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-[0.7] first-letter:pt-2">
                                {narrative.frictionReveal}
                            </p>
                        </section>

                        <section className="bg-white border border-slate-100 p-10 space-y-6 shadow-sm">
                            <h3 className="text-xl font-black uppercase tracking-tight">The Breakthrough</h3>
                            <p className="text-xl leading-relaxed italic text-slate-700">
                                {narrative.editorialPivot}
                            </p>
                        </section>

                        <section className="space-y-8">
                            <p className="text-xl leading-relaxed">
                                {valueProof.priceAnchoring}
                            </p>
                            <div className="grid md:grid-cols-2 gap-10 pt-4">
                                {valueProof.steps?.map((step: any, i: number) => (
                                    <div key={i} className="space-y-2">
                                        <div className="w-8 h-[2px] bg-black mb-4"></div>
                                        <h4 className="font-black uppercase text-sm tracking-widest">{step.title}</h4>
                                        <p className="text-base text-slate-600 leading-relaxed font-sans">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="space-y-12">
                        <div className="bg-[#222] text-white p-8 space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-tight border-b border-white/20 pb-4">{summaryBox.title}</h2>
                            <ul className="space-y-4">
                                {summaryBox.bulletPoints?.map((point: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-tight">
                                        <CheckCircle2 size={16} className="text-white shrink-0 mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <a href={targetUrl} target="_blank" className="block w-full bg-white text-black text-center py-4 font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors">
                                {summaryBox.ctaText}
                            </a>
                        </div>

                        <div className="p-8 border-2 border-black space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest">Editor's Note</h4>
                            <p className="text-sm italic text-slate-600 leading-relaxed font-sans">
                                "This research was conducted over a 12-month period to ensure maximum accuracy in our findings. All links are verified for security."
                            </p>
                        </div>
                    </aside>
                </div>

                {/* Final Masthead CTA */}
                <footer className="border-t-4 border-black py-20 text-center space-y-10">
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic">Secure the Tool.</h2>
                    <a href={targetUrl} target="_blank" className="inline-flex h-16 items-center justify-center px-16 border-4 border-black font-black uppercase text-lg tracking-[0.2em] hover:bg-black hover:text-white transition-all">
                        {summaryBox.ctaText || "Claim The Offer"}
                    </a>
                </footer>
            </div>
        </div>
    );
}
