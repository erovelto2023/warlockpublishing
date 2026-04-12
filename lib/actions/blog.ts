'use server';

import { connectToDatabase } from '@/lib/db';
import BlogPost, { IBlogPost } from '@/lib/models/BlogPost';
import { revalidatePath } from 'next/cache';

// Helper to serialize Mongoose documents
function serializePost(post: any) {
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export async function createPost(data: Partial<IBlogPost>) {
    await connectToDatabase();

    const slug = data.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newPost = await BlogPost.create({
        ...data,
        slug,
        author: 'Warlock Team', // Default author for now
        publishedAt: data.isPublished ? new Date() : undefined,
    });

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return serializePost(newPost);
}

export async function updatePost(id: string, data: Partial<IBlogPost>) {
    await connectToDatabase();

    const post = await BlogPost.findById(id);
    if (!post) throw new Error('Post not found');

    if (data.title && data.title !== post.title) {
        data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }

    if (data.isPublished && !post.isPublished) {
        data.publishedAt = new Date();
    } else if (data.isPublished === false) {
        data.publishedAt = undefined;
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(id, data, { new: true });

    if (!updatedPost) throw new Error('Post not found during update');

    revalidatePath('/blog');
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath('/admin/blog');

    return serializePost(updatedPost);
}

export async function deletePost(id: string) {
    await connectToDatabase();
    await BlogPost.findByIdAndDelete(id);

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true };
}

export async function getPosts(options: { publishedOnly?: boolean; limit?: number; page?: number } = {}) {
    await connectToDatabase();

    const { publishedOnly = false, limit = 10, page = 1 } = options;
    const query = publishedOnly ? { isPublished: true } : {};
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await BlogPost.countDocuments(query);

    return {
        posts: posts.map(serializePost),
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function getPostBySlug(slug: string) {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug, isPublished: true });
    if (!post) return null;
    return serializePost(post);
}

export async function getPostById(id: string) {
    await connectToDatabase();
    const post = await BlogPost.findById(id);
    if (!post) return null;
    return serializePost(post);
}
