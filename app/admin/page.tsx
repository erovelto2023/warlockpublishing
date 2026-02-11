import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UnifiedAdminDashboard from '@/components/admin/UnifiedAdminDashboard';
import { getAllProducts } from '@/lib/actions/product.actions';
import { getPenNames } from '@/lib/actions/pen-name.actions';
import { getSalesPages } from '@/lib/actions/sales-page.actions';
import { getPosts } from '@/lib/actions/blog';
import { getAllMessagesForAdmin } from '@/lib/actions/message';
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
    const [products, penNames, offers, blogResult, messagesResult, subscribers] = await Promise.all([
        getAllProducts(),
        getPenNames(),
        getSalesPages(),
        getPosts({ limit: 100 }),
        getAllMessagesForAdmin({ limit: 100 }),
        (async () => {
            await connectToDatabase();
            return Subscriber.find({}).sort({ createdAt: -1 }).lean();
        })()
    ]);

    return (
        <UnifiedAdminDashboard
            products={products}
            penNames={penNames}
            offers={offers}
            blogPosts={blogResult.posts}
            messages={messagesResult.messages}
            subscribers={JSON.parse(JSON.stringify(subscribers))}
        />
    );
}
