"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, FileText, ShoppingBag, LayoutDashboard, Megaphone, MessageSquare, BookOpen, Image,
    Search, Plus, Eye, Edit, Trash2, Copy, BarChart3, Settings, ExternalLink, Link as LinkIcon, Download, RefreshCw, Send, Check, X, Mail,
    Package, Smartphone, ShieldCheck
} from 'lucide-react';
import SimplePageBuilder from '@/components/admin/SimplePageBuilder';
import GlossaryTable from '@/components/admin/GlossaryTable';
import MediaLibrary from '@/components/admin/MediaLibrary';
import AssetWarehouse from '@/components/admin/AssetWarehouse';
import SiteSettings from '@/components/admin/SiteSettings';
import AdminModuleGrid from '@/components/admin/AdminModuleGrid';
import MarketplaceManager from '@/components/admin/MarketplaceManager';
import TrafficIntelligence from '@/components/admin/TrafficIntelligence';
import { deleteProduct, updateProduct } from '@/lib/actions/product.actions';
import { deletePost } from '@/lib/actions/blog';
import { deletePenName } from '@/lib/actions/pen-name.actions';
import { deleteSalesPage, updateSalesPageRotation } from '@/lib/actions/sales-page.actions';
import { deleteMessage, markMessageAsRead, updateMessage } from '@/lib/actions/message';
import { deleteSubscriber, updateSubscriber, deleteSubscribersBulk } from '@/lib/actions/subscriber.actions';
import { getSanitizedProduct } from '@/lib/product-utils';

interface AdminDashboardProps {
    products: any[];
    penNames: any[];
    blogPosts: any[];
    messages: any[];
    offers: any[];
    subscribers: any[];
    glossaryTerms?: any[];
    analytics?: any;
}

export default function UnifiedAdminDashboard({ products, penNames, blogPosts, messages, offers, subscribers, glossaryTerms = [], analytics }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'pen_names' | 'products' | 'offers' | 'blog' | 'messages' | 'subscribers' | 'glossary' | 'media' | 'warehouse' | 'settings' | 'marketplace'>('overview');
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
    const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
    const [editingSubscriber, setEditingSubscriber] = useState<any | null>(null);
    const [editSubEmail, setEditSubEmail] = useState('');

    const handleDelete = async (type: 'product' | 'post' | 'pen_name' | 'offer' | 'message' | 'subscriber', id: string) => {
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
            if (type === 'subscriber' as any) {
                await deleteSubscriber(id);
            }
            alert('Deleted successfully');
            router.refresh();
        } catch (e) {
            alert('Error deleting item');
        }
    };

    const handleBulkDeleteSubscribers = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) return;
        try {
            await deleteSubscribersBulk(selectedSubscribers);
            setSelectedSubscribers([]);
            alert('Bulk deletion successful');
            router.refresh();
        } catch (e) {
            alert('Error deleting subscribers');
        }
    };

    const handleEditSubscriber = (sub: any) => {
        setEditingSubscriber(sub);
        setEditSubEmail(sub.email);
    };

    const handleSaveSubscriber = async () => {
        if (!editingSubscriber) return;
        try {
            await updateSubscriber(editingSubscriber._id, { email: editSubEmail });
            alert('Subscriber updated');
            setEditingSubscriber(null);
            router.refresh();
        } catch (e) {
            alert('Error updating subscriber');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    // Universal CSV Download
    const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
        const escapeField = (field: string) => `"${String(field ?? '').replace(/"/g, '""')}"`;
        const csvContent = [headers.map(escapeField).join(','), ...rows.map(r => r.map(escapeField).join(','))].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const DOMAIN = typeof window !== 'undefined' ? window.location.origin : 'https://warlockpublishing.com';

    const exportOffers = () => {
        downloadCSV(
            `warlock-offers-${new Date().toISOString().slice(0, 10)}.csv`,
            ['Product Name', 'URL', 'Views', 'Clicks', 'Status'],
            offers.map((o: any) => [o.title, `${DOMAIN}/offers/${o.slug}`, String(o.views || 0), String(o.clicks || 0), o.isPublished ? 'Live' : 'Draft'])
        );
    };

    const exportProducts = () => {
        downloadCSV(
            `warlock-products-${new Date().toISOString().slice(0, 10)}.csv`,
            ['Product Name', 'URL', 'Type', 'Price'],
            products.map((p: any) => [p.title, `${DOMAIN}/products/${p.slug}`, p.productType || 'Standard', `$${p.price}`])
        );
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

    const toggleRotation = async (productId: string, currentState: boolean) => {
        try {
            await updateProduct(productId, { isFeaturedInRotation: !currentState });
            router.refresh();
        } catch (e) {
            alert('Error toggling rotation status');
        }
    };

    const toggleOfferRotation = async (offerId: string, currentState: boolean) => {
        try {
            await updateSalesPageRotation(offerId, !currentState);
            router.refresh();
        } catch (e) {
            alert('Error toggling rotation status');
        }
    };

    return (
        <div className="bg-slate-200 min-h-screen font-sans text-slate-900 antialiased pb-20">
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
                            { id: 'overview', label: 'Command Center', icon: BarChart3 },
                            { id: 'analytics', label: 'Traffic Intel', icon: Eye },
                            { id: 'products', label: 'Products / Tools', icon: ShoppingBag },
                            { id: 'offers', label: 'Offer Builder', icon: Megaphone },
                            { id: 'subscribers', label: 'Subscribers', icon: Users },
                            { id: 'pen_names', label: 'Pen Names', icon: Users },
                            { id: 'blog', label: 'Blog Posts', icon: FileText },
                            { id: 'glossary', label: 'Glossary', icon: BookOpen },
                            { id: 'media', label: 'Media', icon: Image },
                            { id: 'warehouse', label: 'Warehouse', icon: Package },
                            { id: 'messages', label: 'Inbox', icon: MessageSquare },
                            { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
                            { id: 'settings', label: 'Site Config', icon: Settings },
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

                {/* OVERVIEW TAB — Command Center */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Site Visitors</p>
                                <h3 className="text-2xl font-bold text-slate-900">{analytics?.totalHits?.toLocaleString() || '0'}</h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Offer Views</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalViews.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subscribers</p>
                                <h3 className="text-2xl font-bold text-slate-900">{subscribers.length}</h3>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unread Msgs</p>
                                <h3 className={`text-2xl font-bold ${pendingMessages > 0 ? 'text-red-500' : 'text-slate-900'}`}>{pendingMessages}</h3>
                            </div>
                        </div>

                        {/* Module Navigation Cards */}
                        <div>
                            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Modules</h2>
                            <AdminModuleGrid
                                stats={{
                                    products: totalProducts,
                                    offers: offers.length,
                                    subscribers: subscribers.length,
                                    messages: pendingMessages,
                                    posts: totalPosts,
                                    glossary: glossaryTerms.length
                                }}
                                setActiveTab={setActiveTab}
                            />
                        </div>
                    </div>
                )}

                {/* ANALYTICS TAB — Traffic Intelligence */}
                {activeTab === 'analytics' && (
                    <TrafficIntelligence data={analytics} />
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
                                    onClick={exportOffers}
                                    className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5"
                                >
                                    <Download size={14} /> Export CSV
                                </button>
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
                                            <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Rotation</th>
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
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleOfferRotation(offer._id, !!offer.isFeaturedInRotation)}
                                                        className={`p-2 rounded-full transition-all ${offer.isFeaturedInRotation ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 bg-slate-50'}`}
                                                        title={offer.isFeaturedInRotation ? "In Rotation Pool" : "Not in Rotation"}
                                                    >
                                                        <RefreshCw size={16} className={offer.isFeaturedInRotation ? "animate-spin-slow" : ""} />
                                                    </button>
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
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <Users className="text-blue-600" /> Subscribers ({subscribers.length})
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mailing List Compliance & Management</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {selectedSubscribers.length > 0 && (
                                    <button
                                        onClick={handleBulkDeleteSubscribers}
                                        className="flex-1 sm:flex-none bg-red-50 text-red-600 border border-red-100 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Trash2 size={14} /> Delete Selected ({selectedSubscribers.length})
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        const csvHeader = "Email,Signup Date,Registration URL,IP Address,User Agent\n";
                                        const csvRows = subscribers.map((s: any) => 
                                            `"${s.email}","${new Date(s.createdAt).toISOString()}","${s.signupUrl || 'N/A'}","${s.ipAddress || 'unknown'}","${(s.userAgent || 'unknown').replace(/"/g, '""')}"`
                                        ).join("\n");
                                        const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
                                        const encodedUri = encodeURI(csvContent);
                                        const link = document.createElement("a");
                                        link.setAttribute("href", encodedUri);
                                        link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="flex-1 sm:flex-none bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                >
                                    <Download size={14} /> Export CSV
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left w-10">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedSubscribers(subscribers.map(s => s._id));
                                                    else setSelectedSubscribers([]);
                                                }}
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Subscriber Info</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Compliance Data</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date / Origin</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {subscribers.map((sub: any) => (
                                        <tr key={sub._id} className={`hover:bg-slate-50/80 transition-colors group ${selectedSubscribers.includes(sub._id) ? 'bg-blue-50/30' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    checked={selectedSubscribers.includes(sub._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedSubscribers([...selectedSubscribers, sub._id]);
                                                        else setSelectedSubscribers(selectedSubscribers.filter(id => id !== sub._id));
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{sub.email}</div>
                                                <div className="text-[9px] text-slate-400 mt-0.5 font-mono truncate max-w-[150px]" title={sub._id}>ID: {sub._id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <Smartphone size={10} className="text-slate-400" /> 
                                                        <span className="truncate max-w-[150px]" title={sub.userAgent}>{sub.userAgent || 'unknown'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                                                        {sub.ipAddress || '0.0.0.0'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-900 text-xs font-bold">{new Date(sub.createdAt).toLocaleDateString()}</div>
                                                <div className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1 truncate max-w-[120px]" title={sub.signupUrl}>
                                                    <LinkIcon size={10} /> {sub.signupUrl ? new URL(sub.signupUrl).pathname : '/'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                                <button 
                                                    onClick={() => copyToClipboard(sub.email)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Copy Email"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleEditSubscriber(sub)}
                                                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                    title="Edit Email"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete('subscriber' as any, sub._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Subscriber"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
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
                            <div className="flex gap-2">
                                <button
                                    onClick={exportProducts}
                                    className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5"
                                >
                                    <Download size={14} /> Export CSV
                                </button>
                            <button
                                onClick={() => router.push('/admin/products/new')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all hover:scale-105"
                            >
                                <Plus size={16} /> Add New Tool
                            </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Rotation</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map(getSanitizedProduct).map((product: any) => (
                                        <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{product.title}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-1">/products/{product.slug}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{product.productType || 'Standard'}</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">${product.price}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleRotation(product.id, !!product.isFeaturedInRotation)}
                                                    className={`p-2 rounded-full transition-all ${product.isFeaturedInRotation ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 bg-slate-50'}`}
                                                    title={product.isFeaturedInRotation ? "In Rotation Pool" : "Not in Rotation"}
                                                >
                                                    <RefreshCw size={16} className={product.isFeaturedInRotation ? "animate-spin-slow" : ""} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <a href={`/products/${product.slug}`} target="_blank" className="inline-block p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"><Eye size={16} /></a>
                                                <button onClick={() => copyToClipboard(`${window.location.origin}/products/${product.slug}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><LinkIcon size={16} /></button>
                                                <button onClick={() => router.push(`/admin/products/${product.id}/edit`)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete('product', product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
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

                {/* Edit Subscriber Modal */}
                {editingSubscriber && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Subscriber</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Update transmission address</p>
                                </div>
                                <button onClick={() => setEditingSubscriber(null)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-900 transition-all"
                                        value={editSubEmail}
                                        onChange={(e) => setEditSubEmail(e.target.value)}
                                        placeholder="enter new email..."
                                    />
                                </div>
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                                    <ShieldCheck className="text-blue-600 shrink-0" size={18} />
                                    <div className="text-[10px] leading-relaxed text-blue-700 font-medium">
                                        Compliance records (IP, Timestamp, User Agent) will be preserved. This change only updates the communication endpoint.
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pt-0 flex gap-3">
                                <button 
                                    onClick={() => setEditingSubscriber(null)}
                                    className="flex-1 px-6 py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
                                >
                                    Abort
                                </button>
                                <button 
                                    onClick={handleSaveSubscriber}
                                    className="flex-[2] bg-slate-900 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
                                >
                                    Synchronize Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MEDIA TAB */}
                {activeTab === 'media' && (
                    <MediaLibrary />
                )}

                {activeTab === 'warehouse' && (
                    <AssetWarehouse />
                )}

                {activeTab === 'settings' && (
                    <SiteSettings />
                )}

                {activeTab === 'marketplace' && (
                    <MarketplaceManager />
                )}

            </main>
        </div>
    );
}
