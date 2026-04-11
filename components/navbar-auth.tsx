"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

export function NavbarAuth() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-10 w-24" />;
    }

    return (
        <div className="flex items-center justify-end">
            <SignedOut>
                <SignInButton mode="modal">
                    <Button variant="ghost" className="text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "w-9 h-9 border border-white/10 rounded-xl"
                        }
                    }}
                />
            </SignedIn>
        </div>
    );
}

