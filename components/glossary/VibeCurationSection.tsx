import React from 'react';
import { Card } from "@/components/ui/card";
import { Sparkles, Book, ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VibeCurationProps {
  curation: {
    vibe: string;
    vibeDescription?: string;
    books: {
      title: string;
      author: string;
      salesHook: string;
      buyUrl: string;
    }[];
  }[];
}

const VibeCurationSection: React.FC<VibeCurationProps> = ({ curation }) => {
  if (!curation || !Array.isArray(curation)) return null;

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-4 font-serif italic">
          <div className="p-2 bg-amber-500/10 rounded-xl">
            <Sparkles className="text-amber-500" size={28} />
          </div>
          Vibe Curation
        </h2>
        <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Atmospheric Alignment</span>
      </div>
      
      <div className="space-y-20">
        {curation.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex items-start gap-6 mb-10">
              <div className={`w-1 h-16 rounded-full shrink-0 ${
                item.vibe === 'Yellow' ? 'bg-gradient-to-b from-yellow-400 to-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 
                item.vibe === 'Blue' ? 'bg-gradient-to-b from-blue-400 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                item.vibe === 'Red' ? 'bg-gradient-to-b from-red-400 to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                'bg-slate-400'
              }`}></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-2">
                  The {item.vibe} Frequency
                </h3>
                {item.vibeDescription && (
                  <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl italic">
                    {item.vibeDescription}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {(item.books || []).map((book, bookIndex) => (
                <div key={bookIndex} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-5 group-hover:opacity-20 transition duration-500"></div>
                  <Card className="relative p-8 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-[2rem] hover:shadow-2xl transition-all group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                      <Book size={100} />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Architected by {book.author}</p>
                      </div>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-indigo-500 italic text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        "{book.salesHook}"
                      </div>
                      
                      <a href={book.buyUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-slate-900 dark:bg-white dark:text-black hover:bg-black dark:hover:bg-slate-200 text-white rounded-xl h-12 gap-2 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-black/5 dark:shadow-white/5">
                          <ShoppingCart size={16} /> Get Data-Packet <ExternalLink size={14} />
                        </Button>
                      </a>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VibeCurationSection;
