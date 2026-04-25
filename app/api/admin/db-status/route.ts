import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import GlossaryTerm from "@/lib/models/GlossaryTerm";
import Subscriber from "@/lib/models/Subscriber"; // Assuming this exists based on earlier context

import { isAdmin } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        await connectToDatabase();
        
        const glossaryCount = await GlossaryTerm.countDocuments();
        const glossaryPublishedCount = await GlossaryTerm.countDocuments({ isPublished: true });
        const subscriberCount = await Subscriber.countDocuments();
        
        // Get a few sample terms to verify structure
        const sampleTerms = await GlossaryTerm.find({}).limit(3).select('term slug isPublished category').lean();

        return NextResponse.json({
            success: true,
            database: "MongoDB Connected",
            counts: {
                glossaryTerms: glossaryCount,
                glossaryPublished: glossaryPublishedCount,
                subscribers: subscriberCount
            },
            samples: sampleTerms
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
