import Link from 'next/link';
import { ArrowRight, Book } from 'lucide-react';

interface RelatedTermsProps {
    terms: any[];
}

export default function RelatedTerms({ terms }: RelatedTermsProps) {
    if (!terms || terms.length === 0) return null;

    return (
        <section className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Book size={20} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 uppercase tracking-tight">Connected Intelligence</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terms.map((term) => (
                    <Link 
                        key={term._id} 
                        href={`/glossary/${term.slug}`}
                        className="group p-6 bg-white border border-slate-300 rounded-2xl hover:border-indigo-600 transition-all shadow-sm flex items-center justify-between"
                    >
                        <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-600">
                                {term.category}
                            </p>
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-tight">
                                {term.term}
                            </h4>
                        </div>
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ArrowRight size={14} />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
