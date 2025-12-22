import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Book,
    TrendingUp,
    Settings,
    ShoppingCart,
    Users,
    Globe,
    ChevronLeft
} from "lucide-react";
import { getPenNameById } from "@/lib/actions/pen-name.actions";
import { isAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface DashboardLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function PenNameDashboardLayout({
    children,
    params,
}: DashboardLayoutProps) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const { id } = await params;
    const penName = await getPenNameById(id);

    if (!penName) {
        notFound();
    }

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview", href: `/admin/pen-names/${id}/dashboard` },
        { icon: Book, label: "My Library", href: `/admin/pen-names/${id}/products` },
        { icon: TrendingUp, label: "Analytics", href: "#" },
        { icon: ShoppingCart, label: "Orders", href: "#" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/admin/pen-names" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 mb-4 transition-colors">
                        <ChevronLeft size={12} /> Back to All Pen Names
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-indigo-600 flex items-center justify-center text-white font-serif font-bold text-xl shrink-0">
                            {penName.avatarUrl ? (
                                <img src={penName.avatarUrl} alt={penName.name} className="w-full h-full object-cover" />
                            ) : (
                                penName.name.charAt(0)
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="font-bold text-slate-900 leading-tight truncate">{penName.name}</h1>
                            <span className="text-xs text-slate-500">Author Dashboard</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3">
                    <div className="mb-8">
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</p>
                        {sidebarItems.map((item) => (
                            <Link key={item.label} href={item.href}>
                                <Button variant="ghost" className="w-full justify-start gap-3 mb-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                    <item.icon size={20} />
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    <div>
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Settings</p>
                        <Link href={`/admin/pen-names/${id}/subscribers`}>
                            <Button variant="ghost" className="w-full justify-start gap-3 mb-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                <Users size={20} />
                                Subscribers
                            </Button>
                        </Link>
                        <Link href={`/admin/pen-names/${id}/edit`}>
                            <Button variant="ghost" className="w-full justify-start gap-3 mb-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                <Settings size={20} />
                                Configuration
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-8 px-3">
                        <Link href={`/author/${penName.slug || id}`} target="_blank">
                            <button
                                className="w-full flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200"
                            >
                                <Globe size={18} />
                                <span>View Live Site</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
                {children}
            </div>
        </div>
    );
}
