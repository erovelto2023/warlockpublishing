'use client';

import React, { useState, useEffect } from 'react';
import { 
    ShoppingBag, Upload, Save, RefreshCw, FileText, 
    AlertCircle, Check, Database, Search, Download, ExternalLink,
    ChevronRight, Info
} from 'lucide-react';
import { getAmazonCsvContent, updateAmazonCsvContent } from '@/lib/actions/marketplace';

export default function MarketplaceManager() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        const data = await getAmazonCsvContent();
        setContent(data);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        const result = await updateAmazonCsvContent(content);
        if (result.success) {
            setMessage({ type: 'success', text: 'CSV updated successfully and signals revalidated.' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to save CSV.' });
        }
        setSaving(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (text) {
                // Check if the uploaded text has a header and the current content already has data
                let finalAppend = text;
                if (content.length > 0 && (text.includes('keyword') || text.includes('asin'))) {
                    const lines = text.split('\n');
                    if (lines.length > 1) {
                        finalAppend = lines.slice(1).join('\n');
                    }
                }

                setContent(prev => {
                    const separator = prev.length > 0 && !prev.endsWith('\n') ? '\n' : '';
                    return prev + separator + finalAppend;
                });
                setMessage({ type: 'success', text: 'New records appended to the vault. Review below and Save.' });
            }
        };
        reader.readAsText(file);
    };

    const parsedData = React.useMemo(() => {
        if (!content) return [];
        const lines = content.split('\n').filter(l => l.trim());
        const data = lines.map((line, idx) => {
            // Simple split for preview purposes
            const parts = line.split('","').map(p => p.replace(/^"|"$/g, ''));
            return {
                id: idx,
                keyword: parts[1] || '',
                url: parts[3] || '',
                title: parts[9] || 'Untitled',
                price: parts[26] || '0.00'
            };
        });
        return data;
    }, [content]);

    const filteredData = parsedData.filter(item => 
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 uppercase italic">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                            <ShoppingBag size={24} />
                        </div>
                        Marketplace <span className="text-indigo-600">Nexus</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium italic">Manage the Amazon Reference CSV that fuels the Glossary Intelligence.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={loadContent}
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                        title="Reload from Server"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="h-8 w-px bg-slate-100 mx-2" />
                    <button 
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-widest"
                    >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Intelligence
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-white/50 rounded-lg"><Check size={14} /></button>
                </div>
            )}

            {/* Editor & Preview Toggle */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setViewMode('edit')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'edit' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Raw Editor
                        </button>
                        <button 
                            onClick={() => setViewMode('preview')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'preview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Data Preview
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl cursor-pointer hover:border-indigo-600 hover:text-indigo-600 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <Upload size={14} />
                            Upload New CSV
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    {viewMode === 'edit' ? (
                        <div className="relative flex-1">
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full p-8 font-mono text-sm text-slate-700 focus:outline-none resize-none bg-slate-50/20"
                                placeholder="Paste your CSV content here..."
                                spellCheck={false}
                            />
                            {loading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                                    <RefreshCw className="animate-spin text-indigo-600" size={32} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <div className="px-8 py-4 border-b border-slate-100 flex items-center gap-4">
                                <Search size={18} className="text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Filter memory nodes..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {filteredData.length} entries found
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Keyword Signal</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Product Asset</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Commercial Value</th>
                                            <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredData.slice(0, 100).map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase tracking-wider">
                                                        {item.keyword}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="max-w-md">
                                                        <div className="text-sm font-bold text-slate-800 truncate">{item.title}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono truncate">{item.url}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="text-sm font-black text-slate-700">${item.price}</div>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <a 
                                                        href={item.url} 
                                                        target="_blank" 
                                                        className="inline-flex p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredData.length > 100 && (
                                    <div className="p-8 text-center bg-slate-50 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing first 100 results. Use the raw editor for full intelligence modifications.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Help / Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600 rounded-[2rem] p-8 text-white space-y-4">
                    <div className="flex items-center gap-3">
                        <Database size={20} className="text-amber-400" />
                        <h4 className="font-black text-sm uppercase tracking-widest">Logic Node</h4>
                    </div>
                    <p className="text-xs font-medium leading-relaxed opacity-80 italic">
                        The glossary system performs a fuzzy match on the **Keyword** column. Ensure your CSV keywords are concise for better cross-referencing.
                    </p>
                </div>
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-4">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-indigo-400" />
                        <h4 className="font-black text-sm uppercase tracking-widest">CSV Schema</h4>
                    </div>
                    <p className="text-xs font-medium leading-relaxed opacity-80 italic">
                        Col 2: Keyword | Col 4: URL | Col 5: Image | Col 10: Title | Col 27: Price. Maintain this structure to avoid parsing errors.
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-indigo-600" />
                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">Safety Protocol</h4>
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-slate-500 italic">
                        Always keep a backup of your CSV before doing a bulk upload. Saving updates the live `docs/billionairebooks.csv` file.
                    </p>
                </div>
            </div>
        </div>
    );
}
