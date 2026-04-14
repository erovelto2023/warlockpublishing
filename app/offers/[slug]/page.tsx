import { getSalesPageBySlug } from '@/lib/actions/sales-page.actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CodeInjector from '@/components/features/CodeInjector';
import AnalyticsTracker from '@/components/features/AnalyticsTracker';
import { SMART_VARIABLES } from '@/lib/constants/smartVariables';
import { cookies } from 'next/headers';

import { constructMetadata } from '@/lib/seo';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page: any = await getSalesPageBySlug(slug);

    if (!page) return constructMetadata({ title: 'Not Found', description: 'Offer not found.' });

    return constructMetadata({
        title: page.title,
        description: page.description || `Special offer from Warlock Publishing: ${page.title}`,
        image: page.ogImage || page.marketplaceImage,
        type: 'website',
        keywords: page.keywords,
        url: `https://warlockpublishing.com/offers/${slug}`
    });
}

export default async function SalesPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { preview } = await searchParams;
    const page = await getSalesPageBySlug(slug);

    if (!page || (!page.isPublished && !preview)) {
        notFound();
    }

    // A/B Testing Logic
    let activeVersion: 'A' | 'B' | null = null;
    let finalBodyCode = page.bodyCode;

    if (preview === 'A' || preview === 'B') {
        activeVersion = preview;
        finalBodyCode = preview === 'B' ? (page.bodyCodeB || page.bodyCode) : page.bodyCode;
    } else if (page.abEnabled && page.bodyCodeB) {
        const cookieStore = await cookies();
        const cookieName = `ab_test_${page._id}`;
        const existingVersion = cookieStore.get(cookieName)?.value;

        if (existingVersion === 'A' || existingVersion === 'B') {
            activeVersion = existingVersion as 'A' | 'B';
        } else {
            // Assign new version
            activeVersion = Math.random() > 0.5 ? 'A' : 'B';
        }

        if (activeVersion === 'B') {
            finalBodyCode = page.bodyCodeB;
        }
    }

    // Variable Replacement Logic
    const replaceVariables = (content: string) => {
        if (!content) return '';

        let processed = content;

        // 1. Expand Smart Variables (Pre-styled blocks)
        Object.entries(SMART_VARIABLES).forEach(([key, value]) => {
            processed = processed.split(key).join(value);
        });

        // 2. Inject Dynamic Data
        return processed
            .split('{{BUY_URL}}').join(page.buyUrl || '#')
            .split('{{PRICE}}').join(page.price?.toString() || '')
            .split('{{TITLE}}').join(page.title || '');
    };

    const headerHtml = replaceVariables(page.headerCode);
    const bodyHtml = replaceVariables(finalBodyCode);
    const footerHtml = replaceVariables(page.footerCode);

    return (
        <div className="min-h-screen bg-white">
            {/* Analytics Tracking Component */}
            <AnalyticsTracker slug={slug} version={activeVersion} />

            {/* Header Code Injection */}
            {headerHtml && (
                <CodeInjector html={headerHtml} />
            )}

            {/* Main Content */}
            <div className="sales-page-container">
                <CodeInjector html={bodyHtml} />
            </div>

            {/* Footer Code Injection */}
            {footerHtml && (
                <CodeInjector html={footerHtml} />
            )}

            {/* Sticky Buy Button Overlay */}
            {page.price && page.buyUrl && (
                <div className="fixed bottom-8 right-8 z-50 animate-bounce">
                    <a
                        href={page.buyUrl}
                        className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-green-200 flex items-center gap-2 transition-all active:scale-95"
                    >
                        Buy Now for ${page.price}
                    </a>
                </div>
            )}
        </div>
    );
}
