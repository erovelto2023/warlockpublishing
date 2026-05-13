'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
    Copy, Terminal, Send, Check, AlertCircle, FileJson, 
    RefreshCw, Globe, Users, Zap, Shield, Gift, MessageSquare,
    ChevronDown, Layout, Edit, Target
} from 'lucide-react';
import { importAdvertorials } from '@/lib/actions/advertorial';
import { repairJson } from '@/lib/utils';

const HEADLINE_FORMULAS = ['PAS (Problem-Agitate-Solution)', 'AIDA (Attention-Interest-Desire-Action)', 'How-To', 'Curiosity Gap'];

export default function UltimateAdvertorialBuilder({ affiliateOffers = [], onStage }: { affiliateOffers?: any[], onStage?: (data: any) => void }) {
    // Scraper & Gen Inputs
    const [targetUrl, setTargetUrl] = useState('');
    const [competitorUrls, setCompetitorUrls] = useState('');
    const [audience, setAudience] = useState('');
    const [painPoint, setPainPoint] = useState('');
    const [headlineFormula, setHeadlineFormula] = useState(HEADLINE_FORMULAS[0]);
    const [isSaft, setIsSaft] = useState(false);
    const [category, setCategory] = useState('Marketing');
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
        const prompt = `You are a world-class Direct Response Copywriter, Conversion Rate Optimization (CRO) Expert, and Psychological Narrative Architect. 
Your goal is to engineer a high-conversion advertorial for "${selectedOffer?.name || targetUrl}" following the ${headlineFormula} formula and the "Discovery-Discovery-Solution" narrative arc.

### INPUT DATA:
- Primary Product: ${selectedOffer?.name || 'N/A'}
- Target URL: ${targetUrl}
- The Barrier (Friction): ${painPoint}
- The Hook (Saving/Hack): ${offerDetails}
- Target Audience: ${audience}
- Competitor Context: ${competitorUrls}
- Social Proof Context: ${proofSources}
- Hero Video: ${heroVideoUrl || 'N/A'}
- VSL Video: ${vslVideoUrl || 'N/A'}

### SYSTEM DIRECTIVES:
1. **Psychological Anchoring**: Start with a "Friction Reveal" that validates the audience's current frustration. 
2. **The "Epiphany" Moment**: Transition to an "Editorial Pivot" where a new, better way (the hack) is discovered.
3. **High-Fidelity Social Proof**: Generate realistic-sounding testimonials and comments with names and time-stamps.
4. **Interactive Ratings**: Assign credible ratings (95-99%) for Ease of Use, Specifications, and Value for Money.
5. **SAFT Compliance**: ${isSaft ? "Ensure the tone is strictly informative/educational to bypass platform sensitivity filters." : "Use aggressive, benefit-driven language."}

### OUTPUT JSON SCHEMA (STRICT):
{
  "title": "A compelling, clickable internal title (01 Core Architecture)",
  "slug": "url-friendly-slug",
  "category": "${category || 'Gadget Discovery'}",
  "template": "discovery",
  "ftcDisclosure": "This is an advertisement and not a news article",
  "affiliateOfferId": "${selectedAffiliateId}",
  "customTargetUrl": "${customTargetUrl}",
  "narrative": {
    "frictionReveal": "Powerful 2-3 paragraph section (02 Narrative Arc) agitating the core pain point.",
    "editorialPivot": "1-2 paragraph transition positioning the discovery as the unique solution."
  },
  "valueReinforcement": {
    "priceAnchoring": "Comparative value narrative (03 Value & Proof).",
    "steps": [
      { "title": "Step 1 Title", "description": "Step 1 Description" },
      { "title": "Step 2 Title", "description": "Step 2 Description" }
    ]
  },
  "discovery": {
    "author": {
      "name": "Generated Persona (e.g. Mark Holler)",
      "date": "Oct 19",
      "readTime": "6 minute read",
      "avatarUrl": ""
    },
    "ratings": {
      "overall": "4.9/5",
      "breakdown": [
        { "label": "Ease Of Use", "value": 99 },
        { "label": "Specifications", "value": 97 },
        { "label": "Value For Money", "value": 98 }
      ]
    },
    "comments": [
      { "name": "Sarah M.", "time": "2 hours ago", "text": "Stunningly realistic positive comment." },
      { "name": "David K.", "time": "5 hours ago", "text": "Detailed review about the shipping or results." }
    ]
  },
  "heroSection": {
    "headline": "Magnetic headline (04 Ultimate Framework) using ${headlineFormula}",
    "boldClaim": "Bold, credible claim in quotes",
    "imageUrl": "Recommended AI Image Generation Prompt",
    "videoUrl": "${heroVideoUrl}"
  },
  "vsl": {
    "title": "Watch the Full Discovery Video",
    "videoUrl": "${vslVideoUrl}",
    "description": "Why this video is going viral right now."
  },
  "listicleItems": [
    { "subheading": "1. Silence the 'Always-On' Mental Noise", "content": "Detailed educational paragraph." },
    { "subheading": "2. Transport Yourself...", "content": "Detailed educational paragraph." }
  ],
  "comparisonData": {
    "title": "Why Enthusiasts Prefer ${selectedOffer?.name || 'This Product'}",
    "features": [
      { "name": "Feature X", "ourValue": "Superior", "competitorValue": "Inferior", "isBetter": true }
    ]
  },
  "socialProof": [
    { "quote": "Major quote...", "author": "R.S.", "source": "Verified Purchase" }
  ],
  "conversionClose": {
    "ctaText": "Claim Your Copy Now",
    "urgencyText": "Special offer ends today",
    "guaranteeText": "100% Satisfaction Guarantee"
  }
}

### TONE: 
Insightful, authoritative, investigative, and peer-to-peer. Avoid generic sales speak. Focus on "The Reveal."`;

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
                                    <Target size={14} /> Niche Category
                                </label>
                                <Input 
                                    className="border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all" 
                                    value={category} 
                                    onChange={e => setCategory(e.target.value)} 
                                    placeholder="e.g., Tech Deals, Health"
                                />
                            </div>
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
                                            const stagedData = Array.isArray(data) ? data[0] : data;
                                            
                                            if (onStage) {
                                                onStage(stagedData);
                                            } else {
                                                sessionStorage.setItem('staged_advertorial', JSON.stringify(stagedData));
                                                window.location.href = '/admin/articles/new?staged=true';
                                            }
                                        } catch (e) {
                                            alert('Invalid JSON format');
                                        }
                                    }} 
                                    disabled={isImporting || !jsonInput} 
                                    className="w-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-black h-14 rounded-xl transition-all gap-3 uppercase tracking-wider text-xs"
                                >
                                    <Edit size={20} /> Stage to Editor
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
