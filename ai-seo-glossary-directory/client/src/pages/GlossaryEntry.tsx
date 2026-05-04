import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { ChevronLeft, Share2, BookmarkPlus, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import glossaryData from "@/data/glossary.json";
import checklistsData from "@/data/checklists.json";
import enhancementsData from "@/data/enhancements.json";
import ChecklistSection from "@/components/ChecklistSection";
import ProductPipelineSection from "@/components/ProductPipelineSection";
import MarketingStrategySection from "@/components/MarketingStrategySection";
import MarketStrategySection from "@/components/MarketStrategySection";

/**
 * Design Philosophy: AI-First Authority
 * - Individual glossary entry page with comprehensive content
 * - E-E-A-T signals, schema markup, and AI optimization
 * - YouTube embeds, FAQs, related terms, and monetization
 */

export default function GlossaryEntry() {
  const { slug } = useParams<{ slug: string }>();
  
  const entry = useMemo(() => {
    return glossaryData.glossaryEntries.find(e => e.slug === slug);
  }, [slug]);

  const relatedEntries = useMemo(() => {
    if (!entry) return [];
    return glossaryData.glossaryEntries
      .filter(e => e.id !== entry.id && entry.relatedTerms.includes(e.term))
      .slice(0, 4);
  }, [entry]);

  if (!entry) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container py-4">
            <Link href="/" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
              ← Back to Home
            </Link>
          </div>
        </nav>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Term Not Found</h1>
          <p className="text-foreground/70 mb-8">The glossary entry you're looking for doesn't exist.</p>
          <Link href="/directory">
            <Button>Browse Directory</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/directory" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="category-badge">{entry.category}</span>
            <span className={`difficulty-badge difficulty-${entry.difficulty.toLowerCase()}`}>
              {entry.difficulty}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {entry.term}
          </h1>
          <p className="glossary-snapshot">
            {entry.snapshot}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          {/* Definition */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Definition</h2>
            <p className="glossary-definition">
              {entry.definition}
            </p>
          </div>

          {/* Key Characteristics */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Key Characteristics</h2>
            <ul className="space-y-3">
              {entry.characteristics.map((char, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <span className="text-foreground/80">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* YouTube Video */}
          {entry.youtubeVideoId && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Video Tutorial</h2>
              <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${entry.youtubeVideoId}`}
                  title={`${entry.term} Tutorial`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Getting Started Checklist */}
          {checklistsData.checklists[entry.id as keyof typeof checklistsData.checklists] && (
            <ChecklistSection
              title={checklistsData.checklists[entry.id as keyof typeof checklistsData.checklists].title}
              description={checklistsData.checklists[entry.id as keyof typeof checklistsData.checklists].description}
              items={checklistsData.checklists[entry.id as keyof typeof checklistsData.checklists].items}
              termSlug={entry.slug}
            />
          )}

          {/* FAQ Section */}
          {entry.faqItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Frequently Asked Questions</h2>
              <div className="space-y-4">
                {entry.faqItems.map((faq, idx) => (
                  <Card key={idx} className="p-6">
                    <h3 className="faq-question">{faq.question}</h3>
                    <p className="faq-answer">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Product Idea Pipeline */}
          {enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements]?.productIdeas && (
            <ProductPipelineSection
              products={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].productIdeas}
              termSlug={entry.slug}
            />
          )}

          {/* Marketing & Content Strategy */}
          {enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements]?.marketingStrategy && (
            <MarketingStrategySection
              hooks={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].marketingStrategy.hooks}
              headlines={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].marketingStrategy.headlines}
              titles={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].marketingStrategy.titles}
              contentIdeas={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].marketingStrategy.contentIdeas}
              socialPosts={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].marketingStrategy.socialPosts}
            />
          )}

          {/* Market Strategy & SEO */}
          {enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements]?.seoStrategy && (
            <MarketStrategySection
              monthlySearchVolume={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].seoStrategy.monthlySearchVolume}
              volumeRange={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].seoStrategy.volumeRange}
              difficulty={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].seoStrategy.difficulty as "Low" | "Medium" | "High"}
              relatedKeywords={enhancementsData.glossaryEnhancements[entry.id as keyof typeof enhancementsData.glossaryEnhancements].seoStrategy.relatedKeywords}
            />
          )}

          {/* Related Terms */}
          {entry.relatedTerms.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {entry.relatedTerms.map((term) => (
                  <span key={term} className="related-term-link">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Monetization Section */}
          <div className="monetization-section mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Monetization Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {entry.monetizationIdeas.affiliateProducts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Affiliate Products</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    {entry.monetizationIdeas.affiliateProducts.map((product, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <ExternalLink className="w-3 h-3" />
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {entry.monetizationIdeas.courseTopics.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Course Ideas</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    {entry.monetizationIdeas.courseTopics.map((course, idx) => (
                      <li key={idx}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
              {entry.monetizationIdeas.digitalDownloads.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Digital Downloads</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    {entry.monetizationIdeas.digitalDownloads.map((download, idx) => (
                      <li key={idx}>{download}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Entries */}
      {relatedEntries.length > 0 && (
        <section className="py-12 bg-card border-y border-border">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>Related Glossary Entries</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedEntries.map((relEntry) => (
                <Link key={relEntry.id} href={`/glossary/${relEntry.slug}`}>
                  <Card className="p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
                    <span className="category-badge">{relEntry.category}</span>
                    <h3 className="text-lg font-bold text-foreground mt-2 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {relEntry.term}
                    </h3>
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {relEntry.snapshot}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-background">
        <div className="container max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Explore More Terms</h2>
          <p className="text-foreground/70 mb-8">
            Discover hundreds of SEO and AI terms in our comprehensive directory.
          </p>
          <Link href="/directory">
            <Button size="lg">Browse Full Directory</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container text-center text-sm text-foreground/60">
          <p>&copy; 2026 AI & SEO Glossary Directory. Optimized for Google AI Overviews.</p>
        </div>
      </footer>
    </div>
  );
}
