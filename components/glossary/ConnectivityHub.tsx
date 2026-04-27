"use client";

import React from 'react';
import { GitBranch, MinusCircle, PlusCircle } from 'lucide-react';

interface ConnectivityHubProps {
    synonyms?: string[];
    antonyms?: string[];
    relatedTermIds?: string[];
}

export default function ConnectivityHub({ synonyms, antonyms }: ConnectivityHubProps) {
    if (!synonyms?.length && !antonyms?.length) return null;

    return (
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4"><GitBranch size={100} /></div>
            
            <div className="grid md:grid-cols-2 gap-12 relative z-10">
                {/* Synonyms */}
                {synonyms && synonyms.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><PlusCircle size={18} /></div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Semantic Synonyms</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {synonyms.map((s, i) => (
                                <span key={i} className="px-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-default">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Antonyms */}
                {antonyms && antonyms.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><MinusCircle size={18} /></div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Semantic Antonyms</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {antonyms.map((a, i) => (
                                <span key={i} className="px-4 py-2 bg-rose-50/50 border border-rose-100 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-default">
                                    {a}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
