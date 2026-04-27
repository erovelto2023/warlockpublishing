"use client";

import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

export default function TableOfContents() {
    const [sections, setSections] = useState<{ id: string; label: string }[]>([]);
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const h2s = Array.from(document.querySelectorAll('h2[id]'));
        const foundSections = h2s.map(h2 => ({
            id: h2.id,
            label: h2.textContent || ''
        }));
        setSections(foundSections);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-20% 0% -35% 0%' });

        h2s.forEach(h2 => observer.observe(h2));
        return () => observer.disconnect();
    }, []);

    if (sections.length === 0) return null;

    return (
        <div className="sticky top-24 space-y-6 hidden xl:block">
            <div className="flex items-center gap-2 px-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <List size={14} /> On This Page
            </div>
            <nav className="space-y-1">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`group flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                            activeSection === section.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-2' 
                                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                    >
                        <ChevronRight size={10} className={activeSection === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                        {section.label}
                    </a>
                ))}
            </nav>
        </div>
    );
}
