import { getAdvertorialBySlug } from "@/lib/actions/advertorial";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { 
    CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, 
    Star, Zap, HelpCircle, ChevronRight, TrendingUp, Clock, Users as UsersIcon
} from "lucide-react";

export default async function AdvertorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const advertorial = await getAdvertorialBySlug(slug);

    if (!advertorial) notFound();

    // Resolve Target URL (Prioritize Catalog Offer if available)
    const targetUrl = advertorial.affiliateOfferId?.affiliateLink || advertorial.customTargetUrl || advertorial.summaryBox?.targetUrl || "#";

    const template = advertorial.template || 'standard';

    return (
        <div className={`min-h-screen pb-20 ${template === 'minimalist' ? 'bg-white font-serif' : 'bg-slate-50 dark:bg-slate-950 font-sans'}`}>
            {/* Template-Based Header */}
            {template === 'comparison' ? (
                <div className="bg-slate-900 text-white py-12 px-4 border-b border-indigo-500/30">
                    <div className="max-w-4xl mx-auto text-center space-y-4">
                        <div className="inline-block px-4 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Head-to-Head Comparison</div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
                            Is {advertorial.title.split(' ')[0]} Truly Better?
                        </h1>
                        <p className="text-slate-400 font-medium italic">We compared the top 3 contenders so you don't have to.</p>
                    </div>
                </div>
            ) : template === 'listicle' ? (
                <div className="bg-indigo-700 text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Trending Now &bull; {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                        <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight">
                            {advertorial.title}
                        </h1>
                        <div className="flex justify-center items-center gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1"><UsersIcon size={16} /> 142k Shares</span>
                            <span className="flex items-center gap-1"><Clock size={16} /> 4 min read</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pt-24 pb-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                            <TrendingUp size={16} /> Breaking Editorial
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter mb-8">
                            {advertorial.title}
                        </h1>
                        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-indigo-600 flex items-center justify-center font-bold text-indigo-600">WP</div>
                            <div>
                                <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Warlock Editorial Team</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 mt-12">
                {/* Summary Box (The "At a Glance" - Captures non-scrollers) */}
                <Card className={`p-8 md:p-10 border-2 overflow-hidden relative group ${template === 'minimalist' ? 'border-slate-100 bg-slate-50' : 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-600/10'}`}>
                    <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                        Expert Verdict
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex gap-1 text-amber-400">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                    {advertorial.summaryBox?.topPick || "The Ultimate Solution Found"}
                                </h3>
                            </div>
                            
                            <ul className="space-y-3">
                                {advertorial.summaryBox?.benefits?.map((benefit: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            {advertorial.scarcity?.type !== 'none' && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 animate-pulse">
                                    {advertorial.scarcity?.type === 'timer' ? <Clock size={12} /> : <UsersIcon size={12} />}
                                    {advertorial.scarcity?.value}
                                </div>
                            )}
                            <a 
                                href={targetUrl} 
                                className="group/btn w-full bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-2xl text-xl font-black text-center shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                {advertorial.summaryBox?.ctaText || "Claim The Deal Now"}
                                <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                            </a>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Secure Link &bull; Verified Offer</p>
                        </div>
                    </div>
                </Card>

                {/* Narrative Section (The "Friction Reveal") */}
                <div className={`mt-20 prose dark:prose-invert max-w-none ${template === 'minimalist' ? 'prose-slate' : 'prose-indigo'}`}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-1 bg-indigo-600"></div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">The Context</span>
                    </div>
                    
                    <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed mb-12">
                        {advertorial.narrative?.frictionReveal}
                    </div>

                    <div className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                            <AlertTriangle size={16} /> Important Editorial Note
                        </div>
                        <div className="text-xl font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">
                            "{advertorial.narrative?.editorialPivot}"
                        </div>
                    </div>
                </div>

                {/* Value Reinforcement */}
                <div className="mt-20">
                    <h2 className={`text-3xl font-black mb-8 ${template === 'minimalist' ? 'text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                        {template === 'listicle' ? 'Why It Works' : 'Why This Changes Everything'}
                    </h2>
                    <div className={`p-8 md:p-12 rounded-[2.5rem] shadow-2xl mb-12 border ${template === 'minimalist' ? 'bg-slate-50 border-slate-100 text-slate-900' : 'bg-slate-900 text-white border-slate-800'}`}>
                        <div className={`uppercase text-[10px] font-black tracking-widest mb-4 ${template === 'minimalist' ? 'text-slate-400' : 'text-indigo-400'}`}>Price Anchoring & Comparison</div>
                        <div className={`text-2xl md:text-3xl font-bold leading-tight ${template === 'minimalist' ? 'text-slate-900' : 'text-slate-100'}`}>
                            {advertorial.valueReinforcement?.priceAnchoring}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {advertorial.valueReinforcement?.steps?.map((step: any, i: number) => (
                            <div key={i} className={`p-8 rounded-3xl border transition-all ${template === 'minimalist' ? 'bg-white border-slate-100' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-600'}`}>
                                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black mb-6 shadow-lg shadow-indigo-600/20">
                                    {i + 1}
                                </div>
                                <h4 className="text-xl font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tight">{step.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="mt-24">
                    <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">The Hard Data Comparison</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                    {advertorial.comparisonTable?.headers?.map((header: string, i: number) => (
                                        <th key={i} className="p-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-950">
                                {advertorial.comparisonTable?.rows?.map((row: string[], i: number) => (
                                    <tr key={i} className="border-t border-slate-100 dark:border-slate-900">
                                        {row.map((cell: string, j: number) => (
                                            <td key={j} className={`p-4 text-sm font-medium ${j === 1 ? 'bg-indigo-50/30 dark:bg-indigo-900/10 font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 space-y-8">
                    <h2 className="text-3xl font-black flex items-center gap-3">
                        <HelpCircle className="text-indigo-600" /> Frequently Asked
                    </h2>
                    <div className="grid gap-6">
                        {advertorial.faq?.map((item: any, i: number) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                <h4 className="text-lg font-black mb-4">{item.question}</h4>
                                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed m-0">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-24 text-center space-y-8">
                    <h2 className="text-4xl font-black leading-tight">Ready to bypass the friction?</h2>
                    <p className="text-xl text-slate-500">Don't settle for the "Standard Cost" when the Insider Hack is active.</p>
                    <a 
                        href={targetUrl} 
                        className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-6 rounded-2xl text-2xl font-black shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                        {advertorial.summaryBox?.ctaText || "Claim The Hack Now"}
                    </a>
                    <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 pt-8">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> SECURE ACCESS</span>
                        <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-500" /> TRUSTED BRAND</span>
                    </div>
                </div>
            </article>
        </div>
    );
}
