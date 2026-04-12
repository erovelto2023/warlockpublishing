"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { Tag, Hash } from 'lucide-react';

interface Term {
  category: string;
  term: string;
  slug: string;
}

interface TagCloudProps {
  terms: Term[];
  onSelectTag: (tag: string) => void;
  activeTag: string;
}

export default function TagCloud({ terms, onSelectTag, activeTag }: TagCloudProps) {
  const categoryGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    terms.forEach(term => {
      const cat = term.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      if (!groups[cat].includes(term.term)) {
        groups[cat].push(term.term);
      }
    });
    return groups;
  }, [terms]);

  const categories = Object.keys(categoryGroups).sort();

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div key={category} className="group p-6 bg-white rounded-2xl border border-slate-300 hover:border-indigo-100 transition-all shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-indigo-50">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Hash size={12} />
              </div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-600 transition-colors">
                {category}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryGroups[category].slice(0, 10).map((term) => (
                <button
                  key={term}
                  onClick={() => onSelectTag(term)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-tight transition-all ${
                    activeTag === term 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {term}
                </button>
              ))}
              {categoryGroups[category].length > 10 && (
                <div className="flex items-center gap-1 px-3 py-1.5 text-[9px] font-bold text-slate-300 italic">
                  +{categoryGroups[category].length - 10} Nodes
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
