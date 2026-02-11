import mongoose, { Schema, Document } from 'mongoose';

export interface ISalesPage extends Document {
    title: string;
    slug: string;
    description: string;
    keywords: string;
    headerCode: string;
    bodyCode: string;
    footerCode: string;
    isPublished: boolean;
    showInMarketplace: boolean;
    pageType: 'sales' | 'upsell' | 'downsell' | 'thank-you';
    price?: number;
    buyUrl?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    // Marketplace Landing Page Card Overrides
    marketplaceTitle?: string;
    marketplaceDescription?: string;
    marketplaceImage?: string;
    marketplaceColor?: string; // Hex color for the card background
    useColorAsDefault?: boolean; // Whether to prioritize color over image
    marketplaceFeatures?: string[]; // Custom bullet points for the card
    // Analytics & A/B Testing
    views: number;
    clicks: number;
    abEnabled: boolean;
    bodyCodeB: string;
    viewsA: number;
    viewsB: number;
    clicksA: number;
    clicksB: number;
    createdAt: Date;
    updatedAt: Date;
}

const SalesPageSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    keywords: { type: String },
    headerCode: { type: String, default: '' },
    bodyCode: { type: String, required: true },
    footerCode: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    showInMarketplace: { type: Boolean, default: false },
    pageType: {
        type: String,
        enum: ['sales', 'upsell', 'downsell', 'thank-you'],
        default: 'sales'
    },
    price: { type: Number },
    buyUrl: { type: String },
    ogImage: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    // Marketplace Overrides
    marketplaceTitle: { type: String },
    marketplaceDescription: { type: String },
    marketplaceImage: { type: String },
    marketplaceColor: { type: String, default: '#3b82f6' },
    useColorAsDefault: { type: Boolean, default: true },
    marketplaceFeatures: { type: [String], default: ['Instant Access', 'Premium Content'] },
    // Analytics
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    // A/B Testing
    abEnabled: { type: Boolean, default: false },
    bodyCodeB: { type: String, default: '' },
    viewsA: { type: Number, default: 0 },
    viewsB: { type: Number, default: 0 },
    clicksA: { type: Number, default: 0 },
    clicksB: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.SalesPage || mongoose.model<ISalesPage>('SalesPage', SalesPageSchema);
