import SalesPageForm from '@/components/admin/SalesPageForm';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';

export default async function NewOfferPage() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) redirect('/');

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Create New Offer</h1>
            <SalesPageForm />
        </div>
    );
}
