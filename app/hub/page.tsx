import { getGlossaryTerms } from '@/lib/actions/glossary';
import Link from 'next/link';
import { isAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Affiliate Hub | Warlock Publishing',
  description: 'Explore our comprehensive guides and recommended products.',
};

export default async function HubPage() {
  const isUserAdmin = await isAdmin();
  const { terms } = await getGlossaryTerms({ limit: 200, sortBy: 'viewCount' });

  // Group terms by category if they have one
  const categorizedTerms = terms.reduce<Record<string, any[]>>((acc, term) => {
    const category = term.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(term);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto py-24 px-6 sm:px-12">
      <header className="mb-20 text-center relative">
        {isUserAdmin && (
          <div className="absolute top-0 right-0 flex gap-2">
             <Link href="/admin/glossary/new" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm uppercase tracking-wider">
               + Create Article
             </Link>
             <Link href="/admin" className="text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm uppercase tracking-wider">
               Admin Dash
             </Link>
          </div>
        )}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 pt-10">
          Publisher Resource Hub
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          Deep-dive guides, frameworks, and curated tools to elevate your publishing business.
        </p>
      </header>

      <div className="space-y-24">
        {Object.entries(categorizedTerms).map(([category, catTerms]) => (
          <section key={category}>
            <div className="flex items-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {category}
                </h2>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow ml-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catTerms.map((term: any) => (
                <Link 
                  key={term.slug} 
                  href={`/hub/${term.slug}`}
                  className="group flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {term.term}
                  </h3>
                  {term.snapshot && (
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-grow text-lg leading-relaxed">
                      {term.snapshot}
                    </p>
                  )}
                  <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 font-bold text-base uppercase tracking-wider">
                    Read Guide <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
