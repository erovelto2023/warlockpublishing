'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Save, ArrowLeft, Plus, Trash2, 
    Link as LinkIcon, AlertCircle, Check, Target, Layout,
    Share2, HelpCircle, Terminal, Sparkles, Edit, Eye, Smartphone, Zap, Shield, MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateAdvertorial, createAdvertorial, importAdvertorialFromGroove } from '@/lib/actions/advertorial';
import UltimateAdvertorialBuilder from './UltimateAdvertorialBuilder';

interface AdvertorialEditorProps {
    advertorial: any;
    affiliateOffers: any[];
}

export default function AdvertorialEditor({ advertorial, affiliateOffers }: AdvertorialEditorProps) {
    const isNew = !advertorial || !advertorial._id;
    const router = useRouter();

    // The Golden Schema: 100% Alignment with User's Request
    const safeAdvertorial = {
        title: '',
        slug: '',
        category: 'General',
        template: 'discovery',
        isPublished: false,
        ftcDisclosure: 'This is an advertisement and not a news article',
        narrative: { frictionReveal: '', editorialPivot: '' },
        valueReinforcement: { priceAnchoring: '', steps: [] },
        discovery: {
            author: { name: 'Mark Holler', date: 'Oct 19', readTime: '6 min read', avatarUrl: '' },
            ratings: { overall: '4.9/5', breakdown: [{ label: 'Ease Of Use', value: 99 }, { label: 'Specifications', value: 97 }, { label: 'Value For Money', value: 99 }] },
            comments: [],
            painPoints: { title: 'Pain Points', items: [] }
        },
        heroSection: { headline: '', boldClaim: '', imageUrl: '', videoUrl: '' },
        vsl: { title: '', videoUrl: '', description: '' },
        listicleItems: [],
        comparisonData: { title: 'Why Art Therapy Enthusiasts Prefer Country Dreams', features: [] },
        socialProof: [],
        conversionClose: { ctaText: 'Claim Your Copy Today', urgencyText: '', guaranteeText: '' },
        summaryBox: { title: '', benefits: [], ctaText: 'Order Now', targetUrl: '' },
        scarcity: { type: 'none', value: '' },
        customTargetUrl: '',
        ...advertorial,
        affiliateOfferId: advertorial?.affiliateOfferId?._id || advertorial?.affiliateOfferId || '',
    };

    const [formData, setFormData] = useState(safeAdvertorial);
    const [isSaving, setIsSaving] = useState(false);
    const [showBuilder, setShowBuilder] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    // Handle staged data from Importer/Builder
    useEffect(() => {
        if (isNew && typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('staged')) {
                const staged = sessionStorage.getItem('staged_advertorial');
                if (staged) {
                    try {
                        const parsed = JSON.parse(staged);
                        setFormData((prev: any) => ({ ...prev, ...parsed }));
                        sessionStorage.removeItem('staged_advertorial');
                    } catch (e) {
                        console.error('Failed to parse staged data');
                    }
                }
            }
        }
    }, [isNew]);

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
            let res;
            if (isNew) {
                res = await createAdvertorial(formData);
            } else {
                res = await updateAdvertorial(advertorial._id, formData);
            }
            if (res) {
                setStatus({ type: 'success', message: isNew ? 'Advertorial created successfully!' : 'Advertorial updated successfully!' });
                if (isNew) {
                    router.push(`/admin`); 
                    router.refresh();
                } else {
                    router.refresh();
                }
            }
        } catch (e: any) {
            setStatus({ type: 'error', message: 'Failed to save: ' + e.message });
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyles = "w-full rounded-none border-slate-200 bg-white text-black text-sm focus:border-black focus:ring-0 placeholder:text-slate-300 p-3";
    const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block";
    const sectionTitleStyles = "text-lg font-black text-black uppercase tracking-tight flex items-center gap-3 border-b-2 border-black pb-2 mb-6";

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-40 bg-white text-black min-h-screen p-8">
            <header className="flex justify-between items-center bg-white py-4 border-b-4 border-black sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="hover:bg-slate-100 text-black font-bold uppercase text-[10px] tracking-widest">
                        <ArrowLeft size={16} /> Back
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => setShowBuilder(!showBuilder)}
                        className={`gap-2 h-10 px-4 rounded-none border-2 border-black transition-all font-black uppercase text-[10px] tracking-widest ${showBuilder ? 'bg-black text-white' : 'hover:bg-slate-50 text-black'}`}
                    >
                        {showBuilder ? <Terminal size={16} /> : <Sparkles size={16} />}
                        {showBuilder ? 'Hide Architect' : 'Framework Architect'}
                    </Button>
                </div>
                <div className="text-center hidden md:block">
                    <h1 className="text-xl font-black uppercase tracking-tighter text-black">{isNew ? 'New App Page' : 'Studio Editor'}</h1>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-black hover:bg-slate-800 text-white font-black h-12 px-10 rounded-none uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                    {isSaving ? 'Deploying...' : (isNew ? 'Create Page' : 'Save Changes')}
                </Button>
            </header>

            {/* Prompt Architect Hook */}
            {showBuilder && (
                <div className="border-4 border-black p-1 bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="bg-white">
                        <UltimateAdvertorialBuilder 
                            affiliateOffers={affiliateOffers} 
                            onStage={(data) => {
                                setFormData((prev: any) => ({ ...prev, ...data }));
                                setShowBuilder(false);
                                setStatus({ type: 'success', message: 'Framework content loaded successfully!' });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                </div>
            )}

            {status.message && (
                <div className={`p-4 border-2 font-black uppercase text-xs tracking-widest flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 border-green-600 text-green-600' : 'bg-red-50 border-red-600 text-red-600'}`}>
                    {status.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    {status.message}
                </div>
            )}

            {/* 01 Core Architecture */}
            <section>
                <h2 className={sectionTitleStyles}><Layout size={20} /> 01 Core Architecture</h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className={labelStyles}>Main Title</label>
                        <Input className={inputStyles} value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Escaping the Digital Grind..." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={labelStyles}>Slug</label>
                            <Input className={inputStyles} value={formData.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="country-dreams-relaxation-guide" />
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyles}>Category</label>
                            <Input className={inputStyles} value={formData.category} onChange={e => handleChange('category', e.target.value)} placeholder="Self-Care & Wellness" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 02 Narrative Arc */}
            <section>
                <h2 className={sectionTitleStyles}><Smartphone size={20} /> 02 Narrative Arc</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className={labelStyles}>Friction Reveal</label>
                        <Textarea className={`${inputStyles} min-h-[150px]`} value={formData.narrative?.frictionReveal} onChange={e => handleChange('narrative.frictionReveal', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className={labelStyles}>Editorial Pivot</label>
                        <Textarea className={`${inputStyles} min-h-[150px]`} value={formData.narrative?.editorialPivot} onChange={e => handleChange('narrative.editorialPivot', e.target.value)} />
                    </div>
                </div>
            </section>

            {/* 03 Value & Proof */}
            <section>
                <h2 className={sectionTitleStyles}><Zap size={20} /> 03 Value & Proof</h2>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className={labelStyles}>Price Anchoring</label>
                        <Textarea className={inputStyles} value={formData.valueReinforcement?.priceAnchoring} onChange={e => handleChange('valueReinforcement.priceAnchoring', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className={labelStyles}>Steps / Process</label>
                            <Button variant="ghost" onClick={() => handleChange('valueReinforcement.steps', [...(formData.valueReinforcement?.steps || []), { title: '', description: '' }])} className="text-[10px] font-black uppercase text-black hover:bg-slate-100">+ Add Step</Button>
                        </div>
                        <div className="grid gap-4">
                            {formData.valueReinforcement?.steps?.map((step: any, i: number) => (
                                <div key={i} className="bg-slate-50 p-4 border border-slate-100 flex gap-4">
                                    <div className="flex-1 space-y-3">
                                        <Input className="bg-white border-none text-xs font-bold" value={step.title} onChange={e => {
                                            const steps = [...formData.valueReinforcement.steps];
                                            steps[i].title = e.target.value;
                                            handleChange('valueReinforcement.steps', steps);
                                        }} placeholder="Step Title" />
                                        <Textarea className="bg-white border-none text-xs" value={step.description} onChange={e => {
                                            const steps = [...formData.valueReinforcement.steps];
                                            steps[i].description = e.target.value;
                                            handleChange('valueReinforcement.steps', steps);
                                        }} placeholder="Description" />
                                    </div>
                                    <Button variant="ghost" onClick={() => {
                                        const steps = formData.valueReinforcement.steps.filter((_: any, idx: number) => idx !== i);
                                        handleChange('valueReinforcement.steps', steps);
                                    }} className="text-slate-300 hover:text-red-600"><Trash2 size={16} /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Discovery Studio */}
            <section className="bg-slate-900 text-white p-8 -mx-8">
                <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-3 border-b-2 border-white/20 pb-2 mb-6"><Share2 size={20} /> Discovery Studio</h2>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Author & Bylines</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase text-white/40">Author Name</label>
                                <Input className="bg-white/5 border-white/10 text-white" value={formData.discovery?.author?.name} onChange={e => handleChange('discovery.author.name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase text-white/40">Read Time</label>
                                <Input className="bg-white/5 border-white/10 text-white" value={formData.discovery?.author?.readTime} onChange={e => handleChange('discovery.author.readTime', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase text-white/40">Avatar URL</label>
                            <Input className="bg-white/5 border-white/10 text-white" value={formData.discovery?.author?.avatarUrl} onChange={e => handleChange('discovery.author.avatarUrl', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Conversion Ratings</h3>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase text-white/40">Overall Score (e.g. 4.9/5)</label>
                            <Input className="bg-white/5 border-white/10 text-white" value={formData.discovery?.ratings?.overall} onChange={e => handleChange('discovery.ratings.overall', e.target.value)} />
                        </div>
                        <div className="grid gap-3">
                            {formData.discovery?.ratings?.breakdown?.map((rating: any, i: number) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <Input className="bg-white/5 border-none text-[10px] text-white" value={rating.label} onChange={e => {
                                        const b = [...formData.discovery.ratings.breakdown];
                                        b[i].label = e.target.value;
                                        handleChange('discovery.ratings.breakdown', b);
                                    }} />
                                    <Input type="number" className="bg-white/5 border-none text-[10px] text-white w-20" value={rating.value} onChange={e => {
                                        const b = [...formData.discovery.ratings.breakdown];
                                        b[i].value = parseInt(e.target.value);
                                        handleChange('discovery.ratings.breakdown', b);
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Testimonial Comments</h3>
                        <Button variant="ghost" onClick={() => handleChange('discovery.comments', [...(formData.discovery?.comments || []), { name: '', time: 'Just now', text: '' }])} className="text-[9px] font-bold text-white/60">+ Add Comment</Button>
                    </div>
                    <div className="grid gap-4">
                        {formData.discovery?.comments?.map((comment: any, i: number) => (
                            <div key={i} className="bg-white/5 p-4 border border-white/5 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input className="bg-transparent border-none text-[10px] text-white font-bold" value={comment.name} onChange={e => {
                                        const c = [...formData.discovery.comments];
                                        c[i].name = e.target.value;
                                        handleChange('discovery.comments', c);
                                    }} placeholder="Name" />
                                    <Input className="bg-transparent border-none text-[10px] text-white/40" value={comment.time} onChange={e => {
                                        const c = [...formData.discovery.comments];
                                        c[i].time = e.target.value;
                                        handleChange('discovery.comments', c);
                                    }} placeholder="Time" />
                                </div>
                                <Textarea className="bg-transparent border-none text-[10px] text-white/60 min-h-[40px]" value={comment.text} onChange={e => {
                                    const c = [...formData.discovery.comments];
                                    c[i].text = e.target.value;
                                    handleChange('discovery.comments', c);
                                }} placeholder="Comment text" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 p-6 bg-white/5 border border-white/10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 flex items-center gap-2"><HelpCircle size={14} /> Auto-Import from Groove HTML</h3>
                    <p className="text-[10px] text-white/40 mb-4 italic">Paste your raw GroovePages HTML block below to instantly populate discovery headlines, author info, ratings, and comments.</p>
                    <Textarea 
                        className="bg-black border-white/20 text-[10px] font-mono text-indigo-300 min-h-[100px]" 
                        placeholder="Paste HTML here..."
                        onBlur={async (e) => {
                            if (e.target.value) {
                                const imported = await importAdvertorialFromGroove(e.target.value);
                                if (imported) {
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        heroSection: { ...prev.heroSection, ...imported.heroSection },
                                        discovery: { ...prev.discovery, ...imported.discovery }
                                    }));
                                }
                            }
                        }}
                    />
                </div>
            </section>

            {/* 04 Ultimate Framework */}
            <section className="space-y-12">
                <h2 className={sectionTitleStyles}><Smartphone size={20} /> 04 Ultimate Framework</h2>
                
                <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-600">Hero & Media</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className={labelStyles}>Hero Headline</label>
                            <Input className={inputStyles} value={formData.heroSection?.headline} onChange={e => handleChange('heroSection.headline', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyles}>Bold Claim</label>
                            <Input className={inputStyles} value={formData.heroSection?.boldClaim} onChange={e => handleChange('heroSection.boldClaim', e.target.value)} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelStyles}>Hero Image URL</label>
                                <Input className={inputStyles} value={formData.heroSection?.imageUrl} onChange={e => handleChange('heroSection.imageUrl', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyles}>Hero Video URL</label>
                                <Input className={inputStyles} value={formData.heroSection?.videoUrl} onChange={e => handleChange('heroSection.videoUrl', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xs font-black uppercase tracking-widest text-red-600">Video Sales Letter (VSL)</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelStyles}>VSL Title</label>
                                <Input className={inputStyles} value={formData.vsl?.title} onChange={e => handleChange('vsl.title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyles}>VSL Video URL</label>
                                <Input className={inputStyles} value={formData.vsl?.videoUrl} onChange={e => handleChange('vsl.videoUrl', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyles}>VSL Description</label>
                            <Textarea className={`${inputStyles} min-h-[108px]`} value={formData.vsl?.description} onChange={e => handleChange('vsl.description', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-red-600">Narrative Listicle Items</h3>
                            <Button variant="ghost" onClick={() => handleChange('listicleItems', [...(formData.listicleItems || []), { subheading: '', content: '' }])} className="text-[10px] font-black uppercase text-black hover:bg-slate-100">+ Add Block</Button>
                        </div>
                        <div className="space-y-8">
                            {formData.listicleItems?.map((item: any, i: number) => (
                                <div key={i} className="space-y-3 p-6 border-l-4 border-black bg-slate-50 relative">
                                    <label className={labelStyles}>Item #{i + 1}</label>
                                    <Input className="bg-white font-bold" value={item.subheading} onChange={e => {
                                        const items = [...formData.listicleItems];
                                        items[i].subheading = e.target.value;
                                        handleChange('listicleItems', items);
                                    }} placeholder="Subheading" />
                                    <Textarea className="bg-white min-h-[100px]" value={item.content} onChange={e => {
                                        const items = [...formData.listicleItems];
                                        items[i].content = e.target.value;
                                        handleChange('listicleItems', items);
                                    }} placeholder="Content" />
                                    <Button variant="ghost" onClick={() => {
                                        const items = formData.listicleItems.filter((_: any, idx: number) => idx !== i);
                                        handleChange('listicleItems', items);
                                    }} className="absolute top-2 right-2 text-slate-300 hover:text-red-600"><Trash2 size={16} /></Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-red-600">Comparison Engine</h3>
                            <Button variant="ghost" onClick={() => handleChange('comparisonData.features', [...(formData.comparisonData?.features || []), { name: '', ourValue: '', competitorValue: '', isBetter: true }])} className="text-[10px] font-black uppercase text-black hover:bg-slate-100">+ Add Comparison Row</Button>
                        </div>
                        <div className="space-y-4">
                            <Input className="text-sm font-bold border-none bg-slate-100 mb-4" value={formData.comparisonData?.title} onChange={e => handleChange('comparisonData.title', e.target.value)} placeholder="Comparison Title" />
                            <div className="grid gap-2">
                                {formData.comparisonData?.features?.map((f: any, i: number) => (
                                    <div key={i} className="grid grid-cols-4 gap-2 items-center bg-white border border-slate-100 p-2">
                                        <Input className="text-[10px] border-none" value={f.name} onChange={e => {
                                            const features = [...formData.comparisonData.features];
                                            features[i].name = e.target.value;
                                            handleChange('comparisonData.features', features);
                                        }} placeholder="Feature" />
                                        <Input className="text-[10px] border-none font-bold text-green-600" value={f.ourValue} onChange={e => {
                                            const features = [...formData.comparisonData.features];
                                            features[i].ourValue = e.target.value;
                                            handleChange('comparisonData.features', features);
                                        }} placeholder="Our Value" />
                                        <Input className="text-[10px] border-none text-slate-400" value={f.competitorValue} onChange={e => {
                                            const features = [...formData.comparisonData.features];
                                            features[i].competitorValue = e.target.value;
                                            handleChange('comparisonData.features', features);
                                        }} placeholder="Competitor" />
                                        <Button variant="ghost" onClick={() => {
                                            const features = formData.comparisonData.features.filter((_: any, idx: number) => idx !== i);
                                            handleChange('comparisonData.features', features);
                                        }} className="text-slate-200 hover:text-red-600 justify-self-end"><Trash2 size={12} /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-red-600">Social Proof (Testimonials)</h3>
                            <Button variant="ghost" onClick={() => handleChange('socialProof', [...(formData.socialProof || []), { quote: '', author: '', source: 'Verified Customer' }])} className="text-[10px] font-black uppercase text-black hover:bg-slate-100">+ Add Testimonial</Button>
                        </div>
                        <div className="grid gap-6">
                            {formData.socialProof?.map((proof: any, i: number) => (
                                <div key={i} className="p-6 border-2 border-slate-100 space-y-4 bg-white relative">
                                    <Textarea className="text-sm italic border-none bg-slate-50 min-h-[80px]" value={proof.quote} onChange={e => {
                                        const proofs = [...formData.socialProof];
                                        proofs[i].quote = e.target.value;
                                        handleChange('socialProof', proofs);
                                    }} placeholder="The quote..." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input className="text-xs font-bold border-none" value={proof.author} onChange={e => {
                                            const proofs = [...formData.socialProof];
                                            proofs[i].author = e.target.value;
                                            handleChange('socialProof', proofs);
                                        }} placeholder="Author Name" />
                                        <Input className="text-xs text-slate-400 border-none" value={proof.source} onChange={e => {
                                            const proofs = [...formData.socialProof];
                                            proofs[i].source = e.target.value;
                                            handleChange('socialProof', proofs);
                                        }} placeholder="Source" />
                                    </div>
                                    <Button variant="ghost" onClick={() => {
                                        const proofs = formData.socialProof.filter((_: any, idx: number) => idx !== i);
                                        handleChange('socialProof', proofs);
                                    }} className="absolute top-2 right-2 text-slate-200 hover:text-red-600"><Trash2 size={16} /></Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-red-600">Conversion Close (Direct Response)</h3>
                        <div className="space-y-4 bg-slate-900 p-8 text-white">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-white/40 uppercase">CTA Text</label>
                                <Input className="bg-white/5 border-white/10 text-white font-black" value={formData.conversionClose?.ctaText} onChange={e => handleChange('conversionClose.ctaText', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-white/40 uppercase">Urgency Text</label>
                                <Input className="bg-white/5 border-white/10 text-white" value={formData.conversionClose?.urgencyText} onChange={e => handleChange('conversionClose.urgencyText', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyles}>Guarantee Text</label>
                                <Input className="bg-white/5 border-white/10 text-white italic" value={formData.conversionClose?.guaranteeText} onChange={e => handleChange('conversionClose.guaranteeText', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Settings */}
            <div className="grid md:grid-cols-2 gap-12 pt-12 border-t-4 border-black">
                <div className="space-y-8">
                    <section>
                        <h2 className={sectionTitleStyles}><Layout size={20} /> Design System</h2>
                        <div className="space-y-2">
                            <label className={labelStyles}>Layout Template</label>
                            <select 
                                className="w-full h-12 border-2 border-black bg-white text-black px-4 font-black uppercase text-xs tracking-widest outline-none appearance-none" 
                                value={formData.template} 
                                onChange={e => handleChange('template', e.target.value)}
                            >
                                <option value="discovery">Discovery (High Conversion - Groove)</option>
                                <option value="ultimate">Ultimate Framework (Listicle)</option>
                                <option value="industrial">Industrial (Standard)</option>
                                <option value="minimal">Minimalist</option>
                                <option value="magazine">Magazine</option>
                            </select>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className={sectionTitleStyles}><LinkIcon size={20} /> Affiliate Settings</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelStyles}>Product Catalog</label>
                                <select 
                                    className="w-full h-12 border-2 border-black bg-white text-black px-4 font-bold text-xs outline-none appearance-none" 
                                    value={formData.affiliateOfferId || ''} 
                                    onChange={e => handleChange('affiliateOfferId', e.target.value || null)}
                                >
                                    <option value="">-- No Catalog Offer --</option>
                                    {affiliateOffers?.map(offer => (
                                        <option key={offer._id} value={offer._id}>{offer.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyles}>Custom Link URL</label>
                                <Input className={inputStyles} value={formData.customTargetUrl} onChange={e => handleChange('customTargetUrl', e.target.value)} placeholder="Overrides catalog link" />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyles}>CTA Button Text</label>
                                <Input className={inputStyles} value={formData.summaryBox?.ctaText} onChange={e => handleChange('summaryBox.ctaText', e.target.value)} />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className={sectionTitleStyles}><Zap size={20} /> Urgency Signal</h2>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <select 
                                className="h-12 border-2 border-black bg-white text-black px-4 font-black uppercase text-[10px] tracking-widest outline-none appearance-none" 
                                value={formData.scarcity?.type || 'none'} 
                                onChange={e => handleChange('scarcity.type', e.target.value)}
                            >
                                <option value="none">No Urgency</option>
                                <option value="timer">Timer</option>
                                <option value="slots">Slots Remaining</option>
                            </select>
                            <div className="flex items-center gap-3 bg-slate-900 p-3 text-white border-2 border-black">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isPublished} 
                                    onChange={e => handleChange('isPublished', e.target.checked)}
                                    className="w-5 h-5 accent-indigo-500"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest">Published</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
