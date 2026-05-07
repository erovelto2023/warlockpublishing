import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Search, BookOpen, Zap, TrendingUp, Video, Share2, Award, ChevronRight } from "lucide-react";
import { getGlossaryTerms } from "@/lib/actions/glossary";

export const dynamic = 'force-dynamic';

export default async function GlossaryLandingPage() {
    const { terms } = await getGlossaryTerms({ limit: 6 });
    const { terms: trendingTerms } = await getGlossaryTerms({ limit: 5, sortBy: 'viewCount' });

    // Extract categories for browsing
    const categories = Array.from(new Set(terms.map(t => t.category))).sort();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4628c9759?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-slate-900"></div>
                
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap size={14} />
                            The Future of Search
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-serif italic">
                            The Ultimate <span className="text-indigo-400">AI & SEO</span> Glossary
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
                            Master the vocabulary of modern search, content strategy, and generative AI. 
                            300+ terms optimized for Google AI Overviews and E-E-A-T authority.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/glossary/directory">
                                <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/20">
                                    Explore Directory
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Bar */}
            <div className="bg-indigo-600 py-3 overflow-hidden whitespace-nowrap border-y border-indigo-500 relative z-20">
                <div className="container mx-auto px-4 flex items-center gap-6">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-100 shrink-0">
                        <TrendingUp size={14} /> Trending Now:
                    </span>
                    <div className="flex gap-8 items-center overflow-x-auto no-scrollbar">
                        {trendingTerms.map((t) => (
                            <Link 
                                key={t._id} 
                                href={`/glossary/${t.slug}`}
                                className="text-xs font-bold text-white hover:text-indigo-200 transition-colors uppercase tracking-tight"
                            >
                                {t.term}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats / Trust Signals */}
            <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">300+</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Verified Terms</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">2026</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Updated Data</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">E-E-A-T</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Optimized</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">100%</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Free Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-serif italic">Why This Glossary?</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            We didn't just build a list of words. We built an authority engine designed for the generative era of search.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">AI-Optimized</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Every term includes a high-fidelity "Snapshot" specifically structured for Google AI Overviews and citation engines.
                            </p>
                        </Card>

                        <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                <Video size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Multimedia Rich</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Deep-dive definitions paired with YouTube tutorials, checklists, and marketing strategies for every term.
                            </p>
                        </Card>

                        <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Growth Focused</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Integrated monetization ideas, affiliate products, and social content hooks to turn knowledge into revenue.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Terms */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-serif italic">Featured Terms</h2>
                            <p className="text-slate-600 dark:text-slate-400">Start your journey with these foundational concepts.</p>
                        </div>
                        <Link href="/glossary/directory">
                            <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                                View Full Directory <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {terms.map((entry) => (
                            <Link key={entry._id} href={`/glossary/${entry.slug}`}>
                                <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer h-full flex flex-col group">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                            {entry.category}
                                        </span>
                                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                            entry.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                                            entry.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                                            'bg-rose-100 text-rose-700'
                                        }`}>
                                            {entry.difficulty}
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {entry.term}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
                                        {entry.snapshot}
                                    </p>
                                    <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                        Read Definition <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-indigo-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif italic">Ready to Master the Vocabulary of the Future?</h2>
                    <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                        Join 15,000+ marketers and creators using the Warlock Glossary to stay ahead of the AI curve.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/glossary/directory">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none px-10 py-6 text-lg font-bold">
                                Browse Full Directory
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg font-bold">
                            Subscribe for Updates
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
