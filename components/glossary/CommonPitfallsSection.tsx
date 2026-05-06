import React from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, XCircle } from "lucide-react";

interface PitfallsProps {
  pitfalls: {
    pitfall: string;
    howToAvoid: string;
  }[];
}

const CommonPitfallsSection: React.FC<PitfallsProps> = ({ pitfalls }) => {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 font-serif italic">
        <AlertTriangle className="text-rose-600" /> Common Pitfalls
      </h2>
      
      <div className="grid gap-6">
        {pitfalls.map((item, index) => (
          <Card key={index} className="p-0 overflow-hidden border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-950/10 shadow-sm">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-rose-100 dark:border-rose-900/30">
                <div className="flex items-center gap-2 text-rose-600 mb-3">
                  <XCircle size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">The Glitch</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {item.pitfall}
                </p>
              </div>
              <div className="p-6 md:w-1/2 bg-white dark:bg-slate-900/50">
                <div className="flex items-center gap-2 text-emerald-600 mb-3">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">The Fix</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.howToAvoid}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CommonPitfallsSection;
