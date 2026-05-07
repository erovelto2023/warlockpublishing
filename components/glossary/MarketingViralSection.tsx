import { Card } from "@/components/ui/card";
import { Zap, Target, LayoutDashboard, Share2 } from "lucide-react";

interface MarketingViralSectionProps {
    marketingStrategy?: {
        viralHooks: string[];
        contentPillars: string[];
    };
}

export default function MarketingViralSection({ marketingStrategy }: MarketingViralSectionProps) {
    if (!marketingStrategy?.viralHooks?.length && !marketingStrategy?.contentPillars?.length) return null;

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-rose-600 dark:text-rose-400">
                    Viral Distribution & Authority Pillars
                </h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800">
                        Growth Engine
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Viral Hooks */}
                <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={64} className="text-rose-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-600 text-white rounded-lg">
                            <Zap size={18} />
                        </div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight italic">
                            Viral Hooks
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {marketingStrategy.viralHooks.map((hook, idx) => (
                            <div 
                                key={idx}
                                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all group/hook"
                            >
                                <div className="flex gap-3">
                                    <span className="text-rose-600 font-black text-xs mt-1">#{idx + 1}</span>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                                        "{hook}"
                                    </p>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(hook);
                                            alert('Hook copied!');
                                        }}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5"
                                    >
                                        <Share2 size={10} /> Copy Hook
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Content Pillars */}
                <Card className="p-8 bg-slate-900 border-slate-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LayoutDashboard size={64} className="text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-600 text-white rounded-lg">
                            <Target size={18} />
                        </div>
                        <h3 className="font-black text-lg text-white uppercase tracking-tight">
                            Content Pillars
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {marketingStrategy.contentPillars.map((pillar, idx) => (
                            <div 
                                key={idx}
                                className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all flex items-start gap-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                                    <span className="text-indigo-400 font-black text-xs">{idx + 1}</span>
                                </div>
                                <div>
                                    <p className="text-slate-200 font-bold text-sm leading-tight mb-1">
                                        {pillar.split(':')[0]}
                                    </p>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        {pillar.split(':')[1] || 'Strategic thematic focus for authority building.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </section>
    );
}
