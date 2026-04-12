"use client"

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    return (
        <button 
            type="button"
            onClick={handlePrint}
            className="text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
        >
            <Printer size={14} /> Print
        </button>
    );
}
