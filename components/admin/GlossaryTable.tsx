"use client";

import { useState, useMemo } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, Video, ShoppingBag, 
    Link as LinkIcon, FileText, Globe, MousePointer2, 
    RefreshCw, Filter, Download, Upload, AlertCircle, CheckCircle2,
    ChevronLeft, ChevronRight, MoreHorizontal, Zap, Database
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteGlossaryTerm, runGlossaryAudit } from '@/lib/actions/glossary';
import BulkTermImport from './BulkTermImport';

interface GlossaryTableProps {
    terms: any[];
}

export default function GlossaryTable({ terms }: GlossaryTableProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResults, setAuditResults] = useState<string[] | null>(null);
    const [showBulkImport, setShowBulkImport] = useState(false);

    // Categories for filter
    const categories = useMemo(() => {
        const unique = Array.from(new Set(terms.map(t => t.category))).filter(Boolean);
        return ['All', ...unique];
    }, [terms]);

    // Filtering logic
    const filteredTerms = useMemo(() => {
        return terms.filter(term => {
            const matchesSearch = 
                term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                term.slug.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || term.category === categoryFilter;
            const matchesAudit = !auditResults || auditResults.includes(term._id);
            return matchesSearch && matchesCategory && matchesAudit;
        });
    }, [terms, searchQuery, categoryFilter, auditResults]);

    // Pagination
    const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
    const paginatedTerms = filteredTerms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id: string, term: string) => {
        if (!confirm(`Are you sure you want to delete "${term}"?`)) return;
        try {
            await deleteGlossaryTerm(id);
            alert('Term deleted successfully');
            router.refresh();
        } catch (e) {
            alert('Error deleting term');
        }
    };

    const handleAudit = async (type: 'video' | 'affiliate' | 'article') => {
        setIsAuditing(true);
        try {
            const results = await runGlossaryAudit(type);
            const ids = results.map((r: any) => r._id);
            setAuditResults(ids);
            setCurrentPage(1);
        } catch (e) {
            alert('Audit failed');
        } finally {
            setIsAuditing(false);
        }
    };

    const clearAudit = () => {
        setAuditResults(null);
    };

    return (
        <div className="space-y-6">
            {/* AUDIT SUMMARY INDICATOR */}
            {auditResults !== null && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-orange-600" size={20} />
                        <div>
                            <p className="text-sm font-bold text-orange-900">Audit Active: {auditResults.length} Gaps Found</p>
                            <p className="text-xs text-orange-700">Displaying only items that require attention.</p>
                        </div>
                    </div>
                    <button 
                        onClick={clearAudit}
                        className="text-[10px] font-bold uppercase tracking-widest text-orange-600 hover:text-orange-800 transition-colors"
                    >
                        Clear Filter
                    </button>
                </div>
            )}

            {/* UTILITY BAR (K Academy Style) */}
            <div className="flex flex-wrap gap-2 items-center">
                <button 
                    disabled={isAuditing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                    <Zap size={12} className={isAuditing ? 'animate-pulse' : ''} /> Backfill
                </button>
                <button 
                    onClick={() => handleAudit('video')}
                    disabled={isAuditing}
                    className="bg-slate-800 hover:bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                    <Video size={12} className={isAuditing ? 'animate-pulse' : ''} /> Video Audit
                </button>
                <button 
                    onClick={() => handleAudit('affiliate')}
                    disabled={isAuditing}
                    className="bg-slate-800 hover:bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                    <ShoppingBag size={12} className={isAuditing ? 'animate-pulse' : ''} /> Affiliate Audit
                </button>
                <div className="flex-1" />
                <button 
                    onClick={() => router.push('/admin/glossary/new')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 shadow-md transition-all"
                >
                    <Plus size={14} /> New Term
                </button>
                <button 
                    onClick={() => setShowBulkImport(true)}
                    className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 hover:bg-slate-50 transition-all"
                >
                    <Upload size={12} /> Bulk Import
                </button>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search terms, categories, or slugs..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Per Page:</span>
                    {[10, 20, 50, 100].map(num => (
                        <button 
                            key={num}
                            onClick={() => setItemsPerPage(num)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${itemsPerPage === num ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* ICON LEGEND */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-2 flex flex-wrap gap-4 items-center justify-center text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Hydrated</span>
                <span className="flex items-center gap-1.5"><Database size={12} className="text-indigo-400" /> Seeded</span>
                <span className="flex items-center gap-1.5"><Video size={12} className="text-indigo-400" /> Video</span>
                <span className="flex items-center gap-1.5"><ShoppingBag size={12} className="text-emerald-400" /> Products</span>
                <span className="flex items-center gap-1.5"><FileText size={12} className="text-purple-400" /> Article</span>
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-cyan-400" /> Monetized</span>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left w-10">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Term</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedTerms.map((term) => (
                                <tr key={term._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-800">{term.term}</span>
                                                {term.blogContent?.body ? (
                                                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[8px] font-bold uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> Live
                                                    </span>
                                                ) : (
                                                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded text-[8px] font-bold uppercase tracking-widest border border-indigo-100 flex items-center gap-1">
                                                        <Database size={10} /> Seed
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    {term.video?.url && <Video size={12} className="text-indigo-400" />}
                                                    {term.productIdeas?.length > 0 && <Zap size={12} className="text-cyan-400" />}
                                                </div>
                                            </div>
                                            <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{term.definition || term.shortDefinition}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                                        {term.category}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-600 text-sm">
                                        {term.viewCount || 0}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-400 group-hover:text-blue-500 transition-colors">
                                        /glossary/{term.slug}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                                        <a href={`/glossary/${term.slug}`} target="_blank" className="inline-block p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                                            <Eye size={16} />
                                        </a>
                                        <button 
                                            onClick={() => router.push(`/admin/glossary/${term._id}/edit`)}
                                            className="p-1.5 text-slate-300 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(term._id, term.term)}
                                            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTerms.length)} of {filteredTerms.length} terms
                    </span>
                    <div className="flex gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-slate-900 disabled:opacity-50 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'hover:bg-white text-slate-500 border border-transparent hover:border-slate-200'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-slate-900 disabled:opacity-50 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <BulkTermImport 
                isOpen={showBulkImport}
                onClose={() => setShowBulkImport(false)}
            />
        </div>
    );
}
