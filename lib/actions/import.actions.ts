"use server";

import { connectToDatabase } from "@/lib/db";
import AffiliateOffer from "@/lib/models/AffiliateOffer";
import MarketplaceProduct from "@/lib/models/MarketplaceProduct";
import { revalidatePath } from "next/cache";

export async function importFromPlatform6() {
    try {
        const SOURCE_URI = "mongodb://localhost:27017/planova_db";
        const mongoose = require('mongoose');
        const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
        
        const PersonalModel = sourceConn.model('PersonalAffiliateOffer', new mongoose.Schema({}, { strict: false }), 'personalaffiliateoffers');
        const sourceOffers = await PersonalModel.find({}).lean();
        
        await connectToDatabase();
        
        let importedCount = 0;
        for (const offer of sourceOffers) {
            const exists = await AffiliateOffer.findOne({ name: offer.name });
            if (!exists) {
                await AffiliateOffer.create({
                    name: offer.name,
                    affiliateLink: (offer as any).affiliateLink || "",
                    destinationLink: (offer as any).destinationLink || "",
                    productPrice: (offer as any).productPrice || "",
                    commissionLevel: (offer as any).commissionLevel || "",
                    payoutAmount: (offer as any).payoutAmount || "",
                    network: (offer as any).network || "",
                    notes: (offer as any).notes || "",
                    category: "Imported from Platform6"
                });
                importedCount++;
            }
        }
        
        await sourceConn.close();
        revalidatePath('/admin');
        return { success: true, count: importedCount };
    } catch (error: any) {
        console.error('[IMPORT_PLATFORM6]', error);
        return { success: false, error: error.message };
    }
}

export async function importFromNexus() {
    try {
        await connectToDatabase();
        const nexusProducts = await MarketplaceProduct.find().limit(50); // Import a batch
        
        let importedCount = 0;
        for (const product of nexusProducts) {
            const exists = await AffiliateOffer.findOne({ name: product.title });
            if (!exists) {
                await AffiliateOffer.create({
                    name: product.title,
                    affiliateLink: product.shortUrl || product.fullUrl || "",
                    productPrice: product.price || "",
                    network: "Amazon Nexus",
                    category: product.category || "Nexus Import",
                    notes: `ASIN: ${product.asin} | Rank: ${product.rank}`
                });
                importedCount++;
            }
        }
        
        revalidatePath('/admin');
        return { success: true, count: importedCount };
    } catch (error: any) {
        console.error('[IMPORT_NEXUS]', error);
        return { success: false, error: error.message };
    }
}
