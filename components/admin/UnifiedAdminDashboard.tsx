"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, FileText, ShoppingBag, LayoutDashboard, Megaphone, MessageSquare, BookOpen, Image,
    Search, Plus, Eye, Edit, Trash2, Copy, BarChart3, Settings, ExternalLink, Link as LinkIcon, Download, RefreshCw, Send, Check, X, Mail
} from 'lucide-react';
import SimplePageBuilder from '@/components/admin/SimplePageBuilder';
import GlossaryTable from '@/components/admin/GlossaryTable';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { deleteProduct } from '@/lib/actions/product.actions';
import { deletePost } from '@/lib/actions/blog';
import { deletePenName } from '@/lib/actions/pen-name.actions';
import { deleteSalesPage } from '@/lib/actions/sales-page.actions';
import { deleteMessage, markMessageAsRead, updateMessage } from '@/lib/actions/message';

interface AdminDashboardProps {
    products: any[];
    penNames: any[];
    blogPosts: any[];
    messages: any[];
    offers: any[];
    subscribers: any[];
    glossaryTerms?: any[];
}

export default function UnifiedAdminDashboard({ products, penNames, blogPosts, messages, offers, subscribers, glossaryTerms = [] }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'pen_names' | 'products' | 'offers' | 'blog' | 'messages' | 'subscribers' | 'glossary' | 'media'>('overview');
    const router = useRouter();

    // Stats
    const totalViews = offers.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalProducts = products.length;
    const totalPosts = blogPosts.length;
    const pendingMessages = messages.filter(m => !m.isRead).length;

    // View State for Sub-Tabs
    const [offerView, setOfferView] = useState<'list' | 'create'>('list');

    // Message View State
    const [viewingMessage, setViewingMessage] = useState<any | null>(null);
    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const [editMessageContent, setEditMessageContent] = useState('');

    const handleDelete = async (type: 'product' | 'post' | 'pen_name' | 'offer' | 'message', id: string) => {
        if (!confirm(`Are you sure you want to delete this ${type.replace('_', ' ')}?`)) return;

        try {
            if (type === 'product') await deleteProduct(id);
            if (type === 'post') await deletePost(id);
            if (type === 'pen_name') await deletePenName(id);
            if (type === 'offer') await deleteSalesPage(id);
            if (type === 'message') {
                await deleteMessage(id);
                if (viewingMessage?._id === id) setViewingMessage(null);
            }
            alert('Deleted successfully');
            router.refresh();
        } catch (e) {
            alert('Error deleting item');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const handleViewMessage = async (msg: any) => {
        setViewingMessage(msg);
        setIsEditingMessage(false);
        if (!msg.isRead) {
            await markMessageAsRead(msg._id);
            router.refresh();
        }
    };

    const handleEditMessage = (msg: any) => {
        setViewingMessage(msg);
        setEditMessageContent(msg.content);
        setIsEditingMessage(true);
    };

    const handleSaveMessage = async () => {
        if (!viewingMessage) return;
        try {
            await updateMessage(viewingMessage._id, { content: editMessageContent });
            alert('Message updated successfully');
            setIsEditingMessage(false);
            setViewingMessage({ ...viewingMessage, content: editMessageContent });
            router.refresh();
        } catch (e) {
            alert('Error updating message');
        }
    };

    return (
        <div className="bg-slate-200 min-h-screen font-sans text-slate-900 pb-20">
            {/* Header / Nav */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-900 text-white rounded-lg">
                                <LayoutDashboard size={20} />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-slate-800 uppercase">Warlock Admin</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest">
                                v2.0.0 &bull; Secure Mode
                            </span>
                            <a href="/" target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Tabs Scroll Area */}
                    <div className="flex flex-wrap items-center gap-1 pb-2">
                        {[
                            { id: 'overview', label: 'Dashboard', icon: BarChart3 },
                            { id: 'products', label: 'Products / Tools', icon: ShoppingBag },
                            { id: 'offers', label: 'Offer Builder', icon: Megaphone },
                            { id: 'subscribers', label: 'Subscribers', icon: Users },
                            { id: 'pen_names', label: 'Pen Names', icon: Users },
                            { id: 'blog', label: 'Blog Posts', icon: FileText },
                            { id: 'glossary', label: 'Glossary', icon: BookOpen },
                            { id: 'media', label: 'Media', icon: Image },
                            { id: 'messages', label: 'Inbox', icon: MessageSquare },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                        : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-sm'
                                    }
                                `}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                                {tab.id === 'messages' && pendingMessages > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingMessages}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Megaphone size={24} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Offer Views</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalViews.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ShoppingBag size={24} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Products</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalProducts}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={24} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pen Names</p>
                                <h3 className="text-2xl font-bold text-slate-900">{penNames.length}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-500 transition-all" onClick={() => setActiveTab('glossary')}>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={24} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Glossary Terms</p>
                                <h3 className="text-2xl font-bold text-slate-900">{glossaryTerms.length}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* OFFERS TAB (The Requested Feature) */}
                {activeTab === 'offers' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <Megaphone className="text-blue-600" /> Offer Builder
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOfferView('list')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${offerView === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    List View
                                </button>
                                <button
                                    onClick={() => setOfferView('create')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${offerView === 'create' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    Create New
                                </button>
                            </div>
                        </div>

                        {offerView === 'create' ? (
                            <SimplePageBuilder onSuccess={() => { setOfferView('list'); router.refresh(); }} />
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Title / Slug</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Stats</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {offers.map((offer: any) => (
                                            <tr key={offer._id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{offer.title}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono mt-1">/offers/{offer.slug}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-3 text-xs font-medium text-slate-500">
                                                        <span className="flex items-center gap-1"><Eye size={12} /> {offer.views || 0}</span>
                                                        <span className="flex items-center gap-1 text-green-600"><ShoppingBag size={12} /> {offer.clicks || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${offer.isPublished ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'}`}>
                                                        {offer.isPublished ? 'Live' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <a href={`/offers/${offer.slug}`} target="_blank" className="inline-block p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16} /></a>
                                                    <button onClick={() => router.push(`/admin/offers/${offer._id}/edit`)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                    <button onClick={() => handleDelete('offer', offer._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* SUBSCRIBERS TAB */}
                {activeTab === 'subscribers' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Subscribers ({subscribers.length})</h2>
                            <button
                                onClick={() => {
                                    const csvContent = "data:text/csv;charset=utf-8," + "Email,Pen Name,Date\n" + subscribers.map((s: any) => `${s.email},${s.penNameId},${s.createdAt}`).join("\n");
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", "subscribers.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                }}
                                className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2 transition-all"
                            >
                                <Download size={16} /> Export CSV
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Pen Name ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {subscribers.map((sub: any) => (
                                        <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{sub.email}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-mono">{sub.penNameId}</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">All Tools ({products.length})</h2>
                            <button
                                onClick={() => router.push('/admin/products/new')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:scale-105"
                            >
                                <Plus size={16} /> Add New Tool
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map((product: any) => (
                                        <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{product.title}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-1">/products/{product.slug}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{product.productType || 'Standard'}</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">${product.price}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <a href={`/products/${product.slug}`} target="_blank" className="inline-block p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"><Eye size={16} /></a>
                                                <button onClick={() => copyToClipboard(`${window.location.origin}/products/${product.slug}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><LinkIcon size={16} /></button>
                                                <button onClick={() => router.push(`/admin/products/${product._id}/edit`)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete('product', product._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PEN NAMES TAB */}
                {activeTab === 'pen_names' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Identities ({penNames.length})</h2>
                            <button
                                onClick={() => router.push('/admin/pen-names/new')}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 flex items-center gap-2 shadow-lg shadow-purple-200 transition-all hover:scale-105"
                            >
                                <Plus size={16} /> New Identity
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {penNames.map((pen: any) => (
                                <div key={pen._id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow group relative">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full mb-4 overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                        {pen.avatarUrl ? (
                                            <img src={pen.avatarUrl} alt={pen.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><Users size={32} /></div>
                                        )}
                                    </div>
                                    <h3 className="font-black text-lg text-slate-900">{pen.name}</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">{pen.tagline || 'Writer'}</p>
                                    <div className="flex gap-2 mt-auto">
                                        <button onClick={() => router.push(`/admin/pen-names/${pen._id}/dashboard`)} className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider">Manage</button>
                                        <button onClick={() => handleDelete('pen_name', pen._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* BLOG TAB */}
                {activeTab === 'blog' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Blog Posts ({blogPosts.length})</h2>
                            <button
                                onClick={() => router.push('/admin/blog/new')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-200 transition-all hover:scale-105"
                            >
                                <Plus size={16} /> New Post
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {blogPosts.map((post: any) => (
                                        <tr key={post._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${post.isPublished ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {post.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => router.push(`/blog/${post.slug}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16} /></button>
                                                <button onClick={() => router.push(`/admin/blog/${post._id}/edit`)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete('post', post._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'glossary' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <BookOpen className="text-blue-600" /> Glossary Management
                            </h2>
                            <button
                                onClick={() => router.push('/admin/glossary/new')}
                                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} /> New Term
                            </button>
                        </div>
                        <GlossaryTable terms={glossaryTerms} />
                    </div>
                )}
                {activeTab === 'messages' && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Inbox ({messages.length})</h2>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">From</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {messages.map((msg: any) => (
                                        <tr key={msg._id} className={`hover:bg-slate-50/80 transition-colors ${!msg.isRead ? 'bg-blue-50/30' : ''}`}>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    {!msg.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                                    <div>
                                                        {msg.senderName}
                                                        <div className="text-[10px] text-slate-400 font-normal">{msg.senderEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 text-sm font-medium">{msg.subject}</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">{new Date(msg.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleViewMessage(msg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Read Message">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleEditMessage(msg)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" title="Edit Message Content">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete('message', msg._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Message">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Message Detail Modal */}
                {viewingMessage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{isEditingMessage ? 'Edit Message' : viewingMessage.subject}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Mail size={14} />
                                        <span>{viewingMessage.senderName} &lt;{viewingMessage.senderEmail}&gt;</span>
                                        <span className="text-slate-300">•</span>
                                        <span>{new Date(viewingMessage.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={() => { setViewingMessage(null); setIsEditingMessage(false); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 flex-1 text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {isEditingMessage ? (
                                    <textarea
                                        className="w-full h-64 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm"
                                        value={editMessageContent}
                                        onChange={(e) => setEditMessageContent(e.target.value)}
                                    />
                                ) : (
                                    viewingMessage.content
                                )}
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                {isEditingMessage ? (
                                    <>
                                        <button onClick={() => setIsEditingMessage(false)} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                                        <button onClick={handleSaveMessage} className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Save Changes</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleDelete('message', viewingMessage._id)} className="px-4 py-2 text-red-600 font-bold text-sm hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                        <button onClick={() => handleEditMessage(viewingMessage)} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2">
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button onClick={() => { setViewingMessage(null); }} className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors">
                                            Close
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
