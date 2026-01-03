import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check, Star, ShoppingCart } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AmazonTemplateRendererProps {
    contentData: any;
    amazonLink: string;
    title: string;
    description: string;
    imageUrl: string;
}

export function AmazonTemplateRenderer({ contentData, amazonLink, title, description, imageUrl }: AmazonTemplateRendererProps) {
    // Default data if contentData is missing or partial, but NO default values for fields user wants to control
    const data = {
        subheadline: contentData?.subheadline || "",
        features: contentData?.features || [],
        rating: contentData?.rating || "",
        reviewCount: contentData?.reviewCount || "",
        ...contentData
    };

    // Parse features if it's a string (from textarea)
    const featuresList = Array.isArray(data.features)
        ? data.features
        : typeof data.features === 'string'
            ? data.features.split('\n').filter((f: string) => f.trim() !== '')
            : [];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navbar (Optional) */}
            <header className="bg-white border-b py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <div className="font-bold text-xl tracking-tight">ProductReview</div>
                <Link href={amazonLink || "#"} target="_blank">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold">
                        Check Price on Amazon
                    </Button>
                </Link>
            </header>

            <main className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="bg-slate-100 p-8 flex items-center justify-center min-h-[400px]">
                            {imageUrl ? (
                                <div className="relative w-full h-[400px] shadow-lg rounded-lg overflow-hidden">
                                    <Image
                                        src={imageUrl}
                                        alt={title}
                                        fill
                                        className="object-contain" // Use contain for book covers to show full image
                                    />
                                </div>
                            ) : (
                                <div className="text-slate-400 font-medium">No Image Available</div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">

                            {/* Reviews - Conditional */}
                            {(data.reviewCount || data.rating) && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(Number(data.rating || 0)) ? "fill-current" : "text-slate-300"}`} />
                                        ))}
                                    </div>
                                    {data.reviewCount && <span className="text-sm text-slate-500 font-medium">({data.reviewCount} reviews)</span>}
                                </div>
                            )}

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                {title}
                            </h1>

                            {/* Subheadline - Conditional */}
                            {data.subheadline && (
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    {data.subheadline}
                                </p>
                            )}

                            {/* Features - Conditional */}
                            {featuresList.length > 0 && (
                                <div className="space-y-3 mb-8">
                                    {featuresList.map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="mt-1 bg-green-100 text-green-700 rounded-full p-1">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-100">
                                <Link href={amazonLink || "#"} target="_blank" className="block">
                                    <Button size="lg" className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] shadow-sm font-medium text-lg h-14 gap-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        Buy Now on Amazon
                                    </Button>
                                </Link>
                                <p className="text-center text-xs text-slate-400 mt-3">
                                    Secure transaction via Amazon.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description / Review Body */}
                    <div className="p-8 md:p-12 border-t border-slate-100 bg-slate-50/50">
                        {/* 'Our Verdict' removed as requested */}
                        <div className="prose max-w-none text-slate-700">
                            <ReactMarkdown>{description}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
