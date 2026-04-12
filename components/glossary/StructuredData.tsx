interface StructuredDataProps {
    term: any;
}

export default function StructuredData({ term }: StructuredDataProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": "Warlock Publishing Creator Glossary",
            "url": "https://warlockpublishing.com/glossary"
        },
        "url": `https://warlockpublishing.com/glossary/${term.slug}`
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
