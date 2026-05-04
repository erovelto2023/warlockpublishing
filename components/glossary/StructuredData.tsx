import { GlossaryTerm } from "@/lib/types";

export default function StructuredData({ term }: { term: GlossaryTerm }) {
    const faqSchema = term.faqItems && term.faqItems.length > 0 ? {
        "@type": "FAQPage",
        "mainEntity": term.faqItems.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    const howToSchema = term.checklist && term.checklist.items.length > 0 ? {
        "@type": "HowTo",
        "name": term.checklist.title,
        "description": term.checklist.description,
        "step": term.checklist.items.map((item, idx) => ({
            "@type": "HowToStep",
            "position": idx + 1,
            "name": item.task,
            "itemListElement": [{
                "@type": "HowToDirection",
                "text": item.description
            }]
        }))
    } : null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": "https://warlockpublishing.com/glossary",
        ...(faqSchema ? { "mainEntity": faqSchema.mainEntity } : {}),
        ...(howToSchema ? { "step": howToSchema.step } : {})
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
