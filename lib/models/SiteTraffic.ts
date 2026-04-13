import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteTraffic extends Document {
    path: string;
    referrer: string;
    dwellTime: number; // in milliseconds
    sessionId: string;
    timestamp: Date;
    userAgent: string;
    ipHash?: string; // Anonymized IP hash for unique visitor counting
}

const SiteTrafficSchema: Schema = new Schema({
    path: { type: String, required: true, index: true },
    referrer: { type: String, default: 'Direct' },
    dwellTime: { type: Number, default: 0 },
    sessionId: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    userAgent: { type: String },
    ipHash: { type: String },
}, { timestamps: true });

// Index for aggregation performance
SiteTrafficSchema.index({ path: 1, timestamp: -1 });

export default mongoose.models.SiteTraffic || mongoose.model<ISiteTraffic>('SiteTraffic', SiteTrafficSchema);
