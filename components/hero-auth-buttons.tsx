"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn, LayoutDashboard } from "lucide-react";

export function HeroAuthButtons() {
    return (
        <>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2">
                        <LogIn size={20} /> Login / Sign Up
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2">
                    <LayoutDashboard size={20} /> Go to Dashboard
                </Link>
            </SignedIn>
        </>
    );
}
