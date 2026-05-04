import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, Award, Zap, ShoppingCart, Leaf, Play } from "lucide-react";

interface DirectoryPageProps {
  data: any;
}

const iconMap: Record<string, React.ReactNode> = {
  award: <Award className="w-8 h-8 text-green-600 mb-2" />,
  zap: <Zap className="w-8 h-8 text-green-600 mb-2" />,
  "shopping-cart": <ShoppingCart className="w-8 h-8 text-green-600 mb-2" />,
  leaf: <Leaf className="w-8 h-8 text-green-600 mb-2" />,
};

export default function DirectoryPage({ data }: DirectoryPageProps) {
  const metadata = data.metadata || {};
  const hero = data.hero || {};
  const features = data.features || [];
  const mainSections = data.main_sections || [];
  const resources = data.resources || {};
  const faq = data.faq || [];
  const ctaSection = data.cta_section || {};
  const footerLinks = data.footer_links || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">{metadata.category || "Directory"}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {mainSections.map((section: any) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                {section.title}
              </a>
            ))}
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Shop Now
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl">
          {metadata.badge && (
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
              {metadata.badge}
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {hero.headline || metadata.title}
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {hero.subheadline || metadata.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {hero.cta_primary && (
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                {hero.cta_primary.text} <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            )}
            {hero.cta_secondary && (
              <Button size="lg" variant="outline" className="border-slate-300">
                {hero.cta_secondary.text}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Key Features */}
      {features.length > 0 && (
        <section className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature: any, idx: number) => (
            <Card key={idx} className="border-slate-200 hover:shadow-lg transition">
              <CardHeader>
                {iconMap[feature.icon]}
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* Main Sections */}
      {mainSections.map((section: any) => (
        <section key={section.id} id={section.id} className="container py-16 mb-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{section.title}</h2>
            {section.subtitle && <p className="text-lg text-slate-600">{section.subtitle}</p>}
          </div>

          {section.type === "tabs" && (
            <Tabs defaultValue={section.content[0]?.id} className="w-full">
              <TabsList className="grid w-full gap-2 mb-8 grid-cols-4">
                {section.content.map((item: any) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {section.content.map((item: any) => (
                <TabsContent key={item.id} value={item.id} className="space-y-6">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-2xl">{item.title}</CardTitle>
                      {item.subtitle && <CardDescription>{item.subtitle}</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-700">{item.description}</p>
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-2">Popular Products:</h4>
                          <ul className="space-y-2 text-sm text-slate-700">
                            {item.highlights.map((highlight: string, idx: number) => (
                              <li key={idx}>✓ {highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.steps && item.steps.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-2">How to Start:</h4>
                          <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
                            {item.steps.map((step: any, idx: number) => (
                              <li key={idx}>{step.description}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}

          {section.type === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.map((item: any, idx: number) => (
                <Card key={idx} className="border-slate-200 hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    {item.subtitle && <CardDescription>{item.subtitle}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-700 text-sm">{item.description}</p>
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="bg-slate-50 rounded p-3">
                        <p className="text-xs font-semibold text-slate-900 mb-2">Highlights:</p>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {item.highlights.map((highlight: string, hIdx: number) => (
                            <li key={hIdx}>• {highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {section.type === "accordion" && (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {section.content.map((item: any, idx: number) => (
                <Card key={idx} className="border-slate-200">
                  <AccordionItem value={`item-${idx}`} className="border-0">
                    <AccordionTrigger className="hover:no-underline p-6">
                      <span className="text-lg font-semibold text-slate-900">{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-slate-700">
                      {item.description}
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          )}
        </section>
      ))}

      {/* YouTube Videos Section */}
      {resources.youtube_videos && resources.youtube_videos.length > 0 && (
        <section className="container py-16 mb-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Video Resources</h2>
            <p className="text-lg text-slate-600">Learn more from expert videos on YouTube</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.youtube_videos.map((video: any, idx: number) => (
              <a
                key={idx}
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="border-slate-200 hover:shadow-lg transition h-full">
                  <CardHeader>
                    <div className="relative mb-4 bg-slate-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center group-hover:opacity-90 transition">
                      <img
                        src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <Play className="absolute w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-green-600 transition">
                      {video.title}
                    </CardTitle>
                    <CardDescription>
                      {video.channel} • {video.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm">{video.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {resources.related_products && resources.related_products.length > 0 && (
        <section className="container py-16 mb-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Products</h2>
            <p className="text-lg text-slate-600">Explore popular items from our collection</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {resources.related_products.map((product: any, idx: number) => (
              <a key={idx} href={product.link} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="border-slate-200 hover:shadow-lg transition h-full">
                  <CardHeader>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-4 group-hover:opacity-90 transition"
                    />
                    <CardTitle className="text-lg group-hover:text-green-600 transition">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm mb-4">{product.description}</p>
                    <p className="text-xl font-bold text-green-600">{product.price}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* External Resources Section */}
      {resources.external_links && resources.external_links.length > 0 && (
        <section className="container py-16 mb-16">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">External Resources</h2>
            <p className="text-lg text-slate-600">Additional links and information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.external_links.map((link: any, idx: number) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer">
                <Card className="border-slate-200 hover:shadow-lg transition h-full">
                  <CardHeader>
                    <CardTitle className="text-lg hover:text-green-600 transition">{link.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm">{link.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faq.length > 0 && (
        <section className="container py-16 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item: any, idx: number) => (
              <Card key={idx} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {Object.keys(ctaSection).length > 0 && (
        <section className="container py-16 mb-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaSection.headline}</h2>
          <p className="text-lg mb-8 opacity-90">{ctaSection.description}</p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-slate-100">
            {ctaSection.button_text} <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {footerLinks.columns &&
              footerLinks.columns.map((column: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-white font-bold mb-4">{column.title}</h3>
                  <ul className="space-y-2 text-sm">
                    {column.links &&
                      column.links.map((link: any, lIdx: number) => (
                        <li key={lIdx}>
                          <a href={link.url} className="hover:text-white transition">
                            {link.text}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>&copy; 2026 Directory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
