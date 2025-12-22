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
        return <div className="min-h-[40px] min-w-[40px]" />;
    }

    return (
        <div className="min-h-[40px] min-w-[40px] flex items-center justify-end">
            <SignedOut>
                <SignInButton mode="modal">
                    <Button variant="ghost">Sign In</Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>
    );
}
