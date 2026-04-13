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
            <div className="w-full px-8 py-5 bg-white text-slate-900 rounded-2xl border border-white/20 flex items-center justify-between hover:bg-slate-50 transition-all shadow-xl group">
                <div className="flex items-center gap-3">
                    <Search size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Search 15,000+ assets...</span>
                </div>
                <span className="text-[10px] font-black opacity-30 px-2 py-1 bg-slate-100 rounded-md border border-slate-200">CMD + K</span>
            </div>
        </div>
    );
}
