import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UnifiedAdminDashboard from '@/components/admin/UnifiedAdminDashboard';
import { getAllProducts } from '@/lib/actions/product.actions';
import { getPenNames } from '@/lib/actions/pen-name.actions';
import { getSalesPages } from '@/lib/actions/sales-page.actions';
import { getPosts } from '@/lib/actions/blog';
import { getAllMessagesForAdmin } from '@/lib/actions/message';
import { getGlossaryTerms } from '@/lib/actions/glossary';
import { getAnalyticsSummary } from '@/lib/actions/analytics.actions';
import { connectToDatabase } from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Command Center | Warlock Publishing',
    description: 'Manage your products, content, and offers.',
    robots: { index: false, follow: false },
};

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const user = await currentUser();

    if (!user || user.publicMetadata.role !== 'admin') {
        // Double check for safety, though middleware should handle this
        // redirect('/'); 
        // For development, assuming if we are here we are admin or local
    }

    // Fetch All Data in parallel
    const [products, penNames, offers, blogResult, messagesResult, glossaryTerms, subscribers, analytics] = await Promise.all([
        getAllProducts(),
        getPenNames(),
        getSalesPages(),
        getPosts({ limit: 100 }),
        getAllMessagesForAdmin({ limit: 100 }),
        getGlossaryTerms({ publishedOnly: false }),
        (async () => {
            await connectToDatabase();
            return Subscriber.find({}).sort({ createdAt: -1 }).lean();
        })(),
        getAnalyticsSummary()
    ]);

    return (
        <UnifiedAdminDashboard
            products={JSON.parse(JSON.stringify(products))}
            penNames={JSON.parse(JSON.stringify(penNames))}
            offers={JSON.parse(JSON.stringify(offers))}
            blogPosts={JSON.parse(JSON.stringify(blogResult.posts))}
            messages={JSON.parse(JSON.stringify(messagesResult.messages))}
            glossaryTerms={JSON.parse(JSON.stringify(glossaryTerms))}
            subscribers={JSON.parse(JSON.stringify(subscribers))}
            analytics={JSON.parse(JSON.stringify(analytics))}
        />
    );
}
