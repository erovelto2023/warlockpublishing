import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import glossaryData from "@/data/glossary.json";

/**
 * Design Philosophy: AI-First Authority
 * - Comprehensive directory with filtering and search
 * - Organized by category and difficulty level
 * - E-E-A-T signals throughout
 */

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    glossaryData.glossaryEntries.forEach(entry => {
      cats.add(entry.category);
    });
    return Array.from(cats).sort();
  }, []);

  const filteredEntries = useMemo(() => {
    return glossaryData.glossaryEntries.filter(entry => {
      const matchesSearch = !searchQuery || 
        entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || entry.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || entry.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4">
          <Link href="/" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Complete Glossary Directory</h1>
          <p className="text-lg text-foreground/70">
            {filteredEntries.length} of {glossaryData.glossaryEntries.length} terms
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
        <div className="container">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search terms, definitions..."
                className="pl-12 py-6 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <label className="text-sm font-semibold text-foreground mb-2 block">Category</label>
                <select
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex-1">
                <label className="text-sm font-semibold text-foreground mb-2 block">Difficulty</label>
                <select
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  value={selectedDifficulty || ""}
                  onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedDifficulty || searchQuery) && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                      setSelectedDifficulty(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-background">
        <div className="container">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/70 mb-4">No terms found matching your filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setSelectedDifficulty(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredEntries.map((entry) => (
                <Link key={entry.id} href={`/glossary/${entry.slug}`}>
                  <Card className="p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="category-badge">{entry.category}</span>
                          <span className={`difficulty-badge difficulty-${entry.difficulty.toLowerCase()}`}>
                            {entry.difficulty}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{entry.term}</h3>
                        <p className="text-foreground/70 line-clamp-2">{entry.snapshot}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
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
