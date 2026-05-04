import { Card } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

interface ChecklistItem {
    task: string;
    description: string;
}

interface ChecklistSectionProps {
    title: string;
    description: string;
    items: ChecklistItem[];
}

export default function ChecklistSection({ title, description, items }: ChecklistSectionProps) {
    if (!items || items.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 font-serif italic">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white not-italic font-sans text-sm">4</div>
                {title}
            </h2>
            
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                            <ListChecks size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide">Implementation Guide</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.map((item, idx) => (
                        <div key={idx} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <div className="flex gap-5">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors mt-0.5">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {item.task}
                                    </h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Follow these steps for maximum authority
                    </p>
                </div>
            </Card>
        </section>
    );
}
