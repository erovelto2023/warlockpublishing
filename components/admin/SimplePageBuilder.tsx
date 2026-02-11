"use client";

import { useState } from 'react';
import { createOrUpdateSalesPage } from '@/lib/actions/sales-page.actions';
import { Info, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SimplePageBuilder({ onSuccess }: { onSuccess: () => void }) {
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handlePublish = async () => {
        if (!content) return alert("Please add some content.");

        setIsSaving(true);
        try {
            // Auto-generate title from H1 if present, else use slug
            let title = slug || 'Untitled Offer';
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
            if (h1Match) title = h1Match[1];

            // Clean slug
            const finalSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || title.toLowerCase().replace(/[^a-z0-9-]/g, '-');

            const result = await createOrUpdateSalesPage(null, {
                title,
                slug: finalSlug,
                bodyCode: content,
                isPublished: true,
                pageType: 'sales'
            });

            if (result.success) {
                alert(`✅ Page published: /offers/${finalSlug}`);
                setSlug('');
                setContent('');
                onSuccess();
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
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-sm font-bold text-blue-800">Instant Publish Mode</h4>
                    <p className="text-xs text-blue-600 mt-1">
                        Offers are stored in the database and published instantly. No build required. Supports full HTML content.
                    </p>
                </div>
            </div>

            {/* Slug Input */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Page Slug / URL</label>
                <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2.5 rounded-l-lg text-slate-400 font-mono text-sm">/offers/</span>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-r-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. breathalyzer-dashboard (Leave empty to auto-generate from content)"
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
                        <><Loader2 size={16} className="animate-spin" /> Publishing...</>
                    ) : (
                        <><Plus size={16} /> Publish Page</>
                    )}
                </button>
            </div>
        </div>
    );
}
