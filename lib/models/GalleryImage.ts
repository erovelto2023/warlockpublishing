import { Schema, model, models } from 'mongoose';

const GalleryImageSchema = new Schema({
    // Display
    title: { type: String, required: true },
    altText: { type: String, required: true },
    description: { type: String, default: '' },
    tags: [{ type: String }],

    // File info
    originalFilename: { type: String, required: true },
    storedFilename: { type: String, required: true },   // uuid.ext
    fileUrl: { type: String, required: true },           // /uploads/gallery/uuid.ext
    thumbnailUrl: { type: String, required: true },      // /uploads/gallery/thumbs/uuid.ext
    mimeType: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },

    // Publishing
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const GalleryImage = models.GalleryImage || model('GalleryImage', GalleryImageSchema);
export default GalleryImage;
