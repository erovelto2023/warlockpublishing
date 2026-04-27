interface StructuredDataProps {
    term: any;
}

export default function StructuredData({ term }: StructuredDataProps) {
    const baseUrl = "https://warlockpublishing.com";
    const termUrl = `${baseUrl}/glossary/${term.slug}`;

    const graph = [
        {
            "@type": "DefinedTerm",
            "name": term.term,
            "description": term.shortDefinition || term.definition?.substring(0, 160),
            "disambiguatingDescription": term.definition,
            "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": "Warlock Publishing Creator Glossary",
                "url": `${baseUrl}/glossary`
            },
            "url": termUrl
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": baseUrl
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Glossary",
                    "item": `${baseUrl}/glossary`
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": term.term,
                    "item": termUrl
                }
            ]
        }
    ];

    // Add FAQ Schema if FAQs exist
    if (term.faqs && term.faqs.length > 0) {
        graph.push({
            "@type": "FAQPage",
            "mainEntity": term.faqs.map((faq: any) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        } as any);
    }

    // Add HowTo Schema if checklist exists
    if (term.checklist && term.checklist.length > 0) {
        graph.push({
            "@type": "HowTo",
            "name": `How to implement ${term.term}`,
            "description": `Steps to successfully use ${term.term} in your creative business.`,
            "step": term.checklist.map((item: string, index: number) => ({
                "@type": "HowToStep",
                "position": index + 1,
                "text": item
            }))
        } as any);
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": graph
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
