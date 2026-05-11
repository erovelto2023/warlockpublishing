import React from 'react';
import { 
    CheckCircle2, ArrowRight, ShieldCheck, 
    Star, HelpCircle, Clock, Users as UsersIcon
} from "lucide-react";

export default function MinimalistTemplate({ advertorial }: { advertorial: any }) {
    // Safe data access
    const summaryBox = advertorial.summaryBox || { title: "Summary", bulletPoints: [], ctaText: "Learn More" };
    const narrative = advertorial.narrative || { frictionReveal: "", editorialPivot: "" };
    const valueProof = advertorial.valueReinforcement || { priceAnchoring: "", steps: [] };

    // Resolve Target URL
    let targetUrl = advertorial.affiliateOfferId?.affiliateLink || advertorial.customTargetUrl || summaryBox.targetUrl || "#";

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-50 pb-32">
            <div className="max-w-3xl mx-auto px-6 pt-32 space-y-24">
                {/* Header */}
                <header className="space-y-6 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">Industry Insights</div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                        {advertorial.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                        <span>Updated {new Date(advertorial.updatedAt || Date.now()).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span>4 min read</span>
                    </div>
                </header>

                {/* Summary Box */}
                <div className="p-8 md:p-12 bg-slate-50 rounded-3xl space-y-8">
                    <h2 className="text-xl font-bold text-slate-900">{summaryBox.title}</h2>
                    <ul className="grid md:grid-cols-2 gap-6">
                        {summaryBox.bulletPoints?.map((point: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                {point}
                            </li>
                        ))}
                    </ul>
                    <a href={targetUrl} target="_blank" className="inline-flex items-center gap-3 text-sm font-bold text-indigo-600 hover:text-indigo-700 group transition-colors">
                        {summaryBox.ctaText} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                {/* Narrative */}
                <div className="prose prose-slate max-w-none space-y-16">
                    <section>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            {narrative.frictionReveal}
                        </p>
                    </section>

                    <section className="border-y border-slate-100 py-12">
                        <p className="text-2xl font-medium italic text-slate-800 leading-relaxed text-center px-4">
                            "{narrative.editorialPivot}"
                        </p>
                    </section>

                    <section className="space-y-12">
                        <p className="text-xl text-slate-600 leading-relaxed">
                            {valueProof.priceAnchoring}
                        </p>
                        <div className="grid md:grid-cols-3 gap-8 pt-4">
                            {valueProof.steps?.map((step: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Final CTA */}
                <footer className="pt-20 text-center space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight">Ready to start?</h2>
                        <p className="text-slate-500">Join the thousands of professionals using this system today.</p>
                    </div>
                    <a href={targetUrl} target="_blank" className="inline-flex h-14 items-center justify-center px-10 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                        Get Started Now
                    </a>
                </footer>
            </div>
        </div>
    );
}
