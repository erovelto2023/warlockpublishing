import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber"; // Assuming this exists based on earlier context

import { isAdmin } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        await connectToDatabase();
        
        const subscriberCount = await Subscriber.countDocuments();
        


        return NextResponse.json({
            success: true,
            database: "MongoDB Connected",
            counts: {
                subscribers: subscriberCount
            }
        });
    } catch (error: any) {
        console.error("DB Status Diagnostic Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
