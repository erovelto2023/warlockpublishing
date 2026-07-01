"use client";

import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Zap, FileJson, Sparkles, ArrowRight, Wand2, Copy } from 'lucide-react';
import { importDetailedJson, syncMarketplaceData, getGlossaryLinks } from '@/lib/actions/glossary';
import { getAffiliateOffers } from '@/lib/actions/affiliate.actions';
import { getMarketplaceItems } from '@/lib/actions/product.actions';
import { getAmazonCsvContent } from '@/lib/actions/marketplace';
import { useRouter } from 'next/navigation';
import { repairJson } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface BulkTermImportProps {
    isOpen: boolean;
    onClose: () => void;
    isInline?: boolean;
}

export default function BulkTermImport({ isOpen, onClose, isInline = false }: BulkTermImportProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [rawList, setRawList] = useState('');
    const [jsonContent, setJsonContent] = useState('');
    const [category, setCategory] = useState('Writing');
    const [isHydrating, setIsHydrating] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [unifiedCatalog, setUnifiedCatalog] = useState<{name: string, url: string, category: string, source: string}[]>([]);
    const [existingTerms, setExistingTerms] = useState<{term: string, slug: string}[]>([]);
    const [parsedTerms, setParsedTerms] = useState<{term: string, isDuplicate: boolean}[]>([]);
    const [hasFixed, setHasFixed] = useState(false);

    useEffect(() => {
        if (!jsonContent.trim()) {
            setParsedTerms([]);
            setHasFixed(false);
            return;
        }
        
        try {
            let cleaned = jsonContent.trim();
            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
            const matches = [...cleaned.matchAll(codeBlockRegex)];
            
            if (matches.length > 0) {
                // If there are multiple code blocks, join them into a simulated array string
                cleaned = matches.map(m => m[1].trim()).join(', ');
            }
            
            // Run repairJson before parsing for the preview
            const repaired = repairJson(cleaned);
            const data = JSON.parse(repaired);
            
            if (Array.isArray(data)) {
                const terms = data.map((item: any) => ({
                    term: item.term,
                    isDuplicate: existingTerms.some(et => et.term.toLowerCase() === (item.term || '').toLowerCase())
                }));
                setParsedTerms(terms);
            } else if (typeof data === 'object' && data !== null) {
                // Single object case
                setParsedTerms([{
                    term: (data as any).term,
                    isDuplicate: existingTerms.some(et => et.term.toLowerCase() === ((data as any).term || '').toLowerCase())
                }]);
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
        setHasFixed(false);
        try {
            let input = jsonContent.trim();
            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
            const matches = [...input.matchAll(codeBlockRegex)];
            
            if (matches.length > 0) {
                input = matches.map(m => m[1].trim()).join(', ');
            }

            // Auto-repair and sync the portal immediately
            const repaired = repairJson(input);
            setJsonContent(repaired);
            
            let data;
            try {
                data = JSON.parse(repaired);
            } catch (initialError: any) {
                // If it still fails, try one more time after a basic trim in case state didn't update yet
                data = JSON.parse(repaired.trim());
            }

            if (!Array.isArray(data) && typeof data === 'object') {
                data = [data]; // Wrap single object
            }

            if (!Array.isArray(data)) {
                setStatus({ type: 'error', message: 'JSON must be an array of objects.' });
                return;
            }

            setIsHydrating(true);
            setStatus(null);

            // DEFENSIVE: Flatten the data if it's nested (e.g. [[...], [...]])
            let finalData = data;
            if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
                finalData = data.flat();
            }

            const result = await importDetailedJson(finalData);
            
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

    const handleAutoFix = async () => {
        try {
            let input = jsonContent.trim();
            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
            const matches = [...input.matchAll(codeBlockRegex)];
            
            if (matches.length > 0) {
                input = matches.map(m => m[1].trim()).join(', ');
            }

            const fixed = repairJson(input);
            setJsonContent(fixed);
            setHasFixed(true);
            
            // Automatically attempt to populate after fixing
            setStatus({ type: 'success', message: 'JSON repaired! Attempting to populate database...' });
            
            const data = JSON.parse(fixed);
            
            // DEFENSIVE: Flatten if nested
            let finalData = Array.isArray(data) ? data : [data];
            if (Array.isArray(finalData) && finalData.length > 0 && Array.isArray(finalData[0])) {
                finalData = finalData.flat();
            }

            const result = await importDetailedJson(finalData);
            
            if (result.success) {
                // Clear the portal on success
                setJsonContent('');
                setHasFixed(false);
                setStatus({ 
                    type: 'success', 
                    message: `Successfully imported ${result.count} terms! ${(result as any).collisions ? `(${(result as any).collisions} slugs auto-incremented)` : ''}` 
                });
                
                if (result.importedTerms) {
                    const currentTerms = rawList.split('\n').filter(t => t.trim());
                    // Extract term strings from the importedTerms objects
                    const importedTermStrings = result.importedTerms.map((t: any) => t.term);
                    const remainingTerms = currentTerms.filter(term => 
                        !importedTermStrings.includes(term.trim())
                    );
                    setRawList(remainingTerms.join('\n'));
                }
                
                router.refresh();
            } else {
                setStatus({ type: 'error', message: (result as any).message || 'Import failed after repair.' });
            }
        } catch (err: any) {
            setStatus({ type: 'error', message: `Auto-fix/Populate failed: ${err.message}` });
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

        // Add special hardware-first strategy for Stoner and Japanese niches
        if (category.toLowerCase().includes('stoner') || category.toLowerCase().includes('japanese')) {
            categorySpecificInstructions += `\n\n### SPECIAL STRATEGY: HARDWARE-FIRST & AUTHORITY SIGNALING
The market demand data shows extreme Passion Scores (9.9+) for this niche.
- Mention specific paper stock requirements (e.g., 120GSM cream-tinted paper for Japanese Noir, ink-bleed-shield black-backed pages for Stoner art).
- Propose "Hardware Bundles" or "Asset Kits" in the monetization ideas (e.g., technical fineliners or UV-LED keychain lights).
- Use elite authority signaling in the content (Institutional Lead).`;
        }

        const affiliateCatalogStr = unifiedCatalog.length > 0 
            ? unifiedCatalog.map(o => `- [${o.name}](${o.url}) (Niche/Category: ${o.category}) [Source: ${o.source}]`).join('\n')
            : "No affiliate products available.";

        const prompt = `System Role: You are an elite SEO Content Architect and UX Strategist for Warlock Publishing. Your mission is to convert raw database entries into "High-Value Authority Hubs" that rank on Page 1 of Google and drive consistent affiliate conversions.

Task: Generate a valid JSON array for the given keywords. Each object must follow the "Solution-First" framework.

CRITICAL JSON SAFETY RULES:
1. Use double quotes (") for keys and values.
2. Use single quotes (') for ALL HTML attributes/classes (e.g., <div class='hub-card'>). Never nest double quotes inside strings.
3. No physical newlines; use \\n for all line breaks.
4. Output ONLY the raw JSON array.

REQUIRED SCHEMA:
{
  "term": "Main Keyword",
  "slug": "url-friendly-slug",
  "category": "${category}",
  "seoMeta": { "title": "...", "description": "..." },
  "pageHeader": { "hook": "High-impact sentence", "expertIntro": "Unique 150-word authority-building analysis" },
  "pageBody": {
    "htmlContent": "Use <h2>, <h3>, <ul>, and <strong>. Integrate affiliate recommendations naturally. USE SINGLE QUOTES FOR HTML ATTRS.",
    "youtubeEmbedUrl": "..."
  },
  "conversionElement": { "ctaText": "...", "targetUrl": "...", "productName": "..." },
  "seoSchema": {
    "faq": [ { "question": "...", "answer": "..." } ],
    "relatedSlugs": ["slug-1", "slug-2"]
  }
}

INSTRUCTIONS FOR CONTENT QUALITY:
1. Expert Analysis: Do not write generic definitions. Explain *why* this term matters and provide a specific, actionable insight for the reader.
2. Contextual Monetization: For every entry, you MUST select the most relevant affiliate product from the provided list. Do not select randomly; match the niche.
3. Conversion First: The <div class='resource-box'> in the htmlContent must clearly position the affiliate product as the *solution* to the reader's problem.
4. SEO Rich Snippets: The faq section must answer 3 distinct 'People Also Ask' style questions.

${categorySpecificInstructions}

AVAILABLE AFFILIATE CATALOG:
${affiliateCatalogStr}

KEYWORDS TO RESEARCH:
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
                        <div className="flex items-center gap-2">
                            {hasFixed && (
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(jsonContent);
                                        toast({
                                            title: "Success",
                                            description: "Repaired JSON copied to clipboard",
                                        });
                                    }}
                                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-300 transition-all flex items-center gap-2"
                                >
                                    <Copy size={12} /> Copy Fixed JSON
                                </button>
                            )}
                            {status.type === 'error' && (
                                <button 
                                    onClick={handleAutoFix}
                                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg animate-pulse"
                                >
                                    <Wand2 size={12} /> Auto Fix & Populate
                                </button>
                            )}
                        </div>
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
