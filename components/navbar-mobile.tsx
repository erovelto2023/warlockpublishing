"use client";

import { Menu } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { NavbarAuth } from "@/components/navbar-auth";
import { useState, useEffect } from "react";

interface NavbarMobileProps {
    navLinks: { name: string; href: string }[];
    isUserAdmin: boolean;
}

export function NavbarMobile({ navLinks, isUserAdmin }: NavbarMobileProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <button className="p-2 text-slate-300 opacity-50">
                <Menu className="w-6 h-6" />
            </button>
        );
    }

    return (
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
    );
}
