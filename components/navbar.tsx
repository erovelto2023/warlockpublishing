import Link from "next/link";
import { NavbarAuth } from "@/components/navbar-auth";
import { isAdmin } from "@/lib/admin";
import { Zap } from "lucide-react";

import { auth } from "@clerk/nextjs/server";

export default async function Navbar() {
    const isUserAdmin = await isAdmin();
    const { userId } = await auth();

    return (
        <nav className="fixed w-full top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-black" fill="currentColor" />
                            <div className="absolute inset-0 rounded-xl bg-secondary/40 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-black text-xl tracking-tighter text-white leading-none uppercase italic italic">WARLOCK</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mt-0.5">Publishing</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-10">
                        <Link href="/products" className="text-neutral-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest leading-none">
                            Marketplace
                        </Link>
                        <Link href="/offers" className="text-neutral-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest leading-none">
                            The Emporium
                        </Link>
                        <Link href="/blog" className="text-neutral-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest leading-none">
                            Blog
                        </Link>
                        <Link href="/glossary" className="text-neutral-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest leading-none">
                            Glossary
                        </Link>
                        {isUserAdmin && (
                            <div className="flex items-center space-x-6 border-l border-white/10 pl-6 h-4">
                                <Link href="/admin" className="text-neutral-500 hover:text-secondary transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                                    Admin
                                </Link>
                                <Link href="/admin/pen-names" className="text-neutral-500 hover:text-secondary transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                                    Authors
                                </Link>
                            </div>
                        )}
                        {userId && (
                            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all text-xs font-black uppercase tracking-widest">
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
