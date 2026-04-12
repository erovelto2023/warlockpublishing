"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Product {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  slug: string;
  amazonLink?: string;
}

export default function RotatingAffiliateBanner({ products = [] }: { products?: Product[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % products.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (!products || products.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center">
        <h3 className="text-white font-black text-2xl mb-4 italic">Expand Your Reach.</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          Unlock premium publishing templates and commercial blueprints to accelerate your career.
        </p>
        <Link href="/products" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all w-fit shadow-xl shadow-indigo-900/40">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const current = products[index];

  return (
    <div className="h-full flex flex-col justify-center animate-in fade-in duration-700">
      <div className="flex items-start gap-6 mb-8">
        {current.imageUrl && (
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white/5 relative">
            <Image 
              src={current.imageUrl} 
              alt={current.title} 
              fill 
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-white font-black text-xl mb-2 line-clamp-1 italic">{current.title}</h3>
          <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">
            {current.description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {current.amazonLink && (
          <Link 
            href={current.amazonLink} 
            className="bg-amber-500 text-slate-900 px-8 h-12 flex items-center rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
          >
            Buy on Amazon
          </Link>
        )}
        <Link 
          href="/products" 
          className="text-white/40 hover:text-white transition-colors font-black text-[9px] uppercase tracking-widest flex items-center gap-2"
        >
          All Products <ArrowRight size={14} />
        </Link>
      </div>

      {products.length > 1 && (
        <div className="absolute bottom-10 left-12 flex gap-1.5">
          {products.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-indigo-500' : 'w-1 bg-white/10'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
