import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    senderId?: string; // Optional: Clerk User ID if logged in
    senderName: string;
    senderEmail: string;
    recipientId?: string; // Optional: Clerk User ID of recipient. If null, it's a system/admin message.
    subject: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        senderId: { type: String },
        senderName: { type: String, required: true },
        senderEmail: { type: String, required: true },
        recipientId: { type: String },
        subject: { type: String, required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
