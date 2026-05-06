import React from 'react';
import { Card } from "@/components/ui/card";
import { Layers, ChevronRight } from "lucide-react";

interface SubGenreProps {
  variations: {
    genre: string;
    variation: string;
  }[];
}

const SubGenreVariationsSection: React.FC<SubGenreProps> = ({ variations }) => {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 font-serif italic">
        <Layers className="text-indigo-600" /> Sub-Genre Variations
      </h2>
      
      <div className="grid sm:grid-cols-2 gap-6">
        {variations.map((item, index) => (
          <Card key={index} className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm group hover:border-indigo-500 transition-all">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              {item.genre} <ChevronRight size={14} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.variation}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SubGenreVariationsSection;
