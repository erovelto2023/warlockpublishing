"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { 
    Search as SearchIcon, 
    ArrowRight as ArrowIcon, 
    TrendingUp, 
    Book, 
    LayoutList, 
    Zap, 
    Clock, 
    Star as StarIcon,
    ChevronRight,
    Brain,
} from "lucide-react";
import TagCloud from "./TagCloud";
import RotatingAffiliateBanner from "./RotatingAffiliateBanner";

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

interface Product {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    slug: string;
    amazonLink?: string;
}

interface GlossaryClientProps {
    initialTerms: Term[];
    categories: string[];
    products?: Product[];
}

function GlossaryClientInner({ initialTerms, categories, products = [] }: GlossaryClientProps) {
    const [search, setSearch] = useState("");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showLetters, setShowLetters] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    
    const itemsPerPage = 24;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const filteredTerms = useMemo(() => {
        return initialTerms.filter((term) => {
            const matchesSearch = !search || 
                                 term.term.toLowerCase().includes(search.toLowerCase()) || 
                                 term.shortDefinition.toLowerCase().includes(search.toLowerCase());
            const matchesLetter = !selectedLetter || term.term.toLowerCase().startsWith(selectedLetter.toLowerCase());
            const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
            return matchesSearch && matchesLetter && matchesCategory;
        });
    }, [initialTerms, search, selectedLetter, selectedCategory]);

    const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
    const currentItems = filteredTerms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const spotlightTerm = useMemo(() => {
        const premium = initialTerms.filter(t => t.isPremium);
        return premium.length > 0 
            ? premium[Math.floor(Math.random() * premium.length)]
            : initialTerms[Math.floor(Math.random() * initialTerms.length)];
    }, [initialTerms]);

    const resetFilters = () => {
        setSearch("");
        setSelectedLetter(null);
        setSelectedCategory("all");
        setCurrentPage(1);
        setShowLetters(false);
        setShowCategories(false);
    };

    return (
        <div className="space-y-20 pb-24">
            {/* Header / Hero Section */}
            <div className="text-center pt-8">
                <span className="flex items-center justify-center gap-2 text-indigo-600 font-semibold tracking-[0.3em] text-xs mb-8 uppercase">
                    <TrendingUp size={16} /> Research Registry
                </span>
                <h1 className="text-4xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tighter leading-[1.1]">
                    The Warlock <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient italic">
                        Knowledgebase.
                    </span>
                </h1>
                <p className="text-xl text-slate-500 font-semibold mb-12 max-w-2xl mx-auto leading-relaxed italic">
                    Master the structural DNA of successful literature and publishing. One commercial trope at a time.
                </p>

                {/* Main Search */}
                <div className="relative max-w-2xl mx-auto mb-12 group">
                    <SearchIcon className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Identify clusters, tropes, or commercial terms..."
                        className="w-full h-24 pl-20 pr-8 bg-white border border-slate-300 focus:border-indigo-600 rounded-[2rem] outline-none text-xl font-bold transition-all shadow-xl shadow-indigo-500/5 text-slate-900 placeholder-slate-300"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                {/* Knowledgebase Navigation Toggles */}
                <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 pt-8 border-t border-slate-300">
                    <button 
                        onClick={() => { setShowLetters(!showLetters); setShowCategories(false); }}
                        className={`hover:text-indigo-600 transition-colors flex items-center gap-2 ${showLetters ? 'text-indigo-600' : ''}`}
                    >
                        <Book size={14} /> Index Table
                    </button>
                    <span className="opacity-20 hidden md:block">|</span>
                    <button 
                        onClick={() => { setShowCategories(!showCategories); setShowLetters(false); }}
                        className={`hover:text-indigo-600 transition-colors flex items-center gap-2 ${showCategories ? 'text-indigo-600' : ''}`}
                    >
                        <LayoutList size={14} /> Taxonomy Search
                    </button>
                    <span className="opacity-20 hidden md:block">|</span>
                    <Link href="/glossary/study" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <Zap size={14} className="fill-current" /> Mastery Mode
                    </Link>
                    <span className="opacity-20 hidden md:block">|</span>
                    <Link href="/glossary/quiz" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <Brain size={14} className="fill-current" /> Knowledge Quiz
                    </Link>
                </div>

                {/* Sub-Nav: Alphabet */}
                {showLetters && (
                    <div className="mt-12 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500 max-w-4xl mx-auto">
                        <button 
                            onClick={() => { setSelectedLetter(null); setCurrentPage(1); }}
                            className={`w-12 h-12 rounded-2xl text-[10px] font-bold transition-all border uppercase ${!selectedLetter ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/30' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-600'}`}
                        >
                            ALL
                        </button>
                        {alphabet.map(letter => (
                            <button 
                                key={letter}
                                onClick={() => { setSelectedLetter(selectedLetter === letter ? null : letter); setCurrentPage(1); }}
                                className={`w-12 h-12 rounded-2xl text-[10px] font-bold transition-all border ${selectedLetter === letter ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/30' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-600'}`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                )}

                {/* Sub-Nav: Categories */}
                {showCategories && (
                    <div className="mt-12 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 max-w-5xl mx-auto">
                        <button 
                            onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}
                            className={`px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all border ${selectedCategory === "all" ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/30' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-600'}`}
                        >
                            All Concept Sectors
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                className={`px-8 py-4 rounded-2xl text-[11px] font-semibold uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/30' : 'bg-white text-slate-400 border-slate-300 hover:border-indigo-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Spotlight Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Registry Spotlight */}
                <div className="bg-white p-12 rounded-[2rem] border border-slate-300 shadow-sm relative overflow-hidden flex flex-col justify-center group">
                    <div className="absolute -top-12 -right-12 p-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000 text-indigo-600"><TrendingUp size={240} /></div>
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl mb-8 shadow-xl shadow-indigo-500/20">Registry Spotlight</span>
                        {spotlightTerm ? (
                            <>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tighter uppercase leading-none">{spotlightTerm.term}</h2>
                                <p className="text-slate-500 mb-10 line-clamp-3 leading-relaxed font-medium italic text-lg">{spotlightTerm.shortDefinition}</p>
                                <Link href={`/glossary/${spotlightTerm.slug}`} className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-3 transition-all w-fit">
                                    Analyze Transmission <ArrowIcon size={20} />
                                </Link>
                            </>
                        ) : (
                            <div className="h-48 animate-pulse bg-slate-50 rounded-3xl" />
                        )}
                    </div>
                </div>

                {/* Strategic Partnerships */}
                <div className="bg-slate-900 p-12 rounded-[2rem] border border-slate-900 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    <div className="absolute -top-12 -right-12 p-10 opacity-[0.07] rotate-[15deg] text-indigo-400 pointer-events-none"><Zap size={240} /></div>
                    <div className="relative z-10 h-full">
                        <span className="inline-block px-4 py-1.5 bg-indigo-900 text-indigo-300 text-[10px] font-bold uppercase tracking-widest rounded-xl mb-8">Ecosystem Leverage</span>
                        <RotatingAffiliateBanner products={products} />
                    </div>
                </div>
            </div>

            {/* Main Vocabulary Grid */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-8 border-b border-slate-100 px-4 gap-6">
                    <h3 className="text-3xl font-bold text-slate-900 italic uppercase tracking-tighter leading-none">
                        Essential Vocabulary
                    </h3>
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/20 whitespace-nowrap">
                        Indexing {filteredTerms.length.toLocaleString()} Transmissions
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {currentItems.map((term) => (
                        <Link 
                            key={term._id}
                            href={`/glossary/${term.slug}`}
                            className="bg-white p-10 rounded-[2rem] border border-slate-300 hover:border-indigo-600/30 transition-all duration-500 group flex flex-col h-full relative overflow-hidden shadow-sm"
                        >
                            <div className="absolute top-0 right-0 w-2 h-0 bg-indigo-600 group-hover:h-full transition-all duration-500" />
                            
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100/30">{term.category}</span>
                                {term.isPremium && <StarIcon size={14} className="text-yellow-400 fill-yellow-400" />}
                            </div>

                            <h4 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">
                                {term.term}
                            </h4>
                            
                            <p className="text-slate-500 text-base leading-relaxed line-clamp-3 mb-10 flex-grow font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                {term.shortDefinition}
                            </p>

                            <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-indigo-400" />
                                    <span>{Math.round((term.shortDefinition?.length || 100) / 100) + 1}m Audit</span>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <ArrowIcon size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredTerms.length === 0 && (
                    <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <SearchIcon size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">No Transmissions Found.</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-bold mb-12 italic text-lg">Adjust your parameters or expand your cluster search.</p>
                        <button onClick={resetFilters} className="bg-indigo-600 text-white px-12 h-16 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 transition-all">
                            Clear System Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-24 flex flex-col items-center gap-10">
                        <div className="flex items-center gap-3">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-20 transition-all shadow-lg shadow-slate-200/40"
                            >
                                <ArrowIcon size={28} className="rotate-180" />
                            </button>
                            
                            <div className="flex items-center gap-3 px-6">
                                {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                        className={`w-16 h-16 rounded-[1.5rem] text-[13px] font-bold transition-all ${currentPage === p ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 scale-110' : 'bg-white border-2 border-slate-100 text-slate-300 hover:border-indigo-600 hover:text-indigo-600 shadow-lg shadow-slate-200/40'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-20 transition-all shadow-lg shadow-slate-200/40"
                            >
                                <ArrowIcon size={28} />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] bg-white px-8 py-3 rounded-full border border-slate-100 shadow-lg shadow-slate-200/20">
                            Frame {currentPage} of {totalPages} · {filteredTerms.length.toLocaleString()} Commercial Tropes
                        </p>
                    </div>
                )}
            </div>

            {/* Taxonomy Directory Footer */}
            <div className="mt-20 pt-28 border-t border-slate-100">
                <div className="max-w-6xl mx-auto space-y-20">
                    <div className="text-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-indigo-600 mb-12 block">Research Taxonomy Directory</span>
                        <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-2xl shadow-indigo-500/5">
                            <TagCloud 
                                terms={initialTerms} 
                                onSelectTag={(termName) => { setSearch(termName); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                activeTag={search}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GlossaryClient(props: GlossaryClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
            <GlossaryClientInner {...props} />
        </Suspense>
    );
}
