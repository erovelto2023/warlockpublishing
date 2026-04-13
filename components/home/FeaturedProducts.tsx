'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
  category?: string;
  slug?: string;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-[0.4em] mb-4">The Collection</h2>
            <h3 className="text-4xl lg:text-5xl font-serif text-white mb-6">Featured <span className="text-secondary italic">Mastery Assets</span></h3>
            <p className="text-neutral-400 leading-relaxed font-sans">
              Hand-vetted premium assets designed to elevate your creative output and accelerate your professional growth.
            </p>
          </div>
          <Link href="/products" className="group flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-white transition-all">
            Enter the Full Vault <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group relative flex flex-col h-full bg-neutral-900/50 rounded-3xl border border-white/5 overflow-hidden hover:border-secondary/20 transition-all shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-neutral-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase tracking-widest">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  Premium
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">{product.category || 'Digital Asset'}</p>
                <h4 className="text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-secondary transition-colors">
                  {product.title}
                </h4>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-serif text-white">${product.price.toFixed(2)}</span>
                  <Link 
                    href={`/products/${product.slug || product._id}`}
                    className="p-3 bg-secondary/10 text-secondary rounded-xl hover:bg-secondary hover:text-black transition-all"
                  >
                    <ArrowRight className="w-5 h-5" />
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
