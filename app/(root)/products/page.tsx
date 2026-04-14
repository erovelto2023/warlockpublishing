import { getMarketplaceItems } from "@/lib/actions/product.actions";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const items = await getMarketplaceItems();

    const pageStr = resolvedSearchParams?.page as string;
    const currentPage = parseInt(pageStr) || 1;
    const itemsPerPage = 20;

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const validPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
    
    const startIndex = (validPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">All Products & Offers</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedItems.map((item: any) => (
                    <Card key={item.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                            {item.imageUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform hover:scale-105"
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

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <Button variant="outline" disabled={validPage <= 1} asChild={validPage > 1}>
                        {validPage > 1 ? (
                            <Link href={`/products?page=${validPage - 1}`}>Previous</Link>
                        ) : (
                            <span>Previous</span>
                        )}
                    </Button>
                    <span className="text-sm font-medium">
                        Page {validPage} of {totalPages}
                    </span>
                    <Button variant="outline" disabled={validPage >= totalPages} asChild={validPage < totalPages}>
                        {validPage < totalPages ? (
                            <Link href={`/products?page=${validPage + 1}`}>Next</Link>
                        ) : (
                            <span>Next</span>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
