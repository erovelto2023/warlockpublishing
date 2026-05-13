'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
    Copy, Terminal, Send, Check, AlertCircle, FileJson, 
    RefreshCw, Globe, Users, Zap, Shield, Gift, MessageSquare,
    ChevronDown, Layout, Edit
} from 'lucide-react';
import { importAdvertorials } from '@/lib/actions/advertorial';
import { repairJson } from '@/lib/utils';

const HEADLINE_FORMULAS = ['PAS (Problem-Agitate-Solution)', 'AIDA (Attention-Interest-Desire-Action)', 'How-To', 'Curiosity Gap'];

export default function UltimateAdvertorialBuilder({ affiliateOffers = [] }: { affiliateOffers?: any[] }) {
    // Scraper & Gen Inputs
    const [targetUrl, setTargetUrl] = useState('');
    const [competitorUrls, setCompetitorUrls] = useState('');
    const [audience, setAudience] = useState('');
    const [painPoint, setPainPoint] = useState('');
    const [headlineFormula, setHeadlineFormula] = useState(HEADLINE_FORMULAS[0]);
    const [isSaft, setIsSaft] = useState(false);
    const [offerDetails, setOfferDetails] = useState('');
    const [proofSources, setProofSources] = useState('');
    
    // Media Integration
    const [heroVideoUrl, setHeroVideoUrl] = useState('');
    const [vslTitle, setVslTitle] = useState('');
    const [vslVideoUrl, setVslVideoUrl] = useState('');

    // Link Integration
    const [selectedAffiliateId, setSelectedAffiliateId] = useState('');
    const [customTargetUrl, setCustomTargetUrl] = useState('');

    const [jsonInput, setJsonInput] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const selectedOffer = affiliateOffers.find(o => o._id === selectedAffiliateId);

    const copyUltimatePrompt = () => {
        const prompt = `You are an expert direct-response copywriter. Generate a high-converting advertorial following the ${headlineFormula} formula and a listicle format. 
The content must balance educational value with promotional messaging. Ensure FTC compliance by including a clear 'Advertisement' disclosure.

### INPUT DATA:
- Target Product URL: ${targetUrl}
- Competitor URLs: ${competitorUrls}
- Target Audience: ${audience}
- Primary Pain Point: ${painPoint}
- Offer & Urgency: ${offerDetails}
- Social Proof Sources: ${proofSources}
- Affiliate Product Name: ${selectedOffer?.name || 'N/A'}
- Custom Target URL: ${customTargetUrl || 'N/A'}
- Hero Video Provided: ${heroVideoUrl ? 'YES (' + heroVideoUrl + ')' : 'NO'}
- VSL Video Provided: ${vslVideoUrl ? 'YES (' + vslVideoUrl + ')' : 'NO'}
- SAFT Compliance Required: ${isSaft ? 'YES' : 'NO'}

### SYSTEM DIRECTIVE:
Generate a high-converting advertorial that bridges the gap between an advertisement and a product page. 
Use the PAS (Problem-Agitate-Solution) formula and a numbered listicle format.
If videos are provided, weave them naturally into the narrative.

### OUTPUT JSON SCHEMA:
{
  "title": "Compelling internal title",
  "slug": "url-friendly-slug",
  "category": "Niche category",
  "template": "ultimate",
  "ftc_disclosure": "Advertisement",
  "affiliateOfferId": "${selectedAffiliateId}",
  "customTargetUrl": "${customTargetUrl}",
  "heroSection": {
    "headline": "Magnetic Headline using ${headlineFormula}",
    "boldClaim": "Bold credible claim upfront",
    "imagePrompt": "Detailed AI image generation prompt for hero section",
    "videoUrl": "${heroVideoUrl}"
  },
  "vsl": {
    "title": "${vslTitle || 'Watch This Before You Buy'}",
    "videoUrl": "${vslVideoUrl}",
    "description": "Short compelling reason to watch"
  },
  "listicleItems": [
    { "subheading": "Benefit-focused statement 1", "content": "Educational narrative leading to product" },
    { "subheading": "Benefit-focused statement 2", "content": "..." }
  ],
  "comparisonData": {
    "title": "How We Outperform The Rest",
    "features": [
      { "name": "Feature Name", "ourValue": "Our Benefit", "competitorValue": "Their Weakness", "isBetter": true }
    ]
  },
  "socialProof": [
    { "quote": "Real-sounding testimonial", "author": "Name/Initials", "source": "Amazon/Trustpilot" }
  ],
  "conversionClose": {
    "ctaText": "Primary CTA button text",
    "urgencyText": "Countdown/Limited time text",
    "guaranteeText": "Risk-free guarantee text"
  },
  "scraperInputs": {
    "targetUrl": "${targetUrl}",
    "competitorUrls": [${competitorUrls.split(',').map(u => `"${u.trim()}"`).join(', ')}],
    "targetAudience": "${audience}",
    "painPoint": "${painPoint}",
    "headlineFormula": "${headlineFormula}",
    "saftCompliance": ${isSaft}
  }
}

### TONE:
Educational, authoritative, peer-to-peer. Focus on the Narrative Arc from Pain Point to Lifestyle Improvement.`;

        navigator.clipboard.writeText(prompt);
        setStatus({ type: 'success', message: 'Ultimate Framework Prompt copied!' });
    };

    const handleImport = async () => {
        if (!jsonInput.trim()) return;
        setIsImporting(true);
        try {
            const repaired = repairJson(jsonInput);
            const data = JSON.parse(repaired);
            const result = await importAdvertorials(Array.isArray(data) ? data : [data]);
            
            if (result.success) {
                setStatus({ type: 'success', message: `Successfully imported the Ultimate Advertorial!` });
                setJsonInput('');
            } else {
                setStatus({ type: 'error', message: result.message || 'Import failed' });
            }
        } catch (e: any) {
            setStatus({ type: 'error', message: 'Invalid JSON format: ' + e.message });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="space-y-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl">
            <header className="bg-slate-900 text-white p-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                        <Zap size={24} className="text-white fill-current" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Ultimate Advertorial Framework</h2>
                </div>
                <p className="text-slate-400 text-sm font-medium italic">Bridge the gap between curiosity and conversion.</p>
            </header>

            <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Form */}
                    <div className="space-y-8">
                        {/* LINK & VIDEO INTEGRATION SECTION */}
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                <Shield size={14} /> Conversion Assets (Links & Video)
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Affiliate Offer</label>
                                        <div className="relative">
                                            <select 
                                                className="w-full h-10 px-3 bg-white border border-indigo-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                                                value={selectedAffiliateId}
                                                onChange={e => setSelectedAffiliateId(e.target.value)}
                                            >
                                                <option value="">-- Optional Affiliate Link --</option>
                                                {affiliateOffers.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400" size={14} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Custom Button URL</label>
                                        <Input 
                                            className="border-indigo-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                            value={customTargetUrl} 
                                            onChange={e => setCustomTargetUrl(e.target.value)} 
                                            placeholder="Overrides affiliate link"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Hero Video URL</label>
                                        <Input 
                                            className="border-indigo-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                            value={heroVideoUrl} 
                                            onChange={e => setHeroVideoUrl(e.target.value)} 
                                            placeholder="YouTube/Vimeo/Direct Link"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">VSL Section Video URL</label>
                                        <Input 
                                            className="border-indigo-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                            value={vslVideoUrl} 
                                            onChange={e => setVslVideoUrl(e.target.value)} 
                                            placeholder="Dedicated VSL Video"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    <Globe size={14} /> Target Product URL
                                </label>
                                <Input 
                                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                    value={targetUrl} 
                                    onChange={e => setTargetUrl(e.target.value)} 
                                    placeholder="https://your-product.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    <Globe size={14} /> Competitor URLs
                                </label>
                                <Input 
                                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                    value={competitorUrls} 
                                    onChange={e => setCompetitorUrls(e.target.value)} 
                                    placeholder="Comma separated URLs"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    <Users size={14} /> Target Audience
                                </label>
                                <Input 
                                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                    value={audience} 
                                    onChange={e => setAudience(e.target.value)} 
                                    placeholder="e.g., Busy moms, SaaS founders"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    <Zap size={14} /> Core Pain Point
                                </label>
                                <Input 
                                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                    value={painPoint} 
                                    onChange={e => setPainPoint(e.target.value)} 
                                    placeholder="What is the frustration?"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    <Layout size={14} /> Headline Formula
                                </label>
                                <div className="relative">
                                    <select 
                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                                        value={headlineFormula}
                                        onChange={e => setHeadlineFormula(e.target.value)}
                                    >
                                        {HEADLINE_FORMULAS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={14} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    <Shield size={14} /> SAFT Compliance
                                </label>
                                <div className="flex items-center gap-3 h-10 px-3 border border-slate-200 rounded-md">
                                    <input 
                                        type="checkbox" 
                                        checked={isSaft} 
                                        onChange={e => setIsSaft(e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-xs font-bold text-slate-600">Sensitive Category (Meta/Google)</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                <Gift size={14} /> Offer & Urgency
                            </label>
                            <Input 
                                className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                value={offerDetails} 
                                onChange={e => setOfferDetails(e.target.value)} 
                                placeholder="e.g., 20% off, BOGO, ends in 24h"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                <MessageSquare size={14} /> Social Proof Sources
                            </label>
                            <Input 
                                className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                value={proofSources} 
                                onChange={e => setProofSources(e.target.value)} 
                                placeholder="URLs to Trustpilot, Amazon, etc."
                            />
                        </div>

                        <Button 
                            onClick={copyUltimatePrompt} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 rounded-xl shadow-lg shadow-indigo-200 transition-all gap-3 uppercase tracking-wider"
                        >
                            <Copy size={20} /> Generate Framework Prompt
                        </Button>
                    </div>

                    {/* Right Column: Ingestion */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 h-full flex flex-col">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <FileJson size={14} /> Framework Data Ingestion
                            </h3>
                            <Textarea 
                                value={jsonInput} 
                                onChange={e => setJsonInput(e.target.value)} 
                                placeholder="Paste the generated JSON here..."
                                className="flex-grow min-h-[400px] font-mono text-xs rounded-xl border-slate-200 focus:border-indigo-500 bg-white shadow-inner p-4"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <Button 
                                    onClick={handleImport} 
                                    disabled={isImporting || !jsonInput} 
                                    className="w-full bg-slate-900 hover:bg-black text-white font-black h-14 rounded-xl transition-all gap-3 uppercase tracking-wider text-xs"
                                >
                                    {isImporting ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
                                    Direct Build
                                </Button>
                                <Button 
                                    onClick={async () => {
                                        if (!jsonInput.trim()) return;
                                        try {
                                            const repaired = repairJson(jsonInput);
                                            const data = JSON.parse(repaired);
                                            sessionStorage.setItem('staged_advertorial', JSON.stringify(Array.isArray(data) ? data[0] : data));
                                            window.location.href = '/admin/articles/new?staged=true';
                                        } catch (e) {
                                            alert('Invalid JSON format');
                                        }
                                    }} 
                                    disabled={isImporting || !jsonInput} 
                                    className="w-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-black h-14 rounded-xl transition-all gap-3 uppercase tracking-wider text-xs"
                                >
                                    <Edit size={20} /> Open in Editor
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {status.type && (
                    <div className={`mt-8 p-4 rounded-xl border-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                        {status.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-black uppercase tracking-wider">{status.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
