import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateOffer extends Document {
    name: string;
    affiliateLink: string;
    destinationLink?: string;
    productPrice?: string;
    commissionLevel?: string;
    payoutAmount?: string;
    network?: string;
    category?: string;
    notes?: string;
    clicks: number;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AffiliateOfferSchema: Schema = new Schema({
    name: { type: String, required: true },
    affiliateLink: { type: String, required: true },
    destinationLink: { type: String },
    productPrice: { type: String },
    commissionLevel: { type: String },
    payoutAmount: { type: String },
    network: { type: String },
    category: { type: String, default: "General" },
    notes: { type: String },
    clicks: { type: Number, default: 0 },
    isFavorite: { type: Boolean, default: false },
}, {
    timestamps: true
});

export default mongoose.models.AffiliateOffer || mongoose.model<IAffiliateOffer>('AffiliateOffer', AffiliateOfferSchema);
