import { Schema, model, models } from 'mongoose';

const DigitalAssetSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Downloadable' },
    
    // File details
    originalFilename: { type: String, required: true },
    storedFilename: { type: String, required: true },   // UUID
    fileSizeBytes: { type: Number, required: true },
    mimeType: { type: String, required: true },
    
    // Access
    accessSlug: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    
    // Metadata
    downloadCount: { type: Number, default: 0 },
}, { timestamps: true });

const DigitalAsset = models.DigitalAsset || model('DigitalAsset', DigitalAssetSchema);
export default DigitalAsset;
