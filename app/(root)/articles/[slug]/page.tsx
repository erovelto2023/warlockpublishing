import { getAdvertorialBySlug } from "@/lib/actions/advertorial";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { 
    CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, 
    Star, Zap, HelpCircle, ChevronRight, TrendingUp
} from "lucide-react";

export default async function AdvertorialPage({ params }: { params: { slug: string } }) {
    const advertorial = await getAdvertorialBySlug(params.slug);

    if (!advertorial) notFound();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Conversion Header Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
                    <div className="flex flex-col items-center text-center mb-12">
                        <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-xl shadow-indigo-600/20">
                            Exclusive Insider Discovery
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8">
                            {advertorial.headlineOptions?.[0] || advertorial.title}
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                            Published: {new Date(advertorial.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} | Verified by Warlock Editorial
                        </p>
                    </div>

                    {/* Summary Box */}
                    <Card className="p-8 md:p-12 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={120} className="text-indigo-600" />
                        </div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase text-xs tracking-widest mb-4">
                                    <Star size={16} fill="currentColor" /> {advertorial.summaryBox?.topPick || "Our Top Verdict"}
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {advertorial.summaryBox?.benefits?.map((benefit: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-lg font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                            <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={20} />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <a 
                                    href={advertorial.summaryBox?.targetUrl || "#"} 
                                    className="group/btn w-full bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-2xl text-xl font-black text-center shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                                >
                                    {advertorial.summaryBox?.ctaText || "Claim The Deal Now"}
                                    <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                                </a>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Secure Link &bull; Verified Offer</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Narrative Arc Section */}
            <article className="max-w-3xl mx-auto px-4 py-20 prose prose-slate dark:prose-invert prose-lg md:prose-xl">
                <div className="bg-rose-50 dark:bg-rose-900/10 border-l-8 border-rose-600 p-8 md:p-12 rounded-r-[2rem] mb-16 relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-rose-600/10">
                        <AlertTriangle size={80} />
                    </div>
                    <h3 className="text-rose-600 dark:text-rose-400 uppercase text-xs font-black tracking-[0.3em] mb-4 mt-0">The Hidden Friction</h3>
                    <div className="text-slate-900 dark:text-white font-bold text-xl md:text-2xl leading-relaxed italic m-0">
                        "{advertorial.narrative?.frictionReveal}"
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                        <div className="h-px flex-1 bg-indigo-600/20"></div>
                        <TrendingUp size={24} />
                        <div className="h-px flex-1 bg-indigo-600/20"></div>
                    </div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                        {advertorial.narrative?.editorialPivot}
                    </p>
                </div>

                {/* Value Reinforcement */}
                <div className="mt-20">
                    <h2 className="text-3xl font-black mb-8">Why This Changes Everything</h2>
                    <div className="bg-indigo-600 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl mb-12">
                        <div className="text-indigo-200 uppercase text-[10px] font-black tracking-widest mb-2">Market Comparison</div>
                        <div className="text-2xl md:text-3xl font-bold leading-tight">
                            {advertorial.valueReinforcement?.priceAnchoring}
                        </div>
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
                         Quick Start Protocol
                    </h3>
                    <div className="grid gap-6">
                        {advertorial.valueReinforcement?.steps?.map((step: any, i: number) => (
                            <div key={i} className="flex gap-6 items-start p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all group">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 className="font-black text-lg mb-1">{step.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed m-0">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="mt-24 overflow-x-auto">
                    <h2 className="text-3xl font-black mb-8">The Hard Data</h2>
                    <table className="w-full border-collapse border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                {advertorial.comparisonTable?.headers?.map((header: string, i: number) => (
                                    <th key={i} className="p-4 text-left text-xs font-black uppercase tracking-widest">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {advertorial.comparisonTable?.rows?.map((row: string[], i: number) => (
                                <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                                    {row.map((cell: string, j: number) => (
                                        <td key={j} className={`p-4 text-sm font-medium ${j === 1 ? 'bg-indigo-50/50 dark:bg-indigo-900/10 font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                        href={advertorial.summaryBox?.targetUrl || "#"} 
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
