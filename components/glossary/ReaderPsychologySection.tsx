import React from 'react';
import { Card } from "@/components/ui/card";
import { Brain, Zap, Heart, Shield } from "lucide-react";

interface ReaderPsychologyProps {
  psychology: {
    whyWeCraveIt: string;
    cognitiveShortcut: string;
    emotionalPayoff: string;
    catharticRelease: string;
  };
}

const ReaderPsychologySection: React.FC<ReaderPsychologyProps> = ({ psychology }) => {
  if (!psychology) return null;

  const cards = [
    { title: 'The Biological Craving', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/10', content: psychology.whyWeCraveIt },
    { title: 'Neural Shortcut', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/5', border: 'border-indigo-500/10', content: psychology.cognitiveShortcut },
    { title: 'The Emotional Dividend', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', content: psychology.emotionalPayoff },
    { title: 'Primal Catharsis', icon: Brain, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/10', content: psychology.catharticRelease },
  ];

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-4 font-serif italic">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Brain className="text-indigo-600 dark:text-indigo-400" size={28} />
          </div>
          Psychological Blueprint
        </h2>
        <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Biological Hardwiring</span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {cards.map((card, i) => (
          <div key={i} className={`p-8 rounded-[2rem] border ${card.border} ${card.bg} relative overflow-hidden group hover:shadow-xl transition-all duration-500`}>
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <card.icon size={80} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className={`flex items-center gap-3 ${card.color}`}>
                <card.icon size={20} />
                <h3 className="font-black uppercase tracking-[0.2em] text-xs">{card.title}</h3>
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {card.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReaderPsychologySection;
