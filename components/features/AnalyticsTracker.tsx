"use client";

import { useEffect } from 'react';
import { trackSalesPageVisit, trackSalesPageBuyClick } from '@/lib/actions/sales-page.actions';

interface AnalyticsTrackerProps {
    slug: string;
    version: 'A' | 'B' | null;
}

export default function AnalyticsTracker({ slug, version }: AnalyticsTrackerProps) {
    useEffect(() => {
        // Track the visit on mount
        trackSalesPageVisit(slug, version);

        // Track clicks on elements containing the BUY_URL variable replacement
        // We look for elements that have an href matching the buyUrl or class names we can target
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link) {
                // If it's a buy button (usually contains {{BUY_URL}} which becomes the link)
                // We'll check if the link looks like a checkout link or has a certain data attribute
                // For now, let's track ANY link click on the page as a potential conversion if it's external
                const href = link.getAttribute('href');
                if (href && (href.includes('groove') || href.includes('sell') || href.includes('checkout'))) {
                    trackSalesPageBuyClick(slug, version);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [slug, version]);

    return null; // Invisible component
}
