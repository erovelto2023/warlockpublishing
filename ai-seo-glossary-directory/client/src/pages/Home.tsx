import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search, BookOpen, Zap, TrendingUp, Video, Share2, Award } from "lucide-react";
import { useState, useMemo } from "react";
import glossaryData from "@/data/glossary.json";

/**
 * Design Philosophy: AI-First Authority
 * - Premium deep blue and teal palette for trust and innovation
 * - Poppins display font for modern, tech-forward positioning
 * - Comprehensive glossary structure optimized for Google AI Overviews
 * - E-E-A-T signals throughout (expertise, authority, trustworthiness)
 */

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = useMemo(() => {
    const cats = new Map<string, number>();
    glossaryData.glossaryEntries.forEach(entry => {
      cats.set(entry.category, (cats.get(entry.category) || 0) + 1);
    });
    return Array.from(cats.entries());
  }, []);

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return glossaryData.glossaryEntries.slice(0, 6);
    return glossaryData.glossaryEntries.filter(entry =>
      entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>SEO & AI Glossary</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <Link href="#categories" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="#featured" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Featured
            </Link>
            <Link href="#about" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              The Ultimate AI & SEO Glossary
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Comprehensive definitions of 300+ AI and SEO terms optimized for Google AI Overviews. Master the vocabulary of modern search, content strategy, and generative AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Directory
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search glossary terms..."
                className="pl-12 py-6 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {glossaryData.glossaryEntries.length} terms available • Updated for 2026
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-background">
        <div className="container">
          <h3 className="text-2xl font-bold mb-12 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Why This Glossary?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>AI-Optimized</h4>
              <p className="text-foreground/70">
                Structured for Google AI Overviews with E-E-A-T signals and citation-ready definitions.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Video className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Multimedia Rich</h4>
              <p className="text-foreground/70">
                YouTube videos, social content templates, and visual guides for each term.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Monetization Ready</h4>
              <p className="text-foreground/70">
                Affiliate products, course ideas, and digital download opportunities included.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-card border-b border-border">
        <div className="container">
          <h3 className="text-2xl font-bold mb-12" style={{ fontFamily: 'Poppins, sans-serif' }}>Browse by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(([category, count]) => (
              <Link key={category} href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card className="p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
                <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{category}</h4>
                  <p className="text-sm text-muted-foreground">{count} terms</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Terms */}
      <section id="featured" className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Featured Terms</h3>
            <Link href="/directory">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <Link key={entry.id} href={`/glossary/${entry.slug}`}>
                <Card className="p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className="category-badge">{entry.category}</span>
                      <h4 className="text-lg font-bold text-foreground mt-2 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{entry.term}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-4 flex-1">
                    {entry.snapshot}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className={`difficulty-badge difficulty-${entry.difficulty.toLowerCase()}`}>
                      {entry.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">→</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content Structure Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <h3 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>What's in Each Entry?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>Comprehensive Definitions</h4>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">1-sentence snapshot for AI citation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">Full definition with context and nuance</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">Key characteristics and features</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">Origins and evolution of the term</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>Multimedia & Resources</h4>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">YouTube video embeds and tutorials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">FAQ accordion with 10+ questions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">Related terms and internal links</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground/80">Monetization ideas and resources</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social & Monetization */}
      <section className="py-16 bg-background">
        <div className="container">
          <h3 className="text-2xl font-bold mb-12" style={{ fontFamily: 'Poppins, sans-serif' }}>Built for Growth</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border">
              <Share2 className="w-8 h-8 text-secondary mb-4" />
              <h4 className="font-bold text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Social Content Strategy</h4>
              <p className="text-foreground/70 mb-4">
                Each term includes content hooks, headlines, and templates for Twitter, LinkedIn, TikTok, and YouTube Shorts.
              </p>
              <ul className="text-sm text-foreground/60 space-y-2">
                <li>✓ 5 content hooks per term</li>
                <li>✓ Platform-specific strategies</li>
                <li>✓ Engagement optimization tips</li>
              </ul>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border">
              <Award className="w-8 h-8 text-accent mb-4" />
              <h4 className="font-bold text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Monetization Opportunities</h4>
              <p className="text-foreground/70 mb-4">
                Affiliate products, course ideas, digital downloads, and ad revenue strategies for each glossary entry.
              </p>
              <ul className="text-sm text-foreground/60 space-y-2">
                <li>✓ Affiliate product recommendations</li>
                <li>✓ Course topic ideas</li>
                <li>✓ Digital download templates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to Master SEO & AI?</h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Start exploring our comprehensive glossary and unlock the vocabulary of modern search and artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/directory">
              <Button size="lg" variant="secondary">
                Explore Full Directory
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Subscribe for Updates
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Categories</h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="/category/ai-generative-search" className="hover:text-primary">AI & Generative Search</Link></li>
                <li><Link href="/category/seo-basics" className="hover:text-primary">SEO Basics</Link></li>
                <li><Link href="/category/technical-seo" className="hover:text-primary">Technical SEO</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Resources</h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="#" className="hover:text-primary">Full Directory</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Tools</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Company</h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Connect</h5>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="#" className="hover:text-primary">Twitter</Link></li>
                <li><Link href="#" className="hover:text-primary">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-primary">YouTube</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2026 AI & SEO Glossary Directory. Optimized for Google AI Overviews.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
