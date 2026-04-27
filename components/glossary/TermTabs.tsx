"use client";

import React, { useState } from 'react';
import { History, Globe, Zap } from 'lucide-react';

interface TermTabsProps {
    origin?: string;
    modernUsage?: string;
    expandedExplanation?: string;
}

export default function TermTabs({ origin, modernUsage, expandedExplanation }: TermTabsProps) {
    const [activeTab, setActiveTab] = useState<'historical' | 'modern' | 'expanded'>('historical');

    const tabs = [
        { id: 'historical', label: 'Historical Context', icon: History, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'modern', label: 'Modern Usage', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'expanded', label: 'Strategic Depth', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <tab.icon size={14} className={activeTab === tab.id ? tab.color : 'text-slate-400'} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="relative">
                {activeTab === 'historical' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Origins & Evolution</h4>
                        <p className="text-lg text-slate-600 leading-relaxed font-light italic">
                            {origin || "Historical data on this concept is currently being indexed by the Warlock research engine."}
                        </p>
                    </div>
                )}
                {activeTab === 'modern' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Current Implementation</h4>
                        <p className="text-lg text-slate-700 leading-relaxed font-medium">
                            {modernUsage || "In today's digital publishing landscape, this concept serves as a primary driver of commercial authority."}
                        </p>
                    </div>
                )}
                {activeTab === 'expanded' && (
                    <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={80} /></div>
                        <h4 className="text-amber-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4">Deep Strategy</h4>
                        <p className="text-xl font-light leading-relaxed text-slate-200 italic">
                            &quot;{expandedExplanation || "Mastery of this concept allows creators to bridge the gap between creative output and commercial success."}&quot;
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
