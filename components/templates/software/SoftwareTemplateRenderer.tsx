import React from 'react';
import { 
    SoftwareHero, 
    SoftwareFeatures, 
    SoftwarePricing, 
    SoftwareFAQ, 
    SoftwareFooter,
    SoftwareNavbar,
    SoftwareCTA
} from './index';

interface SoftwareTemplateRendererProps {
    contentData: any;
}

export function SoftwareTemplateRenderer({ contentData }: SoftwareTemplateRendererProps) {
    // Helper to get block data safely with guaranteed defaults
    const getBlockData = (id: string) => {
        try {
            if (!contentData || !Array.isArray(contentData.blocks)) return {};
            const block = contentData.blocks.find((b: any) => b.id === id);
            return block?.enabled ? (block.data || {}) : {};
        } catch (err) {
            console.error(`[SoftwareTemplateRenderer] Error getting block ${id}:`, err);
            return {};
        }
    };

    // Helper to check if block is enabled
    const isEnabled = (id: string) => {
        if (!contentData || !Array.isArray(contentData.blocks)) return false;
        const block = contentData.blocks.find((b: any) => b.id === id);
        return Boolean(block?.enabled);
    };

    const heroData = getBlockData('hero');
    // Features, Pricing etc usually pull from contentData or have their own internal fallback
    // But to keep it simple and consistent with the others:
    
    return (
        <div className="min-h-screen bg-white">
            {isEnabled('navbar') && <SoftwareNavbar />}
            <SoftwareHero {...heroData} />
            <SoftwareFeatures />
            <SoftwarePricing />
            {isEnabled('faq') && <SoftwareFAQ />}
            {isEnabled('cta') && <SoftwareCTA />}
            <SoftwareFooter />
        </div>
    );
}
