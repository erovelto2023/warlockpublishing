import React from 'react';
import { ShoppingBag, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { AmazonProduct } from '@/lib/csv-parser';
import { formatAmazonLink } from '@/lib/utils';
import Link from 'next/link';

interface AmazonLibrarySectionProps {
    products: AmazonProduct[];
    title?: string;
    subtitle?: string;
}

export default function AmazonLibrarySection({ 
    products, 
    title = "Prime Reference Library", 
    subtitle = "Vetted Industry Assets" 
}: AmazonLibrarySectionProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="space-y-10" id="library">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                        {title}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> {subtitle}
                    </p>
                </div>
                <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8 mb-4 opacity-50"></div>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest">
                    Live Prime Sync
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, i) => {
                    const amazonLink = formatAmazonLink(product.fullUrl || product.shortUrl || `https://www.amazon.com/dp/${product.asin}`);
                    
                    return (
                        <Link 
                            key={i} 
                            href={amazonLink} 
                            target="_blank" 
                            className="group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all flex flex-col h-full"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">In Stock</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-center shadow-xl">
                                        View on Amazon
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {product.store || "Amazon Prime"}
                                    </span>
                                    <div className="flex items-center gap-0.5 text-amber-400">
                                        <Star size={10} className="fill-current" />
                                        <span className="text-[10px] font-bold text-slate-900 ml-1">{product.rating || "4.8"}</span>
                                    </div>
                                </div>
                                
                                <h3 className="text-sm font-extrabold text-slate-900 leading-snug mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    {product.title}
                                </h3>

                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase">Pricing</span>
                                        <span className="text-md font-black text-slate-900">${product.price || "2.99"}</span>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        <ExternalLink size={16} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
