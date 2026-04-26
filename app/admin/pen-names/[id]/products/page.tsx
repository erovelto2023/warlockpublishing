import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Eye, Edit3 } from "lucide-react";
import { getProductsByPenName } from "@/lib/actions/product.actions";
import { getSanitizedProduct } from "@/lib/product-utils";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface PenNameProductsPageProps {
    params: Promise<{ id: string }>;
}

export default async function PenNameProductsPage({ params }: PenNameProductsPageProps) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const { id } = await params;
    const products = await getProductsByPenName(id);

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">My Library</h2>
                    <p className="text-slate-500">Manage your books, series, and merchandise.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/products/new">
                        <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                            <Plus size={16} />
                            <span>Add Product</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">Add your first product to this pen name.</p>
                    </div>
                ) : (
                    products.map(getSanitizedProduct).map((product: any) => (
                        <div key={product.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
                            <div className="h-48 bg-slate-100 relative p-6 flex items-center justify-center text-center">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain shadow-md" />
                                ) : (
                                    <div className="text-slate-400 font-medium">No Image</div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-[-10px] group-hover:translate-y-0">
                                    <Link href={`/products/${product.id}`} target="_blank">
                                        <button className="p-2 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-100 tooltip" title="View Sales Page">
                                            <Eye size={16} />
                                        </button>
                                    </Link>
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <button className="p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800">
                                            <Edit3 size={16} />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${!product.isHidden ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {!product.isHidden ? 'Published' : 'Hidden'}
                                    </span>
                                    <span className="text-slate-400">
                                        <MoreVertical size={16} />
                                    </span>
                                </div>

                                <h3 className="font-bold text-slate-900 mb-1 truncate">{product.title}</h3>
                                <p className="text-sm text-slate-500 mb-4">{product.category}</p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Price</span>
                                        <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                                    </div>
                                    {/* Sales count would go here if we had it */}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Add New Placeholder */}
                <Link href="/admin/products/new" className="group border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center mb-3 transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Create New Product</span>
                </Link>
            </div>
        </div>
    );
}
