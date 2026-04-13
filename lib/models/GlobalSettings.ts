import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSettings extends Document {
    homeHeroImageUrl: string;
    siteTitle: string;
    siteDescription: string;
    heroOverlayColor: string;
    heroOpacity: number;
    isMaintenanceMode: boolean;
    updatedAt: Date;
}

const GlobalSettingsSchema: Schema = new Schema({
    homeHeroImageUrl: { type: String, default: '' },
    siteTitle: { type: String, default: 'Warlock Publishing' },
    siteDescription: { type: String, default: 'Enter the vault of elite digital assets and literary mastery. Built for creators who refuse to settle for the ordinary.' },
    heroOverlayColor: { type: String, default: '#2D1B4E' }, // Default Indigo
    heroOpacity: { type: Number, default: 40 }, // Default 40%
    isMaintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure we only ever have one settings document
export default mongoose.models.GlobalSettings || mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
