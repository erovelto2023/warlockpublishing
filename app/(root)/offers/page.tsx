import { getPublishedSalesPages } from "@/lib/actions/sales-page.actions";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
    const offers = await getPublishedSalesPages();

    return (
        <div className="container py-24 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">The Grand <span className="text-secondary italic">Emporium</span></h1>
                <p className="text-neutral-500 max-w-2xl text-lg">
                    Discover exclusive access to our premier collection of high-value offers and specialized landing pages. 
                    The definitive destination for elite publishing assets.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.length > 0 ? (
                    offers.map((offer: any) => (
                        <Card key={offer._id} className="flex flex-col h-full bg-neutral-900/40 border-white/5 hover:border-secondary/20 transition-all shadow-2xl overflow-hidden rounded-3xl group">
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                                {offer.marketplaceImage || offer.ogImage ? (
                                    <img
                                        src={offer.marketplaceImage || offer.ogImage}
                                        alt={offer.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div 
                                        className="flex items-center justify-center h-full text-white/20"
                                        style={{ backgroundColor: offer.marketplaceColor || '#4f46e5' }}
                                    >
                                        <div className="p-8 text-center">
                                            <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                            <span className="text-xl font-serif font-bold tracking-tight opacity-40">Elite Asset</span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500/20 backdrop-blur-md rounded-full border border-amber-500/20 flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    Special Offer
                                </div>
                            </div>
                            
                            <CardHeader className="pt-6">
                                <CardTitle className="line-clamp-1 text-xl text-white font-serif">{offer.marketplaceTitle || offer.title}</CardTitle>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {offer.marketplaceFeatures?.slice(0, 2).map((feature: string, idx: number) => (
                                        <span key={idx} className="text-[10px] bg-white/5 text-neutral-400 px-2.5 py-1 rounded-full border border-white/5 uppercase tracking-wider">
                                            {feature}
                                        </span>
                                    ))}
                                    <span className="text-[10px] bg-secondary/10 text-secondary px-2.5 py-1 rounded-full border border-secondary/10 uppercase tracking-wider font-bold">
                                        Exclusive
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                                    {offer.marketplaceDescription || offer.description || "Unlock premium access to this exclusive bundle collection."}
                                </p>
                            </CardContent>

                            <CardFooter className="flex items-center justify-between border-t border-white/5 pt-6 pb-8 bg-black/20">
                                <div className="flex flex-col">
                                    <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Invest</span>
                                    <span className="font-serif text-2xl text-white">${offer.price ? offer.price.toFixed(2) : '0.00'}</span>
                                </div>
                                <Link href={`/offers/${offer.slug}`}>
                                    <Button className="bg-secondary hover:bg-white text-black font-bold px-6 py-6 rounded-2xl transition-all shadow-lg shadow-secondary/10">
                                        Enter Store
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                        <p className="text-neutral-500">No active bundles available at the moment. Check back soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
