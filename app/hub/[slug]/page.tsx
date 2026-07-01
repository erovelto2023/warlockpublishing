import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { isAdmin } from '@/lib/admin';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);
  if (!term) return {};

  return {
    title: term.seoMeta?.title || `${term.term} | Publisher Resource Hub`,
    description: term.seoMeta?.description || term.snapshot || term.definition?.substring(0, 160),
  };
}

export default async function HubArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);
  const isUserAdmin = await isAdmin();

  if (!term) {
    notFound();
  }

  // Generate FAQ Schema (JSON-LD)
  const faqs = term.seoSchema?.faq || term.faqItems || [];
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-12">
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        <article className="mx-auto">
          
          {/* Hub Navigation / Breadcrumbs */}
          <div className="flex justify-between items-center mb-12">
            <nav className="text-sm text-slate-500 flex items-center space-x-2 font-semibold tracking-wide uppercase">
              <Link href="/hub" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Resource Hub</Link> 
              <span className="text-slate-300 dark:text-slate-700">/</span>
              {term.category && (
                <>
                  <span className="text-slate-400 dark:text-slate-500">{term.category}</span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                </>
              )}
              <span className="text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">{term.term}</span>
            </nav>
            {isUserAdmin && (
              <Link href={`/admin/glossary/${term._id}/edit`} className="text-xs font-bold bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider flex items-center gap-1 shadow-sm">
                Edit Article
              </Link>
            )}
          </div>

          {/* Hero Section */}
          <header className="mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
              {term.term}
            </h1>
            {term.pageHeader?.hook && (
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 leading-tight">
                {term.pageHeader.hook}
              </p>
            )}
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light border-l-4 border-blue-500 pl-6">
              {term.pageHeader?.expertIntro || term.snapshot || "The complete guide and resources."}
            </p>
          </header>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-16"></div>

          {/* Core Value / Definition */}
          <section className="mb-16 prose prose-lg md:prose-xl prose-slate dark:prose-invert max-w-none prose-h2:text-3xl prose-h2:font-bold prose-h2:text-slate-900 dark:prose-h2:text-white prose-h3:text-2xl prose-h3:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
            {!term.pageBody?.htmlContent && <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">The Core Concept</h2>}
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
              {term.pageBody?.htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: term.pageBody.htmlContent }} />
              ) : term.articleContent ? (
                  <div dangerouslySetInnerHTML={{ __html: term.articleContent }} />
              ) : (
                  <p>{term.definition}</p>
              )}
            </div>
          </section>

          {/* Affiliate Callout (The Solution) */}
          {(term.conversionElement?.productName || (term.monetizationIdeas?.affiliateProducts && term.monetizationIdeas.affiliateProducts.length > 0)) && (
            <div className="my-20 relative isolate overflow-hidden bg-slate-900 dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-grow text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                    <span className="bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full border border-blue-500/30">
                      Expert Recommendation
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Accelerate with {term.conversionElement?.productName || term.monetizationIdeas?.affiliateProducts?.[0]}
                  </h3>
                  <p className="text-lg text-slate-300 mb-8 max-w-xl">
                    To fully leverage the concepts of {term.term.toLowerCase()}, we recommend using our top-rated solution for maximum profitability and efficiency.
                  </p>
                  <a 
                    href={term.conversionElement?.targetUrl || "#"} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 text-white font-bold text-lg px-10 py-5 rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] transform hover:-translate-y-1"
                  >
                    {term.conversionElement?.ctaText || "Get Started Now"}
                    <span className="ml-3 font-normal text-2xl leading-none">→</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Masterclass / Deep Dive */}
          {term.masterclass?.masterclassDesc && (
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 flex items-center text-slate-900 dark:text-white">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-xl mr-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
                The Masterclass
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-10">
                {term.masterclass.masterclassDesc}
              </p>
              
              {term.masterclass.profitBeats && term.masterclass.profitBeats.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Profitability Beats</h3>
                  <ul className="space-y-8">
                      {term.masterclass.profitBeats.map((beat: any, i: number) => (
                        <li key={i} className="flex flex-col sm:flex-row sm:items-start gap-6 group">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-sm font-bold py-2 px-4 rounded-xl shrink-0 border border-slate-200 dark:border-slate-700 group-hover:border-purple-500/50 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {beat.timing}
                            </span>
                            <div>
                              <strong className="block text-xl text-slate-900 dark:text-white mb-2">{beat.title}</strong>
                              <span className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{beat.description}</span>
                            </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <section className="mb-16">
              <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-16"></div>
              <h2 className="text-3xl font-bold mb-10 text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">{faq.question}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </article>
      </div>
    </div>
  );
}
