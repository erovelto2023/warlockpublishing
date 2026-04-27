'use client';

import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AIPromptCardProps {
    title: string;
    icon: React.ReactNode;
    desc: string;
    prompt: string;
}

export default function AIPromptCard({ title, icon, desc, prompt }: AIPromptCardProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        toast({
            title: `${title} Prompt Copied`,
            description: "The prompt is now in your clipboard.",
        });
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 flex flex-col h-full group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
                <div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{desc}</p>
                </div>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl relative overflow-hidden flex-1 min-h-[120px]">
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed line-clamp-4">
                    {prompt}
                </p>
                <button 
                    onClick={handleCopy}
                    className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100"
                >
                    <Copy size={12} />
                </button>
            </div>
        </div>
    );
}
