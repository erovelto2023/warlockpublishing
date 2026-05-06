"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
    ChevronLeft, Save, Plus, Trash2, 
    Zap, ListChecks, Target, TrendingUp, Lightbulb, Video, BookOpen, MessageSquare, Link as LinkIcon, ChevronDown, Search,
    GraduationCap, Terminal
} from "lucide-react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions/glossary";
import { getAffiliateOffers } from "@/lib/actions/affiliate.actions";
import { getPublishedProducts } from "@/lib/actions/product.actions";
import { getCallToActions } from "@/lib/actions/cta.actions";
import { GlossaryTerm } from "@/lib/types";
import { Switch } from "@/components/ui/switch";

interface GlossaryEditorProps {
    initialData?: GlossaryTerm;
}

const SearchableOfferSelect = ({ offers, onSelect }: { offers: any[], onSelect: (offer: any) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = offers.filter(o => o.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative flex-1 max-w-[200px]" ref={wrapperRef}>
            <div 
                className="bg-slate-800 border-slate-700 text-white text-[10px] h-9 rounded-md px-3 flex items-center justify-between border hover:bg-slate-700/50 transition-colors cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">Select from Hub...</span>
                <ChevronDown size={12} className={`text-slate-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
                <div className="absolute z-50 w-[250px] mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-xl flex flex-col overflow-hidden">
                    <div className="p-2 border-b border-slate-700 bg-slate-800 flex items-center gap-2">
                        <Search size={12} className="text-slate-400 shrink-0" />
                        <Input 
                            autoFocus
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="h-7 text-[10px] bg-slate-900 border-slate-700 text-white flex-1 px-2"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {filtered.map(offer => (
                            <div 
                                key={offer._id} 
                                className="px-3 py-2 text-[10px] text-white hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 truncate"
                                onClick={() => {
                                    onSelect(offer);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                title={offer.name}
                            >
                                {offer.name}
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="p-4 text-[10px] text-slate-400 text-center">No matches</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function GlossaryEditor({ initialData }: GlossaryEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<GlossaryTerm>>(initialData || {
        term: "",
        category: "AI & Search",
        difficulty: "Beginner",
        snapshot: "",
        definition: "",
        characteristics: [""],
        faqItems: [{ question: "", answer: "" }],
        monetizationIdeas: {
            affiliateProducts: [""],
            courseTopics: [""],
            digitalDownloads: [""]
        },
        checklist: {
            title: "Implementation Checklist",
            description: "",
            items: [{ task: "", description: "" }]
        },
        marketingStrategy: {
            hooks: [""],
            headlines: [""],
            titles: [""],
            contentIdeas: [""],
            socialPosts: [""]
        },
        seoStrategy: {
            volumeRange: "",
            difficulty: "Low",
            relatedKeywords: [""]
        },
        isPublished: true,
        marketDemand: {
            demandScore: "5.0/10",
            passionScore: "5.0/10",
            saturationScore: "5.0/10",
            trendStatus: "Stable"
        },
        readerPsychology: {
            whyWeCraveIt: "",
            cognitiveShortcut: "",
            emotionalPayoff: "",
            catharticRelease: ""
        },
        masterclass: {
            masterclassDesc: "",
            threeActStructure: { act1: "", act2: "", act3: "" },
            profitBeats: [],
            characterArchetypes: [],
            technicalComponents: { powerTitle: "", tropes: [], hook: "" },
            profitabilityChecklist: []
        },
        subGenreVariations: [],
        vibeCuration: [],
        commonPitfalls: [],
        aiPromptCommandCenter: {
            sceneGeneratorPrompt: "",
            marketingHookPrompt: "",
            aiImagePrompt: ""
        }
    });

    const [affiliateOffers, setAffiliateOffers] = useState<any[]>([]);
    const [localProducts, setLocalProducts] = useState<any[]>([]);
    const [ctas, setCtas] = useState<any[]>([]);

    useEffect(() => {
        getAffiliateOffers().then(setAffiliateOffers).catch(console.error);
        getPublishedProducts().then(setLocalProducts).catch(console.error);
        getCallToActions().then(setCtas).catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field: string, index: number, value: string) => {
        setFormData(prev => {
            const arr = [...(prev[field as keyof typeof prev] as string[])];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    };

    const addArrayItem = (field: string) => {
        setFormData(prev => {
            const arr = [...(prev[field as keyof typeof prev] as string[]), ""];
            return { ...prev, [field]: arr };
        });
    };

    const removeArrayItem = (field: string, index: number) => {
        setFormData(prev => {
            const arr = [...(prev[field as keyof typeof prev] as string[])].filter((_, i) => i !== index);
            return { ...prev, [field]: arr };
        });
    };

    // Special handlers for nested objects
    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        setFormData(prev => {
            const faqs = [...(prev.faqItems || [])];
            faqs[index] = { ...faqs[index], [field]: value };
            return { ...prev, faqItems: faqs };
        });
    };

    const handleChecklistItemChange = (index: number, field: 'task' | 'description', value: string) => {
        setFormData(prev => {
            const items = [...(prev.checklist?.items || [])];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, checklist: { ...prev.checklist!, items } };
        });
    };

    const handleSeoKeywordChange = (index: number, value: string) => {
        setFormData(prev => {
            const keywords = [...(prev.seoStrategy?.relatedKeywords || [])];
            keywords[index] = value;
            return { ...prev, seoStrategy: { ...prev.seoStrategy!, relatedKeywords: keywords } };
        });
    };

    const updateNestedField = (path: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev };
            const parts = path.split('.');
            let current: any = newData;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {};
                current[parts[i]] = { ...current[parts[i]] };
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            return newData;
        });
    };

    const addNestedArrayItem = (path: string, defaultValue: any) => {
        setFormData(prev => {
            const newData = { ...prev };
            const parts = path.split('.');
            let current: any = newData;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {};
                current[parts[i]] = { ...current[parts[i]] };
                current = current[parts[i]];
            }
            const arr = [...(current[parts[parts.length - 1]] || [])];
            arr.push(defaultValue);
            current[parts[parts.length - 1]] = arr;
            return newData;
        });
    };

    const removeNestedArrayItem = (path: string, index: number) => {
        setFormData(prev => {
            const newData = { ...prev };
            const parts = path.split('.');
            let current: any = newData;
            for (let i = 0; i < parts.length - 1; i++) {
                current[parts[i]] = { ...current[parts[i]] };
                current = current[parts[i]];
            }
            const arr = [...(current[parts[parts.length - 1]] || [])].filter((_, i) => i !== index);
            current[parts[parts.length - 1]] = arr;
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (initialData?._id) {
                await (updateGlossaryTerm as any)(initialData._id, formData);
            } else {
                await (createGlossaryTerm as any)(formData);
            }
            router.push('/admin');
            router.refresh();
        } catch (error) {
            alert("Error saving term");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-12 pb-24">
            <header className="flex items-center justify-between sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft size={20} />
                    </Button>
                    <h1 className="text-xl font-black uppercase tracking-tight">
                        {initialData ? 'Edit Term' : 'Create New Term'}
                    </h1>
                </div>
                <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8">
                    <Save size={18} className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Term'}
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info */}
                    <Card className="p-8 space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
                            <Zap size={14} /> Basic Information
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Term Name</label>
                                <Input 
                                    name="term" 
                                    value={formData.term} 
                                    onChange={handleChange} 
                                    placeholder="e.g. AI Overview"
                                    required
                                    className="h-12 font-bold text-lg"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Category</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-md border border-slate-800 bg-slate-900 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="AI & Search">AI & Search</option>
                                    <option value="Technical SEO">Technical SEO</option>
                                    <option value="Content Strategy">Content Strategy</option>
                                    <option value="Analytics">Analytics</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Difficulty</label>
                                <select 
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-md border border-slate-800 bg-slate-900 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Content */}
                    <Card className="p-8 space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
                            <ListChecks size={14} /> Content & Definitions
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider mb-2 block">AI Snapshot (Short Summary)</label>
                            <Textarea 
                                name="snapshot" 
                                value={formData.snapshot} 
                                onChange={handleChange} 
                                placeholder="A concise summary for Google AI Overviews..."
                                className="h-24 resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Full Definition</label>
                            <Textarea 
                                name="definition" 
                                value={formData.definition} 
                                onChange={handleChange} 
                                placeholder="The detailed explanation of the term..."
                                className="h-64 resize-none"
                                required
                            />
                        </div>
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-4 block flex items-center gap-2">
                                <BookOpen size={16} /> Authority Article (Blog Content)
                            </label>
                            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Framework: Magnetic Headline (H1) → APP Intro → Scannable Body (H2/H3) → Visuals → Wrap → CTA
                                </p>
                                <Textarea 
                                    name="articleContent" 
                                    value={formData.articleContent} 
                                    onChange={handleChange} 
                                    placeholder="Write the ultimate guide using the framework..."
                                    className="h-[600px] bg-white border-2 border-slate-200 text-black font-serif text-lg leading-relaxed px-6 py-8 shadow-inner placeholder:text-slate-300"
                                />
                            </div>
                            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                <label className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Target size={14} className="text-indigo-500" /> Attach Call-To-Action (CTA)
                                </label>
                                <select 
                                    name="callToActionId"
                                    value={formData.callToActionId as string || ""}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-md border border-slate-800 bg-slate-900 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">No CTA Attached</option>
                                    {ctas.map(cta => (
                                        <option key={cta._id} value={cta._id}>{cta.internalName} ({cta.headline})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                                <Video size={16} /> YouTube Video URL or ID
                            </label>
                            <Input 
                                name="youtubeVideoId" 
                                value={formData.youtubeVideoId} 
                                onChange={handleChange} 
                                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                className="bg-white text-black border-2 border-slate-100 h-11"
                            />
                        </div>
                    </Card>

                    {/* Implementation Checklist */}
                    <Card className="p-8 space-y-6 bg-emerald-50/50 border-2 border-emerald-100 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                <ListChecks size={16} /> Implementation Checklist
                            </div>
                            <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] border-emerald-200 text-emerald-700 hover:bg-emerald-100" onClick={() => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, items: [...(prev.checklist?.items || []), { task: "", description: "" }] } }))}>
                                <Plus size={12} className="mr-1" /> Add Step
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <Input 
                                value={formData.checklist?.title} 
                                onChange={(e) => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, title: e.target.value } }))}
                                placeholder="Checklist Title (e.g. Getting Started with AI Overviews)"
                                className="bg-white border-2 border-emerald-100 font-bold text-slate-900 h-11"
                            />
                            <Textarea 
                                value={formData.checklist?.description} 
                                onChange={(e) => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, description: e.target.value } }))}
                                placeholder="Brief description of the goals..."
                                className="bg-white border-2 border-emerald-100 text-slate-900 h-20"
                            />
                            <div className="space-y-4 pt-4">
                                {formData.checklist?.items?.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-white rounded-xl border border-emerald-100 space-y-3 relative shadow-sm">
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500"
                                            onClick={() => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, items: prev.checklist?.items?.filter((_, i) => i !== idx) || [] } }))}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                        <Input 
                                            value={item.task} 
                                            onChange={(e) => handleChecklistItemChange(idx, 'task', e.target.value)}
                                            placeholder="Task name..."
                                            className="bg-slate-50 border-none font-bold text-slate-900 h-9"
                                        />
                                        <Input 
                                            value={item.description} 
                                            onChange={(e) => handleChecklistItemChange(idx, 'description', e.target.value)}
                                            placeholder="Quick instructions..."
                                            className="bg-slate-50 border-none text-slate-600 text-xs h-9"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6 bg-slate-900/95 border-none shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                <Zap size={14} /> Key Characteristics
                            </div>
                            <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setFormData(prev => ({ ...prev, characteristics: [...(prev.characteristics || []), ""] }))}>
                                <Plus size={12} className="mr-1" /> Add
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {formData.characteristics?.map((char, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input 
                                        value={char} 
                                        onChange={(e) => {
                                            const newChars = [...(formData.characteristics || [])];
                                            newChars[idx] = e.target.value;
                                            setFormData(prev => ({ ...prev, characteristics: newChars }));
                                        }} 
                                        className="bg-slate-800 border-slate-700 text-white text-xs"
                                        placeholder="Enter characteristic..."
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, characteristics: formData.characteristics?.filter((_, i) => i !== idx) }))}>
                                        <Trash2 size={14} className="text-slate-500 hover:text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6 bg-slate-900/95 border-none shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                <MessageSquare size={14} /> Frequent Asset Questions
                            </div>
                            <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setFormData(prev => ({ ...prev, faqItems: [...(prev.faqItems || []), { question: "", answer: "" }] }))}>
                                <Plus size={12} className="mr-1" /> Add FAQ
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {formData.faqItems?.map((faq, idx) => (
                                <div key={idx} className="p-6 bg-slate-800/50 rounded-2xl space-y-4 relative border border-slate-700">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-4 right-4 h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-950/30"
                                        onClick={() => setFormData(prev => ({ ...prev, faqItems: prev.faqItems?.filter((_, i) => i !== idx) }))}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Question</label>
                                        <Input 
                                            value={faq.question} 
                                            onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} 
                                            placeholder="What is the common question?"
                                            className="bg-slate-900 border-slate-700 font-bold text-white placeholder:text-slate-600"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Answer</label>
                                        <Textarea 
                                            value={faq.answer} 
                                            onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} 
                                            placeholder="Provide a detailed, strategic answer..."
                                            className="h-24 bg-slate-900 border-slate-700 text-sm leading-relaxed text-white placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-6 space-y-6 bg-slate-900/95 border-none shadow-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            <TrendingUp size={14} /> SEO Strategy
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Search Difficulty</label>
                                <select 
                                    name="difficulty"
                                    value={formData.seoStrategy?.difficulty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, seoStrategy: { ...prev.seoStrategy!, difficulty: e.target.value as any } }))}
                                    className="w-full h-10 bg-slate-800 border-slate-700 rounded-md text-xs font-bold text-white px-3 focus:ring-1 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Volume Range</label>
                                <Input 
                                    value={formData.seoStrategy?.volumeRange}
                                    onChange={(e) => setFormData(prev => ({ ...prev, seoStrategy: { ...prev.seoStrategy!, volumeRange: e.target.value } }))}
                                    placeholder="e.g. 10k - 50k"
                                    className="bg-slate-800 border-slate-700 text-white text-xs h-10"
                                />
                            </div>
                            <div className="pt-4 border-t border-slate-800">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Related Keywords</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] text-indigo-400 hover:bg-slate-800" onClick={() => setFormData(prev => ({ ...prev, seoStrategy: { ...prev.seoStrategy!, relatedKeywords: [...(prev.seoStrategy?.relatedKeywords || []), ""] } }))}>+ Add</Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.seoStrategy?.relatedKeywords?.map((kw, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input 
                                                value={kw}
                                                onChange={(e) => handleSeoKeywordChange(idx, e.target.value)}
                                                className="bg-slate-800 border-slate-700 text-white text-[10px] h-8"
                                                placeholder="Keyword..."
                                            />
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={() => setFormData(prev => ({ ...prev, seoStrategy: { ...prev.seoStrategy!, relatedKeywords: prev.seoStrategy?.relatedKeywords?.filter((_, i) => i !== idx) || [] } }))}>
                                                <Trash2 size={12} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6 bg-slate-900/95 border-none shadow-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            <Lightbulb size={14} /> Market Opportunities
                        </div>
                        
                        {/* Affiliate Products */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Recommended Products (Affiliate Links)</label>
                                <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] text-indigo-400 hover:bg-slate-800" onClick={() => setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, affiliateProducts: [...(prev.monetizationIdeas?.affiliateProducts || []), ""] } }))}>+ Add Product</Button>
                            </div>
                            
                            {formData.monetizationIdeas?.affiliateProducts?.map((prod, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <div className="flex-1 flex gap-2">
                                        <SearchableOfferSelect 
                                            offers={affiliateOffers} 
                                            onSelect={(offer) => {
                                                const newArr = [...(formData.monetizationIdeas?.affiliateProducts || [])];
                                                newArr[idx] = `[${offer.name}](${offer.affiliateLink})`;
                                                setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, affiliateProducts: newArr } }));
                                            }} 
                                        />
                                        <Input 
                                            value={prod}
                                            onChange={(e) => {
                                                const newArr = [...(formData.monetizationIdeas?.affiliateProducts || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, affiliateProducts: newArr } }));
                                            }}
                                            className="bg-slate-800 border-slate-700 text-white text-[10px] h-9 flex-1"
                                            placeholder="Markdown format: [Name](URL)"
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-red-400 shrink-0" onClick={() => setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, affiliateProducts: prev.monetizationIdeas?.affiliateProducts?.filter((_, i) => i !== idx) || [] } }))}>
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Digital Downloads */}
                        <div className="space-y-4 pt-6 border-t border-slate-800">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Digital Downloads (Warehouse)</label>
                                <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] text-emerald-400 hover:bg-slate-800" onClick={() => setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, digitalDownloads: [...(prev.monetizationIdeas?.digitalDownloads || []), ""] } }))}>+ Add Download</Button>
                            </div>
                            
                            {formData.monetizationIdeas?.digitalDownloads?.map((dl, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <div className="flex-1 flex gap-2">
                                        <SearchableOfferSelect 
                                            offers={localProducts.map(p => ({ ...p, name: p.title, affiliateLink: `/products/${p.slug}` }))} 
                                            onSelect={(prod) => {
                                                const newArr = [...(formData.monetizationIdeas?.digitalDownloads || [])];
                                                newArr[idx] = `[${prod.name}](${prod.affiliateLink})`;
                                                setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, digitalDownloads: newArr } }));
                                            }} 
                                        />
                                        <Input 
                                            value={dl}
                                            onChange={(e) => {
                                                const newArr = [...(formData.monetizationIdeas?.digitalDownloads || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, digitalDownloads: newArr } }));
                                            }}
                                            className="bg-slate-800 border-slate-700 text-white text-[10px] h-9 flex-1"
                                            placeholder="Markdown format: [Name](URL)"
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-red-400 shrink-0" onClick={() => setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, digitalDownloads: prev.monetizationIdeas?.digitalDownloads?.filter((_, i) => i !== idx) || [] } }))}>
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Course Topics */}
                        <div className="space-y-4 pt-6 border-t border-slate-800">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Course Topics</label>
                                <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] text-amber-400 hover:bg-slate-800" onClick={() => setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, courseTopics: [...(prev.monetizationIdeas?.courseTopics || []), ""] } }))}>+ Add Topic</Button>
                            </div>
                            
                            {formData.monetizationIdeas?.courseTopics?.map((topic, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input 
                                        value={topic}
                                        onChange={(e) => {
                                            const newArr = [...(formData.monetizationIdeas?.courseTopics || [])];
                                            newArr[idx] = e.target.value;
                                            setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, courseTopics: newArr } }));
                                        }}
                                        className="bg-slate-800 border-slate-700 text-white text-[10px] h-9 flex-1"
                                        placeholder="Course topic name..."
                                    />
                                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-red-400 shrink-0" onClick={() => setFormData(prev => ({ ...prev, monetizationIdeas: { ...prev.monetizationIdeas!, courseTopics: prev.monetizationIdeas?.courseTopics?.filter((_, i) => i !== idx) || [] } }))}>
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Market Intelligence */}
                    <Card className="p-6 space-y-6 bg-slate-900/95 border-none shadow-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            <TrendingUp size={14} /> Market Intelligence
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Demand Score</label>
                                <Input 
                                    value={formData.marketDemand?.demandScore}
                                    onChange={(e) => updateNestedField('marketDemand.demandScore', e.target.value)}
                                    placeholder="8.5/10"
                                    className="bg-slate-800 border-slate-700 text-white text-xs h-9"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Passion Score</label>
                                <Input 
                                    value={formData.marketDemand?.passionScore}
                                    onChange={(e) => updateNestedField('marketDemand.passionScore', e.target.value)}
                                    placeholder="9.0/10"
                                    className="bg-slate-800 border-slate-700 text-white text-xs h-9"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Saturation Score</label>
                                <Input 
                                    value={formData.marketDemand?.saturationScore}
                                    onChange={(e) => updateNestedField('marketDemand.saturationScore', e.target.value)}
                                    placeholder="4.0/10"
                                    className="bg-slate-800 border-slate-700 text-white text-xs h-9"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Trend Status</label>
                                <Input 
                                    value={formData.marketDemand?.trendStatus}
                                    onChange={(e) => updateNestedField('marketDemand.trendStatus', e.target.value)}
                                    placeholder="Rising"
                                    className="bg-slate-800 border-slate-700 text-white text-xs h-9"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Psychology Section */}
                    <Card className="p-6 space-y-6 bg-slate-900/95 border-none shadow-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            <BookOpen size={14} /> Reader Psychology
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Why We Crave It</label>
                                <Textarea 
                                    value={formData.readerPsychology?.whyWeCraveIt}
                                    onChange={(e) => updateNestedField('readerPsychology.whyWeCraveIt', e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white text-xs h-20 resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Emotional Payoff</label>
                                <Textarea 
                                    value={formData.readerPsychology?.emotionalPayoff}
                                    onChange={(e) => updateNestedField('readerPsychology.emotionalPayoff', e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white text-xs h-20 resize-none"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Marketing & Content Strategy */}
                    <Card className="p-8 space-y-6 border-2 border-indigo-100 bg-white shadow-xl">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-6">
                            <Target size={16} /> Marketing Strategy
                        </div>
                        
                        <div className="space-y-8">
                            {/* Hooks */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Viral Hooks</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, hooks: [...(prev.marketingStrategy?.hooks || []), ""] } }))}>+ Add Hook</Button>
                                </div>
                                {formData.marketingStrategy?.hooks?.map((hook, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input 
                                            value={hook} 
                                            onChange={(e) => {
                                                const newArr = [...(formData.marketingStrategy?.hooks || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, hooks: newArr } }));
                                            }}
                                            className="bg-white border-2 border-slate-100 text-black font-bold text-xs h-11"
                                            placeholder="e.g. Why most people fail at..."
                                        />
                                        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 text-slate-300 hover:text-red-500 hover:bg-red-50" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, hooks: prev.marketingStrategy?.hooks?.filter((_, i) => i !== idx) || [] } }))}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Content Pillars */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Top Content Pillars</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, contentIdeas: [...(prev.marketingStrategy?.contentIdeas || []), ""] } }))}>+ Add Pillar</Button>
                                </div>
                                {formData.marketingStrategy?.contentIdeas?.map((idea, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input 
                                            value={idea} 
                                            onChange={(e) => {
                                                const newArr = [...(formData.marketingStrategy?.contentIdeas || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, contentIdeas: newArr } }));
                                            }}
                                            className="bg-white border-2 border-slate-100 text-black font-bold text-xs h-11"
                                            placeholder="e.g. 5-step beginner guide"
                                        />
                                        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 text-slate-300 hover:text-red-500 hover:bg-red-50" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, contentIdeas: prev.marketingStrategy?.contentIdeas?.filter((_, i) => i !== idx) || [] } }))}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Masterclass & AI Intelligence */}
                    <Card className="p-8 space-y-8 bg-white border-2 border-slate-900 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Lightbulb size={120} />
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-4">
                            <GraduationCap size={16} /> Creator Masterclass
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Masterclass Description</label>
                                <Textarea 
                                    value={formData.masterclass?.masterclassDesc}
                                    onChange={(e) => updateNestedField('masterclass.masterclassDesc', e.target.value)}
                                    placeholder="The strategic summary of this concept..."
                                    className="h-20 bg-slate-50 border-slate-200"
                                />
                            </div>

                            {/* 3-Act Structure */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Act 1</label>
                                    <Textarea 
                                        value={formData.masterclass?.threeActStructure?.act1}
                                        onChange={(e) => updateNestedField('masterclass.threeActStructure.act1', e.target.value)}
                                        className="h-24 text-xs bg-slate-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Act 2</label>
                                    <Textarea 
                                        value={formData.masterclass?.threeActStructure?.act2}
                                        onChange={(e) => updateNestedField('masterclass.threeActStructure.act2', e.target.value)}
                                        className="h-24 text-xs bg-slate-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Act 3</label>
                                    <Textarea 
                                        value={formData.masterclass?.threeActStructure?.act3}
                                        onChange={(e) => updateNestedField('masterclass.threeActStructure.act3', e.target.value)}
                                        className="h-24 text-xs bg-slate-50"
                                    />
                                </div>
                            </div>

                            {/* Profit Beats */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Profit Beats</label>
                                    <Button type="button" variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addNestedArrayItem('masterclass.profitBeats', { title: "", description: "", timing: "" })}>+ Add Beat</Button>
                                </div>
                                <div className="grid gap-3">
                                    {formData.masterclass?.profitBeats?.map((beat, idx) => (
                                        <div key={idx} className="flex gap-2 p-3 bg-slate-50 rounded-lg relative">
                                            <div className="flex-1 grid grid-cols-12 gap-2">
                                                <Input value={beat.title} onChange={(e) => {
                                                    const beats = [...(formData.masterclass?.profitBeats || [])];
                                                    beats[idx] = { ...beats[idx], title: e.target.value };
                                                    updateNestedField('masterclass.profitBeats', beats);
                                                }} placeholder="Beat Title" className="col-span-4 h-8 text-[10px]" />
                                                <Input value={beat.timing} onChange={(e) => {
                                                    const beats = [...(formData.masterclass?.profitBeats || [])];
                                                    beats[idx] = { ...beats[idx], timing: e.target.value };
                                                    updateNestedField('masterclass.profitBeats', beats);
                                                }} placeholder="Timing (e.g. 25%)" className="col-span-3 h-8 text-[10px]" />
                                                <Input value={beat.description} onChange={(e) => {
                                                    const beats = [...(formData.masterclass?.profitBeats || [])];
                                                    beats[idx] = { ...beats[idx], description: e.target.value };
                                                    updateNestedField('masterclass.profitBeats', beats);
                                                }} placeholder="Description" className="col-span-5 h-8 text-[10px]" />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500" onClick={() => removeNestedArrayItem('masterclass.profitBeats', idx)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-900 space-y-6">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
                                <Terminal size={16} /> AI Command Center
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Scene Generator Prompt</label>
                                    <Textarea 
                                        value={formData.aiPromptCommandCenter?.sceneGeneratorPrompt}
                                        onChange={(e) => updateNestedField('aiPromptCommandCenter.sceneGeneratorPrompt', e.target.value)}
                                        className="h-24 bg-slate-50 font-mono text-[10px]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Marketing Hook Prompt</label>
                                    <Textarea 
                                        value={formData.aiPromptCommandCenter?.marketingHookPrompt}
                                        onChange={(e) => updateNestedField('aiPromptCommandCenter.marketingHookPrompt', e.target.value)}
                                        className="h-24 bg-slate-50 font-mono text-[10px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-900/95 border-none shadow-2xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Published Status</span>
                            <Switch 
                                checked={formData.isPublished} 
                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isPublished: checked }))} 
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
}
