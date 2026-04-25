import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/db';
import GalleryImage from '@/lib/models/GalleryImage';
import { isAdmin } from '@/lib/admin';

// GET /api/gallery/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const image = await GalleryImage.findById(id).lean();
        if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(JSON.parse(JSON.stringify(image)));
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH /api/gallery/[id] — update metadata
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();
        const allowed = ['title', 'altText', 'description', 'tags', 'status', 'sortOrder'];
        const update: any = {};
        for (const key of allowed) {
            if (body[key] !== undefined) update[key] = body[key];
        }
        const updated = await GalleryImage.findByIdAndUpdate(id, update, { new: true }).lean();
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(JSON.parse(JSON.stringify(updated)));
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE /api/gallery/[id] — delete record + files
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        await connectToDatabase();
        const { id } = await params;
        const image = await GalleryImage.findById(id);
        if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Delete files from disk
        const galleryDir = join(process.cwd(), 'public', 'uploads', 'gallery');
        try {
            await unlink(join(galleryDir, image.storedFilename));
            await unlink(join(galleryDir, 'thumbs', image.storedFilename));
        } catch {
            // Files may already be missing — non-fatal
        }

        await GalleryImage.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
