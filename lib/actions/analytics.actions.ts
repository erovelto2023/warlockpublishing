'use server'

import { connectToDatabase } from "../db";
import SiteTraffic from "../models/SiteTraffic";
import { revalidatePath } from "next/cache";

export async function logPageView(data: {
    path: string;
    referrer: string;
    sessionId: string;
    userAgent: string;
}) {
    try {
        await connectToDatabase();
        
        const newHit = await SiteTraffic.create({
            path: data.path,
            referrer: data.referrer || 'Direct',
            sessionId: data.sessionId,
            userAgent: data.userAgent,
            timestamp: new Date(),
        });

        return { success: true, hitId: newHit._id.toString() };
    } catch (error: any) {
        console.error("Error logging page view:", error);
        return { success: false, error: error.message };
    }
}

export async function updateDwellTime(hitId: string, durationMs: number) {
    try {
        await connectToDatabase();
        await SiteTraffic.findByIdAndUpdate(hitId, { $set: { dwellTime: durationMs } });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating dwell time:", error);
        return { success: false, error: error.message };
    }
}

export async function getAnalyticsSummary() {
    try {
        await connectToDatabase();

        // 1. Most Popular Pages
        const popularPages = await SiteTraffic.aggregate([
            {
                $group: {
                    _id: "$path",
                    views: { $sum: 1 },
                    avgDwellTime: { $avg: "$dwellTime" }
                }
            },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]);

        // 2. Top Referrers
        const topReferrers = await SiteTraffic.aggregate([
            {
                $group: {
                    _id: "$referrer",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 3. Recent Activity (Last 24 hours)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const hourlyActivity = await SiteTraffic.aggregate([
            { $match: { timestamp: { $gte: dayAgo } } },
            {
                $group: {
                    _id: { $hour: "$timestamp" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return {
            popularPages,
            topReferrers,
            hourlyActivity,
            totalHits: await SiteTraffic.countDocuments()
        };
    } catch (error: any) {
        console.error("Error getting analytics summary:", error);
        return { error: error.message };
    }
}
