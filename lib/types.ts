export interface Product {
    _id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category?: string;
    productType?: string;
    pageType?: string;
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
    id?: string;
    shortDefinition?: string;
    definition: string;
    category: string;
    subCategory?: string;
    genre?: string;
    trope?: string;
    niche?: string;
    publishingContext?: string;
    keyCharacteristics: string[];
    origin?: string;
    traditionalMeaning?: string;
    modernUsage?: string;
    expandedExplanation?: string;
    howItWorks?: string;
    benefits?: string;
    commonPractices?: string;
    useCases?: string;
    whoUsesIt?: string;
    targetAudience?: {
        primaryDemographic?: string;
        readerPersonas?: string[];
        painPoints?: string[];
        desiredOutcomes?: string[];
    };
    marketDemand?: {
        trendStatus?: string;
        searchVolume?: string;
        competitionLevel?: string;
        monetizationPotential?: string;
        averagePriceRange?: string;
        marketSize?: string;
    };
    howItMakesMoney?: string;
    bestFor?: string;
    commonMistakes?: string;
    realExamples?: string;
    startupCost?: string;
    timeToFirstDollar?: string;
    skillRequired?: string;
    platformPreference?: string;
    lowPhysicalEffort?: boolean;
    productIdeas?: {
        type?: string;
        title?: string;
        description?: string;
        format?: string;
        estimatedLength?: string;
        pricePoint?: string;
    }[];
    competitorReferences?: {
        title?: string;
        author?: string;
        url?: string;
        price?: string;
        rating?: string;
        reviewCount?: string;
        type?: string;
    }[];
    commonPitfalls?: {
        pitfall?: string;
        whyItHappens?: string;
        howToAvoid?: string;
    }[];
    youtubeVideo?: {
        title?: string;
        url?: string;
        channel?: string;
        views?: string;
        duration?: string;
        publishedDate?: string;
        relevance?: string;
    };
    videoUrl?: string;
    blogArticle?: {
        title?: string;
        slug?: string;
        wordCount?: string;
        content?: string;
        metaTitle?: string;
        metaDescription?: string;
        focusKeyword?: string;
        sources?: string[];
    };
    marketingHooks?: {
        videoHooks?: string[];
        blogTitles?: string[];
        pinterestPinIdeas?: string[];
        twitterTweetIdeas?: string[];
        questionsAndAnswers?: {
            question?: string;
            answer?: string;
        }[];
    };
    headlines?: string[];
    youtubeTitles?: string[];
    pinterestIdeas?: string[];
    instagramIdeas?: string[];
    faqs?: { question?: string; answer?: string }[];
    caseStudies?: { title?: string; description?: string; url?: string }[];
    relatedTermIds?: string[];
    synonyms?: string[];
    antonyms?: string[];
    oppositeTerms?: string[];
    seeAlso?: string[];
    beginnerExplanation?: string;
    advancedPerspective?: string;
    misconceptions?: string;
    warningsOrNotes?: string;
    guidedPractice?: string;
    affirmations?: string;
    visualizations?: string;
    audioOrVideoResources?: string;
    whyItMatters?: string;
    takeaways?: string[];
    keyTakeaways?: string[];
    gettingStartedChecklist?: string[];
    aiPromptCommandCenter?: {
        productIdeaPrompt?: string;
        contentStrategyPrompt?: string;
        aiImagePrompt?: string;
    };
    imagePrompt?: string;
    productPrompt?: string;
    socialPrompt?: string;
    relatedKeywords?: {
        keyword?: string;
        searchVolume?: string;
        competitionLevel?: string;
    }[];
    referenceWebsites?: { name?: string; url?: string }[];
    amazonProducts?: { name?: string; url?: string }[];
    expertOpinion?: string;
    historicalContext?: string;
    originalUsage?: string;
    currentUsage?: string;
    expandedDefinition?: string;
    simpleDefinition?: string;
    technicalDefinition?: string;
    checklist?: string[];
    isPremium: boolean;
    isPublished: boolean;
    imageUrl?: string;
    viewCount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    marketplaceProduct?: {
        productId: string;
    };
    bestMarketingPlatforms?: {
        platform?: string;
        priority?: string;
        reason?: string;
    }[];
    [key: string]: any;
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
    pageType?: string;
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
