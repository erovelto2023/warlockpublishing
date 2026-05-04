import { getGlossaryTerms } from "@/lib/actions/glossary";
import GlossaryDirectoryClient from "@/components/glossary/GlossaryDirectoryClient";

export const dynamic = 'force-dynamic';

export default async function GlossaryDirectoryPage() {
    const { terms } = await getGlossaryTerms({ limit: 1000 }); // Fetch all for easy client-side filtering

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-serif italic">
                        Complete Glossary Directory
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                        Browse our comprehensive collection of AI and SEO terms. Use the filters below to find exactly what you're looking for.
                    </p>
                </header>

                <GlossaryDirectoryClient initialTerms={terms} />
            </div>
        </div>
    );
}
