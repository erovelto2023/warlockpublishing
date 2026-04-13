"use client";

import { Search } from 'lucide-react';

export default function SearchTrigger() {
    const handleClick = () => {
        // Trigger the Cmd+K effect by dispatching the keyboard event
        window.dispatchEvent(new KeyboardEvent('keydown', { 
            key: 'k', 
            metaKey: true,
            ctrlKey: true // Support both systems
        }));
    };

    return (
        <div 
            className="w-full sm:flex-1 relative cursor-pointer" 
            onClick={handleClick}
        >
            <div className="w-full px-8 py-5 bg-white/5 text-slate-500 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/[0.08] transition-all group">
                <div className="flex items-center gap-3">
                    <Search size={18} className="text-slate-500 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">Search 15,000+ assets...</span>
                </div>
                <span className="text-[10px] font-black opacity-40 px-2 py-1 bg-white/10 rounded-md">CMD + K</span>
            </div>
        </div>
    );
}
