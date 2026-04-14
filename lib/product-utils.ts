/**
 * Sanitizes raw product data from the database to ensure it's safe for rendering
 * in Server Components and templates.
 */
export function getSanitizedProduct(product: any) {
    if (!product) return null;

    // Helper for safe block access
    const getBlockData = (blocks: any[], id: string) => {
        if (!Array.isArray(blocks)) return {};
        const block = blocks.find((b: any) => b.id === id);
        return block?.enabled ? (block.data || {}) : {};
    };

    const blocks = Array.isArray(product.contentData?.blocks) ? product.contentData.blocks : [];

    return {
        id: product._id?.toString() || "",
        title: String(product.title || "Untitled Product"),
        slug: String(product.slug || ""),
        description: String(product.description || ""),
        price: Number(product.price) || 0,
        imageUrl: String(product.imageUrl || ""),
        category: String(product.category || "General"),
        licenseType: String(product.licenseType || "Standard"),
        productType: String(product.productType || "standard"),
        pageType: String(product.pageType || product.productType || "standard"),
        amazonLink: String(product.amazonLink || ""),
        isAmazonProduct: Boolean(product.isAmazonProduct),
        grooveSellId: String(product.grooveSellId || ""),
        grooveSellEmbed: String(product.grooveSellEmbed || ""),
        htmlContent: String(product.htmlContent || ""),
        format: String(product.format || "Digital"),
        
        // Sanitized content blocks
        blocks: {
            navbar: getBlockData(blocks, 'navbar'),
            hero: getBlockData(blocks, 'hero'),
            synopsis: getBlockData(blocks, 'synopsis'),
            problem: getBlockData(blocks, 'problem'),
            solution: getBlockData(blocks, 'solution'),
            pricing: getBlockData(blocks, 'pricing'),
            reviews: getBlockData(blocks, 'reviews'),
            author: getBlockData(blocks, 'author'),
            footer: getBlockData(blocks, 'footer'),
            faq: getBlockData(blocks, 'faq'),
            bonuses: getBlockData(blocks, 'bonuses'),
            curriculum: getBlockData(blocks, 'curriculum'),
        },
        
        // Pass through the original contentData just in case, but preferred to use blocks above
        rawContentData: product.contentData || {}
    };
}

export type SanitizedProduct = ReturnType<typeof getSanitizedProduct>;
