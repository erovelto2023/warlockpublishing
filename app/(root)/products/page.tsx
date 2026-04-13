import { getMarketplaceItems } from "@/lib/actions/product.actions";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const items = await getMarketplaceItems();

    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">All Products & Offers</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item: any) => (
                    <Card key={item.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'offer' ? 'bg-amber-100 text-amber-800' : 'bg-secondary'}`}>
                                    {item.category || item.type}
                                </span>
                                {item.licenseType && (
                                    <span className="text-xs bg-muted px-2 py-1 rounded-full">{item.licenseType}</span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {item.description?.replace(/<[^>]*>?/gm, '') || ''}
                            </p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t pt-4">
                            <span className="font-bold text-lg">${item.price ? item.price.toFixed(2) : '0.00'}</span>
                            <Link href={item.externalUrl || `/products/${item.slug || item.id}`}>
                                <Button size="sm">{item.type === 'offer' ? 'Claim Offer' : 'View Details'}</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
