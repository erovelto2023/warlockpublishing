'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Save, ArrowLeft, Plus, Trash2, 
    Link as LinkIcon, AlertCircle, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateAdvertorial } from '@/lib/actions/advertorial';

interface AdvertorialEditorProps {
    advertorial: any;
    affiliateOffers: any[];
}

export default function AdvertorialEditor({ advertorial, affiliateOffers }: AdvertorialEditorProps) {
    const [formData, setFormData] = useState(advertorial);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const router = useRouter();

    const handleChange = (path: string, value: any) => {
        const newData = { ...formData };
        const parts = path.split('.');
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setFormData(newData);
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

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Edit Advertorial</h1>
                        <p className="text-xs text-slate-500 font-mono">ID: {advertorial._id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 gap-2 shadow-lg shadow-indigo-600/20"
                    >
                        {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                    </Button>
                </div>
            </header>

            {status.type && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                    {status.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-bold">{status.message}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <Card className="p-8 border-slate-200">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                            Core Architecture
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Main Title</label>
                                <Input value={formData.title} onChange={e => handleChange('title', e.target.value)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Slug</label>
                                    <Input value={formData.slug} onChange={e => handleChange('slug', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
                                    <Input value={formData.category} onChange={e => handleChange('category', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Narrative Arc */}
                    <Card className="p-8 border-slate-200">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="w-2 h-6 bg-rose-600 rounded-full"></div>
                            Friction-to-Flow Narrative
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Friction Reveal (The Problem)</label>
                                <Textarea 
                                    className="min-h-[120px]" 
                                    value={formData.narrative.frictionReveal} 
                                    onChange={e => handleChange('narrative.frictionReveal', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Editorial Pivot (The Bridge)</label>
                                <Textarea 
                                    className="min-h-[120px]" 
                                    value={formData.narrative.editorialPivot} 
                                    onChange={e => handleChange('narrative.editorialPivot', e.target.value)} 
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Value Reinforcement */}
                    <Card className="p-8 border-slate-200">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                            Value & Proof
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Price Anchoring Text</label>
                                <Textarea value={formData.valueReinforcement.priceAnchoring} onChange={e => handleChange('valueReinforcement.priceAnchoring', e.target.value)} />
                            </div>
                            
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Step-by-Step Instructions</label>
                                {formData.valueReinforcement.steps.map((step: any, i: number) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-3 relative group">
                                        <Input 
                                            placeholder="Step Title" 
                                            className="font-bold bg-white" 
                                            value={step.title} 
                                            onChange={e => {
                                                const steps = [...formData.valueReinforcement.steps];
                                                steps[i].title = e.target.value;
                                                handleChange('valueReinforcement.steps', steps);
                                            }}
                                        />
                                        <Textarea 
                                            placeholder="Step Description" 
                                            className="bg-white text-sm" 
                                            value={step.description}
                                            onChange={e => {
                                                const steps = [...formData.valueReinforcement.steps];
                                                steps[i].description = e.target.value;
                                                handleChange('valueReinforcement.steps', steps);
                                            }}
                                        />
                                        <button 
                                            onClick={() => {
                                                const steps = formData.valueReinforcement.steps.filter((_: any, idx: number) => idx !== i);
                                                handleChange('valueReinforcement.steps', steps);
                                            }}
                                            className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="w-full border-dashed" 
                                    onClick={() => {
                                        handleChange('valueReinforcement.steps', [...formData.valueReinforcement.steps, { title: '', description: '' }]);
                                    }}
                                >
                                    <Plus size={16} className="mr-2" /> Add Step
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Affiliate Settings */}
                    <Card className="p-8 border-slate-200">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <LinkIcon size={20} className="text-indigo-600" /> Affiliate Hub
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Link from Catalog</label>
                                <select 
                                    className="w-full h-11 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.affiliateOfferId || ''}
                                    onChange={e => handleChange('affiliateOfferId', e.target.value || null)}
                                >
                                    <option value="">-- Select Affiliate Offer --</option>
                                    {affiliateOffers.map(offer => (
                                        <option key={offer._id} value={offer._id}>{offer.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100"></span>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 bg-white px-2">OR</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Custom Destination URL</label>
                                <Input 
                                    value={formData.customTargetUrl || ''} 
                                    onChange={e => handleChange('customTargetUrl', e.target.value)} 
                                    placeholder="https://..." 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Summary Box CTA Text</label>
                                <Input value={formData.summaryBox.ctaText} onChange={e => handleChange('summaryBox.ctaText', e.target.value)} />
                            </div>
                        </div>
                    </Card>

                    {/* Scarcity Settings */}
                    <Card className="p-8 border-slate-200">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Target size={20} className="text-rose-600" /> Urgency Signal
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Signal Type</label>
                                <select 
                                    className="w-full h-11 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    value={formData.scarcity?.type || 'none'}
                                    onChange={e => handleChange('scarcity.type', e.target.value)}
                                >
                                    <option value="none">No Urgency</option>
                                    <option value="timer">Timer (Expires Soon)</option>
                                    <option value="slots">Slots (Limited Availability)</option>
                                </select>
                            </div>
                            {formData.scarcity?.type !== 'none' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Signal Value</label>
                                    <Input 
                                        value={formData.scarcity?.value || ''} 
                                        onChange={e => handleChange('scarcity.value', e.target.value)} 
                                        placeholder={formData.scarcity?.type === 'timer' ? 'e.g., 14:00' : 'e.g., Only 12 spots remaining'} 
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Layout Template */}
                    <Card className="p-8 border-slate-200">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Layout size={20} className="text-indigo-600" /> Page Layout
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'standard', label: 'The Bridge', icon: '🌉' },
                                { id: 'listicle', label: 'The Listicle', icon: '📝' },
                                { id: 'comparison', label: 'The Matrix', icon: '🆚' },
                                { id: 'minimalist', label: 'The Pure', icon: '✨' }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => handleChange('template', t.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-center space-y-2 ${formData.template === t.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                >
                                    <div className="text-2xl">{t.icon}</div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${formData.template === t.id ? 'text-indigo-700' : 'text-slate-400'}`}>
                                        {t.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Status */}
                    <Card className="p-8 border-slate-200">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Published Status</label>
                            <button 
                                onClick={() => handleChange('isPublished', !formData.isPublished)}
                                className={`w-14 h-7 rounded-full p-1 transition-all ${formData.isPublished ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full transition-all ${formData.isPublished ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
