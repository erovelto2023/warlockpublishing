import { Card } from "@/components/ui/card";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPipelineSectionProps {
    term: string;
    ideas: {
        affiliateProducts?: string[];
        courseTopics?: string[];
        digitalDownloads?: {
            title: string;
            imageUrl: string;
            downloadUrl: string;
            learnMoreUrl: string;
        }[];
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
                    <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Digital Downloads</h4>
                        {digitalDownloads.map((dl, i) => (
                            <div key={i} className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                                {dl.imageUrl && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img src={dl.imageUrl} alt={dl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="p-4 space-y-3">
                                    <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{dl.title}</h5>
                                    <div className="flex flex-col gap-2">
                                        <a href={dl.downloadUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                                            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest h-8 shadow-sm">
                                                Download Now
                                            </Button>
                                        </a>
                                        {dl.learnMoreUrl && (
                                            <a href={dl.learnMoreUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors text-center flex items-center justify-center gap-1">
                                                Learn More <ArrowRight size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {ideas.courseTopics && ideas.courseTopics.length > 0 && (
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Course Topics</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 marker:text-amber-400">
                            {ideas.courseTopics.map((topic, i) => (
                                <li key={i}>{topic}</li>
                            ))}
                        </ul>
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
