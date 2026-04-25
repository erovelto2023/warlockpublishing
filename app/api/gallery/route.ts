export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import GalleryImage from '@/lib/models/GalleryImage';
import { isAdmin } from '@/lib/admin';

// GET /api/gallery?status=published&tag=sales&page=1&limit=20
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const tag = searchParams.get('tag');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const isAdminUser = await isAdmin();
        const filter: any = {};
        
        if (status) {
            // Only admins can filter by any status; public users only see published
            if (isAdminUser) {
                filter.status = status;
            } else {
                filter.status = 'published';
            }
        } else if (!isAdminUser) {
            // Public users only see published by default
            filter.status = 'published';
        }
        
        if (tag) filter.tags = tag;

        const images = await GalleryImage.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const total = await GalleryImage.countDocuments(filter);

        return NextResponse.json({
            images: JSON.parse(JSON.stringify(images)),
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
