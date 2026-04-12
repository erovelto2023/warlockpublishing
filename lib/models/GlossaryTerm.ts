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

    // --- Metadata & Workflow ---
    isPremium: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    imageUrl: { type: String },
    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 0 }
}, { timestamps: true });

GlossaryTermSchema.pre('save', async function () {
    this.lastUpdated = new Date();
    if (!this.category && this.niche) {
        this.category = this.niche;
    }
    if (!this.niche && this.category) {
        this.niche = this.category;
    }
});

const GlossaryTerm = models.GlossaryTerm || model('GlossaryTerm', GlossaryTermSchema);

export default GlossaryTerm;
