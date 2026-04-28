"use client";

import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Zap, FileJson, Sparkles, ArrowRight } from 'lucide-react';
import { importDetailedJson } from '@/lib/actions/glossary';
import { useRouter } from 'next/navigation';

interface BulkTermImportProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BulkTermImport({ isOpen, onClose }: BulkTermImportProps) {
    const router = useRouter();
    const [rawList, setRawList] = useState('');
    const [jsonContent, setJsonContent] = useState('');
    const [category, setCategory] = useState('Writing');
    const [isHydrating, setIsHydrating] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleHydrate = async () => {
        try {
            let cleanedContent = jsonContent.trim();
            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
            const matches = [...cleanedContent.matchAll(codeBlockRegex)];
            if (matches.length > 0) {
                cleanedContent = matches[0][1].trim();
            }

            cleanedContent = cleanedContent.replace(/,(\s*[\]\}])/g, '$1');
            cleanedContent = cleanedContent.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
                return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
            });

            let data;
            try {
                data = JSON.parse(cleanedContent);
            } catch (initialError: any) {
                // Initial parse failed, the server side normalization in importDetailedJson 
                // actually calls deepNormalize which is quite robust.
                data = JSON.parse(cleanedContent);
            }

            if (!Array.isArray(data)) {
                setStatus({ type: 'error', message: 'JSON must be an array of objects.' });
                return;
            }

            setIsHydrating(true);
            setStatus(null);

            const result = await importDetailedJson(data);
            
            if (result?.success) {
                setStatus({ 
                    type: 'success', 
                    message: `Successfully created/updated ${result.count} glossary terms.` 
                });
                setJsonContent('');
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

        const prompt = `CRITICAL: Generate a STRICT JSON array of research objects for the keywords provided below. 
CATEGORY CONTEXT: ${category}
INSTRUCTIONS: ${categorySpecificInstructions}
- For "commonPitfalls", frame the "pitfall" as a "Writing Sin" (for fiction) or "Design Error" (for coloring books) and the "howToAvoid" as the "Expert Solution".

OUTPUT REQUIREMENTS:
1. Valid JSON Array only. No conversational text.
2. Use DOUBLE QUOTES (") for all keys and string values.
3. CRITICAL: For "targetAudience", ensure "painPoints" are visceral and "desiredOutcomes" are specific.

SCHEMA:
{
  "term": "Main Term",
  "slug": "main-term",
  "shortDefinition": "...",
  "definition": "...",
  "category": "${category}",
  "targetAudience": { "primaryDemographic": "...", "painPoints": [], "desiredOutcomes": [] },
  "marketDemand": { "trendStatus": "...", "monetizationPotential": "..." },
  "productIdeas": [ { "type": "...", "title": "...", "description": "..." } ],
  "youtubeVideo": { "title": "...", "url": "..." },
  "blogArticle": { "title": "...", "content": "..." },
  "faqs": [ { "question": "...", "answer": "..." } ],
  "commonMyths": [ { "myth": "...", "fact": "..." } ],
  "commonPitfalls": [ { "pitfall": "Writing Sin/Design Error", "howToAvoid": "Expert Solution" } ],
  "aiPromptCommandCenter": {
    "productIdeaPrompt": "Scene/Pattern Generator...",
    "contentStrategyPrompt": "Marketing/TikTok Hooks...",
    "aiImagePrompt": "Visual Asset Prompt..."
  },
  "masterclass": {
    "threeActStructure": { "act1": "...", "act2": "...", "act3": "..." },
    "profitBeats": [ { "title": "...", "description": "...", "timing": "..." } ],
    "technicalComponents": { "powerTitle": "...", "tropes": [] },
    "profitabilityChecklist": []
  }
}

KEYWORDS TO RESEARCH:
${rawList || "Please paste keywords in the first column"}`;

        navigator.clipboard.writeText(prompt);
        setStatus({ type: 'success', message: 'Research Prompt copied to clipboard!' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
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
                    <div className={`px-8 py-3 flex items-center gap-3 border-b animate-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
                        {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <p className="text-[10px] font-black uppercase tracking-widest">{status.message}</p>
                    </div>
                )}

                <div className="p-8 grid grid-cols-1 md:grid-cols-11 gap-8 items-stretch">
                    {/* COLUMN 1: KEYWORDS */}
                    <div className="md:col-span-4 flex flex-col space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-black">1</span>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Keyword Source</h3>
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
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-black">3</span>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Injection Portal</h3>
                        </div>
                        <textarea 
                            className="flex-1 w-full bg-slate-900 border border-slate-800 text-emerald-400 rounded-2xl px-4 py-4 text-[10px] font-mono focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none min-h-[300px]"
                            placeholder="Paste JSON array from AI here..."
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                        />
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
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Warlock Publishing System v2.4
                    </p>
                </div>
            </div>
        </div>
    );
}
