import mongoose from "mongoose";

const PenNameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    bio: { type: String },
    avatarUrl: { type: String },
    coverImage: { type: String },
    tagline: { type: String },
    newsletterDescription: { type: String },
    socialLinks: {
        twitter: String,
        instagram: String,
        website: String,
        email: String,
    },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PenName || mongoose.model("PenName", PenNameSchema);
