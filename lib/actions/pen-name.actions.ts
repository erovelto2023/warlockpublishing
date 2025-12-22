"use server";

import { connectToDatabase } from "@/lib/db";
import PenName from "@/lib/models/PenName";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

export async function createPenName(data: {
    name: string;
    bio?: string;
    avatarUrl?: string;
    coverImage?: string;
    tagline?: string;
    newsletterDescription?: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        website?: string;
        email?: string;
    };
}) {
    await connectToDatabase();
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const slug = slugify(data.name);
    // Simple check for uniqueness could be added here, but relying on unique index for now
    // Ideally we'd append a number if it exists, but let's stick to the core requirement first.

    const newPenName = await PenName.create({
        ...data,
        slug,
        userId,
    });

    revalidatePath("/admin/pen-names");
    return JSON.parse(JSON.stringify(newPenName));
}

export async function getPenNames() {
    await connectToDatabase();
    const penNames = await PenName.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(penNames));
}

export async function getPenNameById(id: string) {
    console.log("getPenNameById called with:", id);
    try {
        await connectToDatabase();
        const penName = await PenName.findById(id.trim());
        console.log("getPenNameById result:", penName);
        if (!penName) return null;
        return JSON.parse(JSON.stringify(penName));
    } catch (error) {
        console.error("getPenNameById error:", error);
        return null;
    }
}

export async function getPenNameBySlug(slug: string) {
    await connectToDatabase();
    const penName = await PenName.findOne({ slug });
    if (!penName) return null;
    return JSON.parse(JSON.stringify(penName));
}

export async function updatePenName(id: string, data: any) {
    await connectToDatabase();
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const updateData = { ...data };
    if (data.name) {
        updateData.slug = slugify(data.name);
    }

    const penName = await PenName.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true }
    );

    revalidatePath("/admin/pen-names");
    revalidatePath(`/admin/pen-names/${id}`);
    return JSON.parse(JSON.stringify(penName));
}

export async function deletePenName(id: string) {
    await connectToDatabase();
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    await PenName.findOneAndDelete({ _id: id, userId });
    revalidatePath("/admin/pen-names");
}
