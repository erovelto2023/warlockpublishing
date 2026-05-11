import { getAdvertorials } from "@/lib/actions/advertorial";
import Link from "next/link";
import { ArrowRight, TrendingUp, Clock } from "lucide-react";

export default async function DiscoveryPage() {
    const advertorials = await getAdvertorials();
    const published = advertorials.filter((a: any) => a.isPublished);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-slate-200 pb-20">
            {/* Simple Header */}
            <header className="max-w-4xl mx-auto px-6 pt-32 pb-16">
                <div className="space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        <TrendingUp size={14} /> Discovery Hub
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                        INSIDER<br />FEATURES.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                        Exclusive editorials and research-backed guides on the products changing the game.
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-12">
                <div className="grid gap-12">
                    {published.map((article: any) => (
                        <Link 
                            key={article._id} 
                            href={`/articles/${article.slug}`}
                            className="group block space-y-4 pb-12 border-b border-slate-100 hover:border-black transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {article.category} &bull; {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 group-hover:text-black transition-colors">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold uppercase">4 min read</span>
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight group-hover:italic transition-all">
                                {article.title}
                            </h2>
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                Read Editorial <ArrowRight size={18} />
                            </div>
                        </Link>
                    ))}

                    {published.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-slate-400 italic">No features available at the moment. Check back soon.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
