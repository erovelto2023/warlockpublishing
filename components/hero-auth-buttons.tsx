"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn, LayoutDashboard } from "lucide-react";

export function HeroAuthButtons() {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="relative w-full sm:w-auto px-10 py-5 bg-primary text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                        <LogIn size={18} strokeWidth={3} /> Get Started
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <Link href="/dashboard" className="relative w-full sm:w-auto px-10 py-5 bg-primary text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                    <LayoutDashboard size={18} strokeWidth={3} /> Access Studio
                </Link>
            </SignedIn>
        </div>
    );
}

