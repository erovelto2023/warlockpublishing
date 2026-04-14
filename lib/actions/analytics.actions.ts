'use server'

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "../db";
import SiteTraffic from "../models/SiteTraffic";

export async function logPageView(data: {
    path: string;
    referrer: string;
    sessionId: string;
    userAgent: string;
}) {
    try {
        // ── Server-side guards ────────────────────────────────────────────────
        // 1. Skip any /admin route
        if (data.path.startsWith('/admin')) {
            return { success: true, hitId: null };
        }

        // 2. Skip logged-in users (admins browsing the public site)
        const { userId } = await auth();
        if (userId) {
            return { success: true, hitId: null };
        }
        // ─────────────────────────────────────────────────────────────────────

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
        if (!hitId) return { success: true }; // guard against null hitId from skipped logs
        await connectToDatabase();
        await SiteTraffic.findByIdAndUpdate(hitId, { $set: { dwellTime: durationMs } });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating dwell time:", error);
        return { success: false, error: error.message };
    }
}

export async function resetTrafficData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await connectToDatabase();
        await SiteTraffic.deleteMany({});
        return { success: true };
    } catch (error: any) {
        console.error("Error resetting traffic data:", error);
        return { success: false, error: error.message };
    }
}

export async function getAnalyticsSummary() {
    try {
        await connectToDatabase();

        // 1. Most Popular Pages (exclude /admin paths just in case old data exists)
        const popularPages = await SiteTraffic.aggregate([
            { $match: { path: { $not: /^\/admin/ } } },
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
            { $match: { path: { $not: /^\/admin/ } } },
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
            { $match: { timestamp: { $gte: dayAgo }, path: { $not: /^\/admin/ } } },
            {
                $group: {
                    _id: { $hour: "$timestamp" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 4. Total — only non-admin hits
        const totalHits = await SiteTraffic.countDocuments({ path: { $not: /^\/admin/ } });

        return {
            popularPages,
            topReferrers,
            hourlyActivity,
            totalHits,
        };
    } catch (error: any) {
        console.error("Error getting analytics summary:", error);
        return { error: error.message };
    }
}
