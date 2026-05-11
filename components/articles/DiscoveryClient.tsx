'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Clock, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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

    return (
        <div className="bg-white text-black min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 bg-white text-black">
                {/* Header / Search */}
                <div className="border-b-4 border-black pb-8 space-y-8 bg-white">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Warlock Gazette</div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-black">Discovery.</h1>
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input 
                                className="h-12 pl-12 rounded-none border-2 border-slate-100 focus:border-black bg-white text-black font-bold uppercase tracking-widest text-[10px] placeholder:text-slate-300" 
                                placeholder="Search Archives..." 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Grid (Uniform Cards) */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {paginatedArticles.map((article: any) => (
                        <Link key={article._id} href={`/articles/${article.slug}`} className="group h-full">
                            <Card className="h-full rounded-none border border-slate-200 bg-white shadow-sm group-hover:shadow-xl group-hover:border-black transition-all p-10 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{article.category}</span>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                            <Clock size={12} /> 4 min
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black leading-tight uppercase text-black group-hover:italic transition-all">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                        {article.narrative?.frictionReveal}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black group-hover:translate-x-2 transition-transform">
                                        Open Report <ArrowRight size={18} />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                    
                    {filteredArticles.length === 0 && (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-slate-200 bg-slate-50/30">
                            <div className="text-slate-400 italic uppercase font-black tracking-widest text-sm">
                                No Records Found in Archives
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-8 pt-16 border-t-4 border-black bg-white">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-20 hover:text-indigo-600 transition-colors"
                        >
                            <ChevronLeft size={20} /> Earlier
                        </button>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-black">
                            Page {currentPage} of {totalPages}
                        </div>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-20 hover:text-indigo-600 transition-colors"
                        >
                            Later <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
