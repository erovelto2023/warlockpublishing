"use client";

import { usePathname } from "next/navigation";

interface LayoutShellProps {
    children: React.ReactNode;
    navbar: React.ReactNode;
    footer: React.ReactNode;
}

export function LayoutShell({ children, navbar, footer }: LayoutShellProps) {
    const pathname = usePathname();

    // Check if the current route is an Offer/Sales Page or a standalone custom page
    // These should not have the standard layout wrapper or navbar/footer
    // Added /p/ as a shortcut for "product with custom layout" if we ever decide to use it
    const isCustomPage = pathname?.startsWith("/offers/") || pathname?.includes("/standalone/");

    if (isCustomPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div id="site-navbar-wrapper">
                {navbar}
            </div>
            <main className="flex-1">{children}</main>
            <div id="site-footer-wrapper">
                {footer}
            </div>
        </div>
    );
}
