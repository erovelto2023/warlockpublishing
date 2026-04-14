"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions/glossary"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Plus, Trash2, Video, BookOpen, BarChart3, Palette, Megaphone, HelpCircle, Zap, FileText, ShoppingBag, Table, Play, ChevronRight, Globe, Star } from "lucide-react"

const formSchema = z.object({
    term: z.string().optional(),
    slug: z.string().optional(),
    shortDefinition: z.string().optional(),
    definition: z.string().optional(),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    genre: z.string().optional(),
    trope: z.string().optional(),
    niche: z.string().optional(),
    publishingContext: z.string().optional(),
    keyCharacteristics: z.string().optional(),
    
    // Origin & Meaning
    origin: z.string().optional(),
    traditionalMeaning: z.string().optional(),
    modernUsage: z.string().optional(),
    expandedExplanation: z.string().optional(),
    
    // Content Sections
    howItWorks: z.string().optional(),
    benefits: z.string().optional(),
    howItMakesMoney: z.string().optional(),
    bestFor: z.string().optional(),
    startupCost: z.enum(['$0', '<$100', '$100+']).optional(),
    skillRequired: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    timeToCreate: z.string().optional(),
    estimatedRevenue: z.string().optional(),

    // AI Prompts
    productIdeaPrompt: z.string().optional(),
    contentStrategyPrompt: z.string().optional(),
    aiImagePrompt: z.string().optional(),

    // Discovery & SEO
    searchVolume: z.string().optional(),
    searchDifficulty: z.string().optional(),
    relatedKeywords: z.array(z.object({
        keyword: z.string().optional(),
        searchVolume: z.string().optional(),
        competitionLevel: z.string().optional()
    })).optional(),
    
    // Media
    videoTitle: z.string().optional(),
    videoUrl: z.string().optional(),
    videoSummary: z.string().optional(),
    
    // Article
    blogTitle: z.string().optional(),
    blogBody: z.string().optional(),
    blogUrl: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    focusKeyword: z.string().optional(),

    // Marketing
    brandingCues: z.string().optional(),
    marketingHooks: z.string().optional(),

    // High Fidelity Content
    faqs: z.array(z.object({
        question: z.string().optional(),
        answer: z.string().optional()
    })).optional(),
    productIdeas: z.array(z.object({
        title: z.string().optional(),
        type: z.string().optional(),
        pricePoint: z.string().optional(),
        description: z.string().optional()
    })).optional(),
    commonPitfalls: z.array(z.object({
        pitfall: z.string().optional(),
        whyItHappens: z.string().optional(),
        howToAvoid: z.string().optional()
    })).optional(),
    bestMarketingPlatforms: z.array(z.object({
        platform: z.string().optional(),
        reason: z.string().optional(),
        priority: z.enum(['Low', 'Medium', 'High']).optional()
    })).optional(),
    headlines: z.string().optional(),
    youtubeTitles: z.string().optional(),
    pinterestIdeas: z.string().optional(),
    instagramIdeas: z.string().optional(),
    referenceWebsites: z.array(z.object({
        name: z.string().optional(),
        url: z.string().optional()
    })).optional(),
    amazonProducts: z.array(z.object({
        name: z.string().optional(),
        url: z.string().optional()
    })).optional(),
    checklist: z.array(z.object({
        item: z.string().optional()
    })).optional(),
    expertOpinion: z.string().optional(),

    // Flags
    isPublished: z.boolean(),
    isPremium: z.boolean(),
})

interface GlossaryEntryFormProps {
    term?: any;
}

export default function GlossaryEntryForm({ term }: GlossaryEntryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            term: term?.term || "",
            slug: term?.slug || "",
            shortDefinition: term?.shortDefinition || "",
            definition: term?.definition || "",
            category: term?.category || "Writing",
            subCategory: term?.subCategory || "",
            genre: term?.genre || "",
            trope: term?.trope || "",
            niche: term?.niche || "",
            publishingContext: term?.publishingContext || "",
            keyCharacteristics: term?.keyCharacteristics?.join("\n") || "",
            origin: term?.origin || "",
            traditionalMeaning: term?.traditionalMeaning || "",
            modernUsage: term?.modernUsage || "",
            expandedExplanation: term?.expandedExplanation || "",
            howItWorks: term?.howItWorks || "",
            benefits: term?.benefits || "",
            howItMakesMoney: term?.howItMakesMoney || "",
            bestFor: term?.bestFor || "",
            startupCost: term?.startupCost || "$0",
            skillRequired: term?.skillRequired || "Beginner",
            timeToCreate: term?.timeToCreate || "",
            estimatedRevenue: term?.estimatedRevenue || "",
            productIdeaPrompt: term?.aiPromptCommandCenter?.productIdeaPrompt || "",
            contentStrategyPrompt: term?.aiPromptCommandCenter?.contentStrategyPrompt || "",
            aiImagePrompt: term?.aiPromptCommandCenter?.aiImagePrompt || "",
            searchVolume: term?.searchVolume || term?.marketDemand?.searchVolume || "",
            searchDifficulty: term?.searchDifficulty || term?.marketDemand?.competitionLevel || "",
            relatedKeywords: term?.relatedKeywords || [{ keyword: "", searchVolume: "", competitionLevel: "" }],
            videoTitle: term?.youtubeVideo?.title || term?.video?.title || "",
            videoUrl: term?.youtubeVideo?.url || term?.videoUrl || term?.video?.url || "",
            videoSummary: term?.youtubeVideo?.relevance || term?.video?.summary || "",
            blogTitle: term?.blogArticle?.title || term?.blogContent?.title || "",
            blogBody: term?.blogArticle?.content || term?.blogContent?.body || "",
            blogUrl: term?.blogArticle?.slug || term?.blogContent?.url || "",
            metaTitle: term?.blogArticle?.metaTitle || term?.blogContent?.metaTitle || "",
            metaDescription: term?.blogArticle?.metaDescription || term?.blogContent?.metaDescription || "",
            focusKeyword: term?.blogArticle?.focusKeyword || term?.blogContent?.focusKeyword || "",
            faqs: term?.faqs || [{ question: "", answer: "" }],
            productIdeas: term?.productIdeas || [{ title: "", type: "", pricePoint: "", description: "" }],
            commonPitfalls: term?.commonPitfalls || [{ pitfall: "", whyItHappens: "", howToAvoid: "" }],
            bestMarketingPlatforms: term?.bestMarketingPlatforms || [{ platform: "", reason: "", priority: "Medium" }],
            headlines: term?.headlines?.join("\n") || "",
            youtubeTitles: term?.youtubeTitles?.join("\n") || "",
            pinterestIdeas: term?.pinterestIdeas || term?.marketingHooks?.pinterestPinIdeas?.join("\n") || "",
            instagramIdeas: term?.instagramIdeas || "",
            referenceWebsites: term?.websitesRanking || [{ name: "", url: "" }],
            checklist: term?.checklist || term?.gettingStartedChecklist?.map((item: string) => ({ item })) || [{ item: "" }],
            amazonProducts: term?.amazonProducts || [{ name: "", url: "" }],
            expertOpinion: term?.expertOpinion || "",
            isPublished: term?.isPublished ?? true,
            isPremium: term?.isPremium ?? false,
            brandingCues: term?.brandingCues || "",
            marketingHooks: term?.marketingHooks?.blogTitles?.join("\n") || "",
        },
    })

    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
        control: form.control,
        name: "faqs"
    });

    const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
        control: form.control,
        name: "productIdeas"
    });

    const { fields: pitfallFields, append: appendPitfall, remove: removePitfall } = useFieldArray({
        control: form.control,
        name: "commonPitfalls"
    });

    const { fields: platformFields, append: appendPlatform, remove: removePlatform } = useFieldArray({
        control: form.control,
        name: "bestMarketingPlatforms"
    });

    const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({
        control: form.control,
        name: "relatedKeywords"
    });

    const { fields: webFields, append: appendWeb, remove: removeWeb } = useFieldArray({
        control: form.control,
        name: "referenceWebsites"
    });

    const { fields: amazonFields, append: appendAmazon, remove: removeAmazon } = useFieldArray({
        control: form.control,
        name: "amazonProducts"
    });

    const { fields: checklistFields, append: appendChecklist, remove: removeChecklist } = useFieldArray({
        control: form.control,
        name: "checklist"
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const formData = {
                ...values,
                keyCharacteristics: values.keyCharacteristics?.split("\n").map((k: string) => k.trim()).filter(Boolean),
                headlines: values.headlines?.split("\n").map((h: string) => h.trim()).filter(Boolean),
                youtubeTitles: values.youtubeTitles?.split("\n").map((t: string) => t.trim()).filter(Boolean),
                pinterestIdeas: values.pinterestIdeas?.split("\n").map((p: string) => p.trim()).filter(Boolean),
                instagramIdeas: values.instagramIdeas?.split("\n").map((i: string) => i.trim()).filter(Boolean),
                checklist: values.checklist?.map((c: any) => c.item?.trim()).filter(Boolean),
                amazonProducts: values.amazonProducts?.filter((a: any) => a.name),
                expertOpinion: values.expertOpinion,
                youtubeVideo: {
                    title: values.videoTitle,
                    url: values.videoUrl,
                    relevance: values.videoSummary,
                },
                videoUrl: values.videoUrl,
                blogArticle: {
                    title: values.blogTitle,
                    content: values.blogBody,
                    slug: values.blogUrl,
                    metaTitle: values.metaTitle,
                    metaDescription: values.metaDescription,
                    focusKeyword: values.focusKeyword,
                },
                aiPromptCommandCenter: {
                    productIdeaPrompt: values.productIdeaPrompt,
                    contentStrategyPrompt: values.contentStrategyPrompt,
                    aiImagePrompt: values.aiImagePrompt,
                },
                websitesRanking: values.referenceWebsites,
                marketingHooks: {
                    blogTitles: values.marketingHooks?.split("\n").map(h => h.trim()).filter(Boolean),
                    pinterestPinIdeas: values.pinterestIdeas?.split("\n").map(p => p.trim()).filter(Boolean),
                }
            }

            if (term?._id) {
                await updateGlossaryTerm(term._id, formData)
            } else {
                await createGlossaryTerm(formData)
            }
            router.push("/admin/glossary")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Error saving term")
        } finally {
            setLoading(false)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-20 text-slate-900">
                
                {/* TOP HEADER */}
                <div className="flex justify-between items-center bg-white text-slate-900 p-5 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                            {term ? "Update" : "Create"} <span className="text-blue-600">Glossary Asset</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mt-0.5">Refine writing & publishing technicalities</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" type="button" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-slate-700">Cancel</Button>
                        <Button type="submit" disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-700 font-semibold px-6">
                            {loading ? "Syncing..." : (term ? "Update Term" : "Save Registry")}
                        </Button>
                    </div>
                </div>

                {/* SECTION 3: GETTING STARTED CHECKLIST */}
                {/* SECTION 1: IDENTITY & CLASSIFICATION */}
                <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Identity & Taxonomy</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="term"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Primary Term</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="e.g. Secret Baby Trope" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SEO Slug</FormLabel>
                                    <FormControl><Input className="h-9 text-sm font-mono" placeholder="secret-baby-trope" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Category</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Writing" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subCategory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sub-Category</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Romance Tropes" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="niche"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Niche</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Publishing" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="publishingContext"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Publishing Context</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Business, Fiction..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* SECTION 2: MEANING & CONTEXT */}
                <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><BookOpen size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Contextual Meaning</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="origin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Historical Origin</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Origins..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="traditionalMeaning"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Traditional Concept</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Classical view..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="modernUsage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Modern Industry Standard</FormLabel>
                                <FormControl><Textarea className="text-sm min-h-[60px]" placeholder="Current industry trends..." {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="expandedExplanation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Expanded Synthesis</FormLabel>
                                <FormControl><Textarea className="text-sm min-h-[100px]" placeholder="Deep technical deep-dive..." {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* SECTION 3: CORE KNOWLEDGE BASE */}
                <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Zap size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Public Knowledge Base</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="shortDefinition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">1-Sentence Snapshot</FormLabel>
                                <FormControl><Textarea className="text-sm min-h-[50px] font-medium" placeholder="Brief elevator pitch..." {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="definition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Full Knowledge Injection</FormLabel>
                                <FormControl><Textarea className="text-sm min-h-[150px]" placeholder="Primary explanation..." {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="keyCharacteristics"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Key Characteristics (One per line)</FormLabel>
                                <FormControl><Textarea className="text-xs min-h-[100px]" placeholder="Feature 1\nFeature 2..." {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* SECTION 4: GETTING STARTED CHECKLIST */}
                <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Table size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Getting Started Checklist</h3>
                    </div>
                    <div className="space-y-3">
                        {checklistFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <FormField
                                    control={form.control}
                                    name={`checklist.${index}.item`}
                                    render={({ field }) => (
                                        <FormControl>
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-300">{index + 1}</span>
                                                <Input className="h-9 text-xs pl-8 bg-slate-50/50" placeholder="Step description..." {...field} />
                                            </div>
                                        </FormControl>
                                    )}
                                />
                                <button type="button" onClick={() => removeChecklist(index)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => appendChecklist({ item: "" })} className="w-full bg-slate-50 text-slate-400 hover:text-blue-600 border-dashed border-2 rounded-xl py-4 h-auto">
                        <Plus size={14} className="mr-2" /> Add Checklist Item
                    </Button>
                </div>

                {/* SECTION: FAQ ACCORDION BUILDER */}
                <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><HelpCircle size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">FAQ Accordion Builder</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {faqFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-slate-50 rounded-xl relative group">
                                <button
                                    type="button"
                                    onClick={() => removeFaq(index)}
                                    className="absolute -top-2 -right-2 bg-white text-slate-300 hover:text-red-500 rounded-full p-1 border border-slate-200 shadow-sm z-10"
                                >
                                    <Trash2 size={12} />
                                </button>
                                <div className="space-y-3">
                                    <FormField
                                        control={form.control}
                                        name={`faqs.${index}.question`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[9px] font-bold text-slate-400 uppercase">Question</FormLabel>
                                                <FormControl><Input className="h-8 text-xs bg-white" placeholder="What is..." {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`faqs.${index}.answer`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[9px] font-bold text-slate-400 uppercase">Answer</FormLabel>
                                                <FormControl><Textarea className="text-xs min-h-[60px] bg-white" placeholder="The answer is..." {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendFaq({ question: "", answer: "" })}
                        className="w-full border-dashed border-2 py-6 text-slate-400"
                    >
                        <Plus size={14} className="mr-2" /> Add FAQ Entry
                    </Button>
                </div>

                {/* SECTION 4: MONETIZATION BLUEPRINT */}
                <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><ShoppingBag size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Profit & Creation Blueprint</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                         <FormField
                            control={form.control}
                            name="howItMakesMoney"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">MMO Strategy</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Ad revenue, affiliate products, course sales..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="bestFor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Optimized Format</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Digital Downloads, Paperbacks..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-3 gap-2 col-span-2">
                            <FormField
                                control={form.control}
                                name="startupCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Capital Required</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-9 text-sm">
                                                    <SelectValue placeholder="Select cost" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="$0">$0 / Minimal</SelectItem>
                                                <SelectItem value="<$100">&lt;$100</SelectItem>
                                                <SelectItem value="$100+">$100+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="timeToCreate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Build Duration</FormLabel>
                                        <FormControl><Input className="h-9 text-sm" placeholder="Quick / Long-term" {...field} /></FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="estimatedRevenue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Revenue Upside</FormLabel>
                                        <FormControl><Input className="h-9 text-sm" placeholder="$500 - $5k/mo" {...field} /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="skillRequired"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Skillset Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-9 text-sm">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* SECTION 5: Amazon Affiliate Matrix */}
                <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Palette size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Amazon Recommended Arsenal</h3>
                    </div>
                    <div className="space-y-3">
                        {amazonFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <FormField
                                    control={form.control}
                                    name={`amazonProducts.${index}.name`}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input placeholder="Product Name" className="h-9 text-[11px] bg-white" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`amazonProducts.${index}.url`}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input placeholder="Link" className="h-9 text-[11px] font-mono bg-white" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeAmazon(index)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => appendAmazon({ name: '', url: '' })}
                        className="w-full bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-dashed border-2 rounded-xl py-4 h-auto"
                    >
                        <Plus size={14} className="mr-2" /> Inject More Affiliate Assets
                    </Button>
                </div>

                {/* SECTION 6: PRODUCT IDEA PIPELINE */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4 text-white">
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-3 mb-4">
                        <div className="p-1.5 bg-blue-500 text-white rounded-lg"><Megaphone size={18} /></div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-tight">Product Idea Pipeline</h3>
                            <p className="text-slate-400 text-[9px] font-semibold uppercase tracking-widest mt-0.5">Custom monetization opportunities</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {productFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-white/5 rounded-xl border border-white/10 relative group space-y-3">
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="absolute -top-2 -right-2 bg-slate-800 text-white/20 hover:text-red-400 rounded-full p-1 border border-white/10 shadow-sm z-10"
                                >
                                    <Trash2 size={12} />
                                </button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name={`productIdeas.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[9px] font-bold text-white/40 uppercase">Blueprint Title</FormLabel>
                                                <FormControl><Input className="h-8 text-xs bg-white/5 border-white/10" placeholder="e.g. 50 Socialization Story Prompts" {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`productIdeas.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[9px] font-bold text-white/40 uppercase">Product Category</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-8 text-xs bg-white/5 border-white/10"><SelectValue placeholder="Select type" /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Physical Book">Physical Book</SelectItem>
                                                        <SelectItem value="Ebook">Ebook</SelectItem>
                                                        <SelectItem value="Digital Tool/Software">Digital Tool/Software</SelectItem>
                                                        <SelectItem value="Course/Workshop">Course/Workshop</SelectItem>
                                                        <SelectItem value="Print on Demand">Print on Demand</SelectItem>
                                                        <SelectItem value="Service/Consulting">Service/Consulting</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name={`productIdeas.${index}.pricePoint`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[9px] font-bold text-white/40 uppercase">Target Price</FormLabel>
                                                <FormControl><Input className="h-8 text-xs bg-white/5 border-white/10" placeholder="e.g. $27.00" {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`productIdeas.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[9px] font-bold text-white/40 uppercase">Value Proposition</FormLabel>
                                                <FormControl><Input className="h-8 text-xs bg-white/5 border-white/10" placeholder="Brief pitch..." {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => appendProduct({ title: "", type: "Ebook", pricePoint: "", description: "" })}
                        className="w-full text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-[10px] uppercase border-dashed border border-white/10 py-4 h-auto"
                    >
                        <Plus size={12} className="mr-2" /> Add Strategic Idea
                    </Button>
                </div>

                {/* SECTION: MARKETING & CONTENT STRATEGY */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Megaphone size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Marketing & Content Strategy</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="marketingHooks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hook Vault (One per line)</FormLabel>
                                    <FormControl><Textarea className="text-xs min-h-[100px]" placeholder="Hook 1\nHook 2..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="headlines"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Blog Headlines (One per line)</FormLabel>
                                    <FormControl><Textarea className="text-xs min-h-[100px]" placeholder="Headline 1\nHeadline 2..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="youtubeTitles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">YouTube Titles (One per line)</FormLabel>
                                    <FormControl><Textarea className="text-xs min-h-[100px]" placeholder="Title 1\nTitle 2..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="pinterestIdeas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pinterest Pin Ideas (One per line)</FormLabel>
                                    <FormControl><Textarea className="text-xs min-h-[100px]" placeholder="Idea 1\nIdea 2..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="instagramIdeas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Instagram Post Ideas (One per line)</FormLabel>
                                    <FormControl><Textarea className="text-xs min-h-[100px]" placeholder="Post 1\nPost 2..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* SECTION: MARKET STRATEGY & SEO */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Market Strategy & SEO</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="searchVolume"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Approx. Search Volume</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="1k - 5k /mo" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="searchDifficulty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Keyword Difficulty</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" placeholder="Low / Medium / High" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Related High-Value Keywords</FormLabel>
                        {keywordFields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg relative group">
                                <button
                                    type="button"
                                    onClick={() => removeKeyword(index)}
                                    className="absolute -top-1 -right-1 bg-white text-slate-300 hover:text-red-500 rounded-full p-1 border border-slate-200 shadow-sm z-10"
                                >
                                    <Trash2 size={10} />
                                </button>
                                <FormField
                                    control={form.control}
                                    name={`relatedKeywords.${index}.keyword`}
                                    render={({ field }) => (
                                        <FormControl><Input className="h-8 text-[11px] bg-white" placeholder="Keyword" {...field} /></FormControl>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`relatedKeywords.${index}.searchVolume`}
                                    render={({ field }) => (
                                        <FormControl><Input className="h-8 text-[11px] bg-white" placeholder="Volume" {...field} /></FormControl>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`relatedKeywords.${index}.competitionLevel`}
                                    render={({ field }) => (
                                        <FormControl><Input className="h-8 text-[11px] bg-white" placeholder="Difficulty" {...field} /></FormControl>
                                    )}
                                />
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => appendKeyword({ keyword: "", searchVolume: "", competitionLevel: "" })}
                            className="w-full text-slate-400 hover:text-blue-600 bg-slate-50/50 py-2 h-auto text-[10px] uppercase font-bold"
                        >
                            <Plus size={10} className="mr-1" /> Add SEO Keyword
                        </Button>
                    </div>
                </div>

                {/* SECTION: PLATFORM STRATEGY & PITFALLS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PLATFORM STRATEGY */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Megaphone size={18} /></div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Platform Strategy</h3>
                        </div>
                        <div className="space-y-3">
                            {platformFields.map((field, index) => (
                                <div key={field.id} className="p-3 bg-slate-50 rounded-lg space-y-2 relative group">
                                    <button
                                        type="button"
                                        onClick={() => removePlatform(index)}
                                        className="absolute -top-1 -right-1 bg-white text-slate-300 hover:text-red-500 rounded-full p-1 border border-slate-200 shadow-sm z-10"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`bestMarketingPlatforms.${index}.platform`}
                                            render={({ field }) => (
                                                <FormControl><Input className="h-8 text-[11px] bg-white" placeholder="Platform" {...field} /></FormControl>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`bestMarketingPlatforms.${index}.priority`}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl><SelectTrigger className="h-8 text-[11px] bg-white"><SelectValue placeholder="Priority" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="High">High</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="Low">Low</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`bestMarketingPlatforms.${index}.reason`}
                                        render={({ field }) => (
                                            <FormControl><Input className="h-8 text-[11px] bg-white" placeholder="Why this platform?" {...field} /></FormControl>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => appendPlatform({ platform: "", reason: "", priority: "Medium" })}
                            className="w-full text-slate-400 hover:text-blue-600 bg-slate-50/50 py-2 h-auto text-[10px] uppercase font-bold"
                        >
                            <Plus size={10} className="mr-1" /> Add Platform
                        </Button>
                    </div>

                    {/* COMMON PITFALLS */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Zap size={18} /></div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Common Pitfalls</h3>
                        </div>
                        <div className="space-y-3">
                            {pitfallFields.map((field, index) => (
                                <div key={field.id} className="p-3 bg-red-50/30 rounded-lg space-y-2 relative group border border-red-100">
                                    <button
                                        type="button"
                                        onClick={() => removePitfall(index)}
                                        className="absolute -top-1 -right-1 bg-white text-slate-300 hover:text-red-500 rounded-full p-1 border border-slate-200 shadow-sm z-10"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                    <FormField
                                        control={form.control}
                                        name={`commonPitfalls.${index}.pitfall`}
                                        render={({ field }) => (
                                            <FormControl><Input className="h-8 text-[11px] bg-white border-red-100" placeholder="The Pitfall" {...field} /></FormControl>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`commonPitfalls.${index}.howToAvoid`}
                                        render={({ field }) => (
                                            <FormControl><Input className="h-8 text-[11px] bg-white border-red-100" placeholder="How to avoid?" {...field} /></FormControl>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => appendPitfall({ pitfall: "", whyItHappens: "", howToAvoid: "" })}
                            className="w-full text-red-400 hover:text-red-600 bg-red-50/30 py-2 h-auto text-[10px] uppercase font-bold border border-red-100"
                        >
                            <Plus size={10} className="mr-1" /> Add Pitfall
                        </Button>
                    </div>
                </div>

                {/* SECTION: AUTHORITY REFERENCE HUB */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-slate-50 text-slate-600 rounded-lg"><Globe size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Authority Reference Hub</h3>
                    </div>
                    
                    <div className="space-y-3">
                        {webFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <FormField
                                    control={form.control}
                                    name={`referenceWebsites.${index}.name`}
                                    render={({ field }) => (
                                        <FormControl><Input className="h-9 text-[11px] bg-slate-50/50" placeholder="Site Name" {...field} /></FormControl>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`referenceWebsites.${index}.url`}
                                    render={({ field }) => (
                                        <FormControl><Input className="h-9 text-[11px] font-mono bg-slate-50/50" placeholder="URL" {...field} /></FormControl>
                                    )}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeWeb(index)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => appendWeb({ name: '', url: '' })}
                        className="w-full bg-slate-50 text-slate-400 hover:text-indigo-600 border-dashed border-2 rounded-xl py-4 h-auto"
                    >
                        <Plus size={14} className="mr-2" /> Link Authority Site
                    </Button>
                </div>

                {/* SECTION 7: AI COMMAND CENTER */}
                <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-indigo-100 pb-3 mb-4">
                        <div className="p-1.5 bg-indigo-600 text-white rounded-lg"><Zap size={18} /></div>
                        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">AI Command Center</h3>
                    </div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productIdeaPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Product Generation Prompt</FormLabel>
                                    <FormControl><Textarea className="text-xs bg-white/50 border-indigo-100" placeholder="AI instructions for products..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contentStrategyPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Content Strategy Prompt</FormLabel>
                                    <FormControl><Textarea className="text-xs bg-white/50 border-indigo-100" placeholder="AI instructions for social..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="aiImagePrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Creative Image Prompt</FormLabel>
                                    <FormControl><Textarea className="text-xs bg-white/50 border-indigo-100" placeholder="AI instructions for artwork..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* SECTION 8: DEEP-DIVE & SEO */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-slate-900 text-white rounded-lg"><FileText size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">SEO & Editorial Center</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="blogTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Legacy Article Title</FormLabel>
                                <FormControl><Input className="h-9 text-sm" placeholder="Article Headline" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="blogBody"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Body Content (HTML/Markdown)</FormLabel>
                                <FormControl><Textarea className="text-sm min-h-[300px] leading-relaxed" placeholder="Complete technical guide..." {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="metaTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SEO Meta Title</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="focusKeyword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Primary Keyword</FormLabel>
                                    <FormControl><Input className="h-9 text-sm" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Meta Description</FormLabel>
                                <FormControl><Textarea className="text-xs min-h-[60px]" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                        <div className="p-1.5 bg-slate-50 text-slate-600 rounded-lg"><Star size={18} /></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Expert Opinion / Final Word</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="expertOpinion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Professional Synthesis</FormLabel>
                                <FormControl><Textarea className="text-sm min-h-[150px]" placeholder="Add expert insights, final thoughts, or a master summary here..." {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* FINAL STICKY FOOTER */}
                <div className="flex justify-between items-center p-5 bg-white rounded-xl border border-slate-200 shadow-lg mt-10">
                    <div className="flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel className="text-xs font-medium text-slate-600 cursor-pointer">Published to Hub</FormLabel>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="isPremium"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel className="text-xs font-medium text-slate-600 cursor-pointer">Premium Content</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" type="button" size="sm" onClick={() => router.push("/admin/glossary")}>Cancel</Button>
                         <Button type="submit" disabled={loading} size="sm" className="bg-slate-900 hover:bg-black text-white px-8 font-bold tracking-tight h-10">
                            {loading ? "Transmitting..." : (term ? "Commit Changes" : "Finalize Registration")}
                        </Button>
                    </div>
                </div>

            </form>
        </Form>
    )
}
