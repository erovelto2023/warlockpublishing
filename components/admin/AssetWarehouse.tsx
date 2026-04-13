'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    Package, Upload, Trash2, Copy, FileArchive, FileText, 
    FileCode, ExternalLink, Search, RefreshCw, X, Check,
    HardDrive, Download, AlertCircle, Info, File
} from 'lucide-react';

interface Asset {
    _id: string;
    title: string;
    description?: string;
    originalFilename: string;
    storedFilename: string;
    fileSizeBytes: number;
    mimeType: string;
    accessSlug: string;
    downloadCount: number;
    createdAt: string;
}

export default function AssetWarehouse() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    
    // Upload Form State
    const [uploadTitle, setUploadTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/warehouse');
            const data = await res.json();
            if (data.success) {
                setAssets(data.assets);
            }
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this asset? The file will be permanently removed from the server.')) return;
        
        try {
            const res = await fetch('/api/warehouse', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) fetchAssets();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('title', uploadTitle || selectedFile.name);
        formData.append('file', selectedFile);

        try {
            // Using XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/warehouse/upload', true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setShowUploadModal(false);
                    setUploadTitle('');
                    setSelectedFile(null);
                    fetchAssets();
                } else {
                    const error = JSON.parse(xhr.responseText);
                    alert(`Upload failed: ${error.error || 'Unknown error'}`);
                }
                setUploading(false);
            };

            xhr.onerror = () => {
                alert('Upload failed due to network error');
                setUploading(false);
            };

            xhr.send(formData);
        } catch (err) {
            console.error('Upload Error:', err);
            setUploading(false);
        }
    };

    const copyDownloadLink = (slug: string) => {
        const url = `${window.location.origin}/api/warehouse/download/${slug}`;
        navigator.clipboard.writeText(url);
        alert('Download link copied to clipboard!');
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mime: string) => {
        if (mime.includes('zip') || mime.includes('rar') || mime.includes('7z')) return <FileArchive className="text-amber-500" />;
        if (mime.includes('pdf')) return <FileText className="text-red-500" />;
        if (mime.includes('json') || mime.includes('javascript') || mime.includes('html')) return <FileCode className="text-blue-500" />;
        return <File className="text-slate-400" />;
    };

    const filteredAssets = assets.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.originalFilename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                            <Package size={20} />
                        </div>
                        DIGITAL WAREHOUSE
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Manage and secure your large digital product assets</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        <Upload size={18} />
                        NEW UPLOAD
                    </button>
                    <button 
                        onClick={fetchAssets}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title or filename..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 border-transparent transition-all font-medium text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <HardDrive size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Vault</p>
                            <p className="text-lg font-bold tracking-tight leading-none">{assets.length} Assets</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status</p>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Encrypted</p>
                    </div>
                </div>
            </div>

            {/* Assets List */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">File Info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Downloads</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-8">
                                            <div className="h-4 bg-slate-100 rounded w-1/3 mb-2"></div>
                                            <div className="h-3 bg-slate-50 rounded w-1/4"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredAssets.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <Package size={48} className="text-slate-200 mb-4" />
                                            <p className="text-lg font-bold text-slate-400">Warehouse is empty</p>
                                            <p className="text-sm text-slate-400">Upload your first digital product to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAssets.map((asset) => (
                                    <tr key={asset._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-white transition-colors group-hover:shadow-md">
                                                    {getFileIcon(asset.mimeType)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-2">
                                                        {asset.title}
                                                        <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black uppercase text-slate-500 rounded-md">
                                                            {asset.mimeType.split('/')[1] || 'Unknown'}
                                                        </span>
                                                    </h4>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{asset.originalFilename}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                                    <Download size={12} className="text-slate-400" />
                                                    {formatSize(asset.fileSizeBytes)}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                    ID: {asset.accessSlug.substring(0, 8)}...
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px]">
                                                {asset.downloadCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => copyDownloadLink(asset.accessSlug)}
                                                    title="Copy Download URL"
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(asset._id)}
                                                    title="Delete Asset"
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !uploading && setShowUploadModal(false)} />
                    <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm">
                                    <Upload size={18} />
                                </div>
                                SECURE UPLOAD
                            </h3>
                            {!uploading && (
                                <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-400 hover:bg-white rounded-xl transition-all">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-6">
                            {/* File Dropzone */}
                            <div 
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`
                                    border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                                    ${selectedFile ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 bg-slate-50/50'}
                                    ${uploading ? 'opacity-50 pointer-events-none' : ''}
                                `}
                            >
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                                        }
                                    }}
                                />
                                {selectedFile ? (
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-md mb-3">
                                            {getFileIcon(selectedFile.type || '')}
                                        </div>
                                        <p className="font-bold text-slate-800">{selectedFile.name}</p>
                                        <p className="text-xs text-slate-400 mt-1">{formatSize(selectedFile.size)}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-white text-slate-300 rounded-2xl mb-3">
                                            <Upload size={24} />
                                        </div>
                                        <p className="font-bold text-slate-600">Click to select file</p>
                                        <p className="text-xs text-slate-400 mt-1">Maximum size: 1GB</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Asset Title</label>
                                    <input
                                        type="text"
                                        placeholder="Internal display name..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            {uploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">Uploading to Vault...</span>
                                        <span className="text-indigo-600">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-600 transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    disabled={uploading}
                                    className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <RefreshCw size={18} className="animate-spin" />
                                    ) : (
                                        <Check size={18} />
                                    )}
                                    {uploading ? 'PROCESSING...' : 'START UPLOAD'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
