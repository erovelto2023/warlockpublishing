"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
    ChevronLeft, Save, Plus, Trash2, 
    Zap, ListChecks, Target, TrendingUp, Lightbulb, Video
} from "lucide-react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions/glossary";
import { GlossaryTerm } from "@/lib/types";

interface GlossaryEditorProps {
    initialData?: GlossaryTerm;
}

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
        isPublished: true
    });

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
                                    className="w-full h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                    className="w-full h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                required
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
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider mb-2 block">YouTube Video ID</label>
                            <Input 
                                name="youtubeVideoId" 
                                value={formData.youtubeVideoId} 
                                onChange={handleChange} 
                                placeholder="e.g. dQw4w9WgXcQ"
                            />
                        </div>
                    </Card>

                    {/* Characteristics */}
                    <Card className="p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                <ListChecks size={14} /> Key Characteristics
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('characteristics')}>
                                <Plus size={14} className="mr-1" /> Add
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.characteristics?.map((char, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input 
                                        value={char} 
                                        onChange={(e) => handleArrayChange('characteristics', idx, e.target.value)} 
                                        placeholder="Add a key feature or characteristic..."
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem('characteristics', idx)}>
                                        <Trash2 size={16} className="text-slate-400 hover:text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* FAQ */}
                    <Card className="p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                <Plus size={14} /> Frequently Asked Questions
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, faqItems: [...(prev.faqItems || []), { question: "", answer: "" }] }))}>
                                <Plus size={14} className="mr-1" /> Add FAQ
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {formData.faqItems?.map((faq, idx) => (
                                <div key={idx} className="p-4 border border-slate-100 rounded-xl space-y-3 relative">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-2 right-2"
                                        onClick={() => setFormData(prev => ({ ...prev, faqItems: prev.faqItems?.filter((_, i) => i !== idx) }))}
                                    >
                                        <Trash2 size={16} className="text-slate-400 hover:text-red-500" />
                                    </Button>
                                    <Input 
                                        value={faq.question} 
                                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} 
                                        placeholder="Question..."
                                        className="pr-10"
                                    />
                                    <Textarea 
                                        value={faq.answer} 
                                        onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} 
                                        placeholder="Answer..."
                                        className="h-20"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* SEO Strategy */}
                    <Card className="p-6 space-y-6 bg-slate-900 text-white border-none">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                            <TrendingUp size={14} /> SEO Strategy
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Search Difficulty</label>
                            <select 
                                value={formData.seoStrategy?.difficulty}
                                onChange={(e) => setFormData(prev => ({ ...prev, seoStrategy: { ...prev.seoStrategy!, difficulty: e.target.value as any } }))}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Volume Range</label>
                            <Input 
                                value={formData.seoStrategy?.volumeRange}
                                onChange={(e) => setFormData(prev => ({ ...prev, seoStrategy: { ...prev.seoStrategy!, volumeRange: e.target.value } }))}
                                className="bg-slate-800 border-slate-700 h-10"
                            />
                        </div>
                    </Card>

                    {/* Monetization */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                            <Lightbulb size={14} /> Monetization Ideas
                        </div>
                        {/* Simplified for brevity in this UI, but could be extended */}
                        <p className="text-[10px] text-slate-400 uppercase font-bold italic leading-relaxed">
                            These will be automatically suggested in the public view based on the term category and difficulty level.
                        </p>
                    </Card>

                    {/* Status */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Published Status</label>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPublished ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPublished ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
}
