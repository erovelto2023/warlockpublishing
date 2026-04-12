'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyPromptButtonProps {
    prompt: string;
    className?: string;
}

export default function CopyPromptButton({ prompt, className = '' }: CopyPromptButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg ${
                copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-indigo-900 hover:bg-indigo-50'
            } ${className}`}
        >
            {copied ? (
                <>
                    <Check size={14} /> Copied!
                </>
            ) : (
                <>
                    <Copy size={14} /> Copy Prompt
                </>
            )}
        </button>
    );
}
