export function autoLinkGlossary(content: string, terms: { term: string, slug: string }[]) {
    try {
        if (!content || !terms || terms.length === 0) return content;

        // Sort terms by length descending to avoid partial matches
        const sortedTerms = [...terms]
            .filter(t => t.term && t.term.length > 3) // Only link terms with > 3 chars
            .sort((a, b) => b.term.length - a.term.length);

        let linkedContent = content;

        // We only link the top 25 longest matching terms to keep performance high
        const termsToLink = sortedTerms.slice(0, 50);

        termsToLink.forEach(termObj => {
            const termName = termObj.term;
            const termSlug = termObj.slug;
            
            // Match the term as a whole word, but NOT if it's already inside a tag or attribute
            // Using a simpler but safer approach for cross-environment compatibility
            const escapedTerm = termName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // This regex tries to avoid matching inside < > tags
            const regex = new RegExp(`(?<!<[^>]*)\\b(${escapedTerm})\\b(?![^<]*>)`, 'gi');
            
            let found = false;
            const newContent = linkedContent.replace(regex, (match) => {
                if (found) return match;
                found = true;
                return `<a href="/glossary/${termSlug}" class="text-indigo-600 hover:text-indigo-500 font-bold decoration-indigo-300 underline-offset-4 underline decoration-2 transition-all">${match}</a>`;
            });
            
            linkedContent = newContent;
        });

        return linkedContent;
    } catch (error) {
        console.error("Auto-linking failed:", error);
        return content;
    }
}
