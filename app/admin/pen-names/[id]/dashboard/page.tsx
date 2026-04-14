import {
    DollarSign,
    Book,
    Users,
    Star,
    ArrowUpRight,
    Search,
    Bell,
    Plus,
    Edit,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProductsByPenName } from "@/lib/actions/product.actions";
import { getSubscribers } from "@/lib/actions/subscriber.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

const MOCK_STATS = [
    { label: "Total Revenue", value: "$0.00", change: "+0%", icon: DollarSign, color: "text-emerald-600" },
    { label: "Books Sold", value: "0", change: "+0%", icon: Book, color: "text-blue-600" },
    { label: "Active Readers", value: "0", change: "+0%", icon: Users, color: "text-purple-600" },
    { label: "Avg. Rating", value: "0.0", change: "+0.0", icon: Star, color: "text-amber-500" },
];

const StatCard = ({ stat }: { stat: any }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-opacity-10 ${stat.color.replace('text', 'bg')}`}>
                <stat.icon size={24} className={stat.color} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
                {stat.change} <ArrowUpRight size={12} className="ml-1" />
            </span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
        <p className="text-sm text-slate-500">{stat.label}</p>
    </div>
);

interface DashboardPageProps {
    params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const { id } = await params;
    
    // Fetch real data
    const [subscribers, products] = await Promise.all([
        getSubscribers(id),
        getProductsByPenName(id)
    ]);

    // Update stats with real data
    const stats = [
        ...MOCK_STATS.slice(0, 1),
        { label: "Published Works", value: products.length.toString(), change: "+0", icon: Book, color: "text-blue-600" },
        { label: "Active Readers", value: subscribers.length.toString(), change: "+0%", icon: Users, color: "text-purple-600" },
        ...MOCK_STATS.slice(3)
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-900 hidden sm:block">Author Management</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link href={`/admin/products/new?penNameId=${id}`}>
                        <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-100">
                            <Plus size={16} />
                            <span>Add New Book</span>
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
                            <p className="text-slate-500 font-medium">Performance and inventory overview.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <StatCard key={idx} stat={stat} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Published Works section - replaces mock Sales */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-bold">Published Works</h3>
                                <Badge variant="outline" className="bg-white">{products.length} Products</Badge>
                            </div>
                            <div className="p-0">
                                {products.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="mb-4 flex justify-center">
                                            <Book className="w-12 h-12 text-slate-200" />
                                        </div>
                                        <h4 className="text-slate-900 font-bold">No books published yet</h4>
                                        <p className="text-slate-500 text-sm mb-6">Start building your author profile by adding your first book.</p>
                                        <Link href={`/admin/products/new?penNameId=${id}`}>
                                            <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                                                <Plus size={16} /> Add First Book
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="border-b-slate-100">
                                                <TableHead className="w-[80px]">Cover</TableHead>
                                                <TableHead className="font-bold">Title</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.map((product: any) => (
                                                <TableRow key={product._id} className="border-b-slate-100 hover:bg-slate-50/50 transition-colors">
                                                    <TableCell>
                                                        <div className="w-12 h-16 bg-slate-100 rounded border border-slate-200 overflow-hidden relative shadow-sm">
                                                            {product.imageUrl ? (
                                                                <img src={product.imageUrl} alt={product.title} className="object-cover w-full h-full" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">No Image</div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900">{product.title}</span>
                                                            <span className="text-xs text-slate-500">{product.category || 'No Category'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="capitalize text-[10px] font-bold">
                                                            {product.productType || 'ebook'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm font-bold">
                                                        ${product.price?.toFixed(2) || '0.00'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/admin/products/${product._id}/edit`}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                                                                    <Edit size={16} />
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/products/${product.slug || product._id}`} target="_blank">
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50">
                                                                    <ExternalLink size={16} />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </div>

                        {/* Subscribers List moved to bottom or side if needed, keeping it for now */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm text-slate-900">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold">Recent Mailing List Subscribers</h3>
                            </div>
                            <div className="p-0">
                                {subscribers.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400 text-sm">
                                        No subscribers yet for this author profile.
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="border-b-slate-100">
                                                <TableHead>Email Address</TableHead>
                                                <TableHead className="text-right">Subscription Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subscribers.slice(0, 5).map((sub: any) => (
                                                <TableRow key={sub._id} className="border-b-slate-100 hover:bg-slate-50/50 transition-colors">
                                                    <TableCell className="font-medium">{sub.email}</TableCell>
                                                    <TableCell className="text-right text-slate-500 text-xs">
                                                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
