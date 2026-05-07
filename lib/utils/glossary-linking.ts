export function autoLinkGlossary(content: string, terms: { term: string, slug: string }[]) {
    if (!content || !terms || terms.length === 0) return content;

    // Sort terms by length descending to avoid partial matches (e.g. "Alpha" matching in "Alpha Hero")
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

    let linkedContent = content;

    // We need to avoid linking inside existing <a> tags or <h1>-<h6> tags
    // A simple regex approach might work if we are careful, or we use a DOM parser.
    // Since this is on the server/client in React, we can use a safe regex for text nodes.
    
    sortedTerms.forEach(termObj => {
        const termName = termObj.term;
        const termSlug = termObj.slug;
        
        // Match the term as a whole word, case-insensitive, but NOT if it's already inside a link
        // This is a simplified regex-based approach. A more robust way would be a DOM walker.
        // We look for the term not preceded by " or / or > (basic check for attributes/tags)
        // and followed by a space or punctuation.
        
        const escapedTerm = termName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<![">])\\b(${escapedTerm})\\b(?![^<]*>)`, 'gi');
        
        // We only link the FIRST occurrence to avoid over-optimization/spamminess
        let found = false;
        linkedContent = linkedContent.replace(regex, (match) => {
            if (found) return match;
            found = true;
            return `<a href="/glossary/${termSlug}" class="text-indigo-600 hover:text-indigo-500 font-bold decoration-indigo-300 underline-offset-4 underline decoration-2 transition-all">${match}</a>`;
        });
    });

    return linkedContent;
}
