import mongoose, { Schema, model, models } from 'mongoose';

const GlossaryTermSchema = new Schema({
    // --- Core Glossary Fields ---
    term: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    id: { type: String }, // Custom string identifier from bulk imports
    shortDefinition: { type: String }, // 1-sentence plain-language
    definition: { type: String, required: true }, // Full in-depth explanation
    category: { type: String, default: 'Writing' },
    subCategory: { type: String },
    genre: { type: String },
    trope: { type: String },
    niche: { type: String },
    publishingContext: { type: String }, // e.g. Romance, Sci-Fi, Business
    keyCharacteristics: [String], // Defining features

    // --- Meaning & Context ---
    origin: { type: String },             // Cultural/Historical origin
    traditionalMeaning: { type: String }, // Traditional understanding
    modernUsage: { type: String },        // Current usage
    expandedExplanation: { type: String },// Deeper philosophical context
    
    // --- Practical Application ---
    howItWorks: { type: String },
    benefits: { type: String },
    commonPractices: { type: String },
    useCases: { type: String },
    whoUsesIt: { type: String },

    // --- Detailed Target Audience (Warlock Specific) ---
    targetAudience: {
        primaryDemographic: { type: String },
        readerPersonas: [{ type: String }],
        painPoints: [{ type: String }],
        desiredOutcomes: [{ type: String }]
    },
    
    // --- Deep Market Demand (Warlock Specific) ---
    marketDemand: {
        trendStatus: { type: String }, // 'Rising', 'Stable', 'Declining', 'Seasonal'
        searchVolume: { type: String },
        competitionLevel: { type: String },
        monetizationPotential: { type: String },
        averagePriceRange: { type: String },
        marketSize: { type: String }
    },
    
    // --- Monetization & Business (MMO) ---
    howItMakesMoney: { type: String },
    bestFor: { type: String },
    commonMistakes: { type: String },
    realExamples: { type: String },
    startupCost: { type: String, default: '$0' },
    timeToFirstDollar: { type: String },
    skillRequired: { type: String, default: 'Beginner' },
    platformPreference: { type: String },
    lowPhysicalEffort: { type: Boolean, default: false },

    // --- Robust Product Ideas (Object Array) ---
    productIdeas: [{
        type: { type: String },
        title: { type: String },
        description: { type: String },
        format: { type: String },
        estimatedLength: { type: String },
        pricePoint: { type: String }
    }],
    
    // --- Detailed Competitors (Warlock Specific) ---
    competitorReferences: [{
        title: { type: String },
        author: { type: String },
        url: { type: String },
        price: { type: String },
        rating: { type: String },
        reviewCount: { type: String },
        type: { type: String }
    }],
    
    // --- solution-based Pitfalls ---
    commonPitfalls: [{
        pitfall: { type: String },
        whyItHappens: { type: String },
        howToAvoid: { type: String }
    }],
    
    // --- High-Fidelity Video ---
    youtubeVideo: {
        title: { type: String },
        url: { type: String },
        channel: { type: String },
        views: { type: String },
        duration: { type: String },
        publishedDate: { type: String },
        relevance: { type: String }
    },
    videoUrl: { type: String }, // Legacy field from P6 for simpler embeds
    
    // --- SEO-Optimized Article ---
    blogArticle: {
        title: { type: String },
        slug: { type: String },
        wordCount: { type: String },
        content: { type: String },
        metaTitle: { type: String },
        metaDescription: { type: String },
        focusKeyword: { type: String },
        sources: [{ type: String }]
    },
    
    // --- Marketing Hook Hub ---
    marketingHooks: {
        videoHooks: [{ type: String }],
        blogTitles: [{ type: String }],
        pinterestPinIdeas: [{ type: String }],
        twitterTweetIdeas: [{ type: String }],
        questionsAndAnswers: [{
            question: String,
            answer: String
        }]
    },

    // --- Media & Social Ideas ---
    headlines: [String],
    youtubeTitles: [String],
    pinterestIdeas: [String],
    instagramIdeas: [String],
    faqs: [{ question: String, answer: String }],
    caseStudies: [{ title: String, description: String, url: String }],
    
    // --- Relationships & Linking ---
    relatedTermIds: [String],
    synonyms: [String],
    antonyms: [String],
    oppositeTerms: [String],
    seeAlso: [String],

    // --- Learning & Mastery ---
    beginnerExplanation: { type: String },
    advancedPerspective: { type: String },
    misconceptions: { type: String },
    warningsOrNotes: { type: String },
    guidedPractice: { type: String },
    affirmations: { type: String },
    visualizations: { type: String },
    audioOrVideoResources: { type: String },
    whyItMatters: { type: String },
    takeaways: [String],
    keyTakeaways: [{ type: String }], // Sync with takeaways if possible
    gettingStartedChecklist: [{ type: String }],

    // --- AI Prompt Command Center ---
    aiPromptCommandCenter: {
        productIdeaPrompt: { type: String },
        contentStrategyPrompt: { type: String },
        aiImagePrompt: { type: String }
    },
    imagePrompt: { type: String },
    productPrompt: { type: String },
    socialPrompt: { type: String },

    // --- Related Keywords & SEO ---
    relatedKeywords: [{
        keyword: String,
        searchVolume: String,
        competitionLevel: String,
    }],

    // --- Authority & References ---
    referenceWebsites: [{ name: String, url: String }],
    amazonProducts: [{ name: String, url: String }],

    // --- Expertise & Opinion ---
    expertOpinion: { type: String },
    historicalContext: { type: String },
    originalUsage: { type: String },
    currentUsage: { type: String },
    expandedDefinition: { type: String },
    simpleDefinition: { type: String },
    technicalDefinition: { type: String },
    checklist: [String], // Getting Started

    // --- Universal Authority Framework Phases ---
    
    // Phase 1: SEO Hook
    writingAspect: { type: String },
    geoTagging: { type: String },
    commonMyths: [{ 
        myth: { type: String },
        fact: { type: String }
    }],
    
    // Phase 2: Educational Authority
    anatomy: {
        structuralBreakdown: { type: String }, // For Books: Plot beats, archetypes. For Products: Components.
        specialistPerspective: { type: String } // EEAT Signal
    },
    
    // Phase 3: The Sales Engine (Integrated CSV Directory)
    directoryCategories: [{
        name: { type: String }, // Sub-Niche/Trope Name
        description: { type: String },
        productIds: [String] // References to Amazon ASINs or internal IDs
    }],
    
    // Phase 4: Technical Layer & Optimization
    featuredSnippet: { type: String }, // Quick summary box content
    regionalTrends: { type: String }, // Geo-Optimization
    buyersChecklist: [{ type: String }], // 5-point conversion list
    opportunityScore: { type: Number, default: 0 }, // Scarcity/Social Proof metric

    // --- Metadata & Workflow ---
    isPremium: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    imageUrl: { type: String },
    viewCount: { type: Number, default: 0 }
}, { timestamps: true });

GlossaryTermSchema.index({ category: 1 });
GlossaryTermSchema.index({ isPublished: 1 });
GlossaryTermSchema.index({ isPremium: 1 });
GlossaryTermSchema.index({ niche: 1 });

GlossaryTermSchema.pre('save', async function () {
    if (!this.category && this.niche) {
        this.category = this.niche;
    }
    if (!this.niche && this.category) {
        this.niche = this.category;
    }
});

const GlossaryTerm = models.GlossaryTerm || model('GlossaryTerm', GlossaryTermSchema);

export default GlossaryTerm;
