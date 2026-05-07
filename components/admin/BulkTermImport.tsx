"use client";

import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Zap, FileJson, Sparkles, ArrowRight, Wand2, Copy } from 'lucide-react';
import { importDetailedJson, syncMarketplaceData, getGlossaryLinks } from '@/lib/actions/glossary';
import { getAffiliateOffers } from '@/lib/actions/affiliate.actions';
import { getMarketplaceItems } from '@/lib/actions/product.actions';
import { getAmazonCsvContent } from '@/lib/actions/marketplace';
import { useRouter } from 'next/navigation';
import { repairJson } from '@/lib/utils';
import { toast } from 'sonner';

interface BulkTermImportProps {
    isOpen: boolean;
    onClose: () => void;
    isInline?: boolean;
}

export default function BulkTermImport({ isOpen, onClose, isInline = false }: BulkTermImportProps) {
    const router = useRouter();
    const [rawList, setRawList] = useState('');
    const [jsonContent, setJsonContent] = useState('');
    const [category, setCategory] = useState('Writing');
     const [isHydrating, setIsHydrating] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [unifiedCatalog, setUnifiedCatalog] = useState<{name: string, url: string, category: string, source: string}[]>([]);
    const [existingTerms, setExistingTerms] = useState<{term: string, slug: string}[]>([]);
    const [parsedTerms, setParsedTerms] = useState<{term: string, isDuplicate: boolean}[]>([]);

    useEffect(() => {
        if (!jsonContent.trim()) {
            setParsedTerms([]);
            return;
        }
        
        try {
            let cleaned = jsonContent.trim();
            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
            const matches = [...cleaned.matchAll(codeBlockRegex)];
            if (matches.length > 0) cleaned = matches[0][1].trim();

            const data = JSON.parse(cleaned);
            if (Array.isArray(data)) {
                const terms = data.map((item: any) => ({
                    term: item.term,
                    isDuplicate: existingTerms.some(et => et.term.toLowerCase() === (item.term || '').toLowerCase())
                }));
                setParsedTerms(terms);
            }
        } catch (e) {
            setParsedTerms([]);
        }
    }, [jsonContent, existingTerms]);

    useEffect(() => {
        const loadCatalogs = async () => {
            try {
                const results: {name: string, url: string, category: string, source: string}[] = [];
                
                // Fetch existing terms for duplicate checking
                const links = await getGlossaryLinks();
                setExistingTerms(links);
                
                // 1. Affiliate Hub Offers
                const offers = await getAffiliateOffers();
                offers.forEach((o: any) => {
                    if (o.name && o.affiliateLink) {
                        results.push({ name: o.name, url: o.affiliateLink, category: o.category || 'Hub', source: 'Affiliate Hub' });
                    }
                });

                // 2. Local Products & Offers
                const localItems = await getMarketplaceItems();
                localItems.forEach((i: any) => {
                    if (i.title && (i.externalUrl || i.slug)) {
                        results.push({ name: i.title, url: i.externalUrl || `/products/${i.slug}`, category: i.category || 'Product', source: 'Local Store' });
                    }
                });

                // 3. Amazon Nexus CSV
                const csvContent = await getAmazonCsvContent();
                if (csvContent) {
                    const lines = csvContent.split('\n').filter(l => l.trim());
                    lines.forEach(line => {
                        const parts = line.split('","').map(p => p.replace(/^"|"$/g, ''));
                        const keyword = parts[1] || 'Amazon';
                        const sUrl = (parts[2] || '').trim();
                        const fUrl = (parts[3] || '').trim();
                        const preferredUrl = (fUrl.includes('javascript:void') && sUrl.startsWith('http')) ? sUrl : (fUrl || sUrl);
                        const title = parts[9] || 'Untitled';
                        
                        if (preferredUrl && preferredUrl.startsWith('http')) {
                            results.push({ name: title, url: preferredUrl, category: keyword, source: 'Marketplace Nexus' });
                        }
                    });
                }
                
                setUnifiedCatalog(results);
            } catch (err) {
                console.error("Failed to load catalogs:", err);
            }
        };
        loadCatalogs();
    }, []);

    const handleHydrate = async () => {
        try {
            // Auto-repair and sync the portal immediately
            const repaired = repairJson(jsonContent);
            setJsonContent(repaired);
            
            let data;
            try {
                data = JSON.parse(repaired);
            } catch (initialError: any) {
                // If it still fails, try one more time after a basic trim in case state didn't update yet
                data = JSON.parse(repaired.trim());
            }

            if (!Array.isArray(data)) {
                setStatus({ type: 'error', message: 'JSON must be an array of objects.' });
                return;
            }

            setIsHydrating(true);
            setStatus(null);

            const result = await importDetailedJson(data);
            
            if (result?.success) {
                const collisions = result.importedTerms?.filter((t: any) => t.wasCollision) || [];
                const collisionMsg = collisions.length > 0 
                    ? ` (${collisions.length} URL collisions resolved with suffixes)`
                    : '';

                setStatus({ 
                    type: 'success', 
                    message: `Successfully created/updated ${result.count} glossary terms.${collisionMsg}` 
                });
                setJsonContent('');
                
                // Remove successfully imported terms from the keyword source list
                if (result.importedTerms && Array.isArray(result.importedTerms)) {
                    let currentRawList = rawList;
                    result.importedTerms.forEach((item: any) => {
                        const termName = typeof item === 'string' ? item : item.term;
                        // Create a regex to match the term case-insensitively, 
                        // potentially followed by a newline or at the end of the string
                        const regex = new RegExp(`^\\s*${termName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(\\n|$)`, 'gmi');
                        currentRawList = currentRawList.replace(regex, '');
                    });
                    setRawList(currentRawList.trim());
                }

                // Refresh existing terms list for next import
                getGlossaryLinks().then((links: any) => setExistingTerms(links));
                
                router.refresh();
            } else {
                setStatus({ type: 'error', message: result?.message || 'Injection failed.' });
            }
        } catch (e: any) {
            console.error('JSON Parse Error:', e);
            setStatus({ 
                type: 'error', 
                message: `Invalid JSON format: ${e.message.substring(0, 80)}` 
            });
        } finally {
            setIsHydrating(false);
        }
    };

    const handleAutoFix = () => {
        try {
            const fixed = repairJson(jsonContent);
            setJsonContent(fixed);
            setStatus({ type: 'success', message: 'JSON structure repaired! Please try populating again.' });
        } catch (err: any) {
            setStatus({ type: 'error', message: `Auto-fix failed: ${err.message}` });
        }
    };

    const handleSyncMarketplace = async () => {
        try {
            setIsSyncing(true);
            setStatus(null);
            const result = await syncMarketplaceData();
            if (result.success) {
                setStatus({ type: 'success', message: `Successfully synced ${result.count} marketplace products.` });
            } else {
                setStatus({ type: 'error', message: `Sync failed: ${result.error}` });
            }
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setIsSyncing(false);
        }
    };

    const copyPrompt = () => {
        const isFiction = ['Romance', 'Literature & Fiction', 'Mystery, Thriller & Suspense', 'Science Fiction & Fantasy', 'Teen & Young Adult', 'Comics & Graphic Novels'].includes(category);
        const isNonFiction = ['Biographies & Memoirs', 'Business & Money', 'Health, Fitness & Dieting', 'History', 'Politics & Social Sciences', 'Religion & Spirituality', 'Science & Math', 'Self-Help', 'Education & Teaching', 'Engineering & Transportation', 'Law', 'Medical Books', 'Parenting & Relationships', 'Reference', 'Sports & Outdoors', 'Writing', 'Publishing', 'Marketing'].includes(category);
        const isPractical = ['Cookbooks, Food & Wine', 'Crafts, Hobbies & Home', 'Travel', 'Humor & Entertainment', 'Children\'s Books'].includes(category);

        let categorySpecificInstructions = "";
        if (isFiction) {
            categorySpecificInstructions = `Focus on narrative architecture, character archetypes, and plot-driven profit beats.
- For "masterclass", include a "profitabilityChecklist" with items like: "Does Chapter 1 end with an urgent question?", "Does every chapter drive toward the goal?", "Are the 'Top 3 Tropes' fully satisfied?".
- For "aiPromptCommandCenter", focus on Scene Generators (high-tension scenes) and TikTok hooks for trope reveals.`;
        } else if (isNonFiction) {
            categorySpecificInstructions = `Focus on authority signals, evidence-based frameworks, and transformation milestones.`;
        } else if (isPractical || category.includes('Coloring')) {
            categorySpecificInstructions = `Focus on design aesthetics, user engagement (coloring/crafting flow), and market-compliant production.
- For "masterclass", include a "profitabilityChecklist" with items like: "Does the line art have sufficient contrast?", "Is the pattern complexity appropriate for adults?", "Is the resolution market-compliant (300DPI+)?", "Is the bleed management correct?".
- For "aiPromptCommandCenter", focus on Pattern Generators (thematic page ideas) and TikTok hooks for ASMR coloring or "Relax with [Term]".
- For "visualAsset", create prompts for thematic cover art or Pinterest-style coloring page previews.`;
        }

        const affiliateCatalogStr = unifiedCatalog.length > 0 
            ? unifiedCatalog.map(o => `- [${o.name}](${o.url}) (Niche/Category: ${o.category}) [Source: ${o.source}]`).join('\n')
            : "No affiliate products available.";
        const prompt = `Act as an Expert AI & SEO Content Architect for Warlock Publishing.
You are a master architect designing the "Ultimate Authority Pipeline" for ${category}. 

${categorySpecificInstructions}

For EACH keyword provided below, you must generate a high-ranking, high-converting JSON object that follows this EXACT schema. This data acts as the structural engine for a premium glossary system.

### MANDATORY RULES:
1. Valid JSON Array only. No conversational text or markdown explanation outside the array.
2. Use DOUBLE QUOTES (") for all keys and string values.
3. CRITICAL: Tropes are "cognitive shortcuts". Explain the reader psychology in depth.
4. Ensure the "masterclass" and "aiPromptCommandCenter" sections are hyper-tailored to the niche.
5. All images should use the placeholder '/images/placeholder-product.png' unless you have a specific Amazon ASIN.
6. CRITICAL: ALL URLs (YouTube, Affiliate links, Image links) MUST use 'https://'. Never use 'http://'.
7. For "affiliateProducts", YOU MUST CHOOSE 2-4 products from the "AVAILABLE AFFILIATE CATALOG" below that best match the niche keyword. Output them EXACTLY in Markdown format: [Product Name](Affiliate URL). DO NOT hallucinate products.
8. For "youtubeVideoId", YOU MUST provide a REAL, VERIFIED full YouTube video URL (starting with https://www.youtube.com/watch?v=...) that is highly relevant to the term. DO NOT hallucinate fake video IDs. If you are unsure of a specific video, provide a known high-quality authority video in this niche. Every term MUST have a video.
9. CRITICAL: DO NOT hallucinate "digitalDownloads". The "digitalDownloads" array MUST BE EMPTY [].
10. CRITICAL: DO NOT hallucinate books in "vibeCuration". Use products from the catalog or generic placeholders only.

AVAILABLE AFFILIATE CATALOG:
${affiliateCatalogStr}

SCHEMA FOR EACH OBJECT:
{
  "term": "Main Term",
  "slug": "main-term-slug",
  "snapshot": "1-sentence punchy summary for SEO snippets. This is MANDATORY.",
  "definition": "Clear, authoritative 2-3 sentence definition for SGE. Explain the narrative or practical purpose.",
  "articleContent": "A high-fidelity news article using the CNN 'Inverted Pyramid+' model. Structure: 1. Digital Headline (SEO-focused, present tense), 2. Fast Facts Box (HTML: <div class='cnn-fast-facts'><h3>Key Points</h3><ul>...</ul></div>), 3. Hard Lede (25-35 words), 4. Institutional Lead (mention authorities), 5. Nut Graf (The 'Why it Matters' context), 6. Development (punchy 2-3 sentence paragraphs), 7. Direct Attribution (blockquotes with 'said'), 8. Deep-Dive Subheadings, 9. Forward-Looking Statement, 10. Contributor Footer. Format with standard HTML tags.",
  "category": "${category}",
  "youtubeVideoId": "https://www.youtube.com/watch?v=REAL_VIDEO_ID_HERE",
  "monetizationIdeas": {
    "affiliateProducts": ["[Chosen Product 1](URL 1)", "[Chosen Product 2](URL 2)"],
    "courseTopics": ["Course Topic 1"],
    "digitalDownloads": []
  },
  "seoStrategy": {
    "volumeRange": "1K-5K",
    "difficulty": "Low",
    "relatedKeywords": ["keyword 1", "keyword 2"]
  },
  "marketDemand": { 
    "demandScore": "X.X/10", 
    "passionScore": "X.X/10", 
    "saturationScore": "X.X/10",
    "trendStatus": "Rising/Stable/Oversaturated"
  },
  "readerPsychology": {
    "whyWeCraveIt": "Deep analysis of the human hardwiring for this specific pattern.",
    "cognitiveShortcut": "How this trope acts as a mental shortcut for immediate immersion.",
    "emotionalPayoff": "The specific emotional reward for the reader/user.",
    "catharticRelease": "Exploration of the psychological release or wish fulfillment provided."
  },
  "masterclass": {
    "masterclassDesc": "A high-level, 1-2 sentence strategic summary of how a creator can commercially dominate this specific concept.",
    "threeActStructure": { 
        "act1": "Setup & Hook: How to introduce the concept and trap the reader's attention within the first 10% of the asset.", 
        "act2": "Escalation & Complexity: The middle 60% where tension is built, variables are introduced, and the 'Value' is delivered.", 
        "act3": "Resolution & Payoff: The final 30% where the emotional or practical promise is fulfilled and the user is converted into a fan." 
    },
    "profitBeats": [ 
        { "title": "Strategic Beat Title", "description": "Specific tactical instruction for this moment in the content lifecycle.", "timing": "e.g. 15% (The Inciting Incident) or Step 3" } 
    ],
    "characterArchetypes": [
        { "role": "The Catalyst/Alpha/Specialist", "description": "How this specific persona drives the value or narrative of the term." }
    ],
    "technicalComponents": { 
        "powerTitle": "A high-CTR, curiosity-gap title for a book, course, or video about this term.", 
        "tropes": ["Specific Trope 1", "Specific Trope 2"], 
        "hook": "A 1-sentence magnetic hook that uses the 'Open Loop' technique." 
    },
    "profitabilityChecklist": [
        "Checklist item for ensuring maximum commercial viability (e.g., 'Is the high-concept hook present?')",
        "Checklist item for user retention/engagement."
    ]
  },
  "subGenreVariations": [
    { "genre": "Sub-Genre A", "variation": "How the concept shifts in this sub-genre." }
  ],
  "vibeCuration": [
    {
      "vibe": "Yellow",
      "vibeDescription": "For readers seeking passion and catharsis.",
      "books": [
        { "title": "Example Book 1", "author": "Author Name", "salesHook": "The 'Vibe' hook.", "buyUrl": "https://amazon.com/..." }
      ]
    },
    {
      "vibe": "Blue",
      "vibeDescription": "For readers seeking depth and atmosphere.",
      "books": [
        { "title": "Example Book 2", "author": "Author Name", "salesHook": "The 'Vibe' hook.", "buyUrl": "https://amazon.com/..." }
      ]
    }
  ],
  "marketingStrategy": {
    "viralHooks": ["Hook 1 (TikTok/Shorts style)", "Hook 2 (Curiosity Gap)"],
    "contentPillars": ["Pillar 1: Educational", "Pillar 2: Behind-the-Scenes/Process", "Pillar 3: Community/Reaction"]
  },
  "commonPitfalls": [ 
    { "pitfall": "The common mistake", "howToAvoid": "The expert solution." } 
  ],
  "faqItems": [
    { "question": "Question 1?", "answer": "Detailed answer 1." },
    { "question": "Question 2?", "answer": "Detailed answer 2." },
    { "question": "Question 3?", "answer": "Detailed answer 3." },
    { "question": "Question 4?", "answer": "Detailed answer 4." },
    { "question": "Question 5?", "answer": "Detailed answer 5." },
    { "question": "Question 6?", "answer": "Detailed answer 6." },
    { "question": "Question 7?", "answer": "Detailed answer 7." },
    { "question": "Question 8?", "answer": "Detailed answer 8." },
    { "question": "Question 9?", "answer": "Detailed answer 9." },
    { "question": "Question 10?", "answer": "Detailed answer 10." }
  ],
  "checklist": {
    "title": "Getting Started Checklist",
    "description": "Step-by-step guide to implementing this concept.",
    "items": [
      { "task": "Task 1", "description": "What to do first." },
      { "task": "Task 2", "description": "Next step." },
      { "task": "Task 3", "description": "Final verification." }
    ]
  },
  "aiPromptCommandCenter": {
    "sceneGeneratorPrompt": "Full AI prompt to generate a high-tension scene or concept draft involving [term].",
    "marketingHookPrompt": "Full AI prompt to generate 5 viral TikTok/social hooks for [term].",
    "aiImagePrompt": "Cinematic AI image generation prompt for covers or aesthetic assets."
  }
}

KEYWORDS TO RESEARCH AND CONVERT TO JSON:
${rawList || "Please paste keywords in the first column"}`;

        navigator.clipboard.writeText(prompt);
        setStatus({ type: 'success', message: 'Research Prompt copied to clipboard!' });
    };

    if (!isOpen && !isInline) return null;

    return (
        <div className={isInline ? "w-full" : "fixed inset-0 z-[100] flex items-center justify-center p-4"}>
            {!isInline && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />}
            
            <div className={`relative w-full ${isInline ? "" : "max-w-6xl"} bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200`}>
                {/* Header */}
                <div className="bg-slate-900 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <Zap className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-white font-black uppercase tracking-tight text-lg">Authority Pipeline Command Center</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-80">Glossary Rapid Injection Engine</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Niche</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option>Writing</option>
                                <option>Romance</option>
                                <option>Business & Money</option>
                                <option>Self-Help</option>
                                <option>Coloring Books</option>
                                <option>Children's Books</option>
                                <option>Adult Coloring Books</option>
                            </select>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                {status && (
                    <div className={`px-8 py-3 flex items-center justify-between border-b animate-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
                        <div className="flex items-center gap-3">
                            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <p className="text-[10px] font-black uppercase tracking-widest">{status.message}</p>
                        </div>
                        {status.type === 'error' && (
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(jsonContent);
                                        toast.success('Repaired JSON copied to clipboard');
                                    }}
                                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-300 transition-all flex items-center gap-2"
                                >
                                    <Copy size={12} /> Copy Fixed JSON
                                </button>
                                <button 
                                    onClick={handleAutoFix}
                                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg"
                                >
                                    <Wand2 size={12} /> Auto Fix JSON
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-8 grid grid-cols-1 md:grid-cols-11 gap-8 items-stretch">
                    {/* COLUMN 1: KEYWORDS */}
                    <div className="md:col-span-4 flex flex-col space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-black">1</span>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Keyword Source</h3>
                            </div>
                            {rawList !== undefined && (
                                <button onClick={() => setRawList('')} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                                    <X size={12} /> Clear
                                </button>
                            )}
                        </div>
                        <textarea 
                            className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-mono focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none min-h-[300px]"
                            placeholder="Enter keywords here...&#10;Enemies to Lovers&#10;Slow Burn&#10;Secret Baby..."
                            value={rawList}
                            onChange={(e) => setRawList(e.target.value)}
                        />
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed">
                                Enter the terms you want to research. They will be injected into the prompt in the next step.
                            </p>
                        </div>
                    </div>

                    {/* COLUMN 2: PROMPT (CENTER) */}
                    <div className="md:col-span-3 flex flex-col items-center justify-center space-y-6">
                        <div className="w-full bg-indigo-50 rounded-3xl p-8 border border-indigo-100 text-center space-y-6 relative shadow-xl shadow-indigo-500/5">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                Phase 2: AI Research
                            </div>
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-indigo-100">
                                <Sparkles className="text-indigo-600 animate-pulse" size={32} />
                            </div>
                            <p className="text-[10px] text-indigo-900/70 font-black uppercase tracking-tight leading-relaxed">
                                Copies the Universal Research Prompt with your keywords.
                            </p>
                            <button 
                                onClick={copyPrompt}
                                className="w-full py-5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-200 group active:scale-95"
                            >
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                Copy AI Prompt
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-2 opacity-20">
                            <ArrowRight className="rotate-90 md:rotate-0" />
                        </div>
                    </div>

                    {/* COLUMN 3: HYDRATE */}
                    <div className="md:col-span-4 flex flex-col space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-black">3</span>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Injection Portal</h3>
                            </div>
                            {jsonContent !== undefined && (
                                <button onClick={() => setJsonContent('')} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                                    <X size={12} /> Clear
                                </button>
                            )}
                        </div>
                        <textarea 
                            className="flex-1 w-full bg-slate-900 border border-slate-800 text-emerald-400 rounded-2xl px-4 py-4 text-[10px] font-mono focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none min-h-[300px]"
                            placeholder="Paste JSON array from AI here..."
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                        />

                        {parsedTerms.length > 0 && (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 max-h-[150px] overflow-y-auto">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                                    <span>Validation & Duplicate Check</span>
                                    <span className="text-indigo-600">{parsedTerms.length} terms detected</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {parsedTerms.map((pt, i) => (
                                        <div key={i} className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 ${pt.isDuplicate ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                            {pt.isDuplicate ? <AlertCircle size={10} /> : <CheckCircle2 size={10} />}
                                            {pt.term}
                                            <span className="opacity-50 ml-1">{pt.isDuplicate ? '(Update)' : '(New)'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleHydrate}
                            disabled={isHydrating || !jsonContent.trim()}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95"
                        >
                            {isHydrating ? <Loader2 className="animate-spin" size={16} /> : <FileJson size={16} />}
                            Populate Database
                        </button>
                    </div>
                </div>
                
                {/* Footer Tips */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between px-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-time Creation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Niche Optimized</span>
                        </div>
                        <button
                            onClick={handleSyncMarketplace}
                            disabled={isSyncing || isHydrating}
                            className="ml-6 px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                            {isSyncing ? <Loader2 className="animate-spin" size={12} /> : <Zap size={12} />}
                            Sync Marketplace
                        </button>
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Warlock Publishing System v2.4
                    </p>
                </div>
            </div>
        </div>
    );
}
