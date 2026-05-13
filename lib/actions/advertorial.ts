'use server';

import { connectToDatabase } from '@/lib/db';
import Advertorial from '@/lib/models/Advertorial';
import { revalidatePath } from 'next/cache';

function serialize(doc: any) {
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
}

export async function getAdvertorials() {
    await connectToDatabase();
    const docs = await Advertorial.find({}).sort({ createdAt: -1 });
    return docs.map(serialize);
}

export async function getAdvertorialBySlug(slug: string) {
    await connectToDatabase();
    const doc = await Advertorial.findOne({ slug }).populate('affiliateOfferId');
    return serialize(doc);
}

export async function getAdvertorialById(idOrSlug: string) {
    try {
        await connectToDatabase();
        // Try finding by ID first
        let doc = null;
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            doc = await Advertorial.findById(idOrSlug).lean();
        }
        
        // Fallback to slug if not found or not a valid ID
        if (!doc) {
            doc = await Advertorial.findOne({ slug: idOrSlug }).lean();
        }

        if (!doc) return null;
        return JSON.parse(JSON.stringify(doc));
    } catch (error) {
        console.error('Error fetching advertorial:', error);
        return null;
    }
}

export async function createAdvertorial(data: any) {
    await connectToDatabase();
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const doc = await Advertorial.create({ ...data, slug });
    revalidatePath('/admin');
    return serialize(doc);
}

export async function updateAdvertorial(id: string, data: any) {
    await connectToDatabase();
    const doc = await Advertorial.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin');
    return serialize(doc);
}

export async function deleteAdvertorial(id: string) {
    await connectToDatabase();
    await Advertorial.findByIdAndDelete(id);
    revalidatePath('/admin');
    return { success: true };
}

export async function importAdvertorials(data: any[]) {
    try {
        await connectToDatabase();
        for (const item of data) {
            const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await Advertorial.findOneAndUpdate(
                { title: item.title },
                { ...item, slug, isPublished: true },
                { upsert: true, new: true }
            );
        }
        revalidatePath('/admin');
        return { success: true, count: data.length };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
export async function trackAdvertorialView(id: string) {
    try {
        await connectToDatabase();
        await Advertorial.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    } catch (error) {
        console.error('Failed to track view:', error);
    }
}

/**
 * Specialized Importer for GroovePages HTML
 * Extracts structured data from the user provided HTML blocks
 */
export async function importAdvertorialFromGroove(html: string) {
    try {
        const data: any = {
            discovery: {
                breadcrumbs: [],
                author: {},
                ratings: { breakdown: [] },
                imageGallery: [],
                orderSteps: [],
                comments: [],
                painPoints: { items: [] }
            }
        };

        // Extract Main Headlines
        const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g);
        if (h1Match) {
            data.heroSection = {
                headline: h1Match[0].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' '),
                boldClaim: h1Match[1] ? h1Match[1].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ') : ""
            };
        }

        // Extract Author Info
        const authorMatch = html.match(/<p[^>]*class="gp-component-id-xBCp1qkot"[^>]*>([\s\S]*?)<\/p>/);
        if (authorMatch) {
            const text = authorMatch[1].replace(/&nbsp;/g, ' ').trim();
            const parts = text.split('·');
            data.discovery.author.name = parts[0]?.split(',')[0]?.trim() || "Mark Holler";
            data.discovery.author.date = parts[0]?.split(',')[1]?.trim() || "Oct 19";
            data.discovery.author.readTime = parts[1]?.trim() || "6 minute read";
        }

        // Extract Ratings
        const ratingMatch = html.match(/<h6[^>]*>([\s\S]*?)<\/h6>[\s\S]*?ChMdlJr4id[^>]*>([\s\S]*?)<\/div>/g);
        // Simplified regex for the breakdown
        const labels = html.match(/<h6[^>]*>([\s\S]*?)<\/h6>/g)?.map(l => l.replace(/<[^>]*>/g, '').trim());
        const values = html.match(/9[0-9]%|[0-9]{2}%/g);
        
        if (labels && values) {
            data.discovery.ratings.breakdown = labels.slice(0, 3).map((label, i) => ({
                label,
                value: parseInt(values[i]) || 99
            }));
        }

        // Extract Pain Points
        const painPointItems = html.match(/class="gp-component-id-6htfxoA_6u"[^>]*>([\s\S]*?)<\/p>|class="gp-component-id-_lmevKAgyt"[^>]*>([\s\S]*?)<\/p>/g);
        if (painPointItems) {
            data.discovery.painPoints.items = painPointItems.map(item => item.replace(/<[^>]*>/g, '').trim());
        }

        // Extract Comments
        const commentNames = html.match(/<h2[^>]*class="gp-component-id-xWPx204eh"[^>]*>([\s\S]*?)<\/h2>/g);
        const commentTexts = html.match(/<p[^>]*class="gp-component-id-U6CRPlvv_w"[^>]*>([\s\S]*?)<\/p>/g);
        if (commentNames && commentTexts) {
            data.discovery.comments = commentNames.map((name, i) => {
                const nameParts = name.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').split('·');
                return {
                    name: nameParts[0]?.trim(),
                    time: nameParts[1]?.trim(),
                    text: commentTexts[i]?.replace(/<[^>]*>/g, '').trim()
                };
            });
        }

        return data;
    } catch (error) {
        console.error('Groove Import Failed:', error);
        return null;
    }
}
