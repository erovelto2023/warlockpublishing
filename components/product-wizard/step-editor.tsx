"use client"

import { WizardData } from "./ProductWizard"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import MediaLibrary from '@/components/admin/MediaLibrary'
import { EbookTemplateRenderer } from "../templates/ebook/EbookTemplateRenderer"
import { ThankYouTemplateRenderer } from "../templates/thankyou/ThankYouTemplateRenderer"
import { TEMPLATE_CONFIGS } from "./ebook-templates-config"

interface StepEditorProps {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
}

// Default configuration for Software Template
const SOFTWARE_BLOCKS = [
    { id: "navbar", label: "Navigation Bar", fields: [] },
    {
        id: "hero", label: "Hero Section", fields: [
            { name: "headline", label: "Headline", type: "text", default: "Manage projects without the chaos." },
            { name: "subheadline", label: "Subheadline", type: "textarea", default: "TaskFlow helps teams organize, track, and manage their work with ease." },
            { name: "ctaText", label: "CTA Button Text", type: "text", default: "Start Free Trial" },
        ]
    },
    {
        id: "features", label: "Features Grid", fields: [
            { name: "title", label: "Section Title", type: "text", default: "Everything you need to ship faster." },
        ]
    },
    {
        id: "pricing", label: "Pricing Table", fields: [
            { name: "title", label: "Section Title", type: "text", default: "Simple, transparent pricing." },
        ]
    },
    { id: "testimonials", label: "Testimonials", fields: [] },
    {
        id: "cta", label: "Bottom CTA", fields: [
            { name: "title", label: "Title", type: "text", default: "Ready to get started?" },
        ]
    },
    { id: "footer", label: "Footer", fields: [] },
]

// Default configuration for Ebook Template
const EBOOK_BLOCKS = [
    {
        id: "navbar", label: "Navigation Bar", fields: [
            { name: "brandName", label: "Brand Name", type: "text", default: "FlowState" },
            { name: "link1", label: "Link 1 Text", type: "text", default: "Why This?" },
            { name: "link2", label: "Link 2 Text", type: "text", default: "Chapters" },
            { name: "link3", label: "Link 3 Text", type: "text", default: "Bonuses" },
            { name: "ctaText", label: "CTA Button Text", type: "text", default: "Get the Book" },
        ]
    },
    {
        id: "hero", label: "Hero Section", fields: [
            { name: "badgeText", label: "Badge Text", type: "text", default: "New 2nd Edition Released" },
            { name: "headline", label: "Headline", type: "text", default: "Reclaim Your Focus in a Distracted World" },
            { name: "subheadline", label: "Subheadline", type: "textarea", default: "Stop drowning in notifications. \"Mastering Flow\" is the science-backed guide to achieving 4 hours of deep work every single day." },
            { name: "bullet1", label: "Benefit Bullet 1", type: "text", default: "Eliminate brain fog and mental fatigue by noon." },
            { name: "bullet2", label: "Benefit Bullet 2", type: "text", default: "Structure your day to get 2x more done in half the time." },
            { name: "bullet3", label: "Benefit Bullet 3", type: "text", default: "Learn the \"No-Guilt\" framework for turning down meetings." },
            { name: "ctaText", label: "CTA Button Text", type: "text", default: "Get the Ebook" },
            { name: "checkoutUrl", label: "Checkout URL / Embed Code", type: "text", default: "#pricing" },
            { name: "trackingCodeBody", label: "Body Tracking Code (Pixel/Analytics)", type: "textarea", default: "" },
            { name: "bookCoverImage", label: "Book Cover Image URL", type: "image", default: "https://placehold.co/400x600/1e293b/ffffff?text=Book+Cover" },
        ]
    },
    {
        id: "socialProofLogos", label: "Social Proof (Logos)", fields: [
            { name: "title", label: "Section Title", type: "text", default: "Techniques featured in" },
            { name: "logo1", label: "Logo 1 Name", type: "text", default: "TECHDAILY" },
            { name: "logo2", label: "Logo 2 Name", type: "text", default: "PRODUCTHUNT" },
            { name: "logo3", label: "Logo 3 Name", type: "text", default: "CIRCLE" },
            { name: "logo4", label: "Logo 4 Name", type: "text", default: "STARTUP.IO" },
        ]
    },
    {
        id: "pain", label: "Pain & Problem", fields: [
            { name: "title", label: "Section Title", type: "text", default: "Does this sound familiar?" },
            { name: "p1", label: "Paragraph 1", type: "textarea", default: "You sit down at 9 AM, ready to crush your to-do list. But first, you check one email. Then a Slack notification pops up. Then you realize you haven't had coffee." },
            { name: "p2", label: "Paragraph 2", type: "textarea", default: "By 5 PM, you're exhausted, yet you look at your list and realize: You didn't actually finish the one big thing that mattered." },
            { name: "card1Title", label: "Problem Card 1 Title", type: "text", default: "The Time Trap" },
            { name: "card1Desc", label: "Problem Card 1 Desc", type: "textarea", default: "Why working 80 hours a week is actually destroying your output quality and creativity." },
            { name: "card1Icon", label: "Problem Card 1 Icon", type: "select", options: ["clock", "alert", "zap", "shield", "user", "star"], default: "clock" },
            { name: "card2Title", label: "Problem Card 2 Title", type: "text", default: "Distraction Epidemic" },
            { name: "card2Desc", label: "Problem Card 2 Desc", type: "textarea", default: "How modern apps are engineered to steal your attention and how to build a fortress against them." },
            { name: "card2Icon", label: "Problem Card 2 Icon", type: "select", options: ["clock", "alert", "zap", "shield", "user", "star"], default: "alert" },
            { name: "card3Title", label: "Solution Card Title", type: "text", default: "The Solution: Flow" },
            { name: "card3Desc", label: "Solution Card Desc", type: "textarea", default: "There is a biochemical state where work feels effortless and quality soars. You just need the trigger." },
            { name: "card3Icon", label: "Solution Card Icon", type: "select", options: ["clock", "alert", "zap", "shield", "user", "star"], default: "zap" },
        ]
    },
    {
        id: "promise", label: "Who Is This For?", fields: [
            { name: "forTitle", label: "For You Title", type: "text", default: "This Book Is For You If..." },
            { name: "for1", label: "For You Item 1", type: "text", default: "You feel \"busy\" all day but have nothing to show for it." },
            { name: "for2", label: "For You Item 2", type: "text", default: "You want to advance your career without working nights and weekends." },
            { name: "for3", label: "For You Item 3", type: "text", default: "You are a knowledge worker, creative, or student facing complex tasks." },
            { name: "notForTitle", label: "Not For You Title", type: "text", default: "This Is NOT For You If..." },
            { name: "notFor1", label: "Not For You Item 1", type: "text", default: "You are looking for a \"get rich quick\" scheme." },
            { name: "notFor2", label: "Not For You Item 2", type: "text", default: "You enjoy the \"hustle culture\" of working 16 hours a day." },
            { name: "notFor3", label: "Not For You Item 3", type: "text", default: "You want theory without practical application." },
        ]
    },
    {
        id: "framework", label: "The Framework", fields: [
            { name: "title", label: "Section Title", type: "text", default: "The \"Deep Work\" Framework" },
            { name: "step1Title", label: "Step 1 Title", type: "text", default: "Eliminate" },
            { name: "step1Desc", label: "Step 1 Desc", type: "textarea", default: "Identify and ruthlessly cut the shallow work draining your energy." },
            { name: "step2Title", label: "Step 2 Title", type: "text", default: "Automate" },
            { name: "step2Desc", label: "Step 2 Desc", type: "textarea", default: "Build systems that handle the repetitive tasks for you." },
            { name: "step3Title", label: "Step 3 Title", type: "text", default: "Elevate" },
            { name: "step3Desc", label: "Step 3 Desc", type: "textarea", default: "Enter the flow state and produce your life's best work." },
        ]
    },
    {
        id: "chapters", label: "Chapters / Curriculum", fields: [
            { name: "title", label: "Section Title", type: "text", default: "What's Inside?" },
            { name: "subtitle", label: "Subtitle", type: "textarea", default: "Over 200 pages of actionable strategies, templates, and systems to rebuild your work life." },
            { name: "ch1Title", label: "Chapter 1 Title", type: "text", default: "The Biology of Focus" },
            { name: "ch1Desc", label: "Chapter 1 Desc", type: "text", default: "Understanding dopamine and attention residue." },
            { name: "ch2Title", label: "Chapter 2 Title", type: "text", default: "Environment Design" },
            { name: "ch2Desc", label: "Chapter 2 Desc", type: "text", default: "Setting up your physical and digital workspace for success." },
            { name: "ch3Title", label: "Chapter 3 Title", type: "text", default: "The 4-Hour Deep Work System" },
            { name: "ch3Desc", label: "Chapter 3 Desc", type: "text", default: "My proprietary scheduling method for maximum output." },
            { name: "ch4Title", label: "Chapter 4 Title", type: "text", default: "Saying \"No\" Gracefully" },
            { name: "ch4Desc", label: "Chapter 4 Desc", type: "text", default: "Scripts and strategies to protect your time without burning bridges." },
            { name: "previewTitle", label: "Preview Card Title", type: "text", default: "The 90-Minute Cycle" },
            { name: "previewText", label: "Preview Card Text", type: "textarea", default: "Our brains are not designed for 8-hour marathons. They operate in ultradian rhythms..." },
            { name: "previewKeyInsight", label: "Preview Key Insight", type: "textarea", default: "Rest is not the opposite of work. It is a necessary partner to it. Without high-quality rest, high-quality work is impossible." },
        ]
    },
    {
        id: "reviews", label: "Social Proof (Reviews)", fields: [
            { name: "title", label: "Section Title", type: "text", default: "Don't just take our word for it" },
            { name: "subtitle", label: "Subtitle", type: "text", default: "Join over 10,000 readers who have transformed their work habits." },
            { name: "rev1Text", label: "Review 1 Text", type: "textarea", default: "\"I was skeptical about another 'productivity' book, but Chapter 4 on saying 'No' completely changed my office dynamics. Worth 10x the price.\"" },
            { name: "rev1Name", label: "Review 1 Name", type: "text", default: "Marcus Kim" },
            { name: "rev1Role", label: "Review 1 Role", type: "text", default: "Product Manager" },
            { name: "rev2Text", label: "Review 2 Text", type: "textarea", default: "\"The biology breakdown was eye-opening. I stopped drinking coffee after 2 PM and my focus the next morning doubled. Simple but effective.\"" },
            { name: "rev2Name", label: "Review 2 Name", type: "text", default: "Sarah Jenkins" },
            { name: "rev2Role", label: "Review 2 Role", type: "text", default: "Freelance Designer" },
            { name: "rev3Text", label: "Review 3 Text", type: "textarea", default: "\"The templates alone are worth the price. I just copy-pasted the 'Deep Work' schedule into my calendar and it actually stuck.\"" },
            { name: "rev3Name", label: "Review 3 Name", type: "text", default: "David Ross" },
            { name: "rev3Role", label: "Review 3 Role", type: "text", default: "Startup Founder" },
        ]
    },
    {
        id: "author", label: "Author Section", fields: [
            { name: "title", label: "Title", type: "text", default: "Hi, I'm Alex Vandyne." },
            { name: "role", label: "Role/Subtitle", type: "text", default: "Productivity Consultant & Ex-Google Engineer" },
            { name: "bio", label: "Bio", type: "textarea", default: "I spent 10 years in Silicon Valley building products designed to steal your attention. After burning out, I spent 3 years researching neuroscience and psychology to understand how to reclaim my brain. This book is the manual I wish I had a decade ago." },
            { name: "authorImage", label: "Author Image URL", type: "image", default: "https://placehold.co/200x200/e2e8f0/94a3b8?text=Author" },
        ]
    },
    {
        id: "bonuses", label: "Bonuses", fields: [
            { name: "title", label: "Section Title", type: "text", default: "FREE Bonuses When You Order Today" },
            { name: "subtitle", label: "Subtitle", type: "text", default: "These resources are designed to help you implement the system immediately." },
            { name: "bonus1Title", label: "Bonus 1 Title", type: "text", default: "Deep Work Audio Experience" },
            { name: "bonus1Desc", label: "Bonus 1 Desc", type: "textarea", default: "Binaural beats and guided focus sessions to help you trigger flow on demand." },
            { name: "bonus1Value", label: "Bonus 1 Value", type: "text", default: "$29" },
            { name: "bonus2Title", label: "Bonus 2 Title", type: "text", default: "Notion Dashboard Template" },
            { name: "bonus2Desc", label: "Bonus 2 Desc", type: "textarea", default: "The exact digital workspace I use to manage tasks, goals, and deep work blocks." },
            { name: "bonus2Value", label: "Bonus 2 Value", type: "text", default: "$19" },
        ]
    },
    {
        id: "pricing", label: "Pricing Section", fields: [
            { name: "title", label: "Section Title", type: "text", default: "Choose Your Path to Focus" },
            { name: "subtitle", label: "Subtitle", type: "text", default: "One-time payment. Instant access." },
            { name: "tier1Name", label: "Tier 1 Name", type: "text", default: "The Ebook" },
            { name: "tier1Price", label: "Tier 1 Price", type: "text", default: "$29" },
            { name: "tier1Link", label: "Tier 1 Checkout URL", type: "text", default: "#" },
            { name: "tier2Name", label: "Tier 2 Name", type: "text", default: "Complete System" },
            { name: "tier2Price", label: "Tier 2 Price", type: "text", default: "$59" },
            { name: "tier2OldPrice", label: "Tier 2 Old Price", type: "text", default: "$99" },
            { name: "tier2Link", label: "Tier 2 Checkout URL", type: "text", default: "#" },
            { name: "tier3Name", label: "Tier 3 Name", type: "text", default: "Team Pack" },
            { name: "tier3Price", label: "Tier 3 Price", type: "text", default: "$199" },
            { name: "tier3Link", label: "Tier 3 Checkout URL", type: "text", default: "#" },
        ]
    },
    {
        id: "faq", label: "FAQ Section", fields: [
            { name: "title", label: "Section Title", type: "text", default: "Frequently Asked Questions" },
            { name: "q1", label: "Question 1", type: "text", default: "How is the ebook delivered?" },
            { name: "a1", label: "Answer 1", type: "textarea", default: "Immediately after purchase, you will receive an email with a download link. You'll get access to the PDF, ePub (for Kindle/Books), and audio files instantly." },
            { name: "q2", label: "Question 2", type: "text", default: "Is this suitable for creatives or just developers?" },
            { name: "a2", label: "Answer 2", type: "textarea", default: "The principles in this book are universal. Whether you're coding, designing, writing, or managing, deep work is essential. We have specific chapters dedicated to creative flow states." },
            { name: "q3", label: "Question 3", type: "text", default: "What if I don't like it?" },
            { name: "a3", label: "Answer 3", type: "textarea", default: "We offer a 30-day, no-questions-asked money-back guarantee. Just email us at support@flowstatemedia.com and we'll refund you immediately." },
        ]
    },
    {
        id: "footer", label: "Footer", fields: [
            { name: "tagline", label: "Footer Tagline", type: "text", default: "Helping you do your best work." },
            { name: "copyright", label: "Copyright Text", type: "text", default: "FlowState Media" },
            { name: "twitterUrl", label: "Twitter URL", type: "text", default: "#" },
            { name: "linkedinUrl", label: "LinkedIn URL", type: "text", default: "#" },
            { name: "instagramUrl", label: "Instagram URL", type: "text", default: "#" },
        ]
    },
]

// Default configuration for Thank You Page Template
const THANK_YOU_BLOCKS = [
    {
        id: "header", label: "Header Section", fields: [
            { name: "title", label: "Title", type: "text", default: "Order Confirmed!" },
            { name: "subtitle", label: "Subtitle", type: "text", default: "Thank you for your purchase. You now have full access." },
        ]
    },
    {
        id: "mainProduct", label: "Main Product Download", fields: [
            { name: "productName", label: "Product Name", type: "text", default: "Pro Software Bundle v2.0" },
            { name: "productDesc", label: "Description", type: "text", default: "The core software package. Includes installation guide." },
            { name: "licenseKey", label: "License Key (Optional)", type: "text", default: "PRO-8832-XK99-MN21" },
            { name: "buttonText", label: "Button Text", type: "text", default: "Download for Windows" },
            { name: "downloadUrl", label: "Download URL", type: "text", default: "#" },
        ]
    },
    {
        id: "additionalItems", label: "Additional Items (Upsells/Community)", fields: [
            { name: "item1Title", label: "Item 1 Title", type: "text", default: "Masterclass Video Course" },
            { name: "item1Desc", label: "Item 1 Description", type: "textarea", default: "Access the 12-module video training series included with your bundle." },
            { name: "item1BtnText", label: "Item 1 Button Text", type: "text", default: "Start Learning" },
            { name: "item1Url", label: "Item 1 URL", type: "text", default: "#" },
            { name: "item2Title", label: "Item 2 Title", type: "text", default: "VIP Community Access" },
            { name: "item2Desc", label: "Item 2 Description", type: "textarea", default: "Join the private Discord server and forum to network with other pros." },
            { name: "item2BtnText", label: "Item 2 Button Text", type: "text", default: "Join Community" },
            { name: "item2Url", label: "Item 2 URL", type: "text", default: "#" },
        ]
    },
    {
        id: "footer", label: "Footer", fields: [
            { name: "helpText", label: "Help Text", type: "text", default: "Need help?" },
            { name: "supportLink", label: "Support Link", type: "text", default: "#" },
        ]
    },
]



export function StepEditor({ data, updateData }: StepEditorProps) {
    const [mediaTarget, setMediaTarget] = useState<{blockId: string, fieldName: string} | null>(null);

    // Determine which blocks to use based on product type
    let currentBlocksConfig = data.productType === 'ebook' ? EBOOK_BLOCKS : SOFTWARE_BLOCKS;

    // Check if a specific template config exists
    if (data.productType === 'ebook' && data.templateId && TEMPLATE_CONFIGS[data.templateId]) {
        currentBlocksConfig = TEMPLATE_CONFIGS[data.templateId];
    }

    // Override if it's a Thank You page
    if (data.pageType === 'thankyou') {
        currentBlocksConfig = THANK_YOU_BLOCKS;
    }

    // Initialize or sync contentData
    useEffect(() => {
        if (data.productType === 'software' || data.productType === 'ebook' || data.pageType === 'thankyou') {
            const currentBlocks = data.contentData?.blocks || [];

            // Map over the CONFIG to ensure we have all blocks in the correct order
            const mergedBlocks = currentBlocksConfig.map(def => {
                const existingBlock = currentBlocks.find((b: any) => b.id === def.id);

                // Start with default data for this block type
                const defaultData = def.fields.reduce((acc: any, field: any) => {
                    acc[field.name] = field.default;
                    return acc;
                }, {});

                if (existingBlock) {
                    // Merge existing data on top of defaults (to keep user edits but add new fields)
                    return {
                        id: def.id,
                        enabled: existingBlock.enabled ?? true,
                        data: { ...defaultData, ...(existingBlock.data || {}) }
                    };
                } else {
                    // New block
                    return {
                        id: def.id,
                        enabled: true,
                        data: defaultData
                    };
                }
            });

            // Check if we need to update (avoid infinite loop)
            if (JSON.stringify(mergedBlocks) !== JSON.stringify(currentBlocks)) {
                updateData({ contentData: { blocks: mergedBlocks } });
            }
        }
    }, [data.productType, data.pageType, currentBlocksConfig, data.contentData?.blocks, updateData]);

    const blocks = data.contentData?.blocks || []

    const toggleBlock = (blockId: string, enabled: boolean) => {
        const newBlocks = blocks.map((b: any) =>
            b.id === blockId ? { ...b, enabled } : b
        )
        updateData({ contentData: { ...data.contentData, blocks: newBlocks } })
    }

    const updateBlockData = (blockId: string, fieldName: string, value: string) => {
        const newBlocks = blocks.map((b: any) =>
            b.id === blockId ? { ...b, data: { ...b.data, [fieldName]: value } } : b
        )
        updateData({ contentData: { ...data.contentData, blocks: newBlocks } })
    }

    if (data.pageType === 'custom_html') {
        return (
            <div className="space-y-4 h-[600px] flex flex-col">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-700 flex-shrink-0">
                    <p className="font-semibold">Custom HTML Mode</p>
                    <p>Paste your raw HTML code below. You can include GrooveSell checkout forms, tracking scripts, and custom styles directly.</p>
                </div>
                <div className="space-y-2 flex-1 flex flex-col">
                    <Label htmlFor="htmlContent">HTML Content</Label>
                    <Textarea
                        id="htmlContent"
                        className="font-mono text-sm flex-1 p-4 text-slate-900"
                        value={data.htmlContent || ''}
                        onChange={(e) => updateData({ htmlContent: e.target.value })}
                        placeholder="<!DOCTYPE html>..."
                    />
                </div>
            </div>
        )
    }

    if (data.productType !== 'software' && data.productType !== 'ebook' && data.pageType !== 'thankyou') {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Visual editor is currently only available for Software, Ebook, Amazon, and Thank You page templates.</p>
                <p className="text-sm text-slate-400 mt-2">You can continue to the next step.</p>
            </div>
        )
    }

    return (
        <div className="flex h-[600px] border rounded-lg overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-1/3 border-r bg-slate-50 overflow-y-auto p-4">
                <h3 className="font-bold mb-4">Page Sections</h3>
                <div className="space-y-4">
                    {blocks.map((block: any) => {
                        const def = currentBlocksConfig.find(b => b.id === block.id)
                        if (!def) return null

                        return (
                            <div key={block.id} className="bg-white border rounded-lg shadow-sm">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <span className="font-medium text-sm">{def.label}</span>
                                    <Switch
                                        checked={block.enabled}
                                        onCheckedChange={(checked) => toggleBlock(block.id, checked)}
                                    />
                                </div>
                                {block.enabled && def.fields.length > 0 && (
                                    <div className="p-3 space-y-3 bg-slate-50/50">
                                        {def.fields.map((field: any) => (
                                            <div key={field.name} className="space-y-1">
                                                <Label className="text-xs text-slate-500">{field.label}</Label>
                                                {field.type === 'textarea' ? (
                                                    <Textarea
                                                        className="h-20 text-sm text-slate-900"
                                                        value={block.data?.[field.name] || ''}
                                                        onChange={(e) => updateBlockData(block.id, field.name, e.target.value)}
                                                    />
                                                ) : field.type === 'image' ? (
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <Input
                                                                className="h-8 text-sm text-slate-900 flex-1"
                                                                value={block.data?.[field.name] || ''}
                                                                onChange={(e) => updateBlockData(block.id, field.name, e.target.value)}
                                                                placeholder="https://..."
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 text-xs bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300"
                                                                onClick={() => setMediaTarget({ blockId: block.id, fieldName: field.name })}
                                                            >
                                                                Browse
                                                            </Button>
                                                        </div>
                                                        {block.data?.[field.name] && (
                                                            <div className="relative w-full h-32 bg-slate-100 rounded overflow-hidden border">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={block.data[field.name]}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        if (target.parentElement) {
                                                                            target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-xs font-medium px-2 text-center">Image failed to load</div>';
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : field.type === 'select' ? (
                                                    <select
                                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-slate-900 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={block.data?.[field.name] || field.default}
                                                        onChange={(e) => updateBlockData(block.id, field.name, e.target.value)}
                                                    >
                                                        {field.options?.map((opt: string) => (
                                                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <Input
                                                        className="h-8 text-sm text-slate-900"
                                                        value={block.data?.[field.name] || ''}
                                                        onChange={(e) => updateBlockData(block.id, field.name, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Preview Area */}
            <div className="w-2/3 bg-slate-100 overflow-y-auto relative">
                <div className="absolute top-4 right-4 z-10 bg-black/75 text-white text-xs px-2 py-1 rounded">
                    Preview Mode
                </div>
                <div className="min-h-full bg-white shadow-xl mx-auto max-w-3xl origin-top scale-[0.8] mt-8 mb-8">
                    {data.pageType === 'thankyou' ? (
                        <ThankYouTemplateRenderer contentData={data.contentData} />
                    ) : data.productType === 'ebook' ? (
                        <EbookTemplateRenderer contentData={data.contentData} />
                    ) : (
                        /* Placeholder for software preview or fallback */
                        <div className="p-8 text-center space-y-8">
                            {blocks.filter((b: any) => b.enabled).map((block: any) => (
                                <div key={block.id} className="border-2 border-dashed border-slate-200 p-4 rounded hover:border-blue-300 transition-colors">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">{block.id} Block</div>
                                    {block.id === 'hero' && (
                                        <div className="space-y-4">
                                            <h1 className="text-4xl font-bold text-slate-900">{block.data?.headline}</h1>
                                            <p className="text-xl text-slate-500">{block.data?.subheadline}</p>
                                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full">{block.data?.ctaText}</button>
                                        </div>
                                    )}
                                    {block.id !== 'hero' && (
                                        <div className="h-20 bg-slate-50 flex items-center justify-center text-slate-400">
                                            {block.id} content placeholder
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {mediaTarget && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-bold dark:text-white">Select Media</h2>
                            <button onClick={() => setMediaTarget(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors font-bold text-slate-500 dark:text-slate-400">X</button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-slate-50 dark:bg-slate-900">
                            <MediaLibrary onSelect={(url) => {
                                updateBlockData(mediaTarget.blockId, mediaTarget.fieldName, url);
                                setMediaTarget(null);
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
