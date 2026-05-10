'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, Terminal, Send, Check, AlertCircle, FileJson, RefreshCw } from 'lucide-react';
import { importAdvertorials } from '@/lib/actions/advertorial';
import { repairJson } from '@/lib/utils';

export default function BulkAdvertorialImport() {
    const [productName, setProductName] = useState('');
    const [friction, setFriction] = useState('');
    const [hack, setHack] = useState('');
    const [category, setCategory] = useState('Marketing');
    const [jsonInput, setJsonInput] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const copyMasterPrompt = () => {
        const prompt = `Act as an expert Direct Response Copywriter and Conversion Rate Optimization (CRO) Expert. 
Your goal is to take the product "${productName}" and architect a high-converting "bridge-style" advertorial using the "Friction-to-Flow" framework.

### INPUT DATA:
- Product Name: ${productName}
- The Friction (The Barrier): ${friction}
- The Hack (The Saving/Secret): ${hack}
- Category: ${category}

### OUTPUT FORMAT:
Output ONLY a valid JSON array of objects following this schema. Use single quotes for any HTML inside strings.

SCHEMA:
[{
  "title": "${productName} Hack [Month/Year]",
  "category": "${category}",
  "headlineOptions": ["Headline 1 with Hack Frame", "Headline 2 Insider Discovery", "Headline 3"],
  "summaryBox": {
    "topPick": "Verdict string",
    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "ctaText": "Claim the ${productName} Hack Here",
    "targetUrl": "https://..."
  },
  "narrative": {
    "frictionReveal": "Powerful paragraph about why the topic is hard/expensive/paywalled right now.",
    "editorialPivot": "Transition paragraph positioning ${productName} as the solution."
  },
  "valueReinforcement": {
    "priceAnchoring": "Section comparing Standard Cost vs Hack Savings.",
    "steps": [
      { "title": "Step 1", "description": "Easy setup desc" },
      { "title": "Step 2", "description": "..." }
    ]
  },
  "comparisonTable": {
    "headers": ["Feature", "${productName}", "Competitor A", "Competitor B"],
    "rows": [
      ["Price", "Hack Pricing", "Overpriced", "Overpriced"],
      ["Ease of Use", "1-Click", "Complex", "Manual"]
    ]
  },
  "faq": [
    { "question": "Does this really work?", "answer": "Detailed reassuring answer." }
  ],
  "seoKeywords": ["Free", "Low Cost", "Hack"],
  "ctaPlacements": ["Placement 1 (Header)", "Placement 2 (Middle)", "Placement 3 (Bottom)"]
}]

### TONE: 
Authoritative, "insider," helpful, and peer-to-peer (avoid corporate brochure speak). Focus on the Friction Reveal—this is the critical psychological bridge.`;

        navigator.clipboard.writeText(prompt);
        setStatus({ type: 'success', message: 'Master Prompt copied to clipboard!' });
    };

    const handleImport = async () => {
        if (!jsonInput.trim()) return;
        setIsImporting(true);
        try {
            const repaired = repairJson(jsonInput);
            const data = JSON.parse(repaired);
            const result = await importAdvertorials(Array.isArray(data) ? data : [data]);
            
            if (result.success) {
                setStatus({ type: 'success', message: `Successfully imported ${result.count} advertorials!` });
                setJsonInput('');
            } else {
                setStatus({ type: 'error', message: result.message || 'Import failed' });
            }
        } catch (e: any) {
            setStatus({ type: 'error', message: 'Invalid JSON format: ' + e.message });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="space-y-12 bg-white text-black p-8">
            <header className="space-y-2 border-b border-black pb-6">
                <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-3">
                    <Terminal size={24} /> Prompt Architect
                </h2>
                <p className="text-xs text-slate-400 font-medium">Generate conversion-ready prompts and import AI data.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Step 1: Configuration</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Product Name</label>
                                <Input className="rounded-none border-slate-200 focus:border-black" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., ExpressVPN" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                                <Input className="rounded-none border-slate-200 focus:border-black" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Tech Deals" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">The Friction (Barrier)</label>
                                <Textarea className="rounded-none border-slate-200 focus:border-black" value={friction} onChange={e => setFriction(e.target.value)} placeholder="Why is this hard or expensive?" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">The Hack (Secret)</label>
                                <Textarea className="rounded-none border-slate-200 focus:border-black" value={hack} onChange={e => setHack(e.target.value)} placeholder="What is the insider secret?" />
                            </div>
                            <Button onClick={copyMasterPrompt} className="w-full bg-black hover:bg-slate-800 text-white font-bold h-12 rounded-none gap-2">
                                <Copy size={18} /> Copy Master Prompt
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Step 2: Ingestion</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">AI JSON Output</label>
                                <Textarea 
                                    value={jsonInput} 
                                    onChange={e => setJsonInput(e.target.value)} 
                                    placeholder="Paste the JSON array here..."
                                    className="min-h-[300px] font-mono text-xs rounded-none border-slate-200 focus:border-black bg-slate-50"
                                />
                            </div>
                            <Button 
                                onClick={handleImport} 
                                disabled={isImporting || !jsonInput} 
                                className="w-full bg-black hover:bg-slate-800 text-white font-bold h-12 rounded-none gap-2"
                            >
                                {isImporting ? <RefreshCw className="animate-spin" /> : <FileJson size={18} />}
                                Import Advertorials
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {status.type && (
                <div className={`p-4 border-2 flex items-center gap-3 ${status.type === 'success' ? 'bg-white border-black text-black' : 'bg-white border-red-600 text-red-600'}`}>
                    {status.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-bold uppercase tracking-widest">{status.message}</p>
                </div>
            )}
        </div>
    );
}
