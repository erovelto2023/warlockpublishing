import React from 'react';
import { Card } from "@/components/ui/card";
import { GraduationCap, Layout, PlayCircle, Users, Settings, ClipboardCheck } from "lucide-react";

interface MasterclassProps {
  masterclass: {
    masterclassDesc: string;
    threeActStructure: {
      act1: string;
      act2: string;
      act3: string;
    };
    profitBeats: {
      title: string;
      description: string;
      timing: string;
    }[];
    characterArchetypes: {
      role: string;
      description: string;
    }[];
    technicalComponents: {
      powerTitle: string;
      tropes: string[];
      hook: string;
    };
    profitabilityChecklist: string[];
  };
}

const MasterclassSection: React.FC<MasterclassProps> = ({ masterclass }) => {
  return (
    <section className="space-y-10">
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <GraduationCap size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-serif italic">Creator Masterclass</h2>
              <p className="text-slate-400 text-sm mt-1">{masterclass.masterclassDesc}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {/* 3-Act Structure */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400 uppercase tracking-widest text-xs">
                <Layout size={18} /> Narrative Architecture
              </h3>
              <div className="space-y-4">
                {Object.entries(masterclass.threeActStructure).map(([act, content], i) => (
                  <div key={act} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Act {i + 1}</span>
                      <p className="text-sm text-slate-300">{content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profit Beats */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-400 uppercase tracking-widest text-xs">
                <PlayCircle size={18} /> Profit Beats
              </h3>
              <div className="space-y-4">
                {masterclass.profitBeats.map((beat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-white">{beat.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">
                        {beat.timing}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{beat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-800">
            {/* Character Archetypes */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Users size={14} /> Archetypes
              </h3>
              {masterclass.characterArchetypes.map((arch, i) => (
                <div key={i}>
                  <div className="text-sm font-bold text-white mb-1">{arch.role}</div>
                  <p className="text-xs text-slate-400">{arch.description}</p>
                </div>
              ))}
            </div>

            {/* Technical Components */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Settings size={14} /> Components
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Power Title</div>
                  <div className="text-sm text-white">{masterclass.technicalComponents.powerTitle}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Key Tropes</div>
                  <div className="flex flex-wrap gap-2">
                    {masterclass.technicalComponents.tropes.map((trope, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{trope}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profitability Checklist */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <ClipboardCheck size={14} /> Profitability
              </h3>
              <div className="space-y-2">
                {masterclass.profitabilityChecklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassSection;
