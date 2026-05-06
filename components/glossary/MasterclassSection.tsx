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
  if (!masterclass) return null;
  
  const { 
    threeActStructure = { act1: '', act2: '', act3: '' }, 
    profitBeats = [], 
    characterArchetypes = [], 
    technicalComponents = { powerTitle: '', tropes: [], hook: '' }, 
    profitabilityChecklist = [] 
  } = masterclass;

  return (
    <section className="space-y-12">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden border border-slate-800">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="flex items-start gap-6">
              <div className="p-5 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[1.5rem] shadow-xl shadow-indigo-500/20">
                <GraduationCap size={40} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
                    Authority Level: Master
                  </span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-indigo-500/40"></div>)}
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif italic tracking-tight">Creator Masterclass</h2>
                <p className="text-slate-400 text-lg mt-3 max-w-2xl leading-relaxed">{masterclass.masterclassDesc}</p>
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-16">
            {/* Narrative Architecture Timeline */}
            <div className="lg:col-span-7 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-3">
                  <Layout size={18} /> Narrative Architecture
                </h3>
              </div>
              
              <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-500/30 before:to-transparent">
                {[
                  { act: 'Act 1', content: threeActStructure.act1, label: 'The Hook & Inciting Incident' },
                  { act: 'Act 2', content: threeActStructure.act2, label: 'The Escalation & Midpoint' },
                  { act: 'Act 3', content: threeActStructure.act3, label: 'The Climax & Resolution' }
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center z-10 group-hover:scale-125 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{item.act}</span>
                        <span className="h-[1px] w-8 bg-slate-800"></span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-base">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profit Beats Sidebar */}
            <div className="lg:col-span-5 space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-3">
                <PlayCircle size={18} /> Strategic Profit Beats
              </h3>
              <div className="grid gap-4">
                {profitBeats.map((beat, i) => (
                  <div key={i} className="p-6 rounded-[1.5rem] bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all group shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">{beat.title}</h4>
                      <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        {beat.timing}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{beat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mt-20 pt-16 border-t border-slate-800/50">
            {/* Character Archetypes */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                <Users size={16} /> Narrative Archetypes
              </h3>
              <div className="space-y-6">
                {characterArchetypes.map((arch, i) => (
                  <div key={i} className="group">
                    <div className="text-sm font-black text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1 h-3 bg-indigo-500 rounded-full group-hover:h-5 transition-all"></div>
                      {arch.role}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed pl-3 border-l border-slate-800">{arch.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Components */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                <Settings size={16} /> Asset Components
              </h3>
              <div className="space-y-6 bg-slate-800/30 p-6 rounded-2xl border border-slate-800">
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Power Title Strategy</div>
                  <div className="text-base font-bold text-white italic">"{technicalComponents.powerTitle}"</div>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Mandatory Tropes</div>
                  <div className="flex flex-wrap gap-2">
                    {(technicalComponents.tropes || []).map((trope, i) => (
                      <span key={i} className="text-[10px] font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                        {trope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profitability Checklist */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                <ClipboardCheck size={16} /> Profitability Checklist
              </h3>
              <div className="grid gap-3">
                {profitabilityChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 group hover:bg-emerald-500/10 transition-colors">
                    <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-sm text-slate-300 leading-tight group-hover:text-white transition-colors">{item}</span>
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
