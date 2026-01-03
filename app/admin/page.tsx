import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/actions/product.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { CopyButton } from "@/components/admin/copy-button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const products = await getAllProducts();

    return (
        <div className="container py-10 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <div className="flex flex-wrap gap-4">
                    <Link href="/admin/pen-names">
                        <Button variant="outline" className="text-slate-900 border-slate-200 hover:bg-slate-100">Manage Pen Names</Button>
                    </Link>
                    <Link href="/admin/blog">
                        <Button variant="outline" className="text-slate-900 border-slate-200 hover:bg-slate-100">Manage Blog</Button>
                    </Link>
                    <Link href="/admin/blog/new">
                        <Button variant="outline" className="gap-2 text-slate-900 border-slate-200 hover:bg-slate-100">
                            <Plus className="h-4 w-4" /> New Post
                        </Button>
                    </Link>
                    <Link href="/admin/messages">
                        <Button variant="outline" className="text-slate-900 border-slate-200 hover:bg-slate-100">Inbox</Button>
                    </Link>
                    <Link href="/admin/products/new">
                        <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-none">
                            <Plus className="h-4 w-4" /> Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Pen Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Product Type</TableHead>
                            <TableHead>Page Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <p>No products found. Create one to get started.</p>
                                        <Link href="/admin/products/new">
                                            <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-none">
                                                <Plus className="h-4 w-4" /> Add Product
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product: any) => {
                                const productIdentifier = product.slug || product._id;
                                const productUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${productIdentifier}`;
                                return (
                                    <TableRow key={product._id}>
                                        <TableCell className="font-medium">{product.title}</TableCell>
                                        <TableCell>
                                            {product.penNameId ? (
                                                <Link href={`/admin/pen-names/${product.penNameId._id}/dashboard`} className="text-blue-500 hover:underline">
                                                    {product.penNameId.name}
                                                </Link>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell className="capitalize">{product.productType || (product.isAmazonProduct ? "Amazon" : "Digital")}</TableCell>
                                        <TableCell className="capitalize">
                                            {product.pageType === 'sales' && 'Sales Page'}
                                            {product.pageType === 'upsell' && 'Upsell Page'}
                                            {product.pageType === 'downsell' && 'Downsell Page'}
                                            {product.pageType === 'thankyou' && 'Thank You Page'}
                                            {product.pageType === 'custom_html' && 'Custom HTML'}
                                            {!product.pageType && '-'}
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-2">
                                            <CopyButton url={productUrl} />
                                            <Link href={`/products/${productIdentifier}`} target="_blank">
                                                <Button variant="ghost" size="sm">View</Button>
                                            </Link>
                                            <Link href={`/admin/products/${product._id}/edit`}>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </Link>
                                            <DeleteProductButton productId={product._id} productTitle={product.title} />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
