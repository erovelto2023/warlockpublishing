import { getAdvertorialBySlug } from "@/lib/actions/advertorial";
import { notFound } from "next/navigation";
import { 
    CheckCircle2, ArrowRight, ShieldCheck, 
    Star, HelpCircle, Clock, Users as UsersIcon
} from "lucide-react";

export default async function AdvertorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const advertorial = await getAdvertorialBySlug(slug);

    if (!advertorial) notFound();

    // Resolve Target URL (Prioritize Catalog Offer if available)
    const targetUrl = advertorial.affiliateOfferId?.affiliateLink || advertorial.customTargetUrl || advertorial.summaryBox?.targetUrl || "#";

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-slate-200 pb-20">
            {/* Simple Header */}
            <header className="max-w-3xl mx-auto px-6 pt-20 pb-12 border-b border-slate-100">
                <div className="space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <span>Editorial</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                        {advertorial.title}
                    </h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 mt-12 space-y-16">
                {/* At a Glance / Summary */}
                <section className="p-8 border border-slate-200 rounded-xl space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">{advertorial.summaryBox?.topPick || "The Verdict"}</h3>
                            <div className="flex gap-1 text-slate-900">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                        </div>
                        {advertorial.scarcity?.type !== 'none' && (
                            <div className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-2">
                                {advertorial.scarcity?.type === 'timer' ? <Clock size={12} /> : <UsersIcon size={12} />}
                                {advertorial.scarcity?.value}
                            </div>
                        )}
                    </div>
                    
                    <ul className="grid md:grid-cols-2 gap-4">
                        {advertorial.summaryBox?.benefits?.map((benefit: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                <CheckCircle2 size={16} className="text-black shrink-0 mt-0.5" />
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <a 
                        href={targetUrl} 
                        className="flex items-center justify-center gap-2 w-full bg-black text-white p-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-colors"
                    >
                        {advertorial.summaryBox?.ctaText || "Check Availability"}
                        <ArrowRight size={20} />
                    </a>
                </section>

                {/* The Narrative */}
                <article className="prose prose-slate max-w-none">
                    <p className="text-xl leading-relaxed text-slate-800">
                        {advertorial.narrative?.frictionReveal}
                    </p>
                    <div className="my-12 p-8 border-l-4 border-black bg-slate-50 italic text-slate-600 leading-relaxed">
                        {advertorial.narrative?.editorialPivot}
                    </div>
                </article>

                {/* Value & Proof */}
                <section className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">The Analysis</h2>
                        <p className="text-slate-600 leading-relaxed">
                            {advertorial.valueReinforcement?.priceAnchoring}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {advertorial.valueReinforcement?.steps?.map((step: any, i: number) => (
                            <div key={i} className="flex gap-6 pb-6 border-b border-slate-100 last:border-0">
                                <div className="text-2xl font-bold text-slate-200">{i + 1}</div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Comparison */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-bold uppercase tracking-tight">The Data</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="border-b border-black">
                                <tr>
                                    {advertorial.comparisonTable?.headers?.map((header: string, i: number) => (
                                        <th key={i} className="py-4 font-bold uppercase tracking-widest text-[10px] text-slate-400">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {advertorial.comparisonTable?.rows?.map((row: string[], i: number) => (
                                    <tr key={i}>
                                        {row.map((cell: string, j: number) => (
                                            <td key={j} className={`py-4 font-medium ${j === 1 ? 'font-bold' : 'text-slate-500'}`}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ */}
                <section className="space-y-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-slate-400">
                        <HelpCircle size={14} /> Questions & Answers
                    </div>
                    <div className="space-y-8">
                        {advertorial.faq?.map((item: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <h4 className="font-bold">{item.question}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final Footer CTA */}
                <section className="py-20 text-center border-t border-slate-100 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Ready to start?</h2>
                        <p className="text-slate-500">Secure your access via the verified link below.</p>
                    </div>
                    <a 
                        href={targetUrl} 
                        className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-colors"
                    >
                        {advertorial.summaryBox?.ctaText || "Claim The Deal Now"}
                        <ArrowRight size={20} />
                    </a>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure</span>
                        <span className="flex items-center gap-1.5"><Star size={12} /> Verified</span>
                    </div>
                </section>
            </main>
        </div>
    );
}
