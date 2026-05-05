import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CallToActionBlockProps {
    cta: {
        headline: string;
        body: string;
        buttonText: string;
        buttonUrl: string;
        themeColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
        imageUrl?: string;
    }
}

export default function CallToActionBlock({ cta }: CallToActionBlockProps) {
    const getThemeClasses = () => {
        switch (cta.themeColor) {
            case 'emerald':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                    border: 'border-emerald-200 dark:border-emerald-800',
                    text: 'text-emerald-900 dark:text-emerald-100',
                    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                    accent: 'bg-emerald-500'
                };
            case 'amber':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-950/30',
                    border: 'border-amber-200 dark:border-amber-800',
                    text: 'text-amber-900 dark:text-amber-100',
                    button: 'bg-amber-600 hover:bg-amber-700 text-white',
                    accent: 'bg-amber-500'
                };
            case 'rose':
                return {
                    bg: 'bg-rose-50 dark:bg-rose-950/30',
                    border: 'border-rose-200 dark:border-rose-800',
                    text: 'text-rose-900 dark:text-rose-100',
                    button: 'bg-rose-600 hover:bg-rose-700 text-white',
                    accent: 'bg-rose-500'
                };
            case 'slate':
                return {
                    bg: 'bg-slate-100 dark:bg-slate-900',
                    border: 'border-slate-300 dark:border-slate-700',
                    text: 'text-slate-900 dark:text-white',
                    button: 'bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white',
                    accent: 'bg-slate-500'
                };
            default: // indigo
                return {
                    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
                    border: 'border-indigo-200 dark:border-indigo-800',
                    text: 'text-indigo-900 dark:text-indigo-100',
                    button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                    accent: 'bg-indigo-500'
                };
        }
    };

    const theme = getThemeClasses();

    return (
        <div className={`mt-12 p-8 md:p-12 rounded-3xl border shadow-xl relative overflow-hidden ${theme.bg} ${theme.border}`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${theme.accent}`}></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <h3 className={`text-2xl md:text-3xl font-black font-serif italic ${theme.text}`}>
                        {cta.headline}
                    </h3>
                    <p className={`text-lg leading-relaxed opacity-90 ${theme.text}`}>
                        {cta.body}
                    </p>
                    <div className="pt-4">
                        <Link 
                            href={cta.buttonUrl} 
                            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${theme.button}`}
                        >
                            {cta.buttonText}
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                {cta.imageUrl && (
                    <div className="flex-shrink-0 w-full md:w-1/3">
                        <img 
                            src={cta.imageUrl} 
                            alt={cta.headline} 
                            className="w-full h-auto rounded-xl shadow-2xl object-cover border-4 border-white/20"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
