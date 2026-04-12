import GlossaryEntryForm from '@/components/admin/GlossaryEntryForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New Glossary Entry | Warlock Admin',
};

export default function NewGlossaryPage() {
    return (
        <div className="bg-slate-200 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <GlossaryEntryForm />
            </div>
        </div>
    );
}
