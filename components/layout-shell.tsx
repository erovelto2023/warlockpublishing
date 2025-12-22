"use client";

import { usePathname } from "next/navigation";

interface LayoutShellProps {
    children: React.ReactNode;
    navbar: React.ReactNode;
    footer: React.ReactNode;
}

export function LayoutShell({ children, navbar, footer }: LayoutShellProps) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <div className="flex min-h-screen flex-col">
            {navbar}
            <main className="flex-1">{children}</main>
            {footer}
        </div>
    );
}
