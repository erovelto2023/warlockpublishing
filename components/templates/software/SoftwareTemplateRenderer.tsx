import React from 'react';
import {
    SoftwareNavbar,
    SoftwareHero,
    SoftwareFeatures,
    SoftwarePricing,
    SoftwareTestimonials,
    SoftwareCTA,
    SoftwareFooter
} from './index';

interface SoftwareTemplateRendererProps {
    contentData: any;
}

export function SoftwareTemplateRenderer({ contentData }: SoftwareTemplateRendererProps) {
    const blocks = contentData?.blocks || [];

    // Helper to get block data
    const getBlockData = (id: string) => {
        if (!Array.isArray(blocks)) return null;
        const block = blocks.find((b: any) => b.id === id);
        return block?.enabled ? (block.data || {}) : null;
    };

    // Helper to check if block is enabled
    const isEnabled = (id: string) => {
        const block = blocks.find((b: any) => b.id === id);
        return block?.enabled;
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-600 antialiased selection:bg-blue-100 selection:text-blue-700">
            {isEnabled('navbar') && <SoftwareNavbar />}

            {isEnabled('hero') && (
                <SoftwareHero {...getBlockData('hero')} />
            )}

            {isEnabled('features') && <SoftwareFeatures />}

            {isEnabled('pricing') && <SoftwarePricing />}

            {isEnabled('testimonials') && <SoftwareTestimonials />}

            {isEnabled('cta') && <SoftwareCTA />}

            {isEnabled('footer') && <SoftwareFooter />}
        </div>
    );
}
