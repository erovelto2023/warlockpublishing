'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Clock, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DiscoveryClientProps {
    articles: any[];
}

const ITEMS_PER_PAGE = 9;

export default function DiscoveryClient({ articles }: DiscoveryClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredArticles = useMemo(() => {
        return articles.filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [articles, searchQuery]);

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const featured = paginatedArticles[0];
    const rest = paginatedArticles.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
            {/* Newspaper Masthead / Search */}
            <div className="border-b-4 border-black pb-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Warlock Gazette</div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">Discovery.</h1>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            className="h-12 pl-12 rounded-none border-2 border-slate-100 focus:border-black bg-white text-black font-bold uppercase tracking-widest text-[10px]" 
                            placeholder="Search Archives..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-4 border-t border-slate-100">
                    <div className="flex gap-4">
                        <span>Vol. 02</span>
                        <span className="text-slate-300">|</span>
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="hidden md:block">Price: Time & Attention</div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-12">
                {/* Featured Story */}
                {featured && (
                    <div className="lg:col-span-2 border-b-2 border-slate-100 lg:border-b-0 lg:border-r-2 lg:pr-12 pb-12 lg:pb-0">
                        <Link href={`/articles/${featured.slug}`} className="group space-y-6">
                            <div className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                <TrendingUp size={16} /> Breaking Feature
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase group-hover:italic transition-all">
                                {featured.title}
                            </h2>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                                {featured.narrative?.frictionReveal?.substring(0, 180)}...
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-black text-white">Read Full Report</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">By Warlock Editorial &bull; 4 min read</div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Sidebar Stories */}
                <div className="space-y-12">
                    {rest.map((article: any) => (
                        <Link key={article._id} href={`/articles/${article.slug}`} className="group block space-y-3 pb-8 border-b border-slate-100 last:border-0">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">{article.category}</div>
                            <h3 className="text-2xl font-black leading-tight uppercase group-hover:text-indigo-600 transition-colors">
                                {article.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase">
                                <Clock size={12} /> {new Date(article.createdAt).toLocaleDateString()}
                            </div>
                        </Link>
                    ))}
                    
                    {filteredArticles.length === 0 && (
                        <div className="py-20 text-center text-slate-300 italic uppercase font-black tracking-widest text-xs">
                            No Records Found
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 pt-12 border-t-4 border-black">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:text-indigo-600"
                    >
                        <ChevronLeft size={20} /> Earlier Editions
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em]">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:text-indigo-600"
                    >
                        Later Editions <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
