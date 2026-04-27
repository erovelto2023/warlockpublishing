"use client";

import { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Copy, Zap, FileJson, Database, Sparkles } from 'lucide-react';
import { bulkImportTerms, importDetailedJson } from '@/lib/actions/glossary';
import { useRouter } from 'next/navigation';

interface BulkTermImportProps {
    isOpen: boolean;
    onClose: () => void;
}

type ImportTab = 'seed' | 'prompt' | 'hydrate';

export default function BulkTermImport({ isOpen, onClose }: BulkTermImportProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ImportTab>('seed');
    const [rawList, setRawList] = useState('');
    const [jsonContent, setJsonContent] = useState('');
    const [category, setCategory] = useState('Writing');
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSeed = async () => {
        const keywords = rawList
            .split('\n')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        if (keywords.length === 0) {
            setStatus({ type: 'error', message: 'Please enter at least one keyword' });
            return;
        }

        setIsImporting(true);
        setStatus(null);

        try {
            const result = await bulkImportTerms(keywords, category);
            setStatus({ 
                type: 'success', 
                message: `Seeded ${result.count} terms. (${result.upserted} new, ${result.updated} updated)` 
            });
            setRawList('');
            router.refresh();
        } catch (e) {
            setStatus({ type: 'error', message: 'Seeding failed. Database connection error.' });
        } finally {
            setIsImporting(false);
        }
    };

    const handleHydrate = async () => {
        try {
            // Pre-process: Strip markdown code blocks if present
            let cleanedContent = jsonContent.trim();
            
            // 1. Better Markdown stripping
            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
            const matches = [...cleanedContent.matchAll(codeBlockRegex)];
            if (matches.length > 0) {
                cleanedContent = matches[0][1].trim();
            }

            // 2. Initial cleanup for common issues
            // Fix trailing commas in arrays/objects
            cleanedContent = cleanedContent.replace(/,(\s*[\]\}])/g, '$1');

            // 3. Sanitize literal control characters inside string values
            // JSON.parse fails on literal \n, \r, or \t inside "quotes"
            // We use a regex that matches quoted strings, but we exclude things that look like JSON structure
            cleanedContent = cleanedContent.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
                // If the string starts with [ or {, it might be a stringified array/object
                // We'll leave it to the server-side normalize helper to handle that
                return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
            });

            let data;
            try {
                data = JSON.parse(cleanedContent);
            } catch (initialError: any) {
                // FALLBACK: Aggressive repair for Javascript-like objects
                try {
                    const extremeRepair = (input: string): string => {
                        let s = input.trim();
                        s = s.replace(/```[a-z]*\n?|```/g, '');
                        s = s.replace(/^(const|let|var|data|result|item|array)\s*[\w\d]*\s*=\s*/, '');
                        s = s.replace(/;?\s*$/, '');
                        s = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

                        for (let i = 0; i < 5; i++) {
                            s = s.replace(/(['"])\s*(?:\+)?\s*\\n\s*(['"])/g, '');
                            s = s.replace(/(['"])\s*\+\s*(['"])/g, '');
                            s = s.replace(/(['"])\s*\n\s*(\+)?\s*\n?\s*(['"])/g, '');
                        }

                        s = s.replace(/([\{,\[]\s*)([a-z_][a-z0-9_]*)(\s*):/gi, '$1"$2"$3:');
                        s = s.replace(/([\{,\[]\s*)'([a-z_][a-z0-9_]*)'(\s*):/gi, '$1"$2"$3:');

                        const fixContent = (text: string) => {
                            return text.replace(/([:\[,]\s*)'([^]*?)'(\s*[,\]\}])/g, (match, pre, content, post) => {
                                const escaped = content.replace(/"/g, '\\"');
                                return (pre.startsWith(':') ? ': ' : pre) + '"' + escaped + '"' + post;
                            });
                        };
                        s = fixContent(s);
                        s = fixContent(s);
                        s = s.replace(/\\n/g, ' ');
                        return s.replace(/,(\s*[\]\}])/g, '$1');
                    };

                    const deepNormalize = (val: any): any => {
                        if (typeof val === 'string') {
                            const t = val.trim();
                            if (t.startsWith('[') || t.startsWith('{') || (t.startsWith('"') && t.includes('['))) {
                                try {
                                    return deepNormalize(JSON.parse(t));
                                } catch (e) {
                                    try {
                                        return deepNormalize(JSON.parse(extremeRepair(t)));
                                    } catch (e2) {
                                        if (t.startsWith('"') && t.endsWith('"')) {
                                            try { return deepNormalize(JSON.parse(t)); } catch (e3) { return val; }
                                        }
                                        return val;
                                    }
                                }
                            }
                        }
                        if (Array.isArray(val)) {
                            if (val.length === 1 && typeof val[0] === 'string' && (val[0].trim().startsWith('[') || val[0].trim().startsWith('{'))) {
                                const result = deepNormalize(val[0]);
                                return Array.isArray(result) || (result && typeof result === 'object') ? result : [];
                            }
                            return val.map((item: any) => deepNormalize(item));
                        }
                        if (val !== null && typeof val === 'object') {
                            const obj: any = {};
                            for (const key in val) {
                                obj[key] = deepNormalize(val[key]);
                            }
                            return obj;
                        }
                        return val;
                    };

                    data = deepNormalize(cleanedContent);
                } catch (fallbackError) {
                    throw initialError;
                }
            }

            if (!Array.isArray(data)) {
                setStatus({ type: 'error', message: 'JSON must be an array of objects.' });
                return;
            }

            setIsImporting(true);
            setStatus(null);

            const result = await importDetailedJson(data);
            
            if (result?.success) {
                setStatus({ 
                    type: 'success', 
                    message: `Hydrated ${result.count} terms successfully.` 
                });
                setJsonContent('');
                router.refresh();
            } else {
                setStatus({ type: 'error', message: result?.message || 'Hydration failed.' });
            }
        } catch (e: any) {
            console.error('JSON Parse Error:', e);
            setStatus({ 
                type: 'error', 
                message: `Invalid JSON format: ${e.message.substring(0, 80)}${e.message.length > 80 ? '...' : ''}` 
            });
        } finally {
            setIsImporting(false);
        }
    };

    const copyPrompt = () => {
        const prompt = `CRITICAL: Generate a STRICT JSON array of research objects for the keywords provided below. 

OUTPUT REQUIREMENTS:
1. Valid JSON Array only. No conversational text.
2. Use DOUBLE QUOTES (") for all keys and string values. Never use single quotes (').
3. QUOTE ALL KEYS.
4. NO TRAILING COMMAS.
5. Nested fields like "relatedKeywords" must be real JSON arrays, not strings containing JSON.
6. For "youtubeVideo", ONLY provide URLs that are LIVE, PUBLIC, and currently accessible. Do NOT guess or use placeholder IDs.
7. CRITICAL: For "targetAudience", ensure "painPoints" are visceral (e.g., "Wasting thousands on bad ads") and "desiredOutcomes" are specific (e.g., "Consistent $5k months").

SCHEMA STRUCTURE:
{
  "term": "Main Term",
  "slug": "main-term",
  "shortDefinition": "...",
  "definition": "...",
  "category": "...",
  "origin": "...",
  "modernUsage": "...",
  "expandedExplanation": "...",
  "targetAudience": { 
    "primaryDemographic": "...", 
    "readerPersonas": [], 
    "painPoints": ["Point 1", "Point 2"], 
    "desiredOutcomes": ["Outcome 1", "Outcome 2"] 
  },
  "marketDemand": { 
    "trendStatus": "Rising/Stable/Fading", 
    "monetizationPotential": "High/Medium/Low",
    "averagePriceRange": "..." 
  },
  "productIdeas": [ 
    { "type": "Course/Ebook/Service", "title": "...", "description": "...", "pricePoint": "..." } 
  ],
  "synonyms": ["Synonym 1", "Synonym 2"],
  "antonyms": ["Antonym 1", "Antonym 2"],
  "youtubeVideo": { "title": "...", "url": "...", "channel": "..." },
  "blogArticle": { "title": "...", "content": "..." },
  "faqs": [ { "question": "...", "answer": "..." } ],
  "amazonProducts": [ { "name": "...", "url": "..." } ],
  "checklist": ["Step 1", "Step 2"],
  
  // Authority Framework Extensions
  "writingAspect": "Specific technical nuance for authors...",
  "geoTagging": "Regional popularity or cultural variations...",
  "commonMyths": [ { "myth": "...", "fact": "..." } ],
  "anatomy": { 
    "structuralBreakdown": "...", 
    "specialistPerspective": "Expert mastery note (EEAT)..." 
  },
  "directoryCategories": [
    { "name": "...", "description": "...", "productIds": ["B0XXXXXX", "B0YYYYYY"] }
  ],
  "featuredSnippet": "Brief high-impact summary for SGE...",
  "regionalTrends": "Growth data for specific regions...",
  "opportunityScore": 85
}

KEYWORDS TO RESEARCH:
[PASTE KEYWORDS HERE]`;

        navigator.clipboard.writeText(prompt);
        setStatus({ type: 'success', message: 'Strict Research Prompt copied!' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(49,46,129,0.3)] overflow-hidden animate-in zoom-in-95 duration-200 border border-indigo-50 text-slate-900">
                {/* Header */}
                <div className="bg-indigo-600 p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl ring-1 ring-white/20 backdrop-blur-sm">
                            <Zap className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-white font-black uppercase tracking-widest text-lg">Registry Pipeline</h2>
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-tighter opacity-80">Warlock Publishing Asset Injection</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors bg-white/10 p-2 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-indigo-50">
                    <button 
                        onClick={() => setActiveTab('seed')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'seed' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-400 border-transparent hover:text-indigo-400'}`}
                    >
                        1. Seed Keywords
                    </button>
                    <button 
                        onClick={() => setActiveTab('prompt')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'prompt' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-400 border-transparent hover:text-indigo-400'}`}
                    >
                        2. GPT Research
                    </button>
                    <button 
                        onClick={() => setActiveTab('hydrate')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'hydrate' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-400 border-transparent hover:text-indigo-400'}`}
                    >
                        3. Hydrate Data
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Status Message */}
                    {status && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <p className="text-xs font-black uppercase tracking-tight">{status.message}</p>
                        </div>
                    )}

                    {activeTab === 'seed' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Concept Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 appearance-none"
                                >
                                    <option>Writing</option>
                                    <option>Publishing</option>
                                    <option>Marketing</option>
                                    <option>Trope</option>
                                    <option>Genre</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Keyword List (One per line)</label>
                                <textarea 
                                    rows={8}
                                    placeholder="Enemies to Lovers&#10;Slow Burn&#10;Cliffhanger..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-5 py-5 text-sm font-mono focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                                    value={rawList}
                                    onChange={(e) => setRawList(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={handleSeed}
                                disabled={isImporting || !rawList.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 group"
                            >
                                {isImporting ? <Loader2 className="animate-spin" size={20} /> : <Database size={18} className="group-hover:scale-110 transition" />}
                                Initialize Registry Stubs
                            </button>
                        </div>
                    )}

                    {activeTab === 'prompt' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mb-6">
                                    <Copy className="text-indigo-600" size={32} />
                                </div>
                                <h3 className="text-lg font-black text-indigo-950 mb-3 uppercase tracking-tight">Authority Silo Architect</h3>
                                <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
                                    Copies the **Universal Authority Template** research prompt to your clipboard. Use this with Claude or ChatGPT to generate the 4-Phase content structure (SEO Hook, Educational Authority, Sales Engine, and Optimization) for any niche.
                                </p>
                                <button 
                                    onClick={copyPrompt}
                                    className="px-10 py-4 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center gap-3"
                                >
                                    <Sparkles size={16} />
                                    Copy Universal Authority Prompt
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hydrate' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GPT-Generated JSON Result</label>
                                <textarea 
                                    rows={10}
                                    placeholder="Paste [ { ... } ] array from ChatGPT here..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-5 py-5 text-xs font-mono focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                                    value={jsonContent}
                                    onChange={(e) => setJsonContent(e.target.value)}
                                />
                            </div>

                             <div className="flex gap-4">
                                <button 
                                    onClick={() => {
                                        setJsonContent('');
                                        setStatus(null);
                                    }}
                                    className="flex-1 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Clear Input
                                </button>
                                <button 
                                    onClick={handleHydrate}
                                    disabled={isImporting || !jsonContent.trim()}
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 group"
                                >
                                    {isImporting ? <Loader2 className="animate-spin" size={20} /> : <FileJson size={18} className="group-hover:scale-110 transition" />}
                                    Hydrate Registry Data
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
