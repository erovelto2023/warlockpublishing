import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import GlobalSettings from '@/lib/models/GlobalSettings';
import { isAdmin } from '@/lib/admin';

// GET /api/settings
export async function GET() {
    try {
        await connectToDatabase();
        const settings = await GlobalSettings.findOne().lean();
        
        // Return default if none exists
        const output = settings || {
            homeHeroImageUrl: '',
            siteTitle: 'Warlock Publishing',
            siteDescription: 'Premium Digital Products & PLR',
            isMaintenanceMode: false
        };
        
        return NextResponse.json(JSON.parse(JSON.stringify(output)));
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/settings - Update or Create
export async function POST(req: NextRequest) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        await connectToDatabase();
        const body = await req.json();
        
        // Only allow specific fields
        const allowed = ['homeHeroImageUrl', 'siteTitle', 'siteDescription', 'isMaintenanceMode'];
        const update: any = {};
        for (const key of allowed) {
            if (body[key] !== undefined) update[key] = body[key];
        }

        const settings = await GlobalSettings.findOneAndUpdate(
            {}, // match first
            update,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        return NextResponse.json(JSON.parse(JSON.stringify(settings)));
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
