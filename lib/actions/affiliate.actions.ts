'use server';

import { connectToDatabase } from '@/lib/db';
import AffiliateOffer from '@/lib/models/AffiliateOffer';
import { revalidatePath } from 'next/cache';

function serialize(data: any) {
    return JSON.parse(JSON.stringify(data));
}

export async function getAffiliateOffers() {
    await connectToDatabase();
    const offers = await AffiliateOffer.find().sort({ isFavorite: -1, createdAt: -1 });
    return serialize(offers);
}

export async function createAffiliateOffer(data: any) {
    await connectToDatabase();
    const offer = await AffiliateOffer.create(data);
    revalidatePath('/admin/affiliate-hub');
    revalidatePath('/admin');
    return serialize(offer);
}

export async function updateAffiliateOffer(id: string, data: any) {
    await connectToDatabase();
    const offer = await AffiliateOffer.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/affiliate-hub');
    revalidatePath('/admin');
    return serialize(offer);
}

export async function deleteAffiliateOffer(id: string) {
    await connectToDatabase();
    await AffiliateOffer.findByIdAndDelete(id);
    revalidatePath('/admin/affiliate-hub');
    revalidatePath('/admin');
    return { success: true };
}

export async function toggleFavorite(id: string) {
    await connectToDatabase();
    const offer = await AffiliateOffer.findById(id);
    if (!offer) return { success: false };
    offer.isFavorite = !offer.isFavorite;
    await offer.save();
    revalidatePath('/admin/affiliate-hub');
    revalidatePath('/admin');
    return serialize(offer);
}

export async function trackAffiliateClick(id: string) {
    await connectToDatabase();
    await AffiliateOffer.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
}
