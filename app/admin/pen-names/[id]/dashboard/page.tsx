import {
    DollarSign,
    Book,
    Users,
    Star,
    ArrowUpRight,
    Search,
    Bell,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const MOCK_STATS = [
    { label: "Total Revenue", value: "$0.00", change: "+0%", icon: DollarSign, color: "text-emerald-600" },
    { label: "Books Sold", value: "0", change: "+0%", icon: Book, color: "text-blue-600" },
    { label: "Active Readers", value: "0", change: "+0%", icon: Users, color: "text-purple-600" },
    { label: "Avg. Rating", value: "0.0", change: "+0.0", icon: Star, color: "text-amber-500" },
];

const StatCard = ({ stat }: { stat: any }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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

import { getSubscribers } from "@/lib/actions/subscriber.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// ... (existing imports)

interface DashboardPageProps {
    params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const { id } = await params;
    const subscribers = await getSubscribers(id);

    // Update MOCK_STATS with real subscriber count
    const stats = [
        ...MOCK_STATS.slice(0, 2),
        { label: "Active Readers", value: subscribers.length.toString(), change: "+0%", icon: Users, color: "text-purple-600" },
        ...MOCK_STATS.slice(3)
    ];

    return (
        <>
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                    <Link href="/admin/products/new">
                        <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-indigo-100">
                            <Plus size={16} />
                            <span>Add Product</span>
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                        <p className="text-slate-500">Here's what's happening today.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <StatCard key={idx} stat={stat} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity Mockup */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Sales</h3>
                            <div className="space-y-4">
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    No recent sales to display.
                                </div>
                            </div>
                        </div>

                        {/* Subscribers List */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Mailing List Subscribers</h3>
                            <div className="space-y-4">
                                {subscribers.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-sm">
                                        No subscribers yet.
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Email</TableHead>
                                                <TableHead className="text-right">Joined</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subscribers.map((sub: any) => (
                                                <TableRow key={sub._id}>
                                                    <TableCell>{sub.email}</TableCell>
                                                    <TableCell className="text-right">
                                                        {new Date(sub.createdAt).toLocaleDateString()}
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
        </>
    );
}
