"use server";

import { connectToDatabase } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";
import PenName from "@/lib/models/PenName";
import { revalidatePath } from "next/cache";

export async function subscribeToMailingList(email: string, penNameId: string) {
    await connectToDatabase();

    // 1. Find the PenName to get the userId (owner)
    const penName = await PenName.findById(penNameId);
    if (!penName) {
        return { success: false, message: "Pen name not found." };
    }

    try {
        // 2. Create the subscriber
        await Subscriber.create({
            email,
            penNameId,
            userId: penName.userId,
        });

        return { success: true, message: "Successfully subscribed!" };
    } catch (error: any) {
        if (error.code === 11000) {
            // Duplicate email for this pen name
            return { success: true, message: "You are already subscribed." };
        }
        console.error("Subscription error:", error);
        return { success: false, message: "Failed to subscribe. Please try again." };
    }
}

export async function getSubscribers(penNameId: string) {
    await connectToDatabase();
    const subscribers = await Subscriber.find({ penNameId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(subscribers));
}
