'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, Terminal, Send, Check, AlertCircle, FileJson } from 'lucide-react';
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
        <div className="space-y-8">
            <Card className="p-8 border-slate-200 shadow-xl bg-white">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                        <Terminal size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Advertorial Prompt Architect</h2>
                        <p className="text-sm text-slate-500">Generate the Master Prompt for your next high-converting bridge page.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Product Name</label>
                            <Input value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., ExpressVPN" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
                            <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Tech Deals" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">The Friction (Barrier)</label>
                            <Textarea value={friction} onChange={e => setFriction(e.target.value)} placeholder="Why is this currently hard or expensive for people?" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">The Hack (Secret/Deal)</label>
                            <Textarea value={hack} onChange={e => setHack(e.target.value)} placeholder="What is the insider secret or deal you're providing?" />
                        </div>
                        <Button onClick={copyMasterPrompt} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 gap-2">
                            <Copy size={18} /> Copy Master Prompt
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Paste AI Output (JSON)</label>
                            <Textarea 
                                value={jsonInput} 
                                onChange={e => setJsonInput(e.target.value)} 
                                placeholder="Paste the JSON array generated by the AI here..."
                                className="min-h-[300px] font-mono text-sm bg-slate-50"
                            />
                        </div>
                        <Button 
                            onClick={handleImport} 
                            disabled={isImporting || !jsonInput} 
                            className="w-full bg-slate-900 hover:bg-black h-12 gap-2"
                        >
                            {isImporting ? <RefreshCw className="animate-spin" /> : <FileJson size={18} />}
                            Import Advertorials
                        </Button>
                    </div>
                </div>

                {status.type && (
                    <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        {status.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-medium">{status.message}</p>
                    </div>
                )}
            </Card>
        </div>
    );
}

function RefreshCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    )
}
