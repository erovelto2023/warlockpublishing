"use client";

import { useState, useEffect } from 'react';
import { getGlossaryTerms, getGlossaryStats } from '@/lib/actions/glossary';
import GlossaryTable from '@/components/admin/GlossaryTable';
import GlossaryMaintenance from '@/components/admin/GlossaryMaintenance';
import { BookOpen, ShieldCheck, Database, LayoutPanelLeft, Loader2 } from 'lucide-react';
import { GlossaryTerm } from '@/lib/types';

interface GlossaryStats {
    total: number;
    published: number;
    missingVideo: number;
    missingArticle: number;
    totalViews: number;
}

export default function GlossaryAdminPage() {
    const [activeTab, setActiveTab] = useState<'registry' | 'arsenal'>('registry');
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [stats, setStats] = useState<GlossaryStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [termsData, statsData] = await Promise.all([
                    getGlossaryTerms({ publishedOnly: false }),
                    getGlossaryStats()
                ]);
                const validTerms = (termsData as (GlossaryTerm | null)[]).filter((t): t is GlossaryTerm => t !== null);
                setTerms(validTerms);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to fetch glossary data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="bg-slate-200 min-h-screen font-sans text-slate-900 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                                <BookOpen className="text-indigo-600" size={32} />
                                Warlock <span className="text-slate-400 font-medium">Glossary</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">Knowledge Injection & Asset Management</p>
                        </div>
                        
                        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                            <button 
                                onClick={() => setActiveTab('registry')}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/5 border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Database size={14} />
                                Registry
                            </button>
                            <button 
                                onClick={() => setActiveTab('arsenal')}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'arsenal' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/5 border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ShieldCheck size={14} />
                                Arsenal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scale-in-center">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Database...</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {activeTab === 'registry' ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <GlossaryTable terms={terms} />
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <GlossaryMaintenance />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
