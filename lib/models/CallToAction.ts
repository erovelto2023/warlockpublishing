import mongoose, { Schema, Document } from 'mongoose';

export interface ICallToAction extends Document {
    internalName: string;
    headline: string;
    body: string;
    buttonText: string;
    buttonUrl: string;
    themeColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CallToActionSchema: Schema = new Schema({
    internalName: { type: String, required: true },
    headline: { type: String, required: true },
    body: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonUrl: { type: String, required: true },
    themeColor: { type: String, enum: ['indigo', 'emerald', 'amber', 'rose', 'slate'], default: 'indigo' },
    imageUrl: { type: String }
}, {
    timestamps: true
});

export default mongoose.models.CallToAction || mongoose.model<ICallToAction>('CallToAction', CallToActionSchema);
