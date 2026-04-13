import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectToDatabase } from "../lib/db";
import Product from "../lib/models/Product";
import SalesPage from "../lib/models/SalesPage";
import mongoose from "mongoose";

// Create a generic PenName model if it doesn't exist to avoid import errors
const PenNameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tagline: { type: String },
    avatarUrl: { type: String },
    bio: { type: String }
});
const PenName = mongoose.models.PenName || mongoose.model('PenName', PenNameSchema);

const sampleProducts = [
    {
        title: "Billionaire Romance Hook Collection",
        description: "A comprehensive set of 50 high-converting hooks specifically for Billionaire Romance authors. Designed to grab attention on TikTok and Instagram Reels.",
        price: 47.00,
        category: "Marketing",
        productType: "ebook",
        licenseType: "PLR",
        isFeaturedInRotation: true,
        isHidden: false,
        userId: "admin_seed",
        tags: ["romance", "marketing", "billionaire"]
    },
    {
        title: "Digital Asset Masterclass",
        description: "Learn how to architect, build, and sell premium digital products in the publishing niche. From concept to marketplace launch.",
        price: 197.00,
        category: "Courses",
        productType: "course",
        licenseType: "Standard",
        isFeaturedInRotation: true,
        isHidden: false,
        userId: "admin_seed",
        tags: ["course", "masterclass", "publishing"]
    },
    {
        title: "Warlock Keyword Explorer",
        description: "A specialized software tool for finding untapped keywords in the dark romance and urban fantasy niches.",
        price: 29.00,
        category: "Software",
        productType: "software",
        licenseType: "SaaS",
        isFeaturedInRotation: true,
        isHidden: false,
        userId: "admin_seed",
        tags: ["software", "keywords", "tools"]
    }
];

const sampleOffers = [
    {
        title: "The Ultimate Author Vault",
        slug: "ultimate-author-vault",
        description: "Get everything you need to start your publishing empire today. Includes all our top-tier hooks, templates, and courses at one massive discount.",
        bodyCode: "<h1>The Ultimate Author Vault</h1><p>Welcome to the premium literary frontier.</p>",
        isPublished: true,
        showInMarketplace: true,
        pageType: "sales",
        price: 497.00,
        marketplaceTitle: "Ultimate Author Vault (Bundle)",
        marketplaceDescription: "The complete collection of Warlock Publishing assets in one comprehensive bundle.",
        marketplaceColor: "#4f46e5",
        useColorAsDefault: true,
        isFeaturedInRotation: true
    }
];

async function seedMarketplace() {
    try {
        await connectToDatabase();
        console.log("Connected to database.");

        // 1. Create a Default Pen Name
        let penName = await PenName.findOne({ name: "Warlock Admin" });
        if (!penName) {
            penName = await PenName.create({
                name: "Warlock Admin",
                tagline: "Premier Literary Architect",
                bio: "Official content creator for Warlock Publishing."
            });
            console.log("Created Pen Name: Warlock Admin");
        }

        // 2. Seed Products
        for (const prod of sampleProducts) {
            const slug = prod.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await Product.findOneAndUpdate(
                { slug },
                { ...prod, slug, penNameId: penName._id },
                { upsert: true, new: true }
            );
            console.log(`Seeded Product: ${prod.title}`);
        }

        // 3. Seed Offers
        for (const offer of sampleOffers) {
            await SalesPage.findOneAndUpdate(
                { slug: offer.slug },
                offer,
                { upsert: true, new: true }
            );
            console.log(`Seeded Offer: ${offer.title}`);
        }

        console.log("Marketplace seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding marketplace:", error);
        process.exit(1);
    }
}

seedMarketplace();
