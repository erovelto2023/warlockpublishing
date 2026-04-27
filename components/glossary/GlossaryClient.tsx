"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { GlossaryTerm } from "@/lib/types";
import { 
    Search as SearchIcon, 
    ArrowRight as ArrowIcon,
    Filter,
    ChevronRight,
    Sparkles,
    Book,
    Library,
    Globe,
    TrendingUp,
    Zap,
    ChevronLeft
} from "lucide-react";

interface GlossaryClientProps {
    initialTerms: GlossaryTerm[];
    categories: string[];
}

const AZ_LETTERS = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PAGE_SIZE = 12;

function GlossaryClientInner({ initialTerms, categories }: GlossaryClientProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedLetter, setSelectedLetter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTerms = useMemo(() => {
        return initialTerms.filter((term) => {
            const matchesSearch = !search || 
                                 term.term.toLowerCase().includes(search.toLowerCase()) || 
                                 (term.shortDefinition || "").toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
            const matchesLetter = selectedLetter === "all" || 
                                (selectedLetter === "#" ? /^\d/.test(term.term) : term.term.toUpperCase().startsWith(selectedLetter));
            
            return matchesSearch && matchesCategory && matchesLetter;
        });
    }, [initialTerms, search, selectedCategory, selectedLetter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredTerms.length / PAGE_SIZE);
    const paginatedTerms = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredTerms.slice(start, start + PAGE_SIZE);
    }, [filteredTerms, currentPage]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [search, selectedCategory, selectedLetter]);

    return (
        <div className="bg-[#F8FAFC] text-slate-900 min-h-screen font-sans antialiased">
            
            {/*  PREMIUM HEADER  */}
            <header className="relative pt-32 pb-20 px-6 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
                    <nav className="flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">
                        <Link href="/" className="hover:text-indigo-600 transition-colors">Hub</Link>
                        <ChevronRight size={10} className="text-slate-400" />
                        <span className="text-indigo-600">The Vault</span>
                    </nav>

                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Library size={14} /> The Universal Authority Directory
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                        Strategy <span className="text-indigo-600">Inventory</span>.
                    </h1>
                    
                    <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium italic">
                        Access our vetted repository of commercial publishing strategies, narrative tropes, and digital growth frameworks. Designed for writers, publishers, and creators.
                    </p>
                </div>
            </header>

            {/*  SEARCH & FILTERS (STICKY)  */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-6 px-6 shadow-sm">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col gap-6 items-center">
                        {/* Search Input */}
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search definitions, strategies, or niches..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-8 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all placeholder:text-slate-400 font-bold"
                            />
                        </div>
                    </div>

                    {/* A-Z Filter */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                        <div className="flex flex-wrap items-center justify-center gap-1 mx-auto">
                            <button 
                                onClick={() => setSelectedLetter("all")}
                                className={`w-10 h-10 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                    selectedLetter === "all" 
                                    ? "bg-indigo-600 text-white" 
                                    : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                            >
                                ALL
                            </button>
                            {AZ_LETTERS.map(letter => (
                                <button 
                                    key={letter}
                                    onClick={() => setSelectedLetter(letter)}
                                    className={`w-10 h-10 rounded-lg text-xs font-black uppercase transition-all ${
                                        selectedLetter === letter 
                                        ? "bg-indigo-600 text-white shadow-lg" 
                                        : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                                    }`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/*  MAIN CONTENT: GLOSSARY GRID  */}
            <main className="max-w-[1440px] mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12">
                
                {/* Sidebar Categories */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="sticky top-44 space-y-6">
                        <div className="flex items-center gap-2 px-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            <Filter size={14} /> Categories
                        </div>
                        <nav className="flex flex-col gap-2">
                            <button 
                                onClick={() => setSelectedCategory("all")}
                                className={`group flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                                    selectedCategory === "all" 
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2" 
                                    : "text-slate-500 bg-white border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                            >
                                <span>All Categories</span>
                                <ChevronRight size={10} className={selectedCategory === "all" ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                            </button>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`group flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                                        selectedCategory === cat 
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2" 
                                        : "text-slate-500 bg-white border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600"
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <ChevronRight size={10} className={selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                                </button>
                            ))}
                        </nav>
                        
                        <div className="pt-8 border-t border-slate-100">
                             <div className="flex items-center gap-2 px-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                <TrendingUp size={14} /> Trends
                            </div>
                            <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Pro Tip</p>
                                <p className="text-[11px] font-medium leading-relaxed opacity-70 italic">Filter by category to find specific commercial blueprints for your niche.</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 space-y-12">
                    {paginatedTerms.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {paginatedTerms.map((item) => (
                                    <Link 
                                        key={item._id}
                                        href={`/glossary/${item.slug}`}
                                        className="bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all flex flex-col h-full group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                                {item.category}
                                            </span>
                                            <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all">
                                                <ArrowIcon size={18} />
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight leading-none uppercase italic group-hover:text-indigo-600 transition-colors">
                                            {item.term}
                                        </h3>
                                        
                                        <p className="text-sm text-slate-500 leading-relaxed mb-10 flex-grow font-medium line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                            {item.shortDefinition || item.definition}
                                        </p>
                                        
                                        <div className="pt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-2">
                                                <Globe size={14} className="text-slate-400" />
                                                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Authority Node</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={14} className="text-emerald-500" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase">Tier 1</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-12">
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }).map((_, i) => {
                                            const page = i + 1;
                                            if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                                                if (page === 2 || page === totalPages - 1) return <span key={page} className="px-2 text-slate-300">...</span>;
                                                return null;
                                            }
                                            
                                            return (
                                                <button 
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-12 h-12 rounded-xl text-[10px] font-black transition-all ${
                                                        currentPage === page 
                                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                                                        : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-40 bg-white rounded-[4rem] border border-slate-200 shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-300">
                                <Filter size={48} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase italic">No transmission found</h3>
                            <p className="text-slate-500 text-lg max-w-sm mx-auto font-medium mb-12 italic">
                                The requested strategic node is not currently in the vault. Try adjusting your letter or search filters.
                            </p>
                            <button 
                                onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedLetter("all"); }}
                                className="bg-slate-900 text-white px-12 h-16 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
                            >
                                Reset Directory Signal
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/*  BOTTOM CTA  */}
            <section className="bg-indigo-600 py-24 px-6 no-print">
                <div className="max-w-4xl mx-auto text-center space-y-10 text-white">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-tight">
                        Missing a critical <span className="text-amber-400">Asset</span>?
                    </h2>
                    <p className="text-xl font-medium opacity-90 italic">
                        Our librarians are constantly scouting new tropes and strategies. Request a deep-dive node today.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                        <Link 
                            href="/contact"
                            className="w-full md:w-auto px-10 py-6 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all shadow-xl"
                        >
                            Submit Suggestion <Zap size={14} className="inline ml-2" />
                        </Link>
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
