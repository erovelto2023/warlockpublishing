import { getGlossaryTermById } from '@/lib/actions/glossary';
import GlossaryEntryForm from '@/components/admin/GlossaryEntryForm';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Edit Glossary Entry | Warlock Admin',
};

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditGlossaryPage({ params }: EditPageProps) {
    const { id } = await params;
    const term = await getGlossaryTermById(id);

    if (!term) {
        notFound();
    }

    return (
        <div className="bg-slate-200 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <GlossaryEntryForm term={term} />
            </div>
        </div>
    );
}
