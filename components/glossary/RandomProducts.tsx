'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MarketplaceItem } from '@/lib/types';

interface RandomProductsProps {
  products: MarketplaceItem[];
}

export default function RandomProducts({ products }: RandomProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] mb-4">The Expansion Vault</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-white mb-4">
                Recommended <span className="text-indigo-600 italic">Growth Assets</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Curated premium tools and literary assets to help you implement these concepts and dominate your market.
            </p>
          </div>
          <Link href="/products" className="group flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest">
            Browse Full Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-500/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
                
                {/* Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {product.type === 'offer' ? 'Premium Offer' : 'Marketplace'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{product.category || 'Digital Asset'}</p>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {product.title}
                </h4>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-lg font-serif font-bold text-slate-900 dark:text-white">${product.price ? product.price.toFixed(2) : '0.00'}</span>
                  <Link 
                    href={product.externalUrl || `/products/${product.slug || product.id}`}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    Access <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
