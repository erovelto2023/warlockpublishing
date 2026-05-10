import { getGlossaryTerms } from "@/lib/actions/glossary";
import GlossaryDirectoryClient from "@/components/glossary/GlossaryDirectoryClient";

export const dynamic = 'force-dynamic';

export default async function GlossaryDirectoryPage() {
    const { terms, total } = await getGlossaryTerms({ limit: 10000 }); // Fetch all for easy client-side filtering

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-serif italic">
                            Complete Glossary Directory
                        </h1>
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg shadow-indigo-600/20">
                            {total} ENTRIES
                        </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                        Browse our comprehensive collection of {total} AI and SEO terms. Use the filters below to find exactly what you're looking for.
                    </p>
                </header>

                <GlossaryDirectoryClient initialTerms={terms} />
            </div>
        </div>
    );
}
