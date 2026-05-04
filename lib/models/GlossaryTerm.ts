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
    snapshot: { type: String, required: true },
    definition: { type: String, required: true },
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
    viewCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Add text search index
GlossaryTermSchema.index({ term: 'text', definition: 'text', snapshot: 'text' });

export default mongoose.models.GlossaryTerm || mongoose.model<IGlossaryTerm>('GlossaryTerm', GlossaryTermSchema);
