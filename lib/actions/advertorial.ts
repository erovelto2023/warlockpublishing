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

export async function getAdvertorialById(id: string) {
    await connectToDatabase();
    const doc = await Advertorial.findById(id);
    return serialize(doc);
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
