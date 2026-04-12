"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button 
            onClick={handleShare}
            className={`inline-flex items-center gap-2 transition-all text-[10px] font-black uppercase tracking-widest group ${
                copied ? 'text-emerald-600' : 'text-slate-500 hover:text-indigo-600'
            }`}
        >
            <Share2 size={14} className={`transition-transform ${copied ? 'scale-125' : 'group-hover:scale-110'}`} />
            {copied ? 'Coordinates Copied' : 'Share Transmission'}
        </button>
    );
}
