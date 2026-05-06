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
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 font-serif italic">
        <Sparkles className="text-amber-500" /> Vibe Curation
      </h2>
      
      <div className="space-y-12">
        {curation.map((item, index) => (
          <div key={index} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-12 rounded-full ${
                item.vibe === 'Yellow' ? 'bg-yellow-400' : 
                item.vibe === 'Blue' ? 'bg-blue-500' : 
                item.vibe === 'Red' ? 'bg-red-500' : 'bg-slate-400'
              }`}></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.vibe} Vibe</h3>
                {item.vibeDescription && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.vibeDescription}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {item.books.map((book, bookIndex) => (
                <Card key={bookIndex} className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Book size={64} />
                  </div>
                  
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{book.title}</h4>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">By {book.author}</p>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 italic">
                      "{book.salesHook}"
                    </p>
                    
                    <a href={book.buyUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-slate-900 hover:bg-black text-white gap-2">
                        <ShoppingCart size={16} /> Get Data-Packet <ExternalLink size={14} />
                      </Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VibeCurationSection;
