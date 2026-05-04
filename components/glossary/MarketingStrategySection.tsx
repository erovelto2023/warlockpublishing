import { Card } from "@/components/ui/card";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface MarketingStrategySectionProps {
    strategy: {
        hooks?: string[];
        headlines?: string[];
        titles?: string[];
        contentIdeas?: string[];
        socialPosts?: string[];
    };
}

export default function MarketingStrategySection({ strategy }: MarketingStrategySectionProps) {
    return (
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                    <Lightbulb size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    Authority Playbook
                </h3>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Viral Hooks</h4>
                    <div className="space-y-3">
                        {strategy.hooks?.slice(0, 3).map((hook, i) => (
                            <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm italic">
                                "{hook}"
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Top Content Pillars</h4>
                    <div className="space-y-2">
                        {strategy.contentIdeas?.slice(0, 3).map((idea, i) => (
                            <div key={i} className="flex gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                                <CheckCircle2 size={14} className="text-indigo-500 flex-shrink-0" />
                                {idea}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
