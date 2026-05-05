import { Card } from "@/components/ui/card";
import { Target, ArrowRight } from "lucide-react";

interface ProductPipelineSectionProps {
    term: string;
    ideas: {
        affiliateProducts?: string[];
        courseTopics?: string[];
        digitalDownloads?: string[];
    };
}

export default function ProductPipelineSection({ term, ideas = {} }: ProductPipelineSectionProps) {
    const { affiliateProducts = [], digitalDownloads = [] } = ideas || {};
    
    const parseMarkdownLink = (text: string) => {
        const match = text.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
            return <a href={match[2]} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 font-bold hover:underline">{match[1]}</a>;
        }
        return text;
    };
    
    return (
        <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                    <Target size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    Market Opportunities
                </h3>
            </div>

            <div className="space-y-6">
                {affiliateProducts.length > 0 && (
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Recommended Products</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 marker:text-indigo-400">
                            {affiliateProducts.map((prod, i) => (
                                <li key={i}>{parseMarkdownLink(prod)}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {digitalDownloads.length > 0 && (
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">High-Value Assets</h4>
                        <div className="space-y-2">
                            {digitalDownloads.map((asset, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <ArrowRight size={12} className="text-indigo-400" />
                                    {parseMarkdownLink(asset)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    Market analysis suggests these are the highest converting opportunities for "{term}" currently.
                </p>
            </div>
        </Card>
    );
}
