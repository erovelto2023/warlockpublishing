import { getPublishedProducts } from "@/lib/actions/product.actions";
import { SearchInput } from "@/components/search-input";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams.q;
    const allProducts = await getPublishedProducts();

    const products = q
        ? allProducts.filter((p: any) =>
            p.title.toLowerCase().includes(q.toLowerCase()) ||
            p.description.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase())
        )
        : allProducts;

    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Search Products</h1>

            <div className="mb-8">
                <SearchInput />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <p className="text-muted-foreground">No products found.</p>
                ) : (
                    products.map((product: any) => (
                        <Card key={product._id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                                {product.imageUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
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
                                    <CardTitle className="line-clamp-1 text-lg">{product.title}</CardTitle>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">{product.category}</span>
                                    <span className="text-xs bg-muted px-2 py-1 rounded-full">{product.licenseType}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {product.description}
                                </p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between border-t pt-4">
                                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                                <Link href={`/products/${product._id}`}>
                                    <Button size="sm">View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
