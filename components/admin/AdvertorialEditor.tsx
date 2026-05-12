'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Save, ArrowLeft, Plus, Trash2, 
    Link as LinkIcon, AlertCircle, Check, Target, Layout
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateAdvertorial } from '@/lib/actions/advertorial';

interface AdvertorialEditorProps {
    advertorial: any;
    affiliateOffers: any[];
}

export default function AdvertorialEditor({ advertorial, affiliateOffers }: AdvertorialEditorProps) {
    // Ensure all possible fields have safe defaults to prevent crashes
    const safeAdvertorial = {
        title: '',
        slug: '',
        category: 'General',
        template: 'industrial',
        summaryBox: { title: '', bulletPoints: [], ctaText: '', targetUrl: '' },
        narrative: { frictionReveal: '', editorialPivot: '' },
        valueReinforcement: { priceAnchoring: '', steps: [] },
        comparisonTable: { headers: [], rows: [] },
        faq: [],
        heroSection: { headline: '', boldClaim: '', imageUrl: '', videoUrl: '' },
        listicleItems: [],
        comparisonData: { title: '', features: [] },
        socialProof: [],
        conversionClose: { ctaText: '', urgencyText: '', guaranteeText: '' },
        ...advertorial
    };

    const [formData, setFormData] = useState(safeAdvertorial);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const router = useRouter();

    const handleChange = (path: string, value: any) => {
        setFormData((prev: any) => {
            const newData = { ...prev };
            const parts = path.split('.');
            let current: any = newData;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {};
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            return newData;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStatus({ type: null, message: '' });
        try {
            const res = await updateAdvertorial(advertorial._id, formData);
            if (res) {
                setStatus({ type: 'success', message: 'Advertorial updated successfully!' });
                router.refresh();
            }
        } catch (e: any) {
            setStatus({ type: 'error', message: 'Failed to save: ' + e.message });
        } finally {
            setIsSaving(false);
        }
    };

    // Shared input styles to ensure black text on white background
    const inputStyles = "rounded-none border-slate-200 bg-white text-black focus:border-black focus:ring-0 placeholder:text-slate-300";

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 bg-white text-black min-h-screen p-8">
            <header className="flex justify-between items-center bg-white py-4 border-b border-black sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-100 text-black">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-widest text-black">Edit Advertorial</h1>
                        <p className="text-[10px] text-slate-400 font-mono">{advertorial._id}</p>
                    </div>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-black hover:bg-slate-800 text-white font-bold h-10 px-8 rounded-none"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </header>

            {status.type && (
                <div className={`p-4 border-2 flex items-center gap-3 ${status.type === 'success' ? 'bg-white border-black text-black' : 'bg-white border-red-600 text-red-600'}`}>
                    {status.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-bold uppercase tracking-widest">{status.message}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Core Architecture */}
                    <section className="space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] border-b border-slate-100 pb-2 text-black">01 Core Architecture</h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Main Title</label>
                                <Input className={inputStyles} value={formData.title} onChange={e => handleChange('title', e.target.value)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Slug</label>
                                    <Input className={inputStyles} value={formData.slug} onChange={e => handleChange('slug', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                                    <Input className={inputStyles} value={formData.category} onChange={e => handleChange('category', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Narrative Arc */}
                    <section className="space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] border-b border-slate-100 pb-2 text-black">02 Narrative Arc</h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Friction Reveal</label>
                                <Textarea className={`${inputStyles} min-h-[120px]`} value={formData.narrative.frictionReveal} onChange={e => handleChange('narrative.frictionReveal', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Editorial Pivot</label>
                                <Textarea className={`${inputStyles} min-h-[120px]`} value={formData.narrative.editorialPivot} onChange={e => handleChange('narrative.editorialPivot', e.target.value)} />
                            </div>
                        </div>
                    </section>

                    {/* Value & Proof */}
                    <section className="space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] border-b border-slate-100 pb-2 text-black">03 Value & Proof</h2>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Price Anchoring</label>
                                <Textarea className={inputStyles} value={formData.valueReinforcement.priceAnchoring} onChange={e => handleChange('valueReinforcement.priceAnchoring', e.target.value)} />
                            </div>
                            
                            <div className="space-y-4">
                                {formData.valueReinforcement.steps.map((step: any, i: number) => (
                                    <div key={i} className="p-6 border border-slate-100 space-y-4 relative group bg-white">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-300">Step {i + 1}</span>
                                            <button onClick={() => {
                                                const steps = formData.valueReinforcement.steps.filter((_: any, idx: number) => idx !== i);
                                                handleChange('valueReinforcement.steps', steps);
                                            }} className="text-slate-300 hover:text-black"><Trash2 size={14} /></button>
                                        </div>
                                        <Input className={inputStyles} value={step.title} onChange={e => {
                                            const steps = [...formData.valueReinforcement.steps];
                                            steps[i].title = e.target.value;
                                            handleChange('valueReinforcement.steps', steps);
                                        }} />
                                        <Textarea className={inputStyles} value={step.description} onChange={e => {
                                            const steps = [...formData.valueReinforcement.steps];
                                            steps[i].description = e.target.value;
                                            handleChange('valueReinforcement.steps', steps);
                                        }} />
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full rounded-none border-dashed border-slate-200 text-slate-400 hover:text-black hover:border-black bg-white" onClick={() => handleChange('valueReinforcement.steps', [...formData.valueReinforcement.steps, { title: '', description: '' }])}>
                                    + Add Step
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Ultimate Framework (Hero, VSL, Listicle) */}
                    <section className="space-y-8 pt-8 border-t-2 border-slate-100">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600">04 Ultimate Framework</h2>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded">High Conversion</span>
                        </div>

                        {/* Hero Section */}
                        <div className="space-y-4 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero & Media</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Hero Headline</label>
                                    <Input className={inputStyles} value={formData.heroSection.headline} onChange={e => handleChange('heroSection.headline', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Bold Claim</label>
                                    <Input className={inputStyles} value={formData.heroSection.boldClaim} onChange={e => handleChange('heroSection.boldClaim', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Hero Image URL</label>
                                    <Input className={inputStyles} value={formData.heroSection.imageUrl} onChange={e => handleChange('heroSection.imageUrl', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Hero Video URL</label>
                                    <Input className={inputStyles} value={formData.heroSection.videoUrl} onChange={e => handleChange('heroSection.videoUrl', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* VSL Section */}
                        <div className="space-y-4 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video Sales Letter (VSL)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">VSL Title</label>
                                    <Input className={inputStyles} value={formData.vsl?.title} onChange={e => handleChange('vsl.title', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">VSL Video URL</label>
                                    <Input className={inputStyles} value={formData.vsl?.videoUrl} onChange={e => handleChange('vsl.videoUrl', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">VSL Description</label>
                                <Textarea className={inputStyles} value={formData.vsl?.description} onChange={e => handleChange('vsl.description', e.target.value)} />
                            </div>
                        </div>

                        {/* Listicle Items */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Narrative Listicle Items</h3>
                            <div className="space-y-4">
                                {formData.listicleItems?.map((item: any, i: number) => (
                                    <div key={i} className="p-6 border border-slate-200 space-y-4 bg-white shadow-sm rounded-xl">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Item #{i + 1}</span>
                                            <button onClick={() => {
                                                const items = formData.listicleItems.filter((_: any, idx: number) => idx !== i);
                                                handleChange('listicleItems', items);
                                            }} className="text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                        <Input className={inputStyles} placeholder="Subheading" value={item.subheading} onChange={e => {
                                            const items = [...formData.listicleItems];
                                            items[i].subheading = e.target.value;
                                            handleChange('listicleItems', items);
                                        }} />
                                        <Textarea className={`${inputStyles} min-h-[100px]`} placeholder="Content" value={item.content} onChange={e => {
                                            const items = [...formData.listicleItems];
                                            items[i].content = e.target.value;
                                            handleChange('listicleItems', items);
                                        }} />
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full h-12 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 font-bold" onClick={() => handleChange('listicleItems', [...(formData.listicleItems || []), { subheading: '', content: '' }])}>
                                    <Plus size={16} className="mr-2" /> Add Listicle Narrative Block
                                </Button>
                            </div>
                        </div>

                        {/* Comparison Engine */}
                        <div className="space-y-6 bg-indigo-50/30 p-6 rounded-2xl border border-indigo-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Comparison Engine</h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-indigo-600">Comparison Title</label>
                                    <Input className={inputStyles} value={formData.comparisonData?.title} onChange={e => handleChange('comparisonData.title', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    {formData.comparisonData?.features?.map((f: any, i: number) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end bg-white p-3 rounded-lg border border-indigo-100">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black uppercase text-slate-400">Feature</label>
                                                <Input className="h-8 text-xs px-2" value={f.name} onChange={e => {
                                                    const features = [...formData.comparisonData.features];
                                                    features[i].name = e.target.value;
                                                    handleChange('comparisonData.features', features);
                                                }} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black uppercase text-slate-400">Our Value</label>
                                                <Input className="h-8 text-xs px-2 border-indigo-200" value={f.ourValue} onChange={e => {
                                                    const features = [...formData.comparisonData.features];
                                                    features[i].ourValue = e.target.value;
                                                    handleChange('comparisonData.features', features);
                                                }} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black uppercase text-slate-400">Competitor</label>
                                                <Input className="h-8 text-xs px-2" value={f.competitorValue} onChange={e => {
                                                    const features = [...formData.comparisonData.features];
                                                    features[i].competitorValue = e.target.value;
                                                    handleChange('comparisonData.features', features);
                                                }} />
                                            </div>
                                            <button onClick={() => {
                                                const features = formData.comparisonData.features.filter((_: any, idx: number) => idx !== i);
                                                handleChange('comparisonData.features', features);
                                            }} className="h-8 text-slate-300 hover:text-red-600 flex items-center justify-center"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full h-8 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-100" onClick={() => handleChange('comparisonData.features', [...(formData.comparisonData?.features || []), { name: '', ourValue: '', competitorValue: '', isBetter: true }])}>
                                        + Add Comparison Row
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Social Proof (Testimonials)</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {formData.socialProof?.map((proof: any, i: number) => (
                                    <div key={i} className="p-4 border border-slate-100 bg-white rounded-xl space-y-3 relative group">
                                        <button onClick={() => {
                                            const proofs = formData.socialProof.filter((_: any, idx: number) => idx !== i);
                                            handleChange('socialProof', proofs);
                                        }} className="absolute top-2 right-2 text-slate-200 group-hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                        <Textarea className="text-xs h-20" placeholder="Quote" value={proof.quote} onChange={e => {
                                            const proofs = [...formData.socialProof];
                                            proofs[i].quote = e.target.value;
                                            handleChange('socialProof', proofs);
                                        }} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input className="h-8 text-xs" placeholder="Author" value={proof.author} onChange={e => {
                                                const proofs = [...formData.socialProof];
                                                proofs[i].author = e.target.value;
                                                handleChange('socialProof', proofs);
                                            }} />
                                            <Input className="h-8 text-xs" placeholder="Source" value={proof.source} onChange={e => {
                                                const proofs = [...formData.socialProof];
                                                proofs[i].source = e.target.value;
                                                handleChange('socialProof', proofs);
                                            }} />
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="h-full min-h-[120px] border-dashed border-slate-200 text-slate-300 hover:text-black hover:border-black font-bold uppercase text-[10px]" onClick={() => handleChange('socialProof', [...(formData.socialProof || []), { quote: '', author: '', source: '' }])}>
                                    + Add Testimonial
                                </Button>
                            </div>
                        </div>

                        {/* Conversion Close */}
                        <div className="bg-slate-900 p-6 rounded-2xl space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Conversion Close (Direct Response)</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase text-slate-500">CTA Text</label>
                                    <Input className="bg-slate-800 border-slate-700 text-white h-9" value={formData.conversionClose?.ctaText} onChange={e => handleChange('conversionClose.ctaText', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase text-slate-500">Urgency Text</label>
                                    <Input className="bg-slate-800 border-slate-700 text-white h-9" value={formData.conversionClose?.urgencyText} onChange={e => handleChange('conversionClose.urgencyText', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase text-slate-500">Guarantee Text</label>
                                    <Input className="bg-slate-800 border-slate-700 text-white h-9" value={formData.conversionClose?.guaranteeText} onChange={e => handleChange('conversionClose.guaranteeText', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-12">
                    {/* Design System */}
                    <section className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Design System</h2>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400">Layout Template</label>
                            <select 
                                className="w-full h-10 border border-slate-200 bg-white text-black px-3 text-sm focus:border-black outline-none" 
                                value={formData.template || 'industrial'} 
                                onChange={e => handleChange('template', e.target.value)}
                            >
                                <option value="industrial" className="bg-white text-black">Industrial (White & Bold)</option>
                                <option value="minimalist" className="bg-white text-black">Minimalist (Clean & Spaced)</option>
                                <option value="magazine" className="bg-white text-black">Magazine (Serif & Multi-column)</option>
                            </select>
                        </div>
                    </section>

                    {/* Affiliate Hub */}
                    <section className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Affiliate Settings</h2>
                        <select 
                            className="w-full h-10 border border-slate-200 bg-white text-black px-3 text-sm focus:border-black outline-none" 
                            value={formData.affiliateOfferId || ''} 
                            onChange={e => handleChange('affiliateOfferId', e.target.value || null)}
                        >
                            <option value="" className="bg-white text-black">-- Catalog Offer --</option>
                            {affiliateOffers.map(offer => (
                                <option key={offer._id} value={offer._id} className="bg-white text-black">{offer.name || offer.title}</option>
                            ))}
                        </select>
                        <Input className={inputStyles} value={formData.customTargetUrl || ''} onChange={e => handleChange('customTargetUrl', e.target.value)} placeholder="Custom Link URL" />
                        <Input className={inputStyles} value={formData.summaryBox.ctaText} onChange={e => handleChange('summaryBox.ctaText', e.target.value)} placeholder="CTA Button Text" />
                    </section>

                    {/* Urgency */}
                    <section className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Urgency Signal</h2>
                        <select 
                            className="w-full h-10 border border-slate-200 bg-white text-black px-3 text-sm focus:border-black outline-none" 
                            value={formData.scarcity?.type || 'none'} 
                            onChange={e => handleChange('scarcity.type', e.target.value)}
                        >
                            <option value="none" className="bg-white text-black">No Urgency</option>
                            <option value="timer" className="bg-white text-black">Timer</option>
                            <option value="slots" className="bg-white text-black">Slots</option>
                        </select>
                        {formData.scarcity?.type !== 'none' && (
                            <Input className={inputStyles} value={formData.scarcity?.value || ''} onChange={e => handleChange('scarcity.value', e.target.value)} placeholder="Signal Value" />
                        )}
                    </section>

                    {/* Status */}
                    <section className="pt-8 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Published</span>
                        <button onClick={() => handleChange('isPublished', !formData.isPublished)} className={`w-12 h-6 rounded-full transition-colors ${formData.isPublished ? 'bg-black' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isPublished ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
