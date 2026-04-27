'use client';

import React, { useState, useEffect } from 'react';
import { 
    ShoppingBag, Upload, Save, RefreshCw, FileText, 
    AlertCircle, Check, Database, Search, Download, ExternalLink,
    ChevronRight, Info, Trash2, Edit, X, ChevronLeft
} from 'lucide-react';
import { getAmazonCsvContent, updateAmazonCsvContent } from '@/lib/actions/marketplace';

const PAGE_SIZE = 20;

export default function MarketplaceManager() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Edit Modal State
    const [editingRow, setEditingRow] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({
        keyword: '',
        title: '',
        url: '',
        price: ''
    });

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
                setMessage({ type: 'success', text: 'New records appended. Save to apply changes.' });
            }
        };
        reader.readAsText(file);
    };

    const parsedData = React.useMemo(() => {
        if (!content) return [];
        const lines = content.split('\n').filter(l => l.trim());
        return lines.map((line, idx) => {
            const parts = line.split('","').map(p => p.replace(/^"|"$/g, ''));
            return {
                id: idx,
                rawParts: parts,
                keyword: parts[1] || '',
                url: parts[3] || '',
                title: parts[9] || 'Untitled',
                price: parts[26] || '0.00'
            };
        });
    }, [content]);

    const filteredData = parsedData.filter(item => 
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleDelete = (id: number) => {
        if (!confirm('Permanently remove this entry from the local state? You must click SAVE to apply to server.')) return;
        const lines = content.split('\n').filter(l => l.trim());
        lines.splice(id, 1);
        setContent(lines.join('\n'));
        setMessage({ type: 'success', text: 'Entry removed from local session. Remember to SAVE.' });
    };

    const openEditModal = (item: any) => {
        setEditingRow(item);
        setEditForm({
            keyword: item.keyword,
            title: item.title,
            url: item.url,
            price: item.price
        });
    };

    const saveEdit = () => {
        if (!editingRow) return;
        const lines = content.split('\n').filter(l => l.trim());
        const parts = [...editingRow.rawParts];
        
        // Update specific columns
        parts[1] = editForm.keyword;
        parts[3] = editForm.url;
        parts[9] = editForm.title;
        parts[26] = editForm.price;
        
        // Re-serialize with quotes
        lines[editingRow.id] = `"${parts.join('","')}"`;
        
        setContent(lines.join('\n'));
        setEditingRow(null);
        setMessage({ type: 'success', text: 'Changes applied to local session. Click SAVE to finalize.' });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 uppercase italic">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                            <ShoppingBag size={24} />
                        </div>
                        Marketplace <span className="text-indigo-600">Nexus</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium italic">Command center for your Amazon reference library.</p>
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
                    <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-white/50 rounded-lg"><X size={14} /></button>
                </div>
            )}

            {/* Main Area */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setViewMode('preview')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'preview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Visual Preview
                        </button>
                        <button 
                            onClick={() => setViewMode('edit')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'edit' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Raw Editor
                        </button>
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl cursor-pointer hover:border-indigo-600 hover:text-indigo-600 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <Upload size={14} /> Append CSV
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>

                {viewMode === 'preview' ? (
                    <div className="flex-1 flex flex-col">
                        <div className="px-8 py-4 border-b border-slate-100 flex items-center gap-4">
                            <Search size={18} className="text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search keyword or product title..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {filteredData.length} records in signal
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Signal</th>
                                        <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Details</th>
                                        <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Market Value</th>
                                        <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-4">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                    {item.keyword}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="max-w-md">
                                                    <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{item.title}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono truncate opacity-60">{item.url}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="text-sm font-black text-slate-700">${item.price}</div>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a href={item.url} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><ExternalLink size={14} /></a>
                                                    <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-white rounded-lg transition-all"><Edit size={14} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative flex-1">
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-full p-8 font-mono text-sm text-slate-700 focus:outline-none resize-none bg-slate-50/20 min-h-[600px]"
                            placeholder="CSV raw data..."
                            spellCheck={false}
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                                <RefreshCw className="animate-spin text-indigo-600" size={32} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingRow && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic">Edit Signal Node</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct memory modification</p>
                            </div>
                            <button onClick={() => setEditingRow(null)} className="p-2 text-slate-400 hover:bg-white rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Keyword</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900"
                                        value={editForm.keyword}
                                        onChange={(e) => setEditForm({...editForm, keyword: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Price</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Amazon URL</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono text-xs text-slate-600"
                                        value={editForm.url}
                                        onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setEditingRow(null)} className="flex-1 py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button onClick={saveEdit} className="flex-[2] py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black rounded-2xl transition-all shadow-xl shadow-slate-200">Synchronize Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
