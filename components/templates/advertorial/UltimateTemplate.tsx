'use client';

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle2, ArrowRight, ShieldCheck, 
    Star, Quote, Zap
} from 'lucide-react';
import { extractYouTubeId } from '@/lib/utils';

interface UltimateTemplateProps {
    advertorial: any; // IAdvertorial
}

export default function UltimateTemplate({ advertorial }: UltimateTemplateProps) {
    const { 
        ftcDisclosure, 
        heroSection, 
        listicleItems = [], 
        comparisonData, 
        socialProof = [], 
        conversionClose,
        customTargetUrl,
        affiliateOfferId,
        vsl
    } = advertorial;

    const targetUrl = customTargetUrl || affiliateOfferId?.affiliateLink || "#";

    const renderVideo = (url: string) => {
        const ytId = extractYouTubeId(url);
        if (ytId && ytId.length === 11) {
            return (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`} 
                        title="Video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }
        return (
            <video 
                src={url} 
                controls 
                className="aspect-video w-full rounded-2xl shadow-2xl border border-slate-200"
            />
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* 1. FTC Compliance Header */}
            <div className="bg-slate-100 border-b border-slate-200 py-2 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {ftcDisclosure || 'Advertisement'}
                </span>
            </div>

            {/* 2. Hero Section */}
            <section className="bg-white border-b border-slate-100 pt-16 pb-24">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        {heroSection?.headline}
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-600 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
                        {heroSection?.boldClaim}
                    </p>
                    
                    <div className="max-w-4xl mx-auto">
                        {heroSection?.videoUrl ? (
                            renderVideo(heroSection.videoUrl)
                        ) : heroSection?.imageUrl ? (
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <img 
                                    src={heroSection.imageUrl} 
                                    alt="Hero" 
                                    className="relative rounded-2xl shadow-2xl border border-slate-200 w-full object-cover aspect-video"
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>

            {/* 3. Narrative Body (Listicle) */}
            <main className="container mx-auto px-4 py-20 max-w-3xl">
                <div className="space-y-24">
                    {listicleItems.map((item: any, idx: number) => (
                        <article key={idx} className="relative">
                            <div className="flex items-start gap-8">
                                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-slate-200">
                                    {idx + 1}
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                        {item.subheading}
                                    </h2>
                                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                                        {item.content}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* VSL Section */}
                {vsl?.videoUrl && (
                    <section className="mt-32 space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{vsl.title}</h2>
                            {vsl.description && <p className="text-slate-500 font-medium">{vsl.description}</p>}
                        </div>
                        {renderVideo(vsl.videoUrl)}
                    </section>
                )}

                {/* Comparison Chart */}
                {comparisonData && (
                    <section className="mt-32">
                        <h2 className="text-3xl font-black text-center text-slate-900 mb-12 uppercase tracking-tight">
                            {comparisonData.title}
                        </h2>
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Feature</th>
                                        <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-indigo-600">Our Solution</th>
                                        <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Alternatives</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comparisonData.features.map((f: any, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-6 font-bold text-slate-900">{f.name}</td>
                                            <td className="px-6 py-6 font-bold text-indigo-600 flex items-center gap-2">
                                                <CheckCircle2 className="text-emerald-500" size={18} /> {f.ourValue}
                                            </td>
                                            <td className="px-6 py-6 text-slate-400 font-medium">{f.competitorValue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* 4. Credibility Engine (Social Proof) */}
                {socialProof.length > 0 && (
                    <section className="mt-32">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} className="text-amber-400 fill-current" />)}
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">The Transformation is Real</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {socialProof.map((proof: any, i: number) => (
                                <Card key={i} className="p-8 border-slate-200 rounded-3xl bg-white shadow-xl shadow-slate-100 relative overflow-hidden group hover:border-indigo-500 transition-all">
                                    <Quote className="absolute -right-4 -top-4 text-slate-50 w-24 h-24 rotate-12" />
                                    <p className="relative z-10 text-slate-600 font-medium italic mb-6 leading-relaxed">
                                        "{proof.quote}"
                                    </p>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black text-xs">
                                            {proof.author?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 text-sm">{proof.author}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{proof.source} Verified</div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* 5. Conversion Close (Sticky CTA) */}
            <section className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
                </div>
                
                <div className="container mx-auto max-w-3xl text-center relative z-10">
                    <Zap className="mx-auto mb-8 text-indigo-400 animate-pulse" size={48} />
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                        {conversionClose?.urgencyText || 'Limited Time Availability'}
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 font-medium">
                        {conversionClose?.guaranteeText || '100% Risk-Free Guarantee'}
                    </p>
                    
                    <div className="flex flex-col items-center gap-6">
                        <a href={targetUrl} target="_blank" className="w-full md:w-auto">
                            <Button className="w-full md:w-auto px-12 h-16 bg-indigo-500 hover:bg-indigo-400 text-white text-xl font-black rounded-2xl shadow-2xl shadow-indigo-500/20 uppercase tracking-wider group transition-all">
                                {conversionClose?.ctaText || 'Claim Offer Now'}
                                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </a>
                        <div className="flex items-center gap-3 text-slate-500">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Encrypted Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky CTA Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 px-4 z-50 md:hidden flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Act Fast</div>
                    <div className="text-xs font-black text-indigo-600 uppercase tracking-tight">{conversionClose?.urgencyText?.split(' ')?.[0] || 'Sale'} Ending</div>
                </div>
                <a href={targetUrl} target="_blank">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 rounded-xl h-10 uppercase tracking-widest shadow-lg shadow-indigo-100">
                        Get Started
                    </Button>
                </a>
            </div>
        </div>
    );
}
