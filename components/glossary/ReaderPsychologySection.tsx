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

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 font-serif italic">
        <Brain className="text-indigo-600" /> Reader Psychology
      </h2>
      
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Heart size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Why We Crave It</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {psychology.whyWeCraveIt}
          </p>
        </Card>

        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
            <Zap size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Cognitive Shortcut</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {psychology.cognitiveShortcut}
          </p>
        </Card>

        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-rose-600">
            <Shield size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Emotional Payoff</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {psychology.emotionalPayoff}
          </p>
        </Card>

        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <Brain size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Cathartic Release</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {psychology.catharticRelease}
          </p>
        </Card>
      </div>
    </section>
  );
};

export default ReaderPsychologySection;
