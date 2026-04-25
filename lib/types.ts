export interface Product {
    _id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category?: string;
    productType: 'ebook' | 'software' | 'amazon' | 'course';
    pageType: 'sales' | 'upsell' | 'downsell' | 'thankyou';
    templateId?: string;
    contentData?: any;
    format?: string;
    grooveSellId?: string;
    grooveSellEmbed?: string;
    amazonLink?: string;
    isAmazonProduct: boolean;
    isHidden: boolean;
    isFeaturedInRotation: boolean;
    externalUrl?: string;
    licenseType?: string;
    htmlContent?: string;
    penNameId?: string;
    tags: string[];
    slug: string;
    userId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    [key: string]: any; 
}

export interface GlossaryTerm {
    _id: string;
    term: string;
    slug: string;
    shortDefinition?: string;
    definition: string;
    category: string;
    subCategory?: string;
    genre?: string;
    trope?: string;
    niche?: string;
    publishingContext?: string;
    keyCharacteristics: string[];
    isPublished: boolean;
    isPremium: boolean;
    imageUrl?: string;
    viewCount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    // ... many more optional fields can be added as needed
}

export interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    author: string;
    tags: string[];
    isPublished: boolean;
    publishedAt?: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface GalleryImage {
    _id: string;
    title: string;
    altText: string;
    description?: string;
    tags: string[];
    originalFilename: string;
    storedFilename: string;
    fileUrl: string;
    thumbnailUrl: string;
    mimeType: string;
    fileSizeBytes: number;
    status: 'draft' | 'published';
    sortOrder: number;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface PenName {
    _id: string;
    name: string;
    slug: string;
    bio?: string;
    avatarUrl?: string;
    coverImage?: string;
    tagline?: string;
    newsletterDescription?: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        website?: string;
        email?: string;
    };
    userId: string;
    createdAt: string | Date;
}

export interface SalesPage {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    keywords?: string;
    headerCode?: string;
    bodyCode: string;
    footerCode?: string;
    isPublished: boolean;
    showInMarketplace: boolean;
    pageType: 'sales' | 'upsell' | 'downsell' | 'thank-you';
    price?: number;
    buyUrl?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    marketplaceTitle?: string;
    marketplaceDescription?: string;
    marketplaceImage?: string;
    marketplaceColor?: string;
    useColorAsDefault?: boolean;
    marketplaceFeatures?: string[];
    views: number;
    clicks: number;
    abEnabled: boolean;
    bodyCodeB?: string;
    viewsA: number;
    viewsB: number;
    clicksA: number;
    clicksB: number;
    isFeaturedInRotation: boolean;
    externalUrl?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface MarketplaceItem {
    id: string;
    title: string;
    description?: string;
    price: number;
    slug: string;
    imageUrl?: string;
    type: 'product' | 'offer';
    category?: string;
    externalUrl?: string;
    licenseType?: string;
}
