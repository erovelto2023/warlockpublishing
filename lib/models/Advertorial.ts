import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvertorial extends Document {
    title: string;
    slug: string;
    category: string;
    headlineOptions: string[];
    summaryBox: {
        topPick: string;
        benefits: string[];
        ctaText: string;
        targetUrl: string;
    };
    narrative: {
        frictionReveal: string;
        editorialPivot: string;
    };
    valueReinforcement: {
        priceAnchoring: string;
        steps: {
            title: string;
            description: string;
        }[];
    };
    comparisonTable: {
        headers: string[];
        rows: string[][];
    };
    faq: {
        question: string;
        answer: string;
    }[];
    seoKeywords: string[];
    affiliateOfferId?: string;
    customTargetUrl?: string;
    scarcity?: {
        type: 'timer' | 'slots' | 'none';
        value: string;
    };
    template: 'standard' | 'listicle' | 'comparison' | 'minimalist' | 'industrial' | 'magazine' | 'ultimate';
    
    // New Framework Fields
    ftcDisclosure?: string;
    heroSection?: {
        headline: string;
        boldClaim: string;
        imageUrl?: string;
        imagePrompt?: string;
    };
    listicleItems?: {
        subheading: string;
        content: string;
    }[];
    comparisonData?: {
        title: string;
        features: {
            name: string;
            ourValue: string;
            competitorValue: string;
            isBetter: boolean;
        }[];
    };
    socialProof?: {
        quote: string;
        author: string;
        source?: string;
        avatarUrl?: string;
    }[];
    conversionClose?: {
        ctaText: string;
        urgencyText: string;
        guaranteeText: string;
    };
    scraperInputs?: {
        targetUrl: string;
        competitorUrls: string[];
        targetAudience: string;
        painPoint: string;
        headlineFormula: string;
        saftCompliance: boolean;
    };

    isPublished: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const AdvertorialSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    headlineOptions: [{ type: String }],
    summaryBox: {
        topPick: { type: String },
        benefits: [{ type: String }],
        ctaText: { type: String },
        targetUrl: { type: String }
    },
    narrative: {
        frictionReveal: { type: String },
        editorialPivot: { type: String }
    },
    valueReinforcement: {
        priceAnchoring: { type: String },
        steps: [{
            title: { type: String },
            description: { type: String }
        }]
    },
    comparisonTable: {
        headers: [{ type: String }],
        rows: [[{ type: String }]]
    },
    faq: [{
        question: { type: String },
        answer: { type: String }
    }],
    seoKeywords: [{ type: String }],
    affiliateOfferId: { type: Schema.Types.ObjectId, ref: 'AffiliateOffer' },
    customTargetUrl: { type: String },
    scarcity: {
        type: { type: String, enum: ['timer', 'slots', 'none'], default: 'none' },
        value: { type: String }
    },
    template: { type: String, enum: ['standard', 'listicle', 'comparison', 'minimalist', 'industrial', 'magazine', 'ultimate'], default: 'ultimate' },
    
    // New Framework Schema
    ftcDisclosure: { type: String, default: 'Advertisement' },
    heroSection: {
        headline: { type: String },
        boldClaim: { type: String },
        imageUrl: { type: String },
        imagePrompt: { type: String }
    },
    listicleItems: [{
        subheading: { type: String },
        content: { type: String }
    }],
    comparisonData: {
        title: { type: String, default: 'How We Compare' },
        features: [{
            name: { type: String },
            ourValue: { type: String },
            competitorValue: { type: String },
            isBetter: { type: Boolean, default: true }
        }]
    },
    socialProof: [{
        quote: { type: String },
        author: { type: String },
        source: { type: String },
        avatarUrl: { type: String }
    }],
    conversionClose: {
        ctaText: { type: String },
        urgencyText: { type: String },
        guaranteeText: { type: String }
    },
    scraperInputs: {
        targetUrl: { type: String },
        competitorUrls: [{ type: String }],
        targetAudience: { type: String },
        painPoint: { type: String },
        headlineFormula: { type: String },
        saftCompliance: { type: Boolean, default: false }
    },

    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.models.Advertorial || mongoose.model<IAdvertorial>('Advertorial', AdvertorialSchema);
