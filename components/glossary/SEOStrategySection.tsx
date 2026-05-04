import { Card } from "@/components/ui/card";
import { TrendingUp, Target } from "lucide-react";

interface SEOStrategySectionProps {
    strategy: {
        volumeRange?: string;
        difficulty?: 'Low' | 'Medium' | 'High';
        relatedKeywords: string[];
    };
}

export default function SEOStrategySection({ strategy }: SEOStrategySectionProps) {
    const keywords = strategy.relatedKeywords || [];
    
    return (
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <TrendingUp size={80} />
            </div>
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 dark:border-slate-800 relative z-10">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    <Target size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    Market Intelligence
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Difficulty</div>
                    <div className={`text-xs font-black uppercase ${
                        strategy.difficulty === 'Low' ? 'text-emerald-600' :
                        strategy.difficulty === 'Medium' ? 'text-amber-600' :
                        'text-rose-600'
                    }`}>
                        {strategy.difficulty}
                    </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Volume</div>
                    <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {strategy.volumeRange || 'N/A'}
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">LSI Targets</h4>
                <div className="flex flex-wrap gap-2">
                    {keywords.slice(0, 5).map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold">
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
}
