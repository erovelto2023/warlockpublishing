"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, ArrowRight, BookOpen, ShoppingBag, FileText, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommandCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: any[], glossary: any[], blog: any[] }>({ products: [], glossary: [], blog: [] });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggleOpen();
            }
            if (e.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults({ products: [], glossary: [], blog: [] });
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error('Search failed', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const navigateTo = (url: string) => {
        router.push(url);
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4 animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
            <div 
                className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 origin-top"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Bar */}
                <div className="flex items-center px-6 py-5 border-b border-slate-100">
                    <Search className="text-slate-400 mr-4" size={20} />
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Search glossary, products, articles..."
                        className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-900 placeholder-slate-400"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2 py-1 bg-slate-50 border border-slate-100 rounded-md">ESC</span>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
                    {loading && (
                        <div className="p-12 text-center">
                            <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Searching the archive...</p>
                        </div>
                    )}

                    {!loading && !query && (
                        <div className="p-12 text-center space-y-4">
                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                                <Command size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Type to explore the Warlock universe</p>
                        </div>
                    )}

                    {!loading && query && (results.products.length + results.glossary.length + results.blog.length === 0) && (
                        <div className="p-12 text-center">
                            <p className="text-sm text-slate-400 italic">No matches found for "{query}"</p>
                        </div>
                    )}

                    {/* Glossary Results */}
                    {results.glossary.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3">Glossary Terms</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {results.glossary.map((term: any) => (
                                    <button 
                                        key={term._id}
                                        onClick={() => navigateTo(`/glossary/${term.slug}`)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-indigo-50 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                                <BookOpen size={16} />
                                            </div>
                                            <div className="text-left leading-tight">
                                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">{term.term}</div>
                                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{term.category}</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Results */}
                    {results.products.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3">Products & Tools</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {results.products.map((p: any) => (
                                    <button 
                                        key={p._id}
                                        onClick={() => navigateTo(`/products/${p.slug}`)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-emerald-50 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                                <ShoppingBag size={16} />
                                            </div>
                                            <div className="text-left leading-tight">
                                                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">{p.title}</div>
                                                <div className="text-[10px] text-slate-400 font-bold tracking-tight">${p.price}</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blog Results */}
                    {results.blog.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3">Articles & Blog</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {results.blog.map((post: any) => (
                                    <button 
                                        key={post._id}
                                        onClick={() => navigateTo(`/blog/${post.slug}`)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-slate-100 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                                                <FileText size={16} />
                                            </div>
                                            <div className="text-left leading-tight max-w-[400px]">
                                                <div className="text-sm font-bold text-slate-900 truncate">{post.title}</div>
                                                <div className="text-[10px] text-slate-400 font-bold tracking-tight">{new Date(post.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Tip */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">Enter</span> to select</div>
                        <div className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">Esc</span> to close</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
