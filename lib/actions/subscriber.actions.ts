"use server";

import { connectToDatabase } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";
import PenName from "@/lib/models/PenName";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function subscribeToMailingList(data: { email: string, name?: string, penNameId?: string, signupUrl?: string }) {
    await connectToDatabase();

    const { email, name, penNameId, signupUrl } = data;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "unknown";
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || 
                      headersList.get("x-real-ip") || 
                      "unknown";

    let userId = null;
    
    // 1. If penNameId is provided, find the owner
    if (penNameId) {
        const penName = await PenName.findById(penNameId);
        if (penName) {
            userId = penName.userId;
        }
    }

    try {
        // 2. Create the subscriber with compliance data
        await Subscriber.create({
            email: email.toLowerCase().trim(),
            name: name?.trim(),
            penNameId: penNameId || null,
            userId: userId,
            ipAddress,
            userAgent,
            signupUrl,
        });

        return { success: true, message: "Transmission received. Welcome to The Inner Circle." };
    } catch (error: any) {
        if (error.code === 11000) {
            // Duplicate email for this context
            return { success: true, message: "Signal already synchronized. You are in the circle." };
        }
        console.error("Subscription error:", error);
        return { success: false, message: "Security Breach: Transmission failed. Try again." };
    }
}

export async function getSubscribers(penNameId: string) {
    await connectToDatabase();
    const subscribers = await Subscriber.find({ penNameId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(subscribers));
}

export async function getAllSubscribers() {
    await connectToDatabase();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(subscribers));
}

export async function deleteSubscriber(id: string) {
    await connectToDatabase();
    await Subscriber.findByIdAndDelete(id);
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteSubscribersBulk(ids: string[]) {
    await connectToDatabase();
    await Subscriber.deleteMany({ _id: { $in: ids } });
    revalidatePath("/admin");
    return { success: true };
}

export async function updateSubscriber(id: string, data: { email: string, name?: string }) {
    await connectToDatabase();
    await Subscriber.findByIdAndUpdate(id, data);
    revalidatePath("/admin");
    return { success: true };
}
