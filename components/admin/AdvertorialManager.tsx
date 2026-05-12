'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    FileText, Plus, Search, Eye, Edit, Trash2, 
    Download, Layout, Megaphone, Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import UltimateAdvertorialBuilder from './UltimateAdvertorialBuilder';
import { deleteAdvertorial } from '@/lib/actions/advertorial';

interface AdvertorialManagerProps {
    initialAdvertorials: any[];
    affiliateOffers: any[];
}

function AdvertorialManager({ initialAdvertorials, affiliateOffers }: AdvertorialManagerProps) {
    const [view, setView] = useState<'list' | 'build'>('list');
    const [search, setSearch] = useState('');
    const router = useRouter();

    const filtered = initialAdvertorials.filter(a => 
        a.title.toLowerCase().includes(search.toLowerCase()) || 
        a.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this advertorial?')) return;
        const res = await deleteAdvertorial(id);
        if (res.success) {
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Megaphone className="text-indigo-600" /> Advertorial Command Center
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Management List
                    </button>
                    <button
                        onClick={() => setView('build')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${view === 'build' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'}`}
                    >
                        <Plus size={16} /> Framework Architect
                    </button>
                </div>
            </div>

            {view === 'build' ? (
                <UltimateAdvertorialBuilder affiliateOffers={affiliateOffers} />
            ) : (
                <div className="space-y-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            placeholder="Search advertorials..." 
                            className="pl-10" 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Title / URL</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Engagement</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((ad: any) => (
                                    <tr key={ad._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{ad.title}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-1">/articles/{ad.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">{ad.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-center w-fit px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                                <div className="text-sm font-black text-black">{ad.viewCount || 0}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <a href={`/articles/${ad.slug}`} target="_blank" className="inline-block p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Eye size={16} /></a>
                                            <button onClick={() => window.open(`/admin/articles/${ad._id}/edit`, '_blank')} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(ad._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No advertorials found. Use the Prompt Architect to create one.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdvertorialManager;
