import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    author: string; // Just a string for now, could be ref to User
    tags: string[];
    isPublished: boolean;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: { type: String, required: true },
        coverImage: { type: String },
        author: { type: String, required: true },
        tags: { type: [String], default: [] },
        isPublished: { type: Boolean, default: false },
        publishedAt: { type: Date },
    },
    { timestamps: true }
);

// Prevent overwriting the model if it already exists (Next.js hot reloading)
const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
