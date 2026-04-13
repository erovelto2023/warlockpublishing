"use client";

import { useState } from 'react';
import { createOrUpdateSalesPage } from '@/lib/actions/sales-page.actions';
import { Save, Globe, Code, Megaphone, DollarSign, ExternalLink, Zap, Info, Wand2, Image as ImageIcon, Share2, Tag, ShoppingBag, Layout, Plus, Trash2, ChevronDown, ChevronUp, BarChart3, Layers, Copy, Check, Eye, X } from 'lucide-react';
import { SMART_VARIABLES } from '@/lib/constants/smartVariables';

interface SalesPageFormProps {
    initialData?: any;
    onComplete?: () => void;
}

export default function SalesPageForm({ initialData, onComplete }: SalesPageFormProps) {
    const [loading, setLoading] = useState(false);
    const [slugModified, setSlugModified] = useState(!!initialData?._id);
    const [copiedVar, setCopiedVar] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        keywords: initialData?.keywords || '',
        headerCode: initialData?.headerCode || '',
        bodyCode: initialData?.bodyCode || '',
        footerCode: initialData?.footerCode || '',
        isPublished: initialData?.isPublished ?? false,
        showInMarketplace: initialData?.showInMarketplace ?? false,
        pageType: initialData?.pageType || 'sales',
        price: initialData?.price || '',
        buyUrl: initialData?.buyUrl || '',
        ogTitle: initialData?.ogTitle || '',
        ogDescription: initialData?.ogDescription || '',
        ogImage: initialData?.ogImage || '',
        // Marketplace Card Overrides
        marketplaceTitle: initialData?.marketplaceTitle || '',
        marketplaceDescription: initialData?.marketplaceDescription || '',
        marketplaceImage: initialData?.marketplaceImage || '',
        marketplaceColor: initialData?.marketplaceColor || '#3b82f6',
        useColorAsDefault: initialData?.useColorAsDefault ?? true,
        marketplaceFeatures: initialData?.marketplaceFeatures || ['Instant Access', 'Premium Content'],
        // Rotation Settings
        isFeaturedInRotation: initialData?.isFeaturedInRotation ?? true,
        externalUrl: initialData?.externalUrl || '',
        // A/B Testing
        abEnabled: initialData?.abEnabled ?? false,
        bodyCodeB: initialData?.bodyCodeB || '',
    });

    const [showGallery, setShowGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(false);

    const [showVariableHelp, setShowVariableHelp] = useState(false);

    const handlePreview = (ver: 'A' | 'B') => {
        if (!initialData?._id) {
            alert("Please save the page first to preview accurately.");
            return;
        }
        window.open(`/offers/${formData.slug}?preview=${ver}`, '_blank');
    };

    // Stats calculation
    const views = initialData?.views || 0;
    const clicks = initialData?.clicks || 0;
    const cvr = views > 0 ? ((clicks / views) * 100).toFixed(2) : "0.00";

    const viewsA = initialData?.viewsA || 0;
    const clicksA = initialData?.clicksA || 0;
    const cvrA = viewsA > 0 ? ((clicksA / viewsA) * 100).toFixed(2) : "0.00";

    const viewsB = initialData?.viewsB || 0;
    const clicksB = initialData?.clicksB || 0;
    const cvrB = viewsB > 0 ? ((clicksB / viewsB) * 100).toFixed(2) : "0.00";

    // Auto-slug generation
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await createOrUpdateSalesPage(initialData?._id || null, formData);
            if (result.success) {
                alert('✅ Page saved successfully!');
                if (onComplete) onComplete();
            } else {
                alert('❌ Error: ' + result.error);
            }
        } catch (error) {
            alert('❌ Failed to save page');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => {
            const next = { ...prev, [name]: val };
            if (name === 'title' && !slugModified) {
                next.slug = generateSlug(value);
            }
            return next;
        });

        if (name === 'slug') {
            setSlugModified(true);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedVar(text);
        setTimeout(() => setCopiedVar(null), 2000);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.marketplaceFeatures];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, marketplaceFeatures: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, marketplaceFeatures: [...prev.marketplaceFeatures, ''] }));
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            marketplaceFeatures: prev.marketplaceFeatures.filter((_: string, i: number) => i !== index)
        }));
    };

    const openGallery = async () => {
        setShowGallery(true);
        setGalleryLoading(true);
        try {
            const res = await fetch('/api/gallery?limit=50');
            const data = await res.json();
            setGalleryImages(data.images || []);
        } catch (e) {
            console.error("Failed to fetch gallery", e);
        } finally {
            setGalleryLoading(false);
        }
    };

    const selectImage = (url: string) => {
        setFormData(prev => ({ ...prev, marketplaceImage: url }));
        setShowGallery(false);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; // Sticky header offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleSmartPaste = () => {
        const fullCode = prompt("Paste your full HTML code here. I will automatically split it into Header, Body, and Footer fields:");
        if (!fullCode) return;

        let header = '';
        let body = '';
        let footer = '';

        const headMatch = fullCode.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        if (headMatch) header = headMatch[1].trim();

        const bodyMatch = fullCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            body = bodyMatch[1].trim();
            const scriptMatches = body.match(/<script[\s\S]*?<\/script>|<img[^>]*tracking\.groovesell[\s\S]*?>/gi);
            if (scriptMatches) {
                const lastItems = scriptMatches.filter(s => s.toLowerCase().includes('tracking') || s.toLowerCase().includes('toggle') || s.toLowerCase().includes('modal'));
                if (lastItems.length > 0) {
                    footer = lastItems.join('\n');
                    lastItems.forEach(item => { body = body.replace(item, '').trim(); });
                }
            }
        }

        if (header || body) {
            setFormData(prev => ({
                ...prev,
                headerCode: header || prev.headerCode,
                bodyCode: body || prev.bodyCode,
                footerCode: footer || prev.footerCode
            }));
            alert("✨ Code successfully split into respective fields!");
        } else {
            alert("❌ Could not identify <head> or <body> tags. Please paste standard HTML.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* Header Control Panel */}
            <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-xl border-t-blue-500 border-t-4 transition-all">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Offer Builder</span>
                        <h2 className="text-xl font-black text-slate-900 truncate max-w-[200px]">{formData.title || 'Untitled Offer'}</h2>
                    </div>

                    <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>

                    <div className="hidden lg:flex gap-1 bg-slate-100 p-1 rounded-2xl">
                        <button type="button" onClick={() => scrollToSection('section-basics')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Basics</button>
                        <button type="button" onClick={() => scrollToSection('section-stats')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Analytics</button>
                        <button type="button" onClick={() => scrollToSection('section-content')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Engineering</button>
                        <button type="button" onClick={() => scrollToSection('section-monetization')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Economics</button>
                        <button type="button" onClick={() => scrollToSection('section-publish')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Publish</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleSmartPaste} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200">
                        <Wand2 size={14} /> Import Code
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200 disabled:bg-blue-300">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* QUICK STATS BAR */}
            <section id="section-stats" className="scroll-mt-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Globe size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Views</span>
                            <span className="block text-2xl font-black text-slate-900">{views.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><DollarSign size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Buy Clicks</span>
                            <span className="block text-2xl font-black text-green-600">{clicks.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BarChart3 size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Conversion</span>
                            <span className="block text-2xl font-black text-blue-600">{cvr}%</span>
                        </div>
                    </div>
                    <div className="bg-blue-600 p-6 rounded-3xl border border-blue-500 shadow-lg shadow-blue-100 flex items-center gap-4 text-white">
                        <div className="p-3 bg-white/10 rounded-2xl"><Layers size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-blue-100 uppercase tracking-widest">A/B Status</span>
                            <span className="block text-lg font-black">{formData.abEnabled ? 'Active Test' : 'Single Version'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN FORM SECTIONS */}
            <div className="space-y-16">

                {/* 1. BASIC INFO */}
                <section id="section-basics" className="scroll-mt-32">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Globe size={24} /></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Configuration</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Internal Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-lg" placeholder="Ultimate Marketing Course" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Live URL Path</label>
                                <div className="flex items-center">
                                    <span className="bg-slate-50 border border-r-0 border-slate-200 px-4 py-4 rounded-l-2xl text-slate-400 font-bold text-sm">/offers/</span>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="flex-1 px-5 py-4 rounded-r-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-blue-600" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">System Tag</label>
                                <select name="pageType" value={formData.pageType} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold bg-white appearance-none">
                                    <option value="sales">Sales Page</option>
                                    <option value="upsell">Upsell Page</option>
                                    <option value="downsell">Downsell Page</option>
                                    <option value="thank-you">Thank You Page</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-8 items-center">
                            <label className="flex items-center gap-4 px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl cursor-pointer hover:bg-indigo-100 transition-all font-black text-xs uppercase tracking-widest text-indigo-700">
                                <input 
                                    type="checkbox" 
                                    name="isFeaturedInRotation" 
                                    checked={formData.isFeaturedInRotation} 
                                    onChange={handleChange} 
                                    className="w-6 h-6 rounded-lg border-indigo-300 text-indigo-600 focus:ring-indigo-500" 
                                />
                                Include in Side Rotation Pool
                            </label>

                            <div className="flex-1 min-w-[300px]">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Override Link (External URL)</label>
                                <div className="flex items-center">
                                    <div className="bg-slate-50 border border-r-0 border-slate-200 px-4 py-3 rounded-l-2xl text-slate-400 font-bold text-xs"><ExternalLink size={14} /></div>
                                    <input 
                                        type="url" 
                                        name="externalUrl" 
                                        value={formData.externalUrl} 
                                        onChange={handleChange} 
                                        className="flex-1 px-5 py-3 rounded-r-2xl border border-slate-200 focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                                        placeholder="https://specific-landing-page.com (Optional)" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. ENGINEERING & CONTENT */}
                <section id="section-content" className="scroll-mt-32">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Code size={24} /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Engineering Lab</h3>
                                    <p className="text-sm text-slate-500 font-medium">Build your high-converting body environment.</p>
                                </div>
                            </div>

                            {/* SMART VARIABLES EXPLORER */}
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest">Smart Variables</span>
                                    <span className="block text-[9px] text-slate-400 font-bold uppercase">Click to Copy</span>
                                </div>
                                <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                    {Object.keys(SMART_VARIABLES).map(key => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => copyToClipboard(key)}
                                            className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-white border border-slate-100 hover:border-blue-300 hover:text-blue-600 shadow-sm flex items-center gap-2"
                                        >
                                            {copiedVar === key ? <Check size={12} className="text-green-500" /> : <Zap size={10} />}
                                            {key.replace(/{|}/g, '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Standard Codes */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-500 transition-colors">Header Area (CSS/Styles)</span>
                                    </label>
                                    <textarea name="headerCode" value={formData.headerCode} onChange={handleChange} rows={6} className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-200 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-mono text-xs leading-relaxed bg-slate-50/50" placeholder="<style>...</style>" />
                                </div>
                                <div className="group">
                                    <label className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-500 transition-colors">Footer injection (Scripts)</span>
                                    </label>
                                    <textarea name="footerCode" value={formData.footerCode} onChange={handleChange} rows={6} className="w-full px-6 py-5 rounded-[1.5rem] border border-slate-200 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-mono text-xs leading-relaxed bg-slate-50/50" placeholder="<script>...</script>" />
                                </div>
                            </div>

                            {/* CORE BODY EDITORS - WITH A/B TOGGLE */}
                            <div className="space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm"><Layers size={24} /></div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Visual Content Environment</h4>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Version A: Primary Control Group</p>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-all shadow-sm group">
                                        <input type="checkbox" name="abEnabled" checked={formData.abEnabled} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        <div className="text-left">
                                            <span className="block text-[10px] font-black text-slate-800 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enable A/B testing</span>
                                            <span className="block text-[9px] text-slate-400 font-bold uppercase">Split traffic 50/50</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 gap-12">
                                    {/* VERSION A */}
                                    <div className="group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Version A (Master)</span>
                                                <button type="button" onClick={() => handlePreview('A')} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase hover:bg-blue-100 transition-all">
                                                    <Eye size={12} /> Preview A
                                                </button>
                                            </div>
                                            <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase">
                                                <span>{viewsA} Views</span>
                                                <span className="text-green-600">{cvrA}% CV</span>
                                            </div>
                                        </div>
                                        <textarea name="bodyCode" value={formData.bodyCode} onChange={handleChange} required rows={18} className="w-full px-8 py-6 rounded-[2rem] border-2 border-slate-200 focus:border-blue-500 outline-none transition-all font-mono text-sm leading-relaxed bg-white shadow-xl" placeholder="Version A HTML..." />
                                    </div>

                                    {/* VERSION B (Conditional) */}
                                    {formData.abEnabled && (
                                        <div className="group animate-in slide-in-from-top-4 duration-500">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">Version B (Challenger)</span>
                                                    <button type="button" onClick={() => handlePreview('B')} className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase hover:bg-purple-100 transition-all">
                                                        <Eye size={12} /> Preview B
                                                    </button>
                                                </div>
                                                <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase">
                                                    <span>{viewsB} Views</span>
                                                    <span className="text-purple-600">{cvrB}% CV</span>
                                                </div>
                                            </div>
                                            <textarea name="bodyCodeB" value={formData.bodyCodeB} onChange={handleChange} rows={18} className="w-full px-8 py-6 rounded-[2rem] border-2 border-purple-200 focus:border-purple-500 outline-none transition-all font-mono text-sm leading-relaxed bg-white shadow-xl" placeholder="Version B HTML..." />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. ECONOMICS & MARKETPLACE */}
                <section id="section-monetization" className="scroll-mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Transaction Details */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><DollarSign size={24} /></div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Economics</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Checkout Link</label>
                                    <div className="flex items-center">
                                        <span className="bg-slate-50 border border-r-0 border-slate-200 px-4 py-4 rounded-l-2xl text-slate-400 font-bold text-xs">BUY_URL</span>
                                        <input type="url" name="buyUrl" value={formData.buyUrl} onChange={handleChange} className="flex-1 px-6 py-4 rounded-r-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Selling Price ($)</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none font-black text-2xl text-green-600" placeholder="97" />
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all font-black text-[10px] uppercase tracking-widest text-blue-600">
                                            <input type="checkbox" name="showInMarketplace" checked={formData.showInMarketplace} onChange={handleChange} className="w-5 h-5 rounded-lg border-blue-300 text-blue-600" />
                                            Marketplace Visibility
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marketplace Card Settings */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-900 text-white rounded-2xl"><ShoppingBag size={24} /></div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Public Directory Card</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] font-black text-slate-800 uppercase tracking-widest">Card Style Priority</span>
                                        <span className="block text-[9px] text-slate-400 font-bold uppercase">Choose what to lead with</span>
                                    </div>
                                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, useColorAsDefault: false }))}
                                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${!formData.useColorAsDefault ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Image
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, useColorAsDefault: true }))}
                                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.useColorAsDefault ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Color
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center justify-between block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                            Card Image URL (Optional)
                                            <button type="button" onClick={openGallery} className="text-blue-600 hover:scale-105 flex items-center gap-1 transition-all">
                                                <ImageIcon size={12} /> Pick from Gallery
                                            </button>
                                        </label>
                                        <input type="url" name="marketplaceImage" value={formData.marketplaceImage} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none font-medium text-xs" placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Brand Theme Color</label>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 group-within:border-blue-500 transition-colors">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                                                    <input
                                                        type="color"
                                                        name="marketplaceColor"
                                                        value={formData.marketplaceColor}
                                                        onChange={handleChange}
                                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="marketplaceColor"
                                                    value={formData.marketplaceColor}
                                                    onChange={handleChange}
                                                    className="flex-1 bg-transparent text-sm font-black uppercase outline-none text-slate-700"
                                                    placeholder="#3B82F6"
                                                />
                                            </div>

                                            {/* PRESET PALETTE */}
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { name: 'Trust Blue', hex: '#3b82f6' },
                                                    { name: 'Success Green', hex: '#22c55e' },
                                                    { name: 'Urgency Red', hex: '#ef4444' },
                                                    { name: 'Premium Gold', hex: '#eab308' },
                                                    { name: 'Growth Purple', hex: '#a855f7' },
                                                    { name: 'Pure Dark', hex: '#0f172a' },
                                                    { name: 'Sunset Orange', hex: '#f97316' },
                                                    { name: 'Digital Pink', hex: '#ec4899' }
                                                ].map((color) => (
                                                    <button
                                                        key={color.hex}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, marketplaceColor: color.hex }))}
                                                        className={`w-7 h-7 rounded-lg transition-all hover:scale-125 hover:shadow-lg border-2 ${formData.marketplaceColor.toLowerCase() === color.hex.toLowerCase() ? 'border-white ring-2 ring-blue-500 scale-110 shadow-md' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color.hex }}
                                                        title={color.name}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">Pro Tip: Use Success Green for Profit tools or Trust Blue for Software.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Override Title</label>
                                        <input type="text" name="marketplaceTitle" value={formData.marketplaceTitle} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-xs" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Card Description</label>
                                        <input type="text" name="marketplaceDescription" value={formData.marketplaceDescription} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-xs" />
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center justify-between mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Product Highlights
                                        <button type="button" onClick={addFeature} className="text-blue-600 hover:scale-110 transition-transform"><Plus size={16} /></button>
                                    </label>
                                    <div className="space-y-3">
                                        {formData.marketplaceFeatures.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                                <input type="text" value={feature} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-slate-100 focus:border-blue-500 bg-slate-50 outline-none text-[10px] font-bold uppercase tracking-widest" />
                                                <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. SEO & SOCIAL */}
                <section id="section-seo" className="scroll-mt-32">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Megaphone size={24} /></div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Social Visibility</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-2">Global Search</h5>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">SEO Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-medium italic" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Meta Keywords</label>
                                    <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-medium" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 border-b border-blue-50 pb-2">Open Graph Sharing</h5>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Social Image URL</label>
                                    <input type="url" name="ogImage" value={formData.ogImage} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-medium" />
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <input type="text" name="ogTitle" value={formData.ogTitle} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-medium" placeholder="Override Title" />
                                    <textarea name="ogDescription" value={formData.ogDescription} onChange={handleChange} rows={2} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-medium" placeholder="Override Social Description" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. PUBLISHING */}
                <section id="section-publish" className="pt-10 scroll-mt-32">
                    <div className="bg-slate-900 p-12 rounded-[3rem] shadow-3xl text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        <div className="relative z-10 space-y-4">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Launch Sequence</h3>
                            <p className="text-slate-400 font-medium max-w-lg mx-auto">Toggle the switch below to push your sales funnel live to the production environment.</p>

                            <div className="flex justify-center pt-4">
                                <label className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all group">
                                    <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="w-8 h-8 rounded-xl border-white/20 text-blue-600 focus:ring-offset-slate-900" />
                                    <div className="text-left">
                                        <span className="block font-black text-white uppercase tracking-widest text-xl group-hover:text-blue-400 transition-colors">{formData.isPublished ? 'Page is Live' : 'Page is Draft'}</span>
                                        <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">/offers/{formData.slug}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* GALLERY PICKER MODAL */}
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

                        <div className="flex-1 overflow-y-auto p-8">
                            {galleryLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Media...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {galleryImages.map((img: any) => (
                                        <button
                                            key={img._id}
                                            type="button"
                                            onClick={() => selectImage(img.fileUrl)}
                                            className="group relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all hover:scale-[1.02] shadow-sm"
                                        >
                                            <img src={img.thumbnailUrl} alt={img.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all flex items-center justify-center">
                                                <div className="bg-white text-blue-600 p-2 rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                                                    <Plus size={20} />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
