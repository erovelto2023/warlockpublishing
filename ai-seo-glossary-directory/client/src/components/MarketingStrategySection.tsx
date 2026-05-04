import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface MarketingStrategyProps {
  hooks: string[];
  headlines: string[];
  titles: string[];
  contentIdeas: string[];
  socialPosts: string[];
}

export default function MarketingStrategySection({
  hooks,
  headlines,
  titles,
  contentIdeas,
  socialPosts,
}: MarketingStrategyProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, index: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const ContentCard = ({
    title,
    items,
    sectionId,
  }: {
    title: string;
    items: string[];
    sectionId: string;
  }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <p className="text-foreground/90 flex-1">{item}</p>
              <button
                onClick={() => handleCopy(item, `${sectionId}-${idx}`)}
                className="flex-shrink-0 p-2 hover:bg-primary/10 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copiedIndex === `${sectionId}-${idx}` ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground hover:text-primary" />
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
        Marketing & Content Strategy
      </h2>
      <p className="text-foreground/70 mb-8">
        Pre-written templates and ideas ready to customize for your audience
      </p>

      {/* Hooks */}
      <ContentCard title="🎣 Hooks" items={hooks} sectionId="hooks" />

      {/* Headlines */}
      <ContentCard title="📰 Headlines" items={headlines} sectionId="headlines" />

      {/* Titles */}
      <ContentCard title="📝 Titles" items={titles} sectionId="titles" />

      {/* Content Ideas */}
      <ContentCard title="💡 Content Ideas" items={contentIdeas} sectionId="ideas" />

      {/* Social Posts */}
      <ContentCard title="📱 Social Posts" items={socialPosts} sectionId="posts" />

      {/* Export All Button */}
      <div className="mt-8 p-6 bg-primary/5 border border-primary/30 rounded-lg">
        <h3 className="font-bold text-foreground mb-3">Export All Content</h3>
        <p className="text-sm text-foreground/70 mb-4">
          Copy all marketing templates and ideas at once for use in your content calendar or CMS.
        </p>
        <Button
          onClick={() => {
            const allContent = `
HOOKS:
${hooks.join("\n")}

HEADLINES:
${headlines.join("\n")}

TITLES:
${titles.join("\n")}

CONTENT IDEAS:
${contentIdeas.join("\n")}

SOCIAL POSTS:
${socialPosts.join("\n")}
            `;
            handleCopy(allContent, "export-all");
          }}
          className="w-full sm:w-auto"
        >
          {copiedIndex === "export-all" ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy All Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
