import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import GlobalSettings from '@/lib/models/GlobalSettings';

export async function GET() {
    try {
        await connectToDatabase();
        const settings = await GlobalSettings.findOne().lean();
        return NextResponse.json({ 
            success: true, 
            db: process.env.MONGODB_URI, 
            settings 
        });
    } catch (err: any) {
        return NextResponse.json({ 
            success: false, 
            error: err.message,
            stack: err.stack
        }, { status: 500 });
    }
}
