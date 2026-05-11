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
    template: 'standard' | 'listicle' | 'comparison' | 'minimalist' | 'industrial' | 'magazine';
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
    template: { type: String, enum: ['standard', 'listicle', 'comparison', 'minimalist', 'industrial', 'magazine'], default: 'industrial' },
    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.models.Advertorial || mongoose.model<IAdvertorial>('Advertorial', AdvertorialSchema);
