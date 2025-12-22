import Link from "next/link";
import { NavbarAuth } from "@/components/navbar-auth";
import { isAdmin } from "@/lib/admin";
import { Zap } from "lucide-react";

import { auth } from "@clerk/nextjs/server";

export default async function Navbar() {
    const isUserAdmin = await isAdmin();
    const { userId } = await auth();

    return (
        <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">WARLOCK<span className="text-cyan-400">PUBLISHING</span></span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/products" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                            Marketplace
                        </Link>
                        <Link href="/blog" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                            Blog
                        </Link>
                        <Link href="/search" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                            Search
                        </Link>
                        {isUserAdmin && (
                            <>
                                <Link href="/admin" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                                    Admin
                                </Link>
                                <Link href="/admin/pen-names" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                                    Pen Names
                                </Link>
                                <Link href="/admin/blog" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                                    Admin Blog
                                </Link>
                            </>
                        )}
                        {userId && (
                            <Link href="/dashboard" className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <NavbarAuth />
                    </div>
                </div>
            </div>
        </nav>
    );
}
