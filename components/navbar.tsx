import Link from "next/link";
import { NavbarAuth } from "@/components/navbar-auth";
import { isAdmin } from "@/lib/admin";
import { Zap, Menu } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default async function Navbar() {
    const isUserAdmin = await isAdmin();
    const { userId } = await auth();

    const navLinks = [
        { name: 'Ebooks', href: '/products' },
        { name: 'Marketplace', href: '/offers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Glossary', href: '/glossary' },
    ];

    return (
        <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-5 h-5 md:w-6 md:h-6 text-black" fill="currentColor" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-black text-lg md:text-xl tracking-tighter text-white leading-none uppercase italic">WARLOCK</span>
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-secondary mt-0.5">Publishing</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                className="text-slate-400 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest leading-none"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {isUserAdmin && (
                            <div className="flex items-center space-x-6 border-l border-white/10 pl-6 h-4">
                                <Link href="/admin" className="text-slate-500 hover:text-secondary transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                                    Admin
                                </Link>
                                <Link href="/admin/pen-names" className="text-slate-500 hover:text-secondary transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                                    Authors
                                </Link>
                            </div>
                        )}
                        {userId && (
                            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all text-[11px] font-black uppercase tracking-widest">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="hidden sm:block text-slate-100">
                            <NavbarAuth />
                        </div>

                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="p-2 text-slate-300 hover:text-white transition-colors" aria-label="Open Menu">
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="bg-background border-white/5 pt-12">
                                    <SheetTitle className="sr-only">Menu</SheetTitle>
                                    <div className="flex flex-col space-y-8 mt-4">
                                        {navLinks.map((link) => (
                                            <Link 
                                                key={link.href}
                                                href={link.href} 
                                                className="text-2xl font-serif italic font-black text-white hover:text-secondary transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                        {isUserAdmin && (
                                            <>
                                                <div className="h-px bg-white/10" />
                                                <Link href="/admin" className="text-xl font-black uppercase tracking-widest text-slate-200 hover:text-secondary">Admin</Link>
                                                <Link href="/admin/pen-names" className="text-xl font-black uppercase tracking-widest text-slate-200 hover:text-secondary">Authors</Link>
                                            </>
                                        )}
                                        <div className="pt-8">
                                            <NavbarAuth />
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
