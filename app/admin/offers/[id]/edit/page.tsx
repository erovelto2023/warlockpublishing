import SalesPageForm from '@/components/admin/SalesPageForm';
import { getSalesPageById } from '@/lib/actions/sales-page.actions';
import { isAdmin } from '@/lib/admin';
import { notFound, redirect } from 'next/navigation';

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) redirect('/');

    const { id } = await params;
    const page = await getSalesPageById(id);

    if (!page) notFound();

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Edit Offer: {page.title}</h1>
            <SalesPageForm initialData={page} />
        </div>
    );
}
