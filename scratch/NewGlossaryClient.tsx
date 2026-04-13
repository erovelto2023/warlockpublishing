"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { 
    Search as SearchIcon, 
    ArrowRight as ArrowIcon,
} from "lucide-react";

interface Term {
    _id: string;
    term: string;
    slug: string;
    category: string;
    shortDefinition: string;
    marketDemand: string;
    monetizationPotential: string;
    isPremium: boolean;
    metrics: {
        profitability: number;
        difficulty: number;
        popularity: number;
    };
}

interface GlossaryClientProps {
    initialTerms: Term[];
    categories: string[];
}

function GlossaryClientInner({ initialTerms, categories }: GlossaryClientProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const filteredTerms = useMemo(() => {
        return initialTerms.filter((term) => {
            const matchesSearch = !search || 
                                 term.term.toLowerCase().includes(search.toLowerCase()) || 
                                 term.shortDefinition.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialTerms, search, selectedCategory]);

    return (
        <div className="selection:bg-violet-500/30 text-slate-50 min-h-screen">
            {/* Header Section */}
            <header className="relative pt-24 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-cyan-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                        <span className="glow-dot"></span>
                        <span>Registry: Content & Growth Alchemy</span>
                    </div>
                    <h1 className="heading-font text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-[1.1]">
                        The Warlock <span className="gradient-text">Knowledgebase</span>.
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium font-inter italic opacity-80">
                        Master the mechanics of high-conversion content and aggressive digital growth. Weaponize your message and dominate the modern attention economy.
                    </p>
                </div>
            </header>

            {/* Search & Filter Controls (Sticky) */}
            <section className="px-6 pb-12 sticky top-20 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 pt-6">
                <div className="max-w-6xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <SearchIcon className="w-6 h-6 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search marketing triggers, content frameworks, or growth hacks..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-20 bg-slate-900/50 border border-white/10 rounded-3xl pl-16 pr-8 text-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all placeholder:text-slate-600 font-bold"
                        />
                    </div>

                    {/* Categories */}
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                        <button 
                            onClick={() => setSelectedCategory("all")}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                selectedCategory === "all" 
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20 active" 
                                : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            All Insights
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    selectedCategory === cat 
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20 active" 
                                    : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Glossary Grid */}
            <main className="px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    {filteredTerms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTerms.map((item) => (
                                <Link 
                                    key={item._id}
                                    href={`/glossary/${item.slug}`}
                                    className="glass-premium p-10 rounded-[2.5rem] card-hover flex flex-col h-full group"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-400/10 px-3 py-1.5 rounded-xl border border-violet-400/20">
                                            {item.category}
                                        </span>
                                        <span className="text-slate-600 group-hover:text-violet-400 transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                            <ArrowIcon className="w-6 h-6" />
                                        </span>
                                    </div>
                                    <h3 className="heading-font text-3xl font-bold mb-6 group-hover:text-white transition-colors leading-none tracking-tight">
                                        {item.term}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed mb-10 flex-grow font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                        {item.shortDefinition}
                                    </p>
                                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500">Registry Data Node</span>
                                        <span className="text-xs text-slate-400 font-mono bg-white/5 px-3 py-1 rounded-lg">
                                            {item.isPremium ? "Premium Node" : "Standard Relay"}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-slate-900/40 rounded-[4rem] border border-white/5 shadow-2xl">
                            <div className="text-8xl mb-12 opacity-50 grayscale transition-all hover:grayscale-0 cursor-default">🔮</div>
                            <h3 className="heading-font text-4xl font-bold text-slate-200 mb-6 tracking-tight">Intel not found</h3>
                            <p className="text-slate-500 text-lg max-w-sm mx-auto font-medium mb-12 italic opacity-80">
                                The requested transmission is not in the current registry. Refine your signal search.
                            </p>
                            <button 
                                onClick={() => { setSearch(""); setSelectedCategory("all"); }}
                                className="bg-violet-600 text-white px-12 h-16 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-violet-900/20 hover:scale-105 transition-all"
                            >
                                Reset Signal
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Custom Footer Section (Integrated for focus) */}
            <section className="border-t border-white/10 bg-slate-950 px-6 py-24 mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
                                    <span className="text-white text-sm font-bold">W</span>
                                </div>
                                <span className="heading-font font-bold text-xl tracking-tighter uppercase">Warlock<span className="text-violet-400">Publishing</span></span>
                            </div>
                            <p className="text-slate-400 text-lg max-w-xs leading-relaxed mb-10 opacity-70">
                                The ultimate repository for digital market manipulation, content architecture, and exponential growth.
                            </p>
                        </div>
                        <div>
                            <h4 className="heading-font font-bold uppercase text-[10px] tracking-[0.4em] text-slate-500 mb-8">The Arsenal</h4>
                            <ul className="space-y-5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                                <li><Link href="/" className="hover:text-white transition-colors">Growth Engines</Link></li>
                                <li><Link href="/" className="hover:text-white transition-colors">Copywriting Vault</Link></li>
                                <li><Link href="/" className="hover:text-white transition-colors">Funnel Blueprints</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="heading-font font-bold uppercase text-[10px] tracking-[0.4em] text-slate-500 mb-8">Protocol</h4>
                            <ul className="space-y-5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                                <li><Link href="/license" className="hover:text-white transition-colors">License</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <p>© 2026 Warlock Publishing. | Dominate the Attention Economy.</p>
                        <div className="mt-8 md:mt-0 flex space-x-8">
                            <span className="flex items-center gap-2">Registry Status: <span className="text-green-500 glow-dot !h-1.5 !w-1.5"></span> <span className="text-green-500">Live</span></span>
                            <span>Relay Node: AT-CORTEX-09</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function GlossaryClient(props: GlossaryClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
            <GlossaryClientInner {...props} />
        </Suspense>
    );
}
