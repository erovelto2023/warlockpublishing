import mongoose, { Schema, Document } from 'mongoose';

export interface IGlossaryTerm extends Document {
    term: string;
    slug: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    snapshot: string;
    definition: string;
    characteristics: string[];
    youtubeVideoId?: string;
    faqItems: {
        question: string;
        answer: string;
    }[];
    relatedTerms: string[];
    monetizationIdeas: {
        affiliateProducts: string[];
        courseTopics: string[];
        digitalDownloads: string[];
    };
    checklist?: {
        title: string;
        description: string;
        items: {
            task: string;
            description: string;
        }[];
    };
    marketingStrategy?: {
        hooks: string[];
        headlines: string[];
        titles: string[];
        contentIdeas: string[];
        socialPosts: string[];
    };
    seoStrategy?: {
        monthlySearchVolume?: number;
        volumeRange?: string;
        difficulty?: 'Low' | 'Medium' | 'High';
        relatedKeywords: string[];
    };
    isPublished: boolean;
    callToActionId?: mongoose.Types.ObjectId | string;
    articleContent?: string;
    marketDemand?: {
        demandScore: string;
        passionScore: string;
        saturationScore: string;
        trendStatus: string;
    };
    readerPsychology?: {
        whyWeCraveIt: string;
        cognitiveShortcut: string;
        emotionalPayoff: string;
        catharticRelease: string;
    };
    masterclass?: {
        masterclassDesc: string;
        threeActStructure: {
            act1: string;
            act2: string;
            act3: string;
        };
        profitBeats: {
            title: string;
            description: string;
            timing: string;
        }[];
        characterArchetypes: {
            role: string;
            description: string;
        }[];
        technicalComponents: {
            powerTitle: string;
            tropes: string[];
            hook: string;
        };
        profitabilityChecklist: string[];
    };
    subGenreVariations?: {
        genre: string;
        variation: string;
    }[];
    vibeCuration?: {
        vibe: string;
        vibeDescription?: string;
        books: {
            title: string;
            author: string;
            salesHook: string;
            buyUrl: string;
        }[];
    }[];
    commonPitfalls?: {
        pitfall: string;
        howToAvoid: string;
    }[];
    aiPromptCommandCenter?: {
        sceneGeneratorPrompt: string;
        marketingHookPrompt: string;
        aiImagePrompt: string;
    };
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const GlossaryTermSchema: Schema = new Schema({
    term: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    difficulty: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced'], 
        default: 'Beginner' 
    },
    snapshot: { type: String },
    definition: { type: String, required: true },
    callToActionId: { type: Schema.Types.ObjectId, ref: 'CallToAction' },
    articleContent: { type: String },
    characteristics: [{ type: String }],
    youtubeVideoId: { type: String },
    faqItems: [{
        question: { type: String },
        answer: { type: String }
    }],
    relatedTerms: [{ type: String }],
    monetizationIdeas: {
        affiliateProducts: [{ type: String }],
        courseTopics: [{ type: String }],
        digitalDownloads: [{ type: String }]
    },
    checklist: {
        title: { type: String },
        description: { type: String },
        items: [{
            task: { type: String },
            description: { type: String }
        }]
    },
    marketingStrategy: {
        hooks: [{ type: String }],
        headlines: [{ type: String }],
        titles: [{ type: String }],
        contentIdeas: [{ type: String }],
        socialPosts: [{ type: String }]
    },
    seoStrategy: {
        monthlySearchVolume: { type: Number },
        volumeRange: { type: String },
        difficulty: { type: String, enum: ['Low', 'Medium', 'High'] },
        relatedKeywords: [{ type: String }]
    },
    isPublished: { type: Boolean, default: true },
    marketDemand: {
        demandScore: { type: String },
        passionScore: { type: String },
        saturationScore: { type: String },
        trendStatus: { type: String }
    },
    readerPsychology: {
        whyWeCraveIt: { type: String },
        cognitiveShortcut: { type: String },
        emotionalPayoff: { type: String },
        catharticRelease: { type: String }
    },
    masterclass: {
        masterclassDesc: { type: String },
        threeActStructure: {
            act1: { type: String },
            act2: { type: String },
            act3: { type: String }
        },
        profitBeats: [{
            title: { type: String },
            description: { type: String },
            timing: { type: String }
        }],
        characterArchetypes: [{
            role: { type: String },
            description: { type: String }
        }],
        technicalComponents: {
            powerTitle: { type: String },
            tropes: [{ type: String }],
            hook: { type: String }
        },
        profitabilityChecklist: [{ type: String }]
    },
    subGenreVariations: [{
        genre: { type: String },
        variation: { type: String }
    }],
    vibeCuration: [{
        vibe: { type: String },
        vibeDescription: { type: String },
        books: [{
            title: { type: String },
            author: { type: String },
            salesHook: { type: String },
            buyUrl: { type: String }
        }]
    }],
    commonPitfalls: [{
        pitfall: { type: String },
        howToAvoid: { type: String }
    }],
    aiPromptCommandCenter: {
        sceneGeneratorPrompt: { type: String },
        marketingHookPrompt: { type: String },
        aiImagePrompt: { type: String }
    },
    viewCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Add text search index
GlossaryTermSchema.index({ term: 'text', definition: 'text', snapshot: 'text' });

export default mongoose.models.GlossaryTerm || mongoose.model<IGlossaryTerm>('GlossaryTerm', GlossaryTermSchema);
