import mongoose, { Schema, model, models } from 'mongoose';

const MarketplaceProductSchema = new Schema({
    asin: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    keyword: { type: String }, // Original search phrase
    shortUrl: { type: String },
    fullUrl: { type: String },
    imageUrl: { type: String },
    rank: { type: String },
    store: { type: String },
    category: { type: String },
    rating: { type: String },
    reviewCount: { type: String },
    price: { type: String },
    opportunityScore: { type: String },
    source: { type: String }, // e.g. 'market_nexus.csv', 'b2.csv'
    lastSynced: { type: Date, default: Date.now }
}, { timestamps: true });

MarketplaceProductSchema.index({ keyword: 'text', title: 'text', category: 'text' });
MarketplaceProductSchema.index({ asin: 1 });

const MarketplaceProduct = models.MarketplaceProduct || model('MarketplaceProduct', MarketplaceProductSchema);

export default MarketplaceProduct;
