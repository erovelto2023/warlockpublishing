import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSettings extends Document {
    homeHeroImageUrl: string;
    siteTitle: string;
    siteDescription: string;
    isMaintenanceMode: boolean;
    updatedAt: Date;
}

const GlobalSettingsSchema: Schema = new Schema({
    homeHeroImageUrl: { type: String, default: '' },
    siteTitle: { type: String, default: 'Warlock Publishing' },
    siteDescription: { type: String, default: 'Premium Digital Products & PLR' },
    isMaintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure we only ever have one settings document
export default mongoose.models.GlobalSettings || mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
