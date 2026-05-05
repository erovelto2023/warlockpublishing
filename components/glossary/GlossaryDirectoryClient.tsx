"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronLeft, ChevronRight, X, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GlossaryTerm } from "@/lib/types";

interface GlossaryDirectoryClientProps {
    initialTerms: GlossaryTerm[];
}

export default function GlossaryDirectoryClient({ initialTerms }: GlossaryDirectoryClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const categories = useMemo(() => {
        const cats = new Set<string>();
        initialTerms.forEach(term => cats.add(term.category));
        return Array.from(cats).sort();
    }, [initialTerms]);

    const filteredTerms = useMemo(() => {
        const filtered = initialTerms.filter(term => {
            const matchesSearch = !searchQuery || 
                term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                term.snapshot.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = !selectedCategory || term.category === selectedCategory;
            const matchesDifficulty = !selectedDifficulty || term.difficulty === selectedDifficulty;
            
            return matchesSearch && matchesCategory && matchesDifficulty;
        });
        
        // Reset page to 1 when filters change
        // We do this in a useEffect to avoid side-effects in useMemo
        return filtered;
    }, [initialTerms, searchQuery, selectedCategory, selectedDifficulty]);

    // Effect to reset page when filtering
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedDifficulty]);

    const paginatedTerms = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTerms.slice(start, start + pageSize);
    }, [filteredTerms, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredTerms.length / pageSize);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setSelectedDifficulty(null);
    };

    return (
        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="sticky top-20 z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm p-4 -mx-4 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            placeholder="Search terms, definitions, snapshots..." 
                            className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="md:col-span-3">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Category</label>
                        <select 
                            className="w-full h-12 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Difficulty</label>
                        <select 
                            className="w-full h-12 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={selectedDifficulty || ""}
                            onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="md:col-span-1">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-12 w-full border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={clearFilters}
                            title="Clear Filters"
                        >
                            <X size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTerms.length > 0 ? (
                    paginatedTerms.map((term) => (
                        <Link key={term._id} href={`/glossary/${term.slug}`}>
                            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer h-full flex flex-col group">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                        {term.category}
                                    </span>
                                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                        term.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                                        term.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                        {term.difficulty}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {term.term}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 flex-1">
                                    {term.snapshot}
                                </p>
                                <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    View Full Definition <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-slate-400 dark:text-slate-600 mb-4">
                            <Search size={48} className="mx-auto opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No terms found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search query.</p>
                        <Button onClick={clearFilters}>Clear all filters</Button>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-12 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Previous
                    </Button>
                    
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Page <span className="text-indigo-600">{currentPage}</span> of {totalPages}
                    </div>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === totalPages}
                        onClick={() => {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    >
                        Next <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center pt-8">
                Showing {filteredTerms.length} of {initialTerms.length} terms
            </div>
        </div>
    );
}
