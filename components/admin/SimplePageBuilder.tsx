"use client";

import { useState, useEffect } from 'react';
import { createOrUpdateSalesPage } from '@/lib/actions/sales-page.actions';
import { Info, Plus, Loader2, Save, Image as ImageIcon, RefreshCw, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MediaLibrary from './MediaLibrary';

interface SimplePageBuilderProps {
    onSuccess?: () => void;
    initialData?: {
        _id?: string;
        title?: string;
        slug?: string;
        bodyCode?: string;
        marketplaceImage?: string;
        isFeaturedInRotation?: boolean;
        externalUrl?: string;
    };
}

export default function SimplePageBuilder({ onSuccess, initialData }: SimplePageBuilderProps) {
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [content, setContent] = useState(initialData?.bodyCode || '');
    const [marketplaceImage, setMarketplaceImage] = useState(initialData?.marketplaceImage || '');
    const [isFeaturedInRotation, setIsFeaturedInRotation] = useState(initialData?.isFeaturedInRotation !== false);
    const [externalUrl, setExternalUrl] = useState(initialData?.externalUrl || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (initialData) {
            setSlug(initialData.slug || '');
            setContent(initialData.bodyCode || '');
            setMarketplaceImage(initialData.marketplaceImage || '');
            setIsFeaturedInRotation(initialData.isFeaturedInRotation !== false);
            setExternalUrl(initialData.externalUrl || '');
        }
    }, [initialData]);

    const handlePublish = async () => {
        if (!content) return alert("Please add some content.");

        setIsSaving(true);
        try {
            let title = initialData?.title || slug || 'Untitled Offer';

            if (!initialData?.title) {
                const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
                if (h1Match) title = h1Match[1];
            }

            const finalSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || title.toLowerCase().replace(/[^a-z0-9-]/g, '-');

            const result = await createOrUpdateSalesPage(initialData?._id || null, {
                title,
                slug: finalSlug,
                bodyCode: content,
                isPublished: true,
                pageType: 'sales',
                marketplaceImage,
                isFeaturedInRotation,
                externalUrl
            });

            if (result.success) {
                alert(initialData?._id ? '✅ Offer updated successfully!' : `✅ Page published: /offers/${finalSlug}`);
                if (!initialData) {
                    setSlug('');
                    setContent('');
                    setMarketplaceImage('');
                    setExternalUrl('');
                }
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.refresh();
                    router.push('/admin');
                }
            } else {
                alert("Error: " + result.error);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-sm font-bold text-blue-800">
                        {initialData ? 'Simple Editor Mode' : 'Instant Publish Mode'}
                    </h4>
                    <p className="text-xs text-blue-600 mt-1">
                        Offers are stored in the database and published instantly. No build required. Supports full HTML content.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slug Input */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Page Slug / URL</label>
                        <div className="flex items-center">
                            <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2.5 rounded-l-lg text-slate-400 font-mono text-sm">/offers/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="flex-1 bg-white border border-slate-200 rounded-r-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="slug"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Override Link (Optional)</label>
                        <div className="flex items-center">
                            <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2.5 rounded-l-lg text-slate-400 font-mono text-sm"><ExternalLink size={14} /></span>
                            <input
                                type="url"
                                value={externalUrl}
                                onChange={(e) => setExternalUrl(e.target.value)}
                                className="flex-1 bg-white border border-slate-200 rounded-r-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <input 
                            type="checkbox" 
                            id="rotation-toggle"
                            checked={isFeaturedInRotation} 
                            onChange={(e) => setIsFeaturedInRotation(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="rotation-toggle" className="text-xs font-black uppercase tracking-widest text-slate-600 cursor-pointer">
                            Include in Rotation Pool
                        </label>
                    </div>
                </div>

                {/* Image Picker */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest self-start mb-2">Marketplace Thumbnail</label>
                    
                    <div className="w-full aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                        {marketplaceImage ? (
                            <>
                                <img src={marketplaceImage} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => setMarketplaceImage('')} className="bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-50 transition-all"><X size={16} /></button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <ImageIcon size={40} strokeWidth={1} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">No Image Selected</span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="button" 
                        onClick={() => setShowGallery(true)}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Plus size={14} /> Pick from Gallery
                    </button>
                    <input 
                        type="url" 
                        value={marketplaceImage} 
                        onChange={(e) => setMarketplaceImage(e.target.value)}
                        placeholder="Or paste URL here..."
                        className="w-full px-4 py-2 bg-transparent text-[10px] font-bold text-slate-500 text-center outline-none"
                    />
                </div>
            </div>

            {/* Content Editor */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Content</label>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Paste HTML (Scripts allowed)</span>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-96 bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 selection:bg-blue-500/30 resize-y leading-relaxed"
                    placeholder={`<h1>My Special Offer</h1>\n<p>This is a limited time deal...</p>\n\n<a href="..." class="btn">Buy Now</a>`}
                    spellCheck={false}
                />
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-blue-200"
                >
                    {isSaving ? (
                        <><Loader2 size={16} className="animate-spin" /> {initialData ? 'Saving...' : 'Publishing...'}</>
                    ) : (
                        <>{initialData ? <Save size={16} /> : <Plus size={16} />} {initialData ? 'Update Offer' : 'Publish Page'}</>
                    )}
                </button>
            </div>

            {/* GALLERY MODAL */}
            {showGallery && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-8 border-b border-slate-100">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Image Gallery</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Select an image for your offer card</p>
                            </div>
                            <button type="button" onClick={() => setShowGallery(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                <X size={24} className="text-slate-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                           <MediaLibrary onSelect={(url) => {
                               setMarketplaceImage(url);
                               setShowGallery(false);
                           }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
