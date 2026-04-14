import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Star, ShoppingCart, Shield, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AmazonTemplateRendererProps {
    contentData: any;
    amazonLink?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
}

export function AmazonTemplateRenderer({ 
    contentData, 
    amazonLink = "#", 
    title = "Product Details", 
    description = "", 
    imageUrl 
}: AmazonTemplateRendererProps) {
    // Defensively merge contentData with guaranteed keys
    const data = {
        ...contentData,
        subheadline: typeof contentData?.subheadline === 'string' ? contentData.subheadline : (contentData?.subheadline || ""),
        features: Array.isArray(contentData?.features) ? contentData.features : [],
        rating: String(contentData?.rating || "4.8"),
        reviewCount: String(contentData?.reviewCount || "1,240"),
    };

    // Ensure description is a string for ReactMarkdown
    const safeDescription = typeof description === 'string' ? description : String(description || "");

    return (
        <div className="bg-slate-50 min-h-screen pb-20 font-sans">
            {/* Minimal Header */}
            <div className="bg-white border-b border-slate-200 py-4 mb-8">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="text-xl font-bold text-slate-900 tracking-tight">
                        WARLOCK <span className="text-blue-600">DIRECT</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        Verified Purchase Options
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Image Column */}
                        <div className="lg:col-span-5 bg-white p-8 md:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                            <div className="relative w-full max-w-sm aspect-[3/4] group">
                                <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-2xl group-hover:bg-blue-600/10 transition-colors duration-500"></div>
                                {imageUrl ? (
                                    <div className="relative h-full w-full rounded-2xl shadow-2xl overflow-hidden border-8 border-white ring-1 ring-slate-100 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                                        <img 
                                            src={imageUrl} 
                                            alt={title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative h-full w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center italic">
                                        <Info size={40} className="mb-4 opacity-20" />
                                        Preview Not Available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col">
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex text-amber-400 gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={18} fill={s <= Math.floor(Number(data.rating)) ? "currentColor" : "none"} strokeWidth={s <= Math.floor(Number(data.rating)) ? 0 : 2} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                        {data.rating} / 5.0 ({data.reviewCount} reviews)
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                    {title}
                                </h1>
                                
                                {data.subheadline && (
                                    <p className="text-xl text-blue-600 font-semibold mb-8">
                                        {data.subheadline}
                                    </p>
                                )}

                                <div className="prose prose-slate max-w-none mb-10 text-slate-600 leading-relaxed text-lg">
                                    <ReactMarkdown>{safeDescription}</ReactMarkdown>
                                </div>

                                {data.features.length > 0 && (
                                    <div className="space-y-4 mb-10">
                                        <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                                            <ArrowRight size={16} className="text-blue-600" />
                                            Key Highlights
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {data.features.map((feature: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-slate-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-8 border-t border-slate-100">
                                <a href={amazonLink} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="h-16 w-full text-lg font-bold bg-[#FF9900] hover:bg-[#E68A00] text-slate-900 gap-3 shadow-xl shadow-[#FF9900]/20 rounded-2xl group transition-all">
                                        <ShoppingCart size={24} />
                                        View Price on Amazon
                                        <ArrowRight size={20} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </Button>
                                </a>
                                
                                <div className="flex flex-wrap gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Shield size={16} className="text-blue-500" />
                                        <span>Secure Checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <CheckCircle size={16} className="text-blue-500" />
                                        <span>Official Release</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Badges */}
            <div className="container mx-auto px-4 mt-8 flex flex-wrap justify-center gap-4">
               <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                   <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                       <CheckCircle size={20} />
                   </div>
                   <div className="text-left">
                       <div className="text-xs font-bold text-slate-400 uppercase">Status</div>
                       <div className="text-sm font-bold text-slate-900">In Stock Now</div>
                   </div>
               </div>
               <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                       <Star size={20} fill="currentColor" />
                   </div>
                   <div className="text-left">
                       <div className="text-xs font-bold text-slate-400 uppercase">Reputation</div>
                       <div className="text-sm font-bold text-slate-900">Top Rated Seller</div>
                   </div>
               </div>
            </div>
        </div>
    );
}
