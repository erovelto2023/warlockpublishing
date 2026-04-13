import Link from "next/link";
import { NavbarAuth } from "@/components/navbar-auth";
import { isAdmin } from "@/lib/admin";
import { Zap } from "lucide-react";

import { auth } from "@clerk/nextjs/server";

export default async function Navbar() {
    const isUserAdmin = await isAdmin();
    const { userId } = await auth();

    return (
        <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-white" fill="currentColor" />
                            <div className="absolute inset-0 rounded-xl bg-indigo-400/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-tighter text-slate-900 leading-none">WARLOCK</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-0.5">Publishing</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-10">
                        <Link href="/products" className="text-slate-600 hover:text-primary transition-all text-sm font-semibold tracking-wide uppercase">
                            Marketplace
                        </Link>
                        <Link href="/offers" className="text-slate-600 hover:text-primary transition-all text-sm font-semibold tracking-wide uppercase">
                            The Emporium
                        </Link>
                        <Link href="/blog" className="text-slate-600 hover:text-primary transition-all text-sm font-semibold tracking-wide uppercase">
                            Blog
                        </Link>
                        <Link href="/glossary" className="text-slate-600 hover:text-primary transition-all text-sm font-semibold tracking-wide uppercase">
                            Glossary
                        </Link>
                        {isUserAdmin && (
                            <div className="flex items-center space-x-6 border-l border-slate-200 pl-6">
                                <Link href="/admin" className="text-slate-500 hover:text-primary transition-all text-xs font-bold uppercase tracking-widest">
                                    Admin
                                </Link>
                                <Link href="/admin/pen-names" className="text-slate-500 hover:text-primary transition-all text-xs font-bold uppercase tracking-widest">
                                    Authors
                                </Link>
                            </div>
                        )}
                        {userId && (
                            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all text-sm font-bold">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-6">
                        <NavbarAuth />
                    </div>
                </div>
            </div>
        </nav>
    );
}
