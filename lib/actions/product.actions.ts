'use server'

import { revalidatePath } from "next/cache";
import Product from "../models/Product";
import SalesPage from "../models/SalesPage";
import "../models/PenName"; // Import to ensure model is registered for populate
import { connectToDatabase } from "../db";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

import { isAdmin } from "@/lib/admin";

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

async function generateUniqueSlug(title: string, currentId?: string) {
    let slug = slugify(title);
    if (!slug) slug = "product";
    let uniqueSlug = slug;
    let count = 1;

    while (true) {
        const existingProduct = await Product.findOne({ slug: uniqueSlug });
        if (!existingProduct || (currentId && existingProduct._id.toString() === currentId)) {
            break;
        }
        uniqueSlug = `${slug}-${count}`;
        count++;
    }
    return uniqueSlug;
}

export async function createProduct(data: any) {
    const { userId } = await auth();
    const isUserAdmin = await isAdmin();

    if (!userId || !isUserAdmin) throw new Error("Unauthorized");

    await connectToDatabase();

    const slug = await generateUniqueSlug(data.title);

    // Sanitize data
    const sanitizedData = { ...data };
    if (sanitizedData.penNameId === "") {
        delete sanitizedData.penNameId;
    }
    // Ensure optional fields are not empty strings if they should be undefined/null
    ['description', 'imageUrl', 'category', 'format', 'grooveSellId', 'grooveSellEmbed', 'amazonLink', 'htmlContent', 'externalUrl'].forEach(field => {
        if (sanitizedData[field] === "") {
            delete sanitizedData[field];
        }
    });

    console.log("Creating Product with data:", sanitizedData);
    try {
        const newProduct = await Product.create({
            ...sanitizedData,
            slug,
            userId,
        });
        console.log("Product created:", newProduct);

        revalidatePath("/products");
        revalidatePath("/admin");

        return JSON.parse(JSON.stringify(newProduct));
    } catch (error) {
        console.error("Error creating Product:", error);
        throw error;
    }
}

export async function updateProduct(id: string, data: any) {
    const { userId } = await auth();
    const isUserAdmin = await isAdmin();

    if (!userId || !isUserAdmin) throw new Error("Unauthorized");

    await connectToDatabase();

    // If title is being updated, check if we need to update slug
    // For now, let's only generate a slug if one doesn't exist, or if explicitly requested.
    // But to fulfill the user request "make the url seo optimized", we should probably ensure a slug exists.

    let updateData = { ...data };

    // Sanitize data
    if (updateData.penNameId === "") {
        delete updateData.penNameId;
    }
    // Ensure optional fields are not empty strings if they should be undefined/null
    ['description', 'imageUrl', 'category', 'format', 'grooveSellId', 'grooveSellEmbed', 'amazonLink', 'htmlContent', 'externalUrl'].forEach(field => {
        if (updateData[field] === "") {
            delete updateData[field];
        }
    });

    // Check if product has a slug, if not generate one from title (new or existing)
    const currentProduct = await Product.findById(id);
    if (currentProduct) {
        if (!currentProduct.slug || (data.title && data.title !== currentProduct.title)) {
            // If no slug, or title changed, generate new slug. 
            // Note: Changing slug on title change breaks old links. 
            // However, for this task, let's assume we want the slug to match the title.
            // To be safe, maybe only if it doesn't exist? 
            // The user wants to optimize the URL. 
            // Let's generate it if it's missing OR if the title is updated.
            const titleToSlug = data.title || currentProduct.title;
            updateData.slug = await generateUniqueSlug(titleToSlug, id);
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );

    if (!updatedProduct) throw new Error("Product not found");

    revalidatePath("/products");
    revalidatePath("/admin");
    revalidatePath(`/products/${id}`);
    if (updatedProduct.slug) {
        revalidatePath(`/products/${updatedProduct.slug}`);
    }

    return JSON.parse(JSON.stringify(updatedProduct));
}

export async function getAllProducts() {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 }).populate('penNameId');
    return JSON.parse(JSON.stringify(products));
}

export async function getPublishedProducts() {
    try {
        await connectToDatabase();
        const products = await Product.find({ isHidden: { $ne: true } }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error("Error fetching published products:", error);
        return [];
    }
}

export async function getMarketplaceItems() {
    try {
        await connectToDatabase();
        
        // Fetch products
        const products = await Product.find({ isHidden: { $ne: true } }).sort({ createdAt: -1 });
        
        // Fetch sales pages marked for marketplace
        const salesPages = await SalesPage.find({ isPublished: true, showInMarketplace: true }).sort({ createdAt: -1 });
        
        // Normalize
        const normalizedProducts = products.map((p: any) => ({
            id: p._id.toString(),
            title: p.title,
            description: p.description,
            price: p.price,
            slug: p.slug,
            imageUrl: p.imageUrl,
            type: 'product',
            category: p.category,
            externalUrl: p.externalUrl
        }));

        const normalizedSalesPages = salesPages.map((s: any) => ({
            id: s._id.toString(),
            title: s.marketplaceTitle || s.title,
            description: s.marketplaceDescription || s.description,
            price: s.price,
            slug: s.slug,
            imageUrl: s.marketplaceImage || s.ogImage,
            type: 'offer',
            category: 'Offers',
            externalUrl: `/offers/${s.slug}`
        }));

        // Combine and sort
        const combined = [...normalizedProducts, ...normalizedSalesPages];
        
        return JSON.parse(JSON.stringify(combined));
    } catch (error) {
        console.error("Error fetching marketplace items:", error);
        return [];
    }
}

export async function getFeaturedItems() {
    try {
        await connectToDatabase();
        
        let products = await Product.find({ 
            isFeaturedInRotation: true,
            isHidden: { $ne: true } 
        }).sort({ createdAt: -1 }).limit(10);

        // Fallback to latest products if none are marked as featured
        if (products.length === 0) {
            products = await Product.find({ 
                isHidden: { $ne: true } 
            }).sort({ createdAt: -1 }).limit(8);
        }
        
        let salesPages = await SalesPage.find({ 
            isPublished: true, 
            showInMarketplace: true,
            isFeaturedInRotation: true 
        }).sort({ createdAt: -1 }).limit(5);

        // Fallback to latest sales pages if none are marked as featured
        if (salesPages.length === 0) {
            salesPages = await SalesPage.find({ 
                isPublished: true,
                showInMarketplace: true
            }).sort({ createdAt: -1 }).limit(4);
        }
        
        const normalizedProducts = products.map((p: any) => ({
            id: p._id.toString(),
            title: p.title,
            description: p.description,
            price: p.price,
            slug: p.slug,
            imageUrl: p.imageUrl,
            type: 'product',
            category: p.category,
            externalUrl: p.externalUrl
        }));

        const normalizedSalesPages = salesPages.map((s: any) => ({
            id: s._id.toString(),
            title: s.marketplaceTitle || s.title,
            description: s.marketplaceDescription || s.description,
            price: s.price,
            slug: s.slug,
            imageUrl: s.marketplaceImage || s.ogImage,
            type: 'offer',
            category: 'Premium Offer',
            externalUrl: `/offers/${s.slug}`
        }));

        return JSON.parse(JSON.stringify([...normalizedProducts, ...normalizedSalesPages]));
    } catch (error) {
        console.error("Error fetching featured items:", error);
        return [];
    }
}

export async function getProductById(idOrSlug: string) {
    await connectToDatabase();

    let product;

    if (mongoose.isValidObjectId(idOrSlug)) {
        product = await Product.findById(idOrSlug);
    }

    if (!product) {
        product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) throw new Error("Product not found");

    // If we found by ID but it doesn't have a slug, let's generate one and save it (lazy migration)
    if (!product.slug) {
        const slug = await generateUniqueSlug(product.title, product._id.toString());
        product.slug = slug;
        await product.save();
    }

    return JSON.parse(JSON.stringify(product));
}

export async function getProductsByPenName(penNameId: string) {
    await connectToDatabase();
    const products = await Product.find({ penNameId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
}

export async function deleteProduct(id: string) {
    const { userId } = await auth();
    const isUserAdmin = await isAdmin();

    if (!userId || !isUserAdmin) throw new Error("Unauthorized");

    await connectToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) throw new Error("Product not found");

    revalidatePath("/products");
    revalidatePath("/admin");

    return JSON.parse(JSON.stringify(deletedProduct));
}
