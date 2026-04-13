"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Upload, X, Copy, Check, Pencil, Trash2, Search, Filter,
    Image as ImageIcon, Eye, EyeOff, Loader2, Tag, AlertCircle
} from 'lucide-react';

interface GalleryImage {
    _id: string;
    title: string;
    altText: string;
    description: string;
    tags: string[];
    fileUrl: string;
    thumbnailUrl: string;
    mimeType: string;
    fileSizeBytes: number;
    status: 'draft' | 'published';
    sortOrder: number;
    createdAt: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://warlockpublishing.com';

export default function MediaLibrary({ onSelect }: { onSelect?: (url: string) => void }) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [snippetImage, setSnippetImage] = useState<GalleryImage | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Edit form state ---
    const [editTitle, setEditTitle] = useState('');
    const [editAlt, setEditAlt] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editTags, setEditTags] = useState('');
    const [editStatus, setEditStatus] = useState<'draft' | 'published'>('draft');
    const [saving, setSaving] = useState(false);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/gallery?limit=100');
            const data = await res.json();
            setImages(data.images || []);
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchImages(); }, [fetchImages]);

    // --- Filtering ---
    const filtered = images.filter(img => {
        const matchSearch = img.title.toLowerCase().includes(search.toLowerCase()) ||
            img.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchStatus = statusFilter === 'all' || img.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // --- Upload ---
    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadProgress([]);
        const msgs: string[] = [];
        for (const file of Array.from(files)) {
            msgs.push(`Uploading ${file.name}...`);
            setUploadProgress([...msgs]);
            const fd = new FormData();
            fd.append('files', file);
            fd.append('title', file.name.replace(/\.[^/.]+$/, ''));
            fd.append('altText', file.name.replace(/\.[^/.]+$/, ''));
            try {
                const res = await fetch('/api/gallery/upload', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success) {
                    msgs[msgs.length - 1] = `✅ ${file.name}`;
                } else {
                    msgs[msgs.length - 1] = `❌ ${file.name}: ${data.error}`;
                }
            } catch {
                msgs[msgs.length - 1] = `❌ ${file.name}: Network error`;
            }
            setUploadProgress([...msgs]);
        }
        setUploading(false);
        fetchImages();
        setTimeout(() => setUploadProgress([]), 3000);
    };

    // --- Edit ---
    const openEdit = (img: GalleryImage) => {
        setEditingImage(img);
        setEditTitle(img.title);
        setEditAlt(img.altText);
        setEditDesc(img.description);
        setEditTags(img.tags.join(', '));
        setEditStatus(img.status);
    };

    const saveEdit = async () => {
        if (!editingImage) return;
        setSaving(true);
        await fetch(`/api/gallery/${editingImage._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: editTitle,
                altText: editAlt,
                description: editDesc,
                tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
                status: editStatus,
            }),
        });
        setSaving(false);
        setEditingImage(null);
        fetchImages();
    };

    // --- Delete ---
    const handleDelete = async (img: GalleryImage) => {
        if (!confirm(`Delete "${img.title}"? This cannot be undone.`)) return;
        await fetch(`/api/gallery/${img._id}`, { method: 'DELETE' });
        fetchImages();
    };

    // --- Status toggle ---
    const toggleStatus = async (img: GalleryImage) => {
        await fetch(`/api/gallery/${img._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: img.status === 'published' ? 'draft' : 'published' }),
        });
        fetchImages();
    };

    // --- Copy snippet ---
    const copyText = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatBytes = (b: number) =>
        b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Media Library</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                        {images.length} images · {images.filter(i => i.status === 'published').length} published
                    </p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25"
                >
                    <Upload size={14} /> Upload Images
                </button>
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
                }`}
            >
                <ImageIcon size={32} className={`mx-auto mb-3 ${dragOver ? 'text-indigo-500' : 'text-slate-400'}`} />
                <p className="text-sm font-bold text-slate-500">
                    {dragOver ? 'Drop to upload' : 'Drag & drop images here, or click to browse'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">JPG, PNG, WebP, GIF · Max 10MB each</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={e => handleFiles(e.target.files)}
                />
            </div>

            {/* Upload Progress */}
            {(uploading || uploadProgress.length > 0) && (
                <div className="bg-slate-900 rounded-2xl p-4 space-y-1">
                    {uploading && (
                        <div className="flex items-center gap-2 text-white text-xs font-bold">
                            <Loader2 size={14} className="animate-spin text-indigo-400" /> Processing uploads...
                        </div>
                    )}
                    {uploadProgress.map((msg, i) => (
                        <p key={i} className="text-xs font-mono text-slate-300">{msg}</p>
                    ))}
                </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title or tag..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    {(['all', 'published', 'draft'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                statusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Image Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-indigo-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold uppercase tracking-widest text-xs">No images found</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filtered.map(img => (
                        <div key={img._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all">
                            {/* Thumbnail */}
                            <div className="relative aspect-square bg-slate-100">
                                <img
                                    src={img.thumbnailUrl}
                                    alt={img.altText}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Status badge */}
                                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    img.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                                }`}>
                                    {img.status}
                                </div>
                                {/* Hover actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => setSnippetImage(img)} title="Get embed code"
                                        className="p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-colors">
                                        <Copy size={14} />
                                    </button>
                                    {onSelect ? (
                                        <button onClick={() => onSelect(img.fileUrl)} title="Select this image"
                                            className="p-2 bg-emerald-600 rounded-xl text-white hover:bg-emerald-700 transition-colors">
                                            <Check size={14} />
                                        </button>
                                    ) : (
                                        <button onClick={() => openEdit(img)} title="Edit metadata"
                                            className="p-2 bg-white rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
                                            <Pencil size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => toggleStatus(img)} title={img.status === 'published' ? 'Set to draft' : 'Publish'}
                                        className="p-2 bg-white rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
                                        {img.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button onClick={() => handleDelete(img)} title="Delete"
                                        className="p-2 bg-red-600 rounded-xl text-white hover:bg-red-700 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3 space-y-1">
                                <p className="text-xs font-black text-slate-800 truncate">{img.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{formatBytes(img.fileSizeBytes)}</p>
                                {img.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {img.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ---- EMBED SNIPPET MODAL ---- */}
            {snippetImage && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={e => { if (e.target === e.currentTarget) setSnippetImage(null); }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Embed Snippet</h3>
                                <p className="text-xs text-slate-500 font-bold">Copy and paste anywhere on the web</p>
                            </div>
                            <button onClick={() => setSnippetImage(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={16} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Preview */}
                            <div className="flex items-start gap-4">
                                <img src={snippetImage.thumbnailUrl} alt={snippetImage.altText} className="w-20 h-20 object-cover rounded-2xl border border-slate-200" />
                                <div>
                                    <p className="font-black text-slate-900">{snippetImage.title}</p>
                                    <p className="text-xs text-slate-500 mt-1">{snippetImage.altText}</p>
                                    <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${snippetImage.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {snippetImage.status === 'draft' && <AlertCircle size={9} className="mr-1" />}
                                        {snippetImage.status}
                                    </div>
                                    {snippetImage.status === 'draft' && (
                                        <p className="text-[10px] text-amber-600 font-bold mt-1">⚠ Publish this image for the embed to display</p>
                                    )}
                                </div>
                            </div>

                            {/* Snippet 1: Full <img> tag */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Standard HTML — Paste anywhere</p>
                                <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
                                    <pre className="text-xs text-emerald-400 font-mono p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">{`<img
  src="${APP_URL}${snippetImage.fileUrl}"
  alt="${snippetImage.altText}"
  title="${snippetImage.title}"
  loading="lazy"
  style="max-width:100%;height:auto;"
/>`}</pre>
                                    <button
                                        onClick={() => copyText(`<img\n  src="${APP_URL}${snippetImage.fileUrl}"\n  alt="${snippetImage.altText}"\n  title="${snippetImage.title}"\n  loading="lazy"\n  style="max-width:100%;height:auto;"\n/>`, 'img')}
                                        className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                    >
                                        {copied === 'img' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white" />}
                                    </button>
                                </div>
                            </div>

                            {/* Snippet 2: Thumbnail */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thumbnail (400×400) — For grids, sidebars</p>
                                <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
                                    <pre className="text-xs text-indigo-400 font-mono p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">{`<img
  src="${APP_URL}${snippetImage.thumbnailUrl}"
  alt="${snippetImage.altText}"
  loading="lazy"
  width="400" height="400"
  style="max-width:100%;height:auto;object-fit:cover;"
/>`}</pre>
                                    <button
                                        onClick={() => copyText(`<img\n  src="${APP_URL}${snippetImage.thumbnailUrl}"\n  alt="${snippetImage.altText}"\n  loading="lazy"\n  width="400" height="400"\n  style="max-width:100%;height:auto;object-fit:cover;"\n/>`, 'thumb')}
                                        className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                    >
                                        {copied === 'thumb' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white" />}
                                    </button>
                                </div>
                            </div>

                            {/* Direct URL */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Direct URL — For CSS backgrounds, emails</p>
                                <div className="relative bg-slate-100 rounded-xl flex items-center gap-2 px-4 py-3">
                                    <span className="text-xs font-mono text-slate-700 truncate flex-1">{APP_URL}{snippetImage.fileUrl}</span>
                                    <button
                                        onClick={() => copyText(`${APP_URL}${snippetImage.fileUrl}`, 'url')}
                                        className="shrink-0 p-1.5 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                                    >
                                        {copied === 'url' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-400" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- EDIT METADATA MODAL ---- */}
            {editingImage && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={e => { if (e.target === e.currentTarget) setEditingImage(null); }}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Edit Metadata</h3>
                            <button onClick={() => setEditingImage(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X size={16} className="text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Title *</label>
                                <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Alt Text * (accessibility + SEO)</label>
                                <input value={editAlt} onChange={e => setEditAlt(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tags (comma-separated)</label>
                                <input value={editTags} onChange={e => setEditTags(e.target.value)}
                                    placeholder="sales, hero-banner, product"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                                <div className="flex gap-2">
                                    {(['draft', 'published'] as const).map(s => (
                                        <button key={s} onClick={() => setEditStatus(s)}
                                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${editStatus === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={saveEdit} disabled={saving}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
