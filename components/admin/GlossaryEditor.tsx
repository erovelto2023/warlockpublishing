"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
    ChevronLeft, Save, Plus, Trash2, 
    Zap, ListChecks, Target, TrendingUp, Lightbulb, Video, BookOpen
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
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-4 block flex items-center gap-2">
                                <BookOpen size={16} /> Authority Article (Blog Content)
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Framework: Magnetic Headline (H1) → APP Intro → Scannable Body (H2/H3) → Visuals → Wrap → CTA
                                </p>
                                <Textarea 
                                    name="articleContent" 
                                    value={formData.articleContent} 
                                    onChange={handleChange} 
                                    placeholder="Write the ultimate guide using the framework..."
                                    className="h-[600px] bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-800 text-black dark:text-white font-serif text-lg leading-relaxed px-6 py-8 shadow-inner"
                                />
                            </div>
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
                                <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4 relative border border-slate-100 dark:border-slate-700">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-4 right-4 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        onClick={() => setFormData(prev => ({ ...prev, faqItems: prev.faqItems?.filter((_, i) => i !== idx) }))}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Question</label>
                                        <Input 
                                            value={faq.question} 
                                            onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} 
                                            placeholder="What is the common question?"
                                            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Answer</label>
                                        <Textarea 
                                            value={faq.answer} 
                                            onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} 
                                            placeholder="Provide a detailed, strategic answer..."
                                            className="h-24 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Implementation Checklist */}
                    <Card className="p-8 space-y-8 border-2 border-indigo-100 dark:border-indigo-900/30 shadow-none bg-white dark:bg-slate-950">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-4">
                            <ListChecks size={16} /> Getting Started Checklist
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Checklist Title</label>
                                <Input 
                                    value={formData.checklist?.title} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, title: e.target.value } }))} 
                                    placeholder="e.g. Implementation Guide"
                                    className="h-12 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-800 text-black dark:text-white font-bold px-4 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Description</label>
                                <Textarea 
                                    value={formData.checklist?.description} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, description: e.target.value } }))} 
                                    placeholder="Quick overview of the steps..."
                                    className="h-24 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-800 text-black dark:text-white font-medium px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            
                            <div className="pt-8 border-t-2 border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-black dark:text-white">Task Breakdown</h4>
                                    <Button type="button" variant="outline" size="sm" className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold" onClick={() => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, items: [...(prev.checklist?.items || []), { task: "", description: "" }] } }))}>
                                        <Plus size={14} className="mr-2" /> Add Action Item
                                    </Button>
                                </div>
                                
                                <div className="space-y-6">
                                    {formData.checklist?.items?.map((item, idx) => (
                                        <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl space-y-6 relative border-2 border-slate-100 dark:border-slate-800 group hover:border-indigo-500 transition-all duration-300">
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                className="absolute top-4 right-4 h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full"
                                                onClick={() => setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, items: prev.checklist?.items?.filter((_, i) => i !== idx) || [] } }))}
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">Step {idx + 1}: Task Name</label>
                                                <Input 
                                                    value={item.task} 
                                                    onChange={(e) => {
                                                        const newItems = [...(formData.checklist?.items || [])];
                                                        newItems[idx] = { ...newItems[idx], task: e.target.value };
                                                        setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, items: newItems } }));
                                                    }} 
                                                    placeholder="What needs to be done?"
                                                    className="h-12 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 font-bold text-black dark:text-white px-4 focus:ring-indigo-500"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">Actionable Detail</label>
                                                <Textarea 
                                                    value={item.description} 
                                                    onChange={(e) => {
                                                        const newItems = [...(formData.checklist?.items || [])];
                                                        newItems[idx] = { ...newItems[idx], description: e.target.value };
                                                        setFormData(prev => ({ ...prev, checklist: { ...prev.checklist!, items: newItems } }));
                                                    }} 
                                                    placeholder="Describe the steps to complete this task..."
                                                    className="h-24 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-black dark:text-white px-4 py-3 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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

                    {/* Marketing & Content Strategy */}
                    <Card className="p-8 space-y-6 border-2 border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-slate-950">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-4">
                            <Target size={16} /> Marketing & Content Strategy
                        </div>
                        
                        <div className="space-y-6">
                            {/* Hooks */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Hooks</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, hooks: [...(prev.marketingStrategy?.hooks || []), ""] } }))}>+ Add Hook</Button>
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
                                            className="bg-white dark:bg-black border-slate-200 dark:border-slate-800 text-black dark:text-white"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, hooks: prev.marketingStrategy?.hooks?.filter((_, i) => i !== idx) || [] } }))}>
                                            <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Headlines */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Headlines</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, headlines: [...(prev.marketingStrategy?.headlines || []), ""] } }))}>+ Add Headline</Button>
                                </div>
                                {formData.marketingStrategy?.headlines?.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input 
                                            value={item} 
                                            onChange={(e) => {
                                                const newArr = [...(formData.marketingStrategy?.headlines || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, headlines: newArr } }));
                                            }}
                                            className="bg-white dark:bg-black border-slate-200 dark:border-slate-800 text-black dark:text-white"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, headlines: prev.marketingStrategy?.headlines?.filter((_, i) => i !== idx) || [] } }))}>
                                            <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Titles */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Searchable Titles</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, titles: [...(prev.marketingStrategy?.titles || []), ""] } }))}>+ Add Title</Button>
                                </div>
                                {formData.marketingStrategy?.titles?.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input 
                                            value={item} 
                                            onChange={(e) => {
                                                const newArr = [...(formData.marketingStrategy?.titles || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, titles: newArr } }));
                                            }}
                                            className="bg-white dark:bg-black border-slate-200 dark:border-slate-800 text-black dark:text-white"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, titles: prev.marketingStrategy?.titles?.filter((_, i) => i !== idx) || [] } }))}>
                                            <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Content Ideas */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Content Ideas</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, contentIdeas: [...(prev.marketingStrategy?.contentIdeas || []), ""] } }))}>+ Add Idea</Button>
                                </div>
                                {formData.marketingStrategy?.contentIdeas?.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Textarea 
                                            value={item} 
                                            onChange={(e) => {
                                                const newArr = [...(formData.marketingStrategy?.contentIdeas || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, contentIdeas: newArr } }));
                                            }}
                                            className="bg-white dark:bg-black border-slate-200 dark:border-slate-800 text-black dark:text-white h-20"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, contentIdeas: prev.marketingStrategy?.contentIdeas?.filter((_, i) => i !== idx) || [] } }))}>
                                            <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Social Posts */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Social Media Posts</label>
                                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] font-bold" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, socialPosts: [...(prev.marketingStrategy?.socialPosts || []), ""] } }))}>+ Add Post</Button>
                                </div>
                                {formData.marketingStrategy?.socialPosts?.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Textarea 
                                            value={item} 
                                            onChange={(e) => {
                                                const newArr = [...(formData.marketingStrategy?.socialPosts || [])];
                                                newArr[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, socialPosts: newArr } }));
                                            }}
                                            className="bg-white dark:bg-black border-slate-200 dark:border-slate-800 text-black dark:text-white h-32"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, marketingStrategy: { ...prev.marketingStrategy!, socialPosts: prev.marketingStrategy?.socialPosts?.filter((_, i) => i !== idx) || [] } }))}>
                                            <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
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
