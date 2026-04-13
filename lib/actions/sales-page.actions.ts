"use server";

import { connectToDatabase } from "@/lib/db";
import SalesPage from "@/lib/models/SalesPage";
import { revalidatePath } from "next/cache";

export async function getSalesPages() {
    try {
        await connectToDatabase();
        const pages = await SalesPage.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(pages));
    } catch (error: any) {
        console.error("Error fetching sales pages:", error);
        return [];
    }
}

export async function getPublishedSalesPages() {
    try {
        await connectToDatabase();
        const pages = await SalesPage.find({ 
            isPublished: true, 
            isFeaturedInRotation: { $ne: false } 
        }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(pages));
    } catch (error: any) {
        console.error("Error fetching published sales pages:", error);
        return [];
    }
}

export async function getSalesPageBySlug(slug: string) {
    try {
        await connectToDatabase();
        const page = await SalesPage.findOne({ slug }).lean();
        return page ? JSON.parse(JSON.stringify(page)) : null;
    } catch (error: any) {
        console.error("Error fetching sales page by slug:", error);
        return null;
    }
}

export async function getSalesPageById(id: string) {
    try {
        await connectToDatabase();
        const page = await SalesPage.findById(id).lean();
        return page ? JSON.parse(JSON.stringify(page)) : null;
    } catch (error: any) {
        console.error("Error fetching sales page by id:", error);
        return null;
    }
}

export async function createOrUpdateSalesPage(id: string | null, data: any) {
    try {
        await connectToDatabase();

        if (id) {
            const updated = await SalesPage.findByIdAndUpdate(id, data, { new: true });
            revalidatePath('/admin');
            revalidatePath(`/offers/${data.slug}`);
            revalidatePath('/marketplace');
            revalidatePath('/');
            return { success: true, page: JSON.parse(JSON.stringify(updated)) };
        } else {
            const created = await SalesPage.create(data);
            revalidatePath('/admin');
            revalidatePath('/marketplace');
            revalidatePath('/');
            return { success: true, page: JSON.parse(JSON.stringify(created)) };
        }
    } catch (error: any) {
        console.error("Error saving sales page:", error);
        return { error: error.message || "Failed to save sales page" };
    }
}

export async function deleteSalesPage(id: string) {
    try {
        await connectToDatabase();
        await SalesPage.findByIdAndDelete(id);
        revalidatePath('/admin');
        revalidatePath('/marketplace');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting sales page:", error);
        return { error: error.message || "Failed to delete sales page" };
    }
}

export async function updateSalesPageRotation(id: string, isFeaturedInRotation: boolean) {
    try {
        await connectToDatabase();
        const updated = await SalesPage.findByIdAndUpdate(id, { isFeaturedInRotation }, { new: true });
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true, page: JSON.parse(JSON.stringify(updated)) };
    } catch (error: any) {
        console.error("Error updating sales page rotation:", error);
        return { error: error.message || "Failed to update rotation" };
    }
}

// --- ANALYTICS ACTIONS ---

export async function trackSalesPageVisit(slug: string, version: 'A' | 'B' | null) {
    try {
        await connectToDatabase();
        const update: any = { $inc: { views: 1 } };
        if (version === 'A') update.$inc.viewsA = 1;
        if (version === 'B') update.$inc.viewsB = 1;

        await SalesPage.findOneAndUpdate({ slug }, update);
        return { success: true };
    } catch (error) {
        console.error("Visit tracking failed:", error);
        return { success: false };
    }
}

export async function trackSalesPageBuyClick(slug: string, version: 'A' | 'B' | null) {
    try {
        await connectToDatabase();
        const update: any = { $inc: { clicks: 1 } };
        if (version === 'A') update.$inc.clicksA = 1;
        if (version === 'B') update.$inc.clicksB = 1;

        await SalesPage.findOneAndUpdate({ slug }, update);
        return { success: true };
    } catch (error) {
        console.error("Click tracking failed:", error);
        return { success: false };
    }
}
