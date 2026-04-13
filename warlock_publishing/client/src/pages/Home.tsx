import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, BookOpen, Users, Lightbulb, Zap, Crown } from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Sophisticated Literary Aesthetic
 * - Deep indigo (#2D1B4E) and warm gold (#D4AF37) create luxury and creativity
 * - Playfair Display for headlines conveys elegance and authority
 * - Asymmetric layouts with generous whitespace for premium feel
 * - Mystical hero background with subtle animations
 */

export default function Home() {
  const [email, setEmail] = useState("");

  const warlockValues = [
    {
      letter: "W",
      title: "Worldbuilders",
      description: "Comprehensive tools for crafting immersive worlds, from geography to culture to magic systems.",
      icon: <Sparkles className="w-8 h-8" />,
    },
    {
      letter: "A",
      title: "Authors",
      description: "Resources for every stage of your writing journey—from outlining to publishing.",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      letter: "R",
      title: "Readers",
      description: "Guides to deepen your engagement with stories and build your reading community.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      letter: "L",
      title: "Learning",
      description: "Educational content and masterclasses from industry experts and bestselling authors.",
      icon: <Lightbulb className="w-8 h-8" />,
    },
    {
      letter: "O",
      title: "Originality",
      description: "Unique, carefully curated products that stand out from generic templates.",
      icon: <Crown className="w-8 h-8" />,
    },
    {
      letter: "C",
      title: "Creativity",
      description: "Inspiring frameworks and templates designed to unlock your creative potential.",
      icon: <Zap className="w-8 h-8" />,
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      title: "Complete Worldbuilding Toolkit",
      description: "500+ pages of templates, guides, and worksheets for building fantasy worlds.",
      price: "$47",
      category: "Worldbuilding",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472594019/RP6PxBmonJrBv7bTkqqjid/warlock_product_showcase-Ta9rFaYq6DqXpSM8SxYdxS.webp",
    },
    {
      id: 2,
      title: "Character Development Masterclass",
      description: "Deep-dive guide to creating compelling, multi-dimensional characters.",
      price: "$37",
      category: "Writing",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472594019/RP6PxBmonJrBv7bTkqqjid/warlock_product_showcase-Ta9rFaYq6DqXpSM8SxYdxS.webp",
    },
    {
      id: 3,
      title: "Plot Structure & Story Arc Guide",
      description: "Master the craft of storytelling with proven narrative frameworks.",
      price: "$29",
      category: "Writing",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472594019/RP6PxBmonJrBv7bTkqqjid/warlock_product_showcase-Ta9rFaYq6DqXpSM8SxYdxS.webp",
    },
    {
      id: 4,
      title: "Self-Publishing Success Bundle",
      description: "Complete roadmap from manuscript to published book with marketing strategies.",
      price: "$59",
      category: "Publishing",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472594019/RP6PxBmonJrBv7bTkqqjid/warlock_product_showcase-Ta9rFaYq6DqXpSM8SxYdxS.webp",
    },
    {
      id: 5,
      title: "Fantasy Magic System Designer",
      description: "Interactive tool for creating unique, consistent magic systems.",
      price: "$39",
      category: "Worldbuilding",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472594019/RP6PxBmonJrBv7bTkqqjid/warlock_product_showcase-Ta9rFaYq6DqXpSM8SxYdxS.webp",
    },
    {
      id: 6,
      title: "Reader's Book Club Companion",
      description: "Discussion guides, reading journals, and community resources.",
      price: "$24",
      category: "Reading",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472594019/RP6PxBmonJrBv7bTkqqjid/warlock_product_showcase-Ta9rFaYq6DqXpSM8SxYdxS.webp",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Fantasy Author",
      quote: "The Worldbuilding Toolkit transformed my creative process. I finished my novel 6 months earlier than expected.",
      avatar: "SM",
    },
    {
      name: "James Chen",
      role: "Self-Published Author",
      quote: "The publishing bundle gave me everything I needed. My book is now live on all major platforms!",
      avatar: "JC",
    },
    {
      name: "Emma Rodriguez",
      role: "Book Club Organizer",
      quote: "These resources brought my book club to life. Our discussions are deeper and more meaningful.",
      avatar: "ER",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">Warlock</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm text-foreground hover:text-primary transition-colors">
              Products
            </a>
            <a href="#about" className="text-sm text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#testimonials" className="text-sm text-foreground hover:text-primary transition-colors">
              Stories
            </a>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Browse Collection
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663472594019/RP6PxBmonJrBv7bTkqqjid/warlock_hero_bg-dkgFem2YxCX26UkYNkx3pL.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background/80" />

        {/* Content */}
        <div className="relative z-10 container max-w-3xl text-center">
          <div className="space-y-6 mb-8">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight">
              Unlock Your Creative Potential
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-accent">
              Premium digital products for worldbuilders, authors, and storytellers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Explore Products <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* WARLOCK Value Proposition */}
      <section id="about" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              What is <span className="text-primary">WARLOCK</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Worldbuilders and Readers Linking Originality, Creativity and Knowledge—a curated marketplace for creative professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {warlockValues.map((value, idx) => (
              <Card
                key={idx}
                className="border-border hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                      {value.icon}
                    </div>
                    <span className="font-display text-3xl font-bold text-primary/30">{value.letter}</span>
                  </div>
                  <CardTitle className="font-display text-2xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 bg-secondary/5">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked resources designed to elevate your creative work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className="font-display text-xl font-bold text-accent">{product.price}</span>
                  </div>
                  <CardTitle className="font-display text-xl">{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Browse All Products <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Creator Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              See how Warlock Publishing has transformed creative journeys
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="container max-w-2xl">
          <div className="text-center space-y-6">
            <h2 className="font-display text-4xl font-bold text-foreground">
              Join the Creative Community
            </h2>
            <p className="text-lg text-muted-foreground">
              Get exclusive access to new products, writing tips, and special offers delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-secondary font-bold text-sm">W</span>
                </div>
                <span className="font-display text-lg font-bold">Warlock</span>
              </div>
              <p className="text-sm opacity-75">Premium digital products for creative professionals.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Worldbuilding
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Writing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Publishing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
            <p>&copy; 2026 Warlock Publishing. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
